[CmdletBinding()]
param(
    [string]$InputPath,
    [string]$OutputPath,
    [string]$Format
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$PassCode = 0
$RejectCode = 1
$InconclusiveCode = 2
$checks = [System.Collections.ArrayList]::new()

function Add-Check {
    param(
        [string]$Id,
        [string]$Status,
        [string]$Detail
    )

    [void]$checks.Add([ordered]@{
        id = $Id
        status = $Status
        detail = $Detail
    })
}

function ConvertTo-AsciiJson {
    param(
        [Parameter(Mandatory = $true)][object]$Value,
        [int]$Depth = 8
    )

    $json = $Value | ConvertTo-Json -Depth $Depth -Compress
    $builder = [System.Text.StringBuilder]::new($json.Length)
    foreach ($character in $json.ToCharArray()) {
        $codePoint = [int][char]$character
        if ($codePoint -gt 127) {
            [void]$builder.Append(("\u{0:x4}" -f $codePoint))
        }
        else {
            [void]$builder.Append($character)
        }
    }
    return $builder.ToString()
}

function Write-OfficeResult {
    param(
        [string]$Status,
        [int]$ExitCode,
        [string]$Reason,
        [AllowNull()][object]$Application,
        [AllowNull()][string]$ResolvedInput,
        [AllowNull()][string]$ResolvedOutput,
        [AllowNull()][string]$ResolvedFormat
    )

    $payload = [ordered]@{
        tool = "office_preflight"
        schema_version = 1
        status = $Status
        exit_code = $ExitCode
        reason = $Reason
        input_path = $ResolvedInput
        output_path = $ResolvedOutput
        format = $ResolvedFormat
        application = $Application
        checks = @($checks)
    }
    Write-Output (ConvertTo-AsciiJson -Value $payload -Depth 8)
    exit $ExitCode
}

function Test-FullyQualifiedPath {
    param([string]$Path)

    if ([string]::IsNullOrWhiteSpace($Path)) {
        return $false
    }
    try {
        if (-not [System.IO.Path]::IsPathRooted($Path)) {
            return $false
        }
        $root = [System.IO.Path]::GetPathRoot($Path)
        return -not ($root -match "^[A-Za-z]:$")
    }
    catch {
        return $false
    }
}

if (-not (Test-FullyQualifiedPath -Path $InputPath)) {
    Add-Check "input.absolute" "REJECT" "InputPath must be an absolute filesystem path."
    Write-OfficeResult "REJECT" $RejectCode "Invalid input path." $null $null $null $null
}
if (-not (Test-FullyQualifiedPath -Path $OutputPath)) {
    Add-Check "output.absolute" "REJECT" "OutputPath must be an absolute filesystem path."
    Write-OfficeResult "REJECT" $RejectCode "Invalid output path." $null $null $null $null
}

try {
    $inputItem = Get-Item -LiteralPath $InputPath
}
catch {
    Add-Check "input.exists" "REJECT" "Input file does not exist or cannot be resolved."
    Write-OfficeResult "REJECT" $RejectCode "Input file is unavailable." $null $null $null $null
}
if ($inputItem.PSIsContainer -or $inputItem.PSProvider.Name -ne "FileSystem") {
    Add-Check "input.file" "REJECT" "InputPath must identify a file."
    Write-OfficeResult "REJECT" $RejectCode "Input is not a file." $null $null $null $null
}

$resolvedInput = $inputItem.FullName
$resolvedOutput = [System.IO.Path]::GetFullPath($OutputPath.TrimEnd([char[]]@("\", "/")))
$resolvedFormat = if ($null -eq $Format) { "" } else { $Format.Trim().ToUpperInvariant() }

Add-Check "input.absolute" "PASS" "InputPath resolved to an absolute file path."
Add-Check "output.absolute" "PASS" "OutputPath resolved to an absolute path."

if ($resolvedFormat -notin @("PDF", "PNG")) {
    Add-Check "format.requested" "REJECT" "Format must be PDF or PNG."
    Write-OfficeResult "REJECT" $RejectCode "Invalid export format." $null $resolvedInput $resolvedOutput $resolvedFormat
}

$extension = [System.IO.Path]::GetExtension($resolvedInput).ToLowerInvariant()
$profile = switch ($extension) {
    ".docx" {
        [ordered]@{
            name = "Microsoft Word"
            prog_id = "Word.Application"
            collection = "Documents"
            formats = @("PDF")
        }
        break
    }
    ".pptx" {
        [ordered]@{
            name = "Microsoft PowerPoint"
            prog_id = "PowerPoint.Application"
            collection = "Presentations"
            formats = @("PDF", "PNG")
        }
        break
    }
    ".xlsx" {
        [ordered]@{
            name = "Microsoft Excel"
            prog_id = "Excel.Application"
            collection = "Workbooks"
            formats = @("PDF")
        }
        break
    }
    default { $null }
}

if ($null -eq $profile) {
    Add-Check "input.format" "REJECT" "Supported inputs are DOCX, PPTX, and XLSX."
    Write-OfficeResult "REJECT" $RejectCode "Unsupported input format." $null $resolvedInput $resolvedOutput $resolvedFormat
}
Add-Check "input.format" "PASS" "Input format maps to $($profile.name)."

if ($resolvedFormat -notin $profile.formats) {
    Add-Check "adapter.capability" "INCONCLUSIVE" "$($profile.name) $resolvedFormat export is not implemented by this adapter."
    Write-OfficeResult "INCONCLUSIVE" $InconclusiveCode "Requested export pair is not supported." $profile $resolvedInput $resolvedOutput $resolvedFormat
}

if ([string]::Equals($resolvedInput, $resolvedOutput, [System.StringComparison]::OrdinalIgnoreCase)) {
    Add-Check "source.preserved" "REJECT" "OutputPath must differ from InputPath."
    Write-OfficeResult "REJECT" $RejectCode "Source overwrite is forbidden." $profile $resolvedInput $resolvedOutput $resolvedFormat
}

if ($resolvedFormat -eq "PDF" -and [System.IO.Path]::GetExtension($resolvedOutput).ToLowerInvariant() -ne ".pdf") {
    Add-Check "output.kind" "REJECT" "PDF output must use a .pdf filename."
    Write-OfficeResult "REJECT" $RejectCode "Output path does not match the requested format." $profile $resolvedInput $resolvedOutput $resolvedFormat
}

if (Test-Path -LiteralPath $resolvedOutput) {
    Add-Check "output.absent" "REJECT" "OutputPath already exists; the adapter never overwrites it."
    Write-OfficeResult "REJECT" $RejectCode "Output already exists." $profile $resolvedInput $resolvedOutput $resolvedFormat
}

$outputParent = Split-Path -Parent $resolvedOutput
if (-not (Test-Path -LiteralPath $outputParent -PathType Container)) {
    Add-Check "output.parent" "REJECT" "The output parent directory must already exist."
    Write-OfficeResult "REJECT" $RejectCode "Output parent directory is unavailable." $profile $resolvedInput $resolvedOutput $resolvedFormat
}
Add-Check "output.safe" "PASS" "Output is absent, has an existing parent, and cannot overwrite the source."

if ($env:OS -ne "Windows_NT") {
    Add-Check "platform.windows" "INCONCLUSIVE" "Desktop Office COM requires Windows."
    Write-OfficeResult "INCONCLUSIVE" $InconclusiveCode "Windows Office runtime is unavailable." $profile $resolvedInput $resolvedOutput $resolvedFormat
}
Add-Check "platform.windows" "PASS" "Windows runtime detected."

$application = $null
$collection = $null
$createdProbe = $false
$attachedExisting = $false
$cleanupFailure = $null
$applicationResult = $null

try {
    $comType = [type]::GetTypeFromProgID($profile.prog_id)
    if ($null -eq $comType) {
        Add-Check "com.registered" "INCONCLUSIVE" "$($profile.prog_id) is not registered."
        Write-OfficeResult "INCONCLUSIVE" $InconclusiveCode "Required Office application is not installed or registered." $profile $resolvedInput $resolvedOutput $resolvedFormat
    }
    Add-Check "com.registered" "PASS" "$($profile.prog_id) is registered."

    try {
        $application = [Runtime.InteropServices.Marshal]::GetActiveObject($profile.prog_id)
        $attachedExisting = $true
    }
    catch {
        $application = [Activator]::CreateInstance($comType)
        $createdProbe = $true
    }

    $collection = $application.($profile.collection)
    $openItemCount = [int]$collection.Count
    $applicationResult = [ordered]@{
        name = [string]$application.Name
        version = [string]$application.Version
        prog_id = $profile.prog_id
        state = if ($attachedExisting) { "attached_existing" } else { "created_probe" }
        open_item_count = $openItemCount
    }
    Add-Check "com.activation" "PASS" "COM activation and collection access succeeded."
}
catch {
    Add-Check "com.activation" "INCONCLUSIVE" $_.Exception.Message
    Write-OfficeResult "INCONCLUSIVE" $InconclusiveCode "Office COM could not be activated." $profile $resolvedInput $resolvedOutput $resolvedFormat
}
finally {
    if ($createdProbe -and $null -ne $application) {
        try {
            if ($null -ne $collection -and [int]$collection.Count -eq 0) {
                $application.Quit()
            }
            else {
                $cleanupFailure = "Probe instance was not quit because it exposed open documents."
            }
        }
        catch {
            $cleanupFailure = $_.Exception.Message
        }
    }
    if ($null -ne $collection -and [Runtime.InteropServices.Marshal]::IsComObject($collection)) {
        [void][Runtime.InteropServices.Marshal]::FinalReleaseComObject($collection)
    }
    if ($null -ne $application -and [Runtime.InteropServices.Marshal]::IsComObject($application)) {
        [void][Runtime.InteropServices.Marshal]::FinalReleaseComObject($application)
    }
}

if ($null -ne $cleanupFailure) {
    Add-Check "com.cleanup" "INCONCLUSIVE" $cleanupFailure
    Write-OfficeResult "INCONCLUSIVE" $InconclusiveCode "COM was available, but safe probe cleanup was not confirmed." $applicationResult $resolvedInput $resolvedOutput $resolvedFormat
}

Add-Check "com.cleanup" "PASS" $(if ($attachedExisting) { "Existing application and documents were left open." } else { "Disposable empty probe instance was quit." })
Write-OfficeResult "PASS" $PassCode "Office runtime and safe export route are available." $applicationResult $resolvedInput $resolvedOutput $resolvedFormat

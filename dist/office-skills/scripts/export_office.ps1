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
    param([string]$Id, [string]$Status, [string]$Detail)
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

function Write-ExportResult {
    param(
        [string]$Status,
        [int]$ExitCode,
        [string]$Reason,
        [AllowNull()][string]$ResolvedInput,
        [AllowNull()][string]$ResolvedOutput,
        [AllowNull()][string]$ResolvedFormat,
        [AllowNull()][object]$Application,
        [AllowNull()][string]$SourceState,
        [object[]]$ExportedFiles
    )

    $payload = [ordered]@{
        tool = "export_office"
        schema_version = 1
        status = $Status
        exit_code = $ExitCode
        reason = $Reason
        input_path = $ResolvedInput
        output_path = $ResolvedOutput
        format = $ResolvedFormat
        application = $Application
        source_state = $SourceState
        exported_files = @($ExportedFiles)
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
        return -not ([System.IO.Path]::GetPathRoot($Path) -match "^[A-Za-z]:$")
    }
    catch {
        return $false
    }
}

if (-not (Test-FullyQualifiedPath -Path $InputPath)) {
    Add-Check "input.absolute" "REJECT" "InputPath must be an absolute filesystem path."
    Write-ExportResult "REJECT" $RejectCode "Invalid input path." $null $null $null $null $null @()
}
if (-not (Test-FullyQualifiedPath -Path $OutputPath)) {
    Add-Check "output.absolute" "REJECT" "OutputPath must be an absolute filesystem path."
    Write-ExportResult "REJECT" $RejectCode "Invalid output path." $null $null $null $null $null @()
}

try {
    $inputItem = Get-Item -LiteralPath $InputPath
}
catch {
    Add-Check "input.exists" "REJECT" "Input file does not exist or cannot be resolved."
    Write-ExportResult "REJECT" $RejectCode "Input file is unavailable." $null $null $null $null $null @()
}
if ($inputItem.PSIsContainer -or $inputItem.PSProvider.Name -ne "FileSystem") {
    Add-Check "input.file" "REJECT" "InputPath must identify a file."
    Write-ExportResult "REJECT" $RejectCode "Input is not a file." $null $null $null $null $null @()
}

$resolvedInput = $inputItem.FullName
$resolvedOutput = [System.IO.Path]::GetFullPath($OutputPath.TrimEnd([char[]]@("\", "/")))
$resolvedFormat = if ($null -eq $Format) { "" } else { $Format.Trim().ToUpperInvariant() }

if ($resolvedFormat -notin @("PDF", "PNG")) {
    Add-Check "format.requested" "REJECT" "Format must be PDF or PNG."
    Write-ExportResult "REJECT" $RejectCode "Invalid export format." $resolvedInput $resolvedOutput $resolvedFormat $null $null @()
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
    Write-ExportResult "REJECT" $RejectCode "Unsupported input format." $resolvedInput $resolvedOutput $resolvedFormat $null $null @()
}
if ($resolvedFormat -notin $profile.formats) {
    Add-Check "adapter.capability" "INCONCLUSIVE" "$($profile.name) $resolvedFormat export is not implemented."
    Write-ExportResult "INCONCLUSIVE" $InconclusiveCode "Requested export pair is not supported." $resolvedInput $resolvedOutput $resolvedFormat $profile $null @()
}
if ([string]::Equals($resolvedInput, $resolvedOutput, [System.StringComparison]::OrdinalIgnoreCase)) {
    Add-Check "source.preserved" "REJECT" "OutputPath must differ from InputPath."
    Write-ExportResult "REJECT" $RejectCode "Source overwrite is forbidden." $resolvedInput $resolvedOutput $resolvedFormat $profile $null @()
}
if ($resolvedFormat -eq "PDF" -and [System.IO.Path]::GetExtension($resolvedOutput).ToLowerInvariant() -ne ".pdf") {
    Add-Check "output.kind" "REJECT" "PDF output must use a .pdf filename."
    Write-ExportResult "REJECT" $RejectCode "Output path does not match the requested format." $resolvedInput $resolvedOutput $resolvedFormat $profile $null @()
}
if (Test-Path -LiteralPath $resolvedOutput) {
    Add-Check "output.absent" "REJECT" "OutputPath already exists; the adapter never overwrites it."
    Write-ExportResult "REJECT" $RejectCode "Output already exists." $resolvedInput $resolvedOutput $resolvedFormat $profile $null @()
}
$outputParent = Split-Path -Parent $resolvedOutput
if (-not (Test-Path -LiteralPath $outputParent -PathType Container)) {
    Add-Check "output.parent" "REJECT" "The output parent directory must already exist."
    Write-ExportResult "REJECT" $RejectCode "Output parent directory is unavailable." $resolvedInput $resolvedOutput $resolvedFormat $profile $null @()
}
Add-Check "source.preserved" "PASS" "Source and output differ, and the output does not exist."

if ($env:OS -ne "Windows_NT") {
    Add-Check "platform.windows" "INCONCLUSIVE" "Desktop Office COM requires Windows."
    Write-ExportResult "INCONCLUSIVE" $InconclusiveCode "Windows Office runtime is unavailable." $resolvedInput $resolvedOutput $resolvedFormat $profile $null @()
}

$application = $null
$collection = $null
$artifact = $null
$createdApplication = $false
$quitEligible = $false
$openedByScript = $false
$sourceState = $null
$applicationResult = $null
$exportedFiles = @()
$cleanupFailures = [System.Collections.ArrayList]::new()
$phase = "activate"
$status = "INCONCLUSIVE"
$exitCode = $InconclusiveCode
$reason = "Office COM could not be activated."

try {
    $comType = [type]::GetTypeFromProgID($profile.prog_id)
    if ($null -eq $comType) {
        throw "$($profile.prog_id) is not registered."
    }
    try {
        $application = [Runtime.InteropServices.Marshal]::GetActiveObject($profile.prog_id)
        $applicationState = "attached_existing"
    }
    catch {
        $application = [Activator]::CreateInstance($comType)
        $createdApplication = $true
        $applicationState = "created_for_export"
    }

    $collection = $application.($profile.collection)
    $initialCount = [int]$collection.Count
    $quitEligible = $createdApplication -and $initialCount -eq 0
    if ($createdApplication) {
        $application.Visible = $true
    }
    $applicationResult = [ordered]@{
        name = [string]$application.Name
        version = [string]$application.Version
        prog_id = $profile.prog_id
        state = $applicationState
    }
    Add-Check "com.activation" "PASS" "Office COM activation succeeded."

    $phase = "open"
    for ($index = 1; $index -le [int]$collection.Count; $index++) {
        $candidate = $collection.Item($index)
        $candidateMatches = $false
        try {
            $candidatePath = [System.IO.Path]::GetFullPath([string]$candidate.FullName)
            $candidateMatches = [string]::Equals(
                $candidatePath,
                $resolvedInput,
                [System.StringComparison]::OrdinalIgnoreCase
            )
        }
        catch {
            $candidateMatches = $false
        }
        if ($candidateMatches) {
            $artifact = $candidate
            $sourceState = "reused_open"
            break
        }
        if ([Runtime.InteropServices.Marshal]::IsComObject($candidate)) {
            [void][Runtime.InteropServices.Marshal]::FinalReleaseComObject($candidate)
        }
    }

    if ($null -eq $artifact) {
        $artifact = switch ($extension) {
            ".docx" { $collection.Open($resolvedInput, $false, $true); break }
            ".pptx" { $collection.Open($resolvedInput, -1, 0, -1); break }
            ".xlsx" { $collection.Open($resolvedInput, 0, $true); break }
        }
        $openedByScript = $true
        $sourceState = "opened_read_only"
    }
    Add-Check "source.open" "PASS" $(if ($openedByScript) { "Source was opened read-only." } else { "Matching open source was reused and will remain open." })

    $phase = "export"
    if (Test-Path -LiteralPath $resolvedOutput) {
        throw "OutputPath appeared after validation; refusing to overwrite it."
    }

    if ($extension -eq ".docx") {
        $artifact.ExportAsFixedFormat($resolvedOutput, 17)
    }
    elseif ($extension -eq ".xlsx") {
        $artifact.ExportAsFixedFormat(0, $resolvedOutput)
    }
    elseif ($resolvedFormat -eq "PDF") {
        $artifact.SaveCopyAs($resolvedOutput, 32)
    }
    else {
        $expectedSlides = [int]$artifact.Slides.Count
        [void][System.IO.Directory]::CreateDirectory($resolvedOutput)
        [void]$artifact.GetType().InvokeMember(
            "Export",
            [System.Reflection.BindingFlags]::InvokeMethod,
            $null,
            $artifact,
            [object[]]@($resolvedOutput, "PNG", 0, 0)
        )
        $pngFiles = @(
            Get-ChildItem -LiteralPath $resolvedOutput -File |
                Where-Object { $_.Extension -ieq ".png" } |
                Sort-Object FullName
        )
        if ($pngFiles.Count -ne $expectedSlides -or @($pngFiles | Where-Object Length -le 0).Count -gt 0) {
            throw "PNG export count or file size did not match the slide set."
        }
        $exportedFiles = @($pngFiles | ForEach-Object FullName)
    }

    if ($resolvedFormat -eq "PDF") {
        $outputItem = Get-Item -LiteralPath $resolvedOutput
        if ($outputItem.PSIsContainer -or $outputItem.Length -le 0) {
            throw "PDF export did not produce a non-empty file."
        }
        $exportedFiles = @($outputItem.FullName)
    }

    Add-Check "export.output" "PASS" "Export produced non-empty output without saving the source."
    $status = "PASS"
    $exitCode = $PassCode
    $reason = "Office export completed."
}
catch {
    if ($phase -eq "activate") {
        Add-Check "com.activation" "INCONCLUSIVE" $_.Exception.Message
        $status = "INCONCLUSIVE"
        $exitCode = $InconclusiveCode
        $reason = "Required Office application is unavailable."
    }
    else {
        Add-Check "export.operation" "REJECT" $_.Exception.Message
        $status = "REJECT"
        $exitCode = $RejectCode
        $reason = "Office export failed; any partial output was preserved for inspection."
    }
}
finally {
    if ($openedByScript -and $null -ne $artifact) {
        try {
            switch ($extension) {
                ".docx" { $artifact.Close(0) }
                ".pptx" { $artifact.Close() }
                ".xlsx" { $artifact.Close($false) }
            }
        }
        catch {
            [void]$cleanupFailures.Add("Script-opened source could not be closed safely: $($_.Exception.Message)")
        }
    }

    if ($quitEligible -and $null -ne $application) {
        try {
            if ($null -ne $collection -and [int]$collection.Count -eq 0) {
                $application.Quit()
            }
            else {
                [void]$cleanupFailures.Add("Created Office instance was left running because it exposed open documents.")
            }
        }
        catch {
            [void]$cleanupFailures.Add("Created Office instance could not be quit: $($_.Exception.Message)")
        }
    }

    if ($null -ne $artifact -and [Runtime.InteropServices.Marshal]::IsComObject($artifact)) {
        [void][Runtime.InteropServices.Marshal]::FinalReleaseComObject($artifact)
    }
    if ($null -ne $collection -and [Runtime.InteropServices.Marshal]::IsComObject($collection)) {
        [void][Runtime.InteropServices.Marshal]::FinalReleaseComObject($collection)
    }
    if ($null -ne $application -and [Runtime.InteropServices.Marshal]::IsComObject($application)) {
        [void][Runtime.InteropServices.Marshal]::FinalReleaseComObject($application)
    }
}

if ($cleanupFailures.Count -gt 0) {
    Add-Check "com.cleanup" "INCONCLUSIVE" ($cleanupFailures -join " ")
    if ($status -eq "PASS") {
        $status = "INCONCLUSIVE"
        $exitCode = $InconclusiveCode
        $reason = "Output exists, but safe COM cleanup was not confirmed."
    }
}
else {
    Add-Check "com.cleanup" "PASS" $(if ($sourceState -eq "reused_open") { "User-open source and application were left open." } else { "Only script-owned objects were closed." })
}

Write-ExportResult $status $exitCode $reason $resolvedInput $resolvedOutput $resolvedFormat $applicationResult $sourceState $exportedFiles

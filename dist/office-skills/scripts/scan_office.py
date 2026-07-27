#!/usr/bin/env python3
"""Deterministic static issue scan for DOCX, PPTX, and XLSX packages."""

from __future__ import annotations

import argparse
import json
import posixpath
import re
import tempfile
import zipfile
from pathlib import Path, PurePosixPath
from typing import Dict, Iterable, List, Optional, Tuple
from urllib.parse import unquote, urlsplit
from xml.etree import ElementTree


PASS = 0
REJECT = 1
INCONCLUSIVE = 2

RELATIONSHIP_NS = "http://schemas.openxmlformats.org/package/2006/relationships"
SPREADSHEET_NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"

REQUIRED_PARTS = {
    ".docx": ("[Content_Types].xml", "_rels/.rels", "word/document.xml"),
    ".pptx": ("[Content_Types].xml", "_rels/.rels", "ppt/presentation.xml"),
    ".xlsx": ("[Content_Types].xml", "_rels/.rels", "xl/workbook.xml"),
}

PLACEHOLDER_PATTERNS = (
    re.compile(r"\{\{[^{}\r\n]{1,120}\}\}"),
    re.compile(r"<<[^<>\r\n]{1,120}>>"),
    re.compile(r"\$\{[^{}\r\n]{1,120}\}"),
    re.compile(r"\[(?:PLACEHOLDER|TBD|TODO|INSERT[^\]\r\n]{0,100})\]", re.IGNORECASE),
    re.compile(r"\b(?:TBD|TODO|FIXME)\b", re.IGNORECASE),
    re.compile(r"\bLorem ipsum\b", re.IGNORECASE),
    re.compile(r"Click to add (?:title|text|subtitle)", re.IGNORECASE),
)

FORMULA_ERROR_PATTERN = re.compile(
    r"#(?:REF!|DIV/0!|VALUE!|NAME\?|N/A|NUM!|NULL!|SPILL!|CALC!|FIELD!|"
    r"GETTING_DATA|CONNECT!|BLOCKED!|UNKNOWN!|BUSY!)",
    re.IGNORECASE,
)


def _issue(code: str, location: str, message: str) -> Dict[str, str]:
    return {
        "code": code,
        "location": location,
        "message": message,
        "severity": "error",
    }


def _deduplicate_issues(issues: Iterable[Dict[str, str]]) -> List[Dict[str, str]]:
    unique = {
        (item["code"], item["location"], item["message"], item["severity"]): item
        for item in issues
    }
    return [
        unique[key]
        for key in sorted(unique, key=lambda value: (value[0], value[1], value[2]))
    ]


def _relationship_source(rels_name: str) -> str:
    if rels_name == "_rels/.rels":
        return ""
    marker = "/_rels/"
    if marker not in rels_name or not rels_name.endswith(".rels"):
        return ""
    prefix, filename = rels_name.split(marker, 1)
    return posixpath.join(prefix, filename[:-5])


def _resolve_relationship_target(rels_name: str, target: str) -> Optional[str]:
    parsed = urlsplit(target)
    path = unquote(parsed.path)
    if not path or path.startswith("#"):
        return None
    if path.startswith("/"):
        return posixpath.normpath(path.lstrip("/"))
    source = _relationship_source(rels_name)
    return posixpath.normpath(posixpath.join(posixpath.dirname(source), path))


def _content_part(extension: str, name: str) -> bool:
    if extension == ".docx":
        return bool(
            name == "word/document.xml"
            or re.fullmatch(
                r"word/(?:header|footer|footnotes|endnotes|comments)\d*\.xml", name
            )
        )
    if extension == ".pptx":
        return bool(
            re.fullmatch(r"ppt/(?:slides/slide|notesSlides/notesSlide)\d+\.xml", name)
        )
    return bool(
        name == "xl/sharedStrings.xml"
        or re.fullmatch(r"xl/(?:worksheets/sheet|comments)\d+\.xml", name)
    )


def _scan_placeholders(
    extension: str, roots: Dict[str, ElementTree.Element]
) -> List[Dict[str, str]]:
    issues: List[Dict[str, str]] = []
    for name in sorted(roots):
        if not _content_part(extension, name):
            continue
        text = "".join(roots[name].itertext())
        for pattern in PLACEHOLDER_PATTERNS:
            for match in pattern.finditer(text):
                token = re.sub(r"\s+", " ", match.group(0)).strip()
                issues.append(
                    _issue(
                        "placeholder_text",
                        "{}#text-{}".format(name, match.start()),
                        "unresolved placeholder text: {!r}".format(token[:160]),
                    )
                )
    return issues


def _scan_formula_errors(
    roots: Dict[str, ElementTree.Element]
) -> List[Dict[str, str]]:
    issues: List[Dict[str, str]] = []
    cell_tag = "{{{}}}c".format(SPREADSHEET_NS)
    defined_name_tag = "{{{}}}definedName".format(SPREADSHEET_NS)

    for name in sorted(roots):
        if re.fullmatch(r"xl/worksheets/sheet\d+\.xml", name):
            for cell in roots[name].iter(cell_tag):
                text = "".join(cell.itertext())
                for literal in sorted(set(FORMULA_ERROR_PATTERN.findall(text.upper()))):
                    issues.append(
                        _issue(
                            "formula_error_literal",
                            "{}!{}".format(name, cell.get("r", "?")),
                            "formula error literal found: {}".format(literal),
                        )
                    )
        elif name == "xl/workbook.xml":
            for defined_name in roots[name].iter(defined_name_tag):
                text = "".join(defined_name.itertext())
                for literal in sorted(set(FORMULA_ERROR_PATTERN.findall(text.upper()))):
                    label = defined_name.get("name", "?")
                    issues.append(
                        _issue(
                            "formula_error_literal",
                            "{}!definedName:{}".format(name, label),
                            "formula error literal found: {}".format(literal),
                        )
                    )
    return issues


def _format_counts(
    extension: str,
    names: Iterable[str],
    roots: Dict[str, ElementTree.Element],
) -> Dict[str, int]:
    name_set = set(names)
    counts: Dict[str, int] = {
        "package_members": len(name_set),
        "relationship_parts": sum(name.endswith(".rels") for name in name_set),
        "xml_parts": sum(
            name.lower().endswith((".xml", ".rels")) for name in name_set
        ),
    }

    if extension == ".docx":
        word_ns = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
        document = roots.get("word/document.xml")
        counts.update(
            {
                "comments": sum(
                    1
                    for root_name, root in roots.items()
                    if root_name == "word/comments.xml"
                    for _ in root.iter("{{{}}}comment".format(word_ns))
                ),
                "footers": sum(
                    bool(re.fullmatch(r"word/footer\d+\.xml", name))
                    for name in name_set
                ),
                "headers": sum(
                    bool(re.fullmatch(r"word/header\d+\.xml", name))
                    for name in name_set
                ),
                "paragraphs": (
                    sum(1 for _ in document.iter("{{{}}}p".format(word_ns)))
                    if document is not None
                    else 0
                ),
                "sections": (
                    sum(1 for _ in document.iter("{{{}}}sectPr".format(word_ns)))
                    if document is not None
                    else 0
                ),
                "tables": (
                    sum(1 for _ in document.iter("{{{}}}tbl".format(word_ns)))
                    if document is not None
                    else 0
                ),
            }
        )
    elif extension == ".pptx":
        counts.update(
            {
                "charts": sum(name.startswith("ppt/charts/") and name.endswith(".xml") for name in name_set),
                "media": sum(name.startswith("ppt/media/") and not name.endswith("/") for name in name_set),
                "notes_slides": sum(
                    bool(re.fullmatch(r"ppt/notesSlides/notesSlide\d+\.xml", name))
                    for name in name_set
                ),
                "slide_layouts": sum(
                    bool(re.fullmatch(r"ppt/slideLayouts/slideLayout\d+\.xml", name))
                    for name in name_set
                ),
                "slide_masters": sum(
                    bool(re.fullmatch(r"ppt/slideMasters/slideMaster\d+\.xml", name))
                    for name in name_set
                ),
                "slides": sum(
                    bool(re.fullmatch(r"ppt/slides/slide\d+\.xml", name))
                    for name in name_set
                ),
            }
        )
    else:
        formula_tag = "{{{}}}f".format(SPREADSHEET_NS)
        cell_tag = "{{{}}}c".format(SPREADSHEET_NS)
        worksheet_roots = [
            root
            for name, root in roots.items()
            if re.fullmatch(r"xl/worksheets/sheet\d+\.xml", name)
        ]
        workbook = roots.get("xl/workbook.xml")
        counts.update(
            {
                "cells": sum(sum(1 for _ in root.iter(cell_tag)) for root in worksheet_roots),
                "charts": sum(name.startswith("xl/charts/") and name.endswith(".xml") for name in name_set),
                "defined_names": (
                    sum(
                        1
                        for _ in workbook.iter(
                            "{{{}}}definedName".format(SPREADSHEET_NS)
                        )
                    )
                    if workbook is not None
                    else 0
                ),
                "external_link_parts": sum(
                    name.startswith("xl/externalLinks/") and name.endswith(".xml")
                    for name in name_set
                ),
                "formulas": sum(
                    sum(1 for _ in root.iter(formula_tag)) for root in worksheet_roots
                ),
                "tables": sum(name.startswith("xl/tables/") and name.endswith(".xml") for name in name_set),
                "worksheets": len(worksheet_roots),
            }
        )
    return counts


def _scan_package(
    path: Path,
    allowed_external_targets: Iterable[str] = (),
) -> Tuple[str, Dict[str, object]]:
    absolute_path = str(path.resolve(strict=False))
    extension = path.suffix.lower()
    allowed_external_target_set = set(allowed_external_targets)
    base: Dict[str, object] = {
        "allowed_external_targets": sorted(allowed_external_target_set),
        "counts": {},
        "format": extension.lstrip(".") or None,
        "issues": [],
        "path": absolute_path,
        "status": "INCONCLUSIVE",
    }

    if extension not in REQUIRED_PARTS:
        base["issues"] = [
            _issue(
                "unsupported_format",
                absolute_path,
                "supported extensions are .docx, .pptx, and .xlsx",
            )
        ]
        base["status"] = "REJECT"
        return "REJECT", base

    try:
        if not path.exists():
            base["issues"] = [_issue("file_missing", absolute_path, "input file does not exist")]
            base["status"] = "REJECT"
            return "REJECT", base
        if not path.is_file():
            base["issues"] = [_issue("not_a_file", absolute_path, "input path is not a file")]
            base["status"] = "REJECT"
            return "REJECT", base
        if not zipfile.is_zipfile(path):
            base["issues"] = [
                _issue(
                    "invalid_zip",
                    absolute_path,
                    "file is not a valid ZIP-based OOXML package",
                )
            ]
            base["status"] = "REJECT"
            return "REJECT", base
    except OSError as exc:
        base["issues"] = [_issue("io_unavailable", absolute_path, str(exc))]
        return "INCONCLUSIVE", base

    issues: List[Dict[str, str]] = []
    external_targets: List[str] = []
    authorized_external_targets: List[str] = []
    roots: Dict[str, ElementTree.Element] = {}
    try:
        with zipfile.ZipFile(path) as package:
            raw_names = package.namelist()
            names = set(raw_names)
            duplicate_names = sorted(
                name for name in names if raw_names.count(name) > 1
            )
            for name in duplicate_names:
                issues.append(
                    _issue("duplicate_package_part", name, "duplicate ZIP member name")
                )

            bad_member = package.testzip()
            if bad_member:
                issues.append(
                    _issue("crc_failure", bad_member, "ZIP member failed CRC validation")
                )

            for name in sorted(names):
                pure = PurePosixPath(name)
                if pure.is_absolute() or ".." in pure.parts or "\\" in name:
                    issues.append(
                        _issue("unsafe_package_path", name, "unsafe ZIP member path")
                    )

            for required in REQUIRED_PARTS[extension]:
                if required not in names:
                    issues.append(
                        _issue(
                            "missing_required_part",
                            required,
                            "required OOXML part is missing",
                        )
                    )

            for name in sorted(names):
                if not name.lower().endswith((".xml", ".rels")):
                    continue
                try:
                    roots[name] = ElementTree.fromstring(package.read(name))
                except (ElementTree.ParseError, KeyError, RuntimeError) as exc:
                    issues.append(_issue("invalid_xml", name, str(exc)))

            for name in sorted(roots):
                if not name.endswith(".rels"):
                    continue
                for relationship in roots[name].findall(
                    "{{{}}}Relationship".format(RELATIONSHIP_NS)
                ):
                    target = relationship.get("Target")
                    if not target:
                        issues.append(
                            _issue(
                                "relationship_without_target",
                                name,
                                "relationship has no Target",
                            )
                        )
                        continue
                    if (relationship.get("TargetMode") or "").lower() == "external":
                        external_targets.append(target)
                        if target in allowed_external_target_set:
                            authorized_external_targets.append(target)
                            continue
                        issues.append(
                            _issue(
                                "external_relationship",
                                name,
                                "external target is not explicitly authorized: {}".format(
                                    target
                                ),
                            )
                        )
                        continue
                    resolved = _resolve_relationship_target(name, target)
                    if resolved is not None and (
                        resolved.startswith("../") or resolved not in names
                    ):
                        issues.append(
                            _issue(
                                "missing_relationship_target",
                                name,
                                "missing internal target: {}".format(target),
                            )
                        )

            issues.extend(_scan_placeholders(extension, roots))
            if extension == ".xlsx":
                issues.extend(_scan_formula_errors(roots))

            counts = _format_counts(extension, names, roots)
    except (OSError, PermissionError) as exc:
        base["issues"] = [_issue("io_unavailable", absolute_path, str(exc))]
        return "INCONCLUSIVE", base
    except (zipfile.BadZipFile, RuntimeError) as exc:
        issues.append(_issue("invalid_zip", absolute_path, str(exc)))
        counts = {}

    final_issues = _deduplicate_issues(issues)
    counts["external_relationships"] = len(external_targets)
    counts["authorized_external_relationships"] = len(
        authorized_external_targets
    )
    counts["unauthorized_external_relationships"] = sum(
        issue["code"] == "external_relationship" for issue in final_issues
    )
    counts["formula_error_literals"] = sum(
        issue["code"] == "formula_error_literal" for issue in final_issues
    )
    counts["placeholders"] = sum(
        issue["code"] == "placeholder_text" for issue in final_issues
    )
    base["counts"] = counts
    base["issues"] = final_issues
    base["status"] = "REJECT" if final_issues else "PASS"
    return str(base["status"]), base


def _write_fixture(
    path: Path,
    extension: str,
    with_issues: bool = False,
    external_target: Optional[str] = None,
) -> None:
    content_types = (
        '<?xml version="1.0" encoding="UTF-8"?>'
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"/>'
    )
    relationships = (
        '<?xml version="1.0" encoding="UTF-8"?>'
        '<Relationships xmlns="{}"/>'.format(RELATIONSHIP_NS)
    )
    if extension == ".docx":
        main_name = "word/document.xml"
        token = "{{CLIENT}}" if with_issues else "Ready"
        main_xml = (
            '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
            "<w:body><w:p><w:r><w:t>{}</w:t></w:r></w:p><w:sectPr/></w:body>"
            "</w:document>"
        ).format(token)
        extras: Dict[str, str] = {}
    elif extension == ".pptx":
        main_name = "ppt/presentation.xml"
        main_xml = (
            '<p:presentation xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"/>'
        )
        token = "TODO" if with_issues else "Ready"
        extras = {
            "ppt/slides/slide1.xml": (
                '<p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" '
                'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">'
                "<p:cSld><p:spTree><p:sp><p:txBody><a:p><a:r><a:t>{}</a:t></a:r>"
                "</a:p></p:txBody></p:sp></p:spTree></p:cSld></p:sld>"
            ).format(token)
        }
    else:
        main_name = "xl/workbook.xml"
        main_xml = (
            '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"/>'
        )
        value = "#REF!" if with_issues else "2"
        cell_type = ' t="e"' if with_issues else ""
        extras = {
            "xl/worksheets/sheet1.xml": (
                '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
                '<sheetData><row r="1"><c r="A1"{}><f>1+1</f><v>{}</v></c>'
                "</row></sheetData></worksheet>"
            ).format(cell_type, value)
        }

    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as package:
        package.writestr("[Content_Types].xml", content_types)
        package.writestr("_rels/.rels", relationships)
        package.writestr(main_name, main_xml)
        for name in sorted(extras):
            package.writestr(name, extras[name])
        if with_issues or external_target is not None:
            external_rels = (
                '<?xml version="1.0" encoding="UTF-8"?>'
                '<Relationships xmlns="{}"><Relationship Id="rId1" '
                'Type="test" Target="{}" '
                'TargetMode="External"/></Relationships>'
            ).format(
                RELATIONSHIP_NS,
                external_target or "https://example.invalid/resource",
            )
            package.writestr("_rels/issue.rels", external_rels)


def _self_test() -> Tuple[int, Dict[str, object]]:
    checks: List[Dict[str, object]] = []
    failures: List[str] = []
    with tempfile.TemporaryDirectory(prefix="office-static-scan-") as directory:
        root = Path(directory)
        for extension in sorted(REQUIRED_PARTS):
            valid = root / ("valid" + extension)
            _write_fixture(valid, extension)
            status, result = _scan_package(valid)
            passed = status == "PASS"
            checks.append({"check": "valid_{}".format(extension[1:]), "passed": passed})
            if not passed:
                failures.append("valid {} fixture was not PASS".format(extension))

        issue_fixture = root / "issues.xlsx"
        _write_fixture(issue_fixture, ".xlsx", with_issues=True)
        status, result = _scan_package(issue_fixture)
        codes = {item["code"] for item in result["issues"]}  # type: ignore[index]
        expected = {"external_relationship", "formula_error_literal"}
        passed = status == "REJECT" and expected.issubset(codes)
        checks.append({"check": "issue_detection", "passed": passed})
        if not passed:
            failures.append("issue fixture did not expose external relationship and formula error")

        authorized = root / "authorized.docx"
        authorized_target = "https://example.invalid/authorized-source"
        _write_fixture(
            authorized,
            ".docx",
            external_target=authorized_target,
        )
        status, result = _scan_package(
            authorized,
            allowed_external_targets=(authorized_target,),
        )
        counts = result["counts"]  # type: ignore[assignment]
        passed = (
            status == "PASS"
            and counts["external_relationships"] == 1  # type: ignore[index]
            and counts["authorized_external_relationships"] == 1  # type: ignore[index]
            and counts["unauthorized_external_relationships"] == 0  # type: ignore[index]
        )
        checks.append({"check": "authorized_external_target", "passed": passed})
        if not passed:
            failures.append("an exactly allowlisted external target was not accepted")

        invalid = root / "invalid.docx"
        invalid.write_bytes(b"not an OOXML package")
        status, _ = _scan_package(invalid)
        passed = status == "REJECT"
        checks.append({"check": "invalid_zip", "passed": passed})
        if not passed:
            failures.append("invalid ZIP fixture was not REJECT")

    exit_code = PASS if not failures else REJECT
    payload: Dict[str, object] = {
        "exit_code": exit_code,
        "failures": failures,
        "schema_version": 1,
        "self_test": checks,
        "status": "PASS" if not failures else "REJECT",
        "tool": "scan_office",
    }
    return exit_code, payload


class _JsonArgumentParser(argparse.ArgumentParser):
    def error(self, message: str) -> None:
        payload = {
            "exit_code": REJECT,
            "issues": [_issue("invalid_arguments", "command_line", message)],
            "schema_version": 1,
            "status": "REJECT",
            "tool": "scan_office",
        }
        print(json.dumps(payload, ensure_ascii=True, indent=2, sort_keys=True))
        raise SystemExit(REJECT)


def main() -> int:
    parser = _JsonArgumentParser(description=__doc__)
    parser.add_argument("paths", nargs="*", type=Path)
    parser.add_argument(
        "--allow-external-target",
        action="append",
        default=[],
        metavar="EXACT_URI",
        help=(
            "authorize one exact external relationship target; repeat for each "
            "reviewed URI"
        ),
    )
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()

    if args.self_test:
        if args.paths or args.allow_external_target:
            parser.error(
                "--self-test cannot be combined with input paths or allowlists"
            )
        exit_code, payload = _self_test()
        print(json.dumps(payload, ensure_ascii=True, indent=2, sort_keys=True))
        return exit_code

    if not args.paths:
        parser.error("provide at least one DOCX, PPTX, or XLSX path")

    results: List[Dict[str, object]] = []
    statuses: List[str] = []
    for path in args.paths:
        status, result = _scan_package(
            path,
            allowed_external_targets=args.allow_external_target,
        )
        statuses.append(status)
        results.append(result)

    if "REJECT" in statuses:
        status = "REJECT"
        exit_code = REJECT
    elif "INCONCLUSIVE" in statuses:
        status = "INCONCLUSIVE"
        exit_code = INCONCLUSIVE
    else:
        status = "PASS"
        exit_code = PASS

    payload = {
        "exit_code": exit_code,
        "results": results,
        "schema_version": 1,
        "status": status,
        "summary": {
            "files": len(results),
            "inconclusive": statuses.count("INCONCLUSIVE"),
            "issues": sum(len(result["issues"]) for result in results),
            "passed": statuses.count("PASS"),
            "rejected": statuses.count("REJECT"),
        },
        "tool": "scan_office",
    }
    print(json.dumps(payload, ensure_ascii=True, indent=2, sort_keys=True))
    return exit_code


if __name__ == "__main__":
    raise SystemExit(main())

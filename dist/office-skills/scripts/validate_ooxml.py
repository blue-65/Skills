#!/usr/bin/env python3
"""Static OOXML package validator for DOCX, PPTX, and XLSX files."""

from __future__ import annotations

import argparse
import posixpath
import tempfile
import zipfile
from pathlib import Path, PurePosixPath
from xml.etree import ElementTree


REQUIRED_PARTS = {
    ".docx": {"[Content_Types].xml", "_rels/.rels", "word/document.xml"},
    ".pptx": {"[Content_Types].xml", "_rels/.rels", "ppt/presentation.xml"},
    ".xlsx": {"[Content_Types].xml", "_rels/.rels", "xl/workbook.xml"},
}

RELATIONSHIP_NS = "http://schemas.openxmlformats.org/package/2006/relationships"


def _relationship_source(rels_name: str) -> str:
    if rels_name == "_rels/.rels":
        return ""
    marker = "/_rels/"
    if marker not in rels_name or not rels_name.endswith(".rels"):
        return ""
    prefix, filename = rels_name.split(marker, 1)
    return posixpath.join(prefix, filename[:-5])


def _resolve_target(rels_name: str, target: str) -> str:
    if target.startswith("/"):
        return target.lstrip("/")
    source = _relationship_source(rels_name)
    base = posixpath.dirname(source)
    return posixpath.normpath(posixpath.join(base, target))


def validate_package(file_path: Path) -> list[str]:
    issues: list[str] = []
    suffix = file_path.suffix.lower()
    if suffix not in REQUIRED_PARTS:
        return [f"unsupported extension: {suffix or '<none>'}"]
    if not file_path.is_file():
        return ["file does not exist"]
    if not zipfile.is_zipfile(file_path):
        return ["not a valid ZIP-based OOXML package"]

    with zipfile.ZipFile(file_path) as package:
        names = set(package.namelist())
        bad_member = package.testzip()
        if bad_member:
            issues.append(f"CRC failure: {bad_member}")

        for name in names:
            pure = PurePosixPath(name)
            if pure.is_absolute() or ".." in pure.parts or "\\" in name:
                issues.append(f"unsafe package path: {name}")

        for required in REQUIRED_PARTS[suffix]:
            if required not in names:
                issues.append(f"missing required part: {required}")

        for name in sorted(names):
            lowered = name.lower()
            if lowered.endswith((".vbaProject.bin".lower(), ".bin")) and (
                "vba" in lowered or "oleobject" in lowered or "embeddings/" in lowered
            ):
                issues.append(f"executable or embedded binary part: {name}")

            if not lowered.endswith((".xml", ".rels")):
                continue
            try:
                root = ElementTree.fromstring(package.read(name))
            except ElementTree.ParseError as exc:
                issues.append(f"invalid XML in {name}: {exc}")
                continue

            if not lowered.endswith(".rels"):
                continue
            for relationship in root.findall(f"{{{RELATIONSHIP_NS}}}Relationship"):
                target = relationship.get("Target")
                if not target:
                    issues.append(f"relationship without target in {name}")
                    continue
                if relationship.get("TargetMode") == "External":
                    issues.append(f"external relationship in {name}: {target}")
                    continue
                resolved = _resolve_target(name, target)
                if resolved.startswith("../") or resolved not in names:
                    issues.append(f"missing relationship target from {name}: {target}")

    return sorted(set(issues))


def _write_minimal_package(path: Path, main_part: str) -> None:
    content_types = """<?xml version="1.0" encoding="UTF-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"/>
"""
    relationships = f"""<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="{RELATIONSHIP_NS}"/>
"""
    body = """<?xml version="1.0" encoding="UTF-8"?><root/>"""
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as package:
        package.writestr("[Content_Types].xml", content_types)
        package.writestr("_rels/.rels", relationships)
        package.writestr(main_part, body)


def self_test() -> list[str]:
    failures: list[str] = []
    with tempfile.TemporaryDirectory(prefix="office-ooxml-self-test-") as directory:
        root = Path(directory)
        for suffix, required in REQUIRED_PARTS.items():
            main_part = next(part for part in required if part not in {"[Content_Types].xml", "_rels/.rels"})
            path = root / f"valid{suffix}"
            _write_minimal_package(path, main_part)
            issues = validate_package(path)
            if issues:
                failures.append(f"{suffix} valid fixture failed: {issues}")

        invalid = root / "invalid.docx"
        invalid.write_text("not a zip", encoding="utf-8")
        if not validate_package(invalid):
            failures.append("invalid ZIP fixture was not rejected")
    return failures


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("paths", nargs="*", type=Path)
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()

    failures: list[str] = []
    if args.self_test:
        failures.extend(self_test())

    for path in args.paths:
        issues = validate_package(path)
        if issues:
            failures.append(f"{path}:")
            failures.extend(f"  {issue}" for issue in issues)
        else:
            print(f"PASS: {path}")

    if failures:
        print("FAIL:")
        for failure in failures:
            print(failure)
        return 1

    if args.self_test:
        print("PASS: OOXML validator self-test")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

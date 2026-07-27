#!/usr/bin/env python3
"""Validate an Office evidence report's schema and semantic invariants.

The command first validates the schema itself and then the report with
jsonschema 4.x Draft202012Validator. Semantic checks run only after that stage
passes.

Examples:
  python scripts/validate_evidence_report.py report.json --profile generic
  python scripts/validate_evidence_report.py report.json --profile rfp --expected-count 42
  python scripts/validate_evidence_report.py report.json --profile generic --schema schema.json
  python scripts/validate_evidence_report.py --self-test

Exit codes are 0 for PASS, 1 for REJECT, and 2 for INCONCLUSIVE. A valid report
whose own overall_status is REJECT or INCONCLUSIVE returns the corresponding
exit code. Invalid schema, invalid report structure, or a semantic contradiction
returns REJECT. Missing jsonschema 4.x or a missing schema file returns
INCONCLUSIVE and names the missing capability.
"""

from __future__ import annotations

import argparse
import copy
import json
import math
import re
from importlib.metadata import PackageNotFoundError, version
from pathlib import Path
from typing import Any

try:
    from jsonschema import Draft202012Validator, FormatChecker
    from jsonschema.exceptions import SchemaError

    JSONSCHEMA_VERSION: str | None = version("jsonschema")
except (ImportError, PackageNotFoundError):
    Draft202012Validator = None  # type: ignore[assignment,misc]
    FormatChecker = None  # type: ignore[assignment,misc]
    SchemaError = Exception  # type: ignore[assignment,misc]
    JSONSCHEMA_VERSION = None


PASS = 0
REJECT = 1
INCONCLUSIVE = 2

DEFAULT_SCHEMA_PATH = (
    Path(__file__).resolve().parent.parent
    / "references"
    / "evidence-report.schema.json"
)
PROFILES = ("generic", "proposal", "rfp", "financial-model")
GATE_NAMES = ("reopen", "scan", "render", "runtime", "accessibility")
STATUS_EXIT = {"PASS": PASS, "REJECT": REJECT, "INCONCLUSIVE": INCONCLUSIVE}
SHA256_PATTERN = re.compile(r"^[A-Fa-f0-9]{64}$")

LIMITATIONS = (
    "Schema validation uses jsonschema 4.x Draft202012Validator with format checks.",
    "This tool does not open Office artifacts, check paths, recompute hashes, "
    "or prove that an RFP DOCX is visually or revision-clean.",
)


def _issue(code: str, location: str, message: str) -> dict[str, str]:
    return {"code": code, "location": location, "message": message}


def _add(
    issues: list[dict[str, str]], code: str, location: str, message: str
) -> None:
    issues.append(_issue(code, location, message))


def _sorted_issues(issues: list[dict[str, str]]) -> list[dict[str, str]]:
    unique = {
        (item["code"], item["location"], item["message"]): item for item in issues
    }
    return [
        unique[key]
        for key in sorted(unique, key=lambda value: (value[1], value[0], value[2]))
    ]


def _json_pointer(parts: Any) -> str:
    encoded = [
        str(part).replace("~", "~0").replace("/", "~1") for part in parts
    ]
    return "$" if not encoded else "$/" + "/".join(encoded)


def _schema_validation(
    report: Any, schema_path: str | Path | None
) -> tuple[str, list[dict[str, str]], list[str], str]:
    path = (
        Path(schema_path).expanduser().resolve(strict=False)
        if schema_path is not None
        else DEFAULT_SCHEMA_PATH
    )
    path_text = str(path)

    major = None
    if JSONSCHEMA_VERSION is not None:
        try:
            major = int(JSONSCHEMA_VERSION.split(".", 1)[0])
        except ValueError:
            major = None
    if Draft202012Validator is None or FormatChecker is None or major != 4:
        capability = (
            "jsonschema 4.x with Draft202012Validator is unavailable"
            if JSONSCHEMA_VERSION is None
            else "jsonschema 4.x is required; found {}".format(
                JSONSCHEMA_VERSION
            )
        )
        return "INCONCLUSIVE", [], [capability], path_text

    try:
        if not path.is_file():
            return (
                "INCONCLUSIVE",
                [],
                ["schema file is unavailable: {}".format(path_text)],
                path_text,
            )
        with path.open("r", encoding="utf-8") as handle:
            schema = json.load(handle)
    except FileNotFoundError:
        return (
            "INCONCLUSIVE",
            [],
            ["schema file is unavailable: {}".format(path_text)],
            path_text,
        )
    except OSError as exc:
        return (
            "INCONCLUSIVE",
            [],
            [
                "schema file cannot be read: {}: {}".format(
                    type(exc).__name__, str(exc)
                )
            ],
            path_text,
        )
    except (UnicodeError, json.JSONDecodeError) as exc:
        return (
            "REJECT",
            [
                _issue(
                    "schema_document_invalid",
                    "schema",
                    "{}: {}".format(type(exc).__name__, str(exc)),
                )
            ],
            [],
            path_text,
        )

    try:
        Draft202012Validator.check_schema(schema)
        validator = Draft202012Validator(
            schema, format_checker=FormatChecker()
        )
    except SchemaError as exc:
        location = _json_pointer(getattr(exc, "absolute_schema_path", ()))
        return (
            "REJECT",
            [
                _issue(
                    "schema_definition_invalid",
                    location,
                    str(exc.message),
                )
            ],
            [],
            path_text,
        )

    errors = sorted(
        validator.iter_errors(report),
        key=lambda error: (
            tuple(str(part) for part in error.absolute_path),
            tuple(str(part) for part in error.absolute_schema_path),
            str(error.validator),
            error.message,
        ),
    )
    if errors:
        issues = [
            _issue(
                "report_schema_invalid",
                _json_pointer(error.absolute_path),
                error.message,
            )
            for error in errors
        ]
        return "REJECT", _sorted_issues(issues), [], path_text
    return "PASS", [], [], path_text


def _artifacts(report: dict[str, Any]) -> list[dict[str, Any]]:
    value = report.get("artifacts")
    return [item for item in value if isinstance(item, dict)] if isinstance(value, list) else []


def _checks(report: dict[str, Any]) -> list[dict[str, Any]]:
    value = report.get("acceptance_checks")
    return [item for item in value if isinstance(item, dict)] if isinstance(value, list) else []


def _category_checks(
    report: dict[str, Any], category: str
) -> list[dict[str, Any]]:
    return [item for item in _checks(report) if item.get("category") == category]


def _format_is(artifact: dict[str, Any], extension: str) -> bool:
    expected = extension.lower().lstrip(".")
    declared = str(artifact.get("format", "")).lower().lstrip(".")
    path_suffix = Path(str(artifact.get("path", ""))).suffix.lower().lstrip(".")
    return declared == expected and path_suffix == expected


def _normalized_artifact_path(artifact: dict[str, Any]) -> str:
    value = artifact.get("path")
    if not isinstance(value, str) or not value.strip():
        return ""
    return (
        str(Path(value).expanduser().resolve(strict=False))
        .replace("\\", "/")
        .casefold()
    )


def _valid_hash(artifact: dict[str, Any]) -> bool:
    return bool(SHA256_PATTERN.fullmatch(str(artifact.get("sha256", ""))))


def _number(value: Any) -> bool:
    return isinstance(value, (int, float)) and not isinstance(value, bool)


def _require_profile_category(
    report: dict[str, Any],
    category: str,
    profile: str,
    issues: list[dict[str, str]],
) -> None:
    matches = _category_checks(report, category)
    location = "acceptance_checks[category={}]".format(category)
    if not matches:
        _add(
            issues,
            "{}_acceptance_missing".format(profile.replace("-", "_")),
            location,
            "{} requires a {} acceptance check.".format(profile, category),
        )
        return
    for check in matches:
        if (
            check.get("required") is not True
            or check.get("status") != "PASS"
            or check.get("met") is not True
        ):
            _add(
                issues,
                "{}_acceptance_not_pass".format(profile.replace("-", "_")),
                location,
                "{} acceptance checks must be required, PASS, and met.".format(
                    category
                ),
            )


def _walk_evidence_references(
    value: Any, location: str = "$"
) -> list[tuple[str, Any]]:
    references: list[tuple[str, Any]] = []
    if isinstance(value, dict):
        for key in sorted(value):
            child = value[key]
            child_location = "{}.{}".format(location, key)
            if key == "evidence" and isinstance(child, list):
                for index, reference in enumerate(child):
                    references.append(
                        ("{}[{}]".format(child_location, index), reference)
                    )
            else:
                references.extend(_walk_evidence_references(child, child_location))
    elif isinstance(value, list):
        for index, child in enumerate(value):
            references.extend(
                _walk_evidence_references(
                    child, "{}[{}]".format(location, index)
                )
            )
    return references


def _validate_common(
    report: dict[str, Any],
    profile: str,
    expected_count: int | None,
    issues: list[dict[str, str]],
) -> tuple[str | None, list[str]]:
    if report.get("profile") != profile:
        _add(
            issues,
            "profile_mismatch",
            "profile",
            "Report profile {!r} must match CLI --profile {!r}.".format(
                report.get("profile"), profile
            ),
        )

    artifacts = _artifacts(report)
    artifact_ids = [item.get("artifact_id") for item in artifacts]
    string_ids = [item for item in artifact_ids if isinstance(item, str) and item]
    id_set = set(string_ids)

    if len(string_ids) != len(artifacts):
        _add(
            issues,
            "artifact_id_missing",
            "artifacts",
            "Every artifact must have a non-empty artifact_id.",
        )
    if len(id_set) != len(string_ids):
        duplicates = sorted(
            {item for item in string_ids if string_ids.count(item) > 1}
        )
        _add(
            issues,
            "duplicate_artifact_id",
            "artifacts",
            "Artifact IDs must be unique; duplicates: {}.".format(
                ", ".join(duplicates)
            ),
        )

    primary_id = report.get("primary_artifact_id")
    primary_role = [item for item in artifacts if item.get("role") == "primary"]
    primary_matches = [
        item for item in primary_role if item.get("artifact_id") == primary_id
    ]
    if len(primary_role) != 1 or len(primary_matches) != 1:
        _add(
            issues,
            "primary_artifact_mismatch",
            "primary_artifact_id",
            "primary_artifact_id must identify the one artifact with role primary.",
        )

    render = report.get("render")
    inventory_value = render.get("inventory") if isinstance(render, dict) else None
    inventory = (
        [item for item in inventory_value if isinstance(item, dict)]
        if isinstance(inventory_value, list)
        else []
    )
    inventory_ids = [
        item.get("item_id")
        for item in inventory
        if isinstance(item.get("item_id"), str) and item.get("item_id")
    ]
    inventory_by_id = {
        item["item_id"]: item
        for item in inventory
        if isinstance(item.get("item_id"), str) and item.get("item_id")
    }
    if len(inventory_ids) != len(inventory) or len(inventory_by_id) != len(inventory):
        _add(
            issues,
            "render_item_id_not_unique",
            "render.inventory",
            "Every render inventory item must have a unique non-empty item_id.",
        )

    physical_keys: dict[tuple[Any, Any, Any], str] = {}
    source_keys: dict[tuple[Any, Any, str], str] = {}
    render_paths: dict[str, str] = {}
    ordinal_groups: dict[tuple[Any, Any], list[int]] = {}
    for index, item in enumerate(inventory):
        location = "render.inventory[{}]".format(index)
        item_id = str(item.get("item_id", "?"))
        artifact_id = item.get("artifact_id")
        kind = item.get("kind")
        ordinal = item.get("ordinal")
        if artifact_id not in id_set:
            _add(
                issues,
                "render_artifact_unresolved",
                "{}.artifact_id".format(location),
                "Render item {} artifact_id {!r} does not resolve.".format(
                    item_id, artifact_id
                ),
            )
        physical_key = (artifact_id, kind, ordinal)
        if physical_key in physical_keys:
            _add(
                issues,
                "duplicate_render_physical_unit",
                location,
                "Render items {} and {} identify the same artifact, kind, and "
                "ordinal.".format(physical_keys[physical_key], item_id),
            )
        else:
            physical_keys[physical_key] = item_id

        source_location = str(item.get("source_location", "")).strip().casefold()
        source_key = (artifact_id, kind, source_location)
        if source_key in source_keys:
            _add(
                issues,
                "duplicate_render_source_location",
                location,
                "Render items {} and {} identify the same artifact, kind, and "
                "source_location.".format(source_keys[source_key], item_id),
            )
        else:
            source_keys[source_key] = item_id

        render_path = (
            str(item.get("render_path", ""))
            .strip()
            .replace("\\", "/")
            .casefold()
        )
        if render_path in render_paths:
            _add(
                issues,
                "duplicate_render_path",
                "{}.render_path".format(location),
                "Render items {} and {} reuse the same render_path.".format(
                    render_paths[render_path], item_id
                ),
            )
        else:
            render_paths[render_path] = item_id

        if isinstance(ordinal, int) and not isinstance(ordinal, bool):
            ordinal_groups.setdefault((artifact_id, kind), []).append(ordinal)

    for (artifact_id, kind), ordinals in sorted(
        ordinal_groups.items(), key=lambda item: (str(item[0][0]), str(item[0][1]))
    ):
        observed_ordinals = sorted(ordinals)
        expected_ordinals = list(range(1, len(ordinals) + 1))
        if observed_ordinals != expected_ordinals:
            _add(
                issues,
                "render_ordinals_not_contiguous",
                "render.inventory",
                "Render ordinals for artifact {!r} kind {!r} must be the unique "
                "contiguous sequence 1..{}; observed {}.".format(
                    artifact_id, kind, len(ordinals), observed_ordinals
                ),
            )

    for index, artifact in enumerate(artifacts):
        source_id = artifact.get("source_artifact_id")
        if source_id is not None and source_id not in id_set:
            _add(
                issues,
                "unresolved_source_artifact",
                "artifacts[{}].source_artifact_id".format(index),
                "source_artifact_id {!r} does not resolve.".format(source_id),
            )

    for location, reference in _walk_evidence_references(report):
        if not isinstance(reference, dict):
            _add(
                issues,
                "invalid_evidence_reference",
                location,
                "Evidence entries must be objects with a resolving artifact_id.",
            )
            continue
        reference_id = reference.get("artifact_id")
        if reference_id not in id_set:
            _add(
                issues,
                "unresolved_evidence_reference",
                "{}.artifact_id".format(location),
                "Evidence artifact_id {!r} does not resolve.".format(reference_id),
            )

    exact_checks = _category_checks(report, "exact_target")
    if not exact_checks:
        _add(
            issues,
            "exact_target_missing",
            "acceptance_checks",
            "At least one exact_target acceptance check is required.",
        )
    for check in exact_checks:
        check_id = str(check.get("check_id", "?"))
        location = "acceptance_checks[{}]".format(check_id)
        for field in (
            "expected",
            "observed",
            "tolerance",
            "limitations",
            "evidence",
            "target_artifact_id",
            "target_kind",
            "inventory_item_ids",
        ):
            if field not in check:
                _add(
                    issues,
                    "exact_target_field_missing",
                    "{}.{}".format(location, field),
                    "exact_target must include {}.".format(field),
                )
        if not isinstance(check.get("tolerance"), str) or not check["tolerance"].strip():
            _add(
                issues,
                "exact_target_tolerance_missing",
                "{}.tolerance".format(location),
                "exact_target tolerance must be a non-empty string.",
            )
        if not isinstance(check.get("limitations"), list):
            _add(
                issues,
                "exact_target_limitations_invalid",
                "{}.limitations".format(location),
                "exact_target limitations must be an array; use [] when none apply.",
            )
        if not isinstance(check.get("evidence"), list) or not check["evidence"]:
            _add(
                issues,
                "exact_target_evidence_missing",
                "{}.evidence".format(location),
                "exact_target must cite at least one evidence artifact.",
            )
        target_artifact_id = check.get("target_artifact_id")
        target_kind = check.get("target_kind")
        target_inventory_ids = check.get("inventory_item_ids")
        if target_artifact_id not in id_set:
            _add(
                issues,
                "exact_target_artifact_unresolved",
                "{}.target_artifact_id".format(location),
                "exact_target target_artifact_id {!r} does not resolve.".format(
                    target_artifact_id
                ),
            )
        if target_artifact_id != primary_id:
            _add(
                issues,
                "exact_target_must_reference_primary",
                "{}.target_artifact_id".format(location),
                "exact_target must reference primary_artifact_id {!r}.".format(
                    primary_id
                ),
            )
        allowed_target_kinds = {
            "proposal": {"slide"},
            "rfp": {"page"},
            "financial-model": {"sheet", "print_page"},
        }.get(profile, {"page", "slide", "sheet", "print_page", "static_export"})
        if target_kind not in allowed_target_kinds:
            _add(
                issues,
                "exact_target_kind_invalid_for_profile",
                "{}.target_kind".format(location),
                "Profile {!r} exact_target kind must be one of {}.".format(
                    profile, ", ".join(sorted(allowed_target_kinds))
                ),
            )
        if not isinstance(target_inventory_ids, list) or not target_inventory_ids:
            _add(
                issues,
                "exact_target_inventory_missing",
                "{}.inventory_item_ids".format(location),
                "exact_target must list the render inventory item IDs that prove "
                "the counted physical units.",
            )
            target_inventory_ids = []
        if len(set(target_inventory_ids)) != len(target_inventory_ids):
            _add(
                issues,
                "exact_target_inventory_duplicate",
                "{}.inventory_item_ids".format(location),
                "exact_target inventory_item_ids must be unique.",
            )
        unresolved_target_ids = sorted(
            {
                str(item_id)
                for item_id in target_inventory_ids
                if item_id not in inventory_by_id
            }
        )
        if unresolved_target_ids:
            _add(
                issues,
                "exact_target_inventory_unresolved",
                "{}.inventory_item_ids".format(location),
                "exact_target inventory IDs do not resolve: {}.".format(
                    ", ".join(unresolved_target_ids)
                ),
            )
        resolved_target_items = [
            inventory_by_id[item_id]
            for item_id in target_inventory_ids
            if item_id in inventory_by_id
        ]
        if any(
            item.get("artifact_id") != target_artifact_id
            or item.get("kind") != target_kind
            for item in resolved_target_items
        ):
            _add(
                issues,
                "exact_target_inventory_scope_mismatch",
                "{}.inventory_item_ids".format(location),
                "Every exact_target inventory item must match target_artifact_id "
                "and target_kind.",
            )
        complete_target_ids = {
            item.get("item_id")
            for item in inventory
            if item.get("artifact_id") == target_artifact_id
            and item.get("kind") == target_kind
        }
        if set(target_inventory_ids) != complete_target_ids:
            _add(
                issues,
                "exact_target_inventory_incomplete",
                "{}.inventory_item_ids".format(location),
                "exact_target inventory_item_ids must equal the complete render "
                "inventory for the target artifact and physical-unit kind.",
            )
        counted_units = len(target_inventory_ids)
        if (
            isinstance(check.get("expected"), bool)
            or isinstance(check.get("observed"), bool)
            or not isinstance(check.get("expected"), int)
            or not isinstance(check.get("observed"), int)
            or check.get("expected") != counted_units
            or check.get("observed") != counted_units
        ):
            _add(
                issues,
                "exact_target_physical_count_mismatch",
                location,
                "exact_target expected and observed must both equal the number of "
                "bound physical render units ({}).".format(counted_units),
            )
        if expected_count is not None:
            if (
                isinstance(check.get("expected"), bool)
                or isinstance(check.get("observed"), bool)
                or check.get("expected") != expected_count
                or check.get("observed") != expected_count
            ):
                _add(
                    issues,
                    "expected_count_mismatch",
                    location,
                    "exact_target expected and observed must both equal "
                    "--expected-count {}.".format(expected_count),
                )

    if not isinstance(render, dict):
        _add(issues, "render_missing", "render", "A render gate object is required.")
    else:
        inventory_length = (
            len(inventory_value) if isinstance(inventory_value, list) else None
        )
        if not (
            isinstance(render.get("expected_count"), int)
            and not isinstance(render.get("expected_count"), bool)
            and render.get("expected_count") == render.get("actual_count")
            and render.get("expected_count") == inventory_length
            and render.get("count_match") is True
        ):
            _add(
                issues,
                "render_count_mismatch",
                "render",
                "render expected_count, actual_count, and inventory length must "
                "agree, with count_match true.",
            )

    required_states: list[tuple[str, str]] = []
    missing_capabilities: list[str] = []
    for name in GATE_NAMES:
        gate = report.get(name)
        if not isinstance(gate, dict):
            _add(
                issues,
                "gate_missing",
                name,
                "{} gate must be an object.".format(name),
            )
            continue
        if gate.get("required") is True:
            status = gate.get("status")
            required_states.append((name, status))
            if status == "INCONCLUSIVE":
                reason = gate.get("reason")
                if isinstance(reason, str) and reason.strip():
                    missing_capabilities.append("{}: {}".format(name, reason.strip()))
                else:
                    _add(
                        issues,
                        "missing_capability_reason",
                        "{}.reason".format(name),
                        "A required INCONCLUSIVE gate must state the missing "
                        "capability or evidence.",
                    )

    for index, check in enumerate(_checks(report)):
        if check.get("required") is not True:
            continue
        status = check.get("status")
        required_states.append(
            ("acceptance_checks[{}]".format(index), status)
        )
        if status == "INCONCLUSIVE":
            limitations = check.get("limitations")
            explanations = [
                item.strip()
                for item in limitations
                if isinstance(item, str) and item.strip()
            ] if isinstance(limitations, list) else []
            if explanations:
                missing_capabilities.append(
                    "acceptance_checks[{}]: {}".format(index, "; ".join(explanations))
                )
            else:
                _add(
                    issues,
                    "missing_capability_reason",
                    "acceptance_checks[{}].limitations".format(index),
                    "A required INCONCLUSIVE acceptance check must state the "
                    "missing capability or evidence in limitations.",
                )
        elif status == "PASS" and check.get("met") is not True:
            required_states[-1] = (required_states[-1][0], "REJECT")

    blocking = [
        item
        for item in report.get("unresolved_items", [])
        if isinstance(item, dict)
        and item.get("state") == "OPEN"
        and item.get("delivery_blocking") is True
    ] if isinstance(report.get("unresolved_items"), list) else []

    states = [status for _, status in required_states]
    if "REJECT" in states or blocking:
        aggregate = "REJECT"
    elif "INCONCLUSIVE" in states:
        aggregate = "INCONCLUSIVE"
    elif states and all(status == "PASS" for status in states):
        aggregate = "PASS"
    else:
        aggregate = None
        _add(
            issues,
            "invalid_required_status",
            "overall_status",
            "Required gates and acceptance checks must use PASS, REJECT, or "
            "INCONCLUSIVE.",
        )

    overall = report.get("overall_status")
    if overall == "PASS":
        for index, check in enumerate(_checks(report)):
            if (
                check.get("required") is True
                and (
                    check.get("status") != "PASS"
                    or check.get("met") is not True
                )
            ):
                _add(
                    issues,
                    "required_acceptance_not_pass",
                    "acceptance_checks[{}]".format(index),
                    "overall_status PASS requires every required acceptance "
                    "check to be PASS and met.",
                )
    if aggregate is not None and overall != aggregate:
        _add(
            issues,
            "overall_status_mismatch",
            "overall_status",
            "overall_status {!r} does not match required-gate aggregate {!r}.".format(
                overall, aggregate
            ),
        )
    if overall == "INCONCLUSIVE" and not missing_capabilities:
        _add(
            issues,
            "missing_capability_not_stated",
            "overall_status",
            "INCONCLUSIVE requires a required gate reason or acceptance limitation "
            "that states the missing capability or evidence.",
        )

    return aggregate, sorted(set(missing_capabilities))


def _validate_proposal(
    report: dict[str, Any], issues: list[dict[str, str]]
) -> None:
    artifacts = _artifacts(report)
    primary = [
        item
        for item in artifacts
        if item.get("artifact_id") == report.get("primary_artifact_id")
        and item.get("role") == "primary"
    ]
    if len(primary) != 1 or not _format_is(primary[0], "pptx"):
        _add(
            issues,
            "proposal_primary_pptx_required",
            "primary_artifact_id",
            "proposal primary artifact must be PPTX.",
        )
    if not any(item.get("role") == "source_ledger" for item in artifacts):
        _add(
            issues,
            "proposal_source_ledger_missing",
            "artifacts",
            "proposal requires a source_ledger artifact.",
        )
    render = report.get("render")
    inventory = render.get("inventory") if isinstance(render, dict) else None
    if not isinstance(inventory, list) or not inventory or any(
        not isinstance(item, dict)
        or item.get("kind") != "slide"
        or item.get("artifact_id") != report.get("primary_artifact_id")
        for item in inventory
    ):
        _add(
            issues,
            "proposal_slide_inventory_required",
            "render.inventory",
            "proposal render inventory must contain one primary-artifact slide "
            "item per slide.",
        )
    for category in (
        "source",
        "cross_artifact",
        "customer_evidence",
        "security_evidence",
        "economic_evidence",
    ):
        _require_profile_category(report, category, "proposal", issues)


def _validate_rfp(
    report: dict[str, Any], issues: list[dict[str, str]]
) -> None:
    artifacts = _artifacts(report)
    primary = [
        item
        for item in artifacts
        if item.get("artifact_id") == report.get("primary_artifact_id")
        and item.get("role") == "primary"
    ]
    if len(primary) != 1 or not _format_is(primary[0], "docx"):
        _add(
            issues,
            "rfp_primary_docx_required",
            "primary_artifact_id",
            "rfp primary artifact must be a distinct DOCX clean-copy record.",
        )

    role_artifacts = {
        role: [item for item in artifacts if item.get("role") == role]
        for role in ("source_ledger", "baseline", "redline")
    }
    for role, matches in role_artifacts.items():
        if not matches:
            _add(
                issues,
                "rfp_{}_missing".format(role),
                "artifacts",
                "rfp requires at least one {} artifact.".format(role),
            )
        for item in matches:
            if not _valid_hash(item):
                _add(
                    issues,
                    "rfp_artifact_hash_invalid",
                    "artifacts[{}].sha256".format(item.get("artifact_id", "?")),
                    "rfp {} artifacts require a SHA-256 hash.".format(role),
                )

    matrix = [
        item
        for item in role_artifacts["source_ledger"]
        if _format_is(item, "xlsx")
    ]
    if not matrix:
        _add(
            issues,
            "rfp_xlsx_matrix_missing",
            "artifacts",
            "rfp requires a source_ledger artifact in XLSX format.",
        )
    for item in matrix:
        if not _valid_hash(item):
            _add(
                issues,
                "rfp_matrix_hash_invalid",
                "artifacts[{}].sha256".format(item.get("artifact_id", "?")),
                "The RFP XLSX matrix requires a SHA-256 hash.",
            )

    render = report.get("render")
    inventory = render.get("inventory") if isinstance(render, dict) else None
    inventory_items = (
        [item for item in inventory if isinstance(item, dict)]
        if isinstance(inventory, list)
        else []
    )
    primary_id = report.get("primary_artifact_id")
    matrix_ids = {
        item.get("artifact_id")
        for item in matrix
        if isinstance(item.get("artifact_id"), str)
    }
    primary_pages = [
        item
        for item in inventory_items
        if item.get("kind") == "page" and item.get("artifact_id") == primary_id
    ]
    matrix_units = [
        item
        for item in inventory_items
        if item.get("kind") in {"sheet", "print_page"}
        and item.get("artifact_id") in matrix_ids
    ]
    invalid_inventory_items = [
        item
        for item in inventory_items
        if not (
            (
                item.get("kind") == "page"
                and item.get("artifact_id") == primary_id
            )
            or (
                item.get("kind") in {"sheet", "print_page"}
                and item.get("artifact_id") in matrix_ids
            )
        )
    ]
    if (
        not primary_pages
        or not matrix_units
        or invalid_inventory_items
        or len(inventory_items) != len(inventory or [])
    ):
        _add(
            issues,
            "rfp_package_render_inventory_required",
            "render.inventory",
            "rfp render inventory must cover primary DOCX pages and source-ledger "
            "XLSX sheets or print pages, with no units from other artifacts.",
        )

    baseline_by_id = {
        item.get("artifact_id"): item for item in role_artifacts["baseline"]
    }
    baseline_ids = set(baseline_by_id)
    for item in role_artifacts["baseline"]:
        author = item.get("author")
        if not isinstance(author, dict) or not any(
            isinstance(value, str) and value.strip() for value in author.values()
        ):
            _add(
                issues,
                "rfp_baseline_author_missing",
                "artifacts[{}].author".format(item.get("artifact_id", "?")),
                "Every RFP baseline artifact must record an author.",
            )
    for item in role_artifacts["redline"]:
        item_id = item.get("artifact_id", "?")
        if not _format_is(item, "docx"):
            _add(
                issues,
                "rfp_redline_docx_required",
                "artifacts[{}]".format(item_id),
                "Every RFP redline artifact must declare DOCX and use a .docx path.",
            )
        baseline_id = item.get("source_artifact_id")
        if baseline_id not in baseline_ids:
            _add(
                issues,
                "rfp_redline_baseline_mismatch",
                "artifacts[{}].source_artifact_id".format(
                    item_id
                ),
                "Every RFP redline source_artifact_id must identify a baseline.",
            )
            continue

        comparison_targets: list[tuple[str, dict[str, Any]]] = [
            ("baseline", baseline_by_id[baseline_id])
        ]
        if len(primary) == 1:
            comparison_targets.append(("primary", primary[0]))
        redline_path = _normalized_artifact_path(item)
        redline_hash = str(item.get("sha256", "")).casefold()
        for target_role, target in comparison_targets:
            if redline_path == _normalized_artifact_path(target):
                _add(
                    issues,
                    "rfp_redline_path_not_distinct",
                    "artifacts[{}].path".format(item_id),
                    "RFP redline normalized path must differ from its {} "
                    "artifact path.".format(target_role),
                )
            if redline_hash == str(target.get("sha256", "")).casefold():
                _add(
                    issues,
                    "rfp_redline_hash_not_distinct",
                    "artifacts[{}].sha256".format(item_id),
                    "RFP redline recorded SHA-256 must differ from its {} "
                    "artifact SHA-256.".format(target_role),
                )

    for category in ("source", "cross_artifact", "baseline"):
        _require_profile_category(report, category, "rfp", issues)

    live_checks = report.get("live_source_checks")
    if not isinstance(live_checks, list) or not live_checks:
        _add(
            issues,
            "rfp_live_source_checks_missing",
            "live_source_checks",
            "rfp requires at least one live source check.",
        )
    else:
        for index, check in enumerate(live_checks):
            if not isinstance(check, dict) or check.get("content_status") != "verified":
                _add(
                    issues,
                    "rfp_live_source_unverified",
                    "live_source_checks[{}]".format(index),
                    "Every RFP live source check must be verified.",
                )

    unresolved = report.get("unresolved_items")
    if isinstance(unresolved, list) and any(
        isinstance(item, dict)
        and item.get("state") == "OPEN"
        and item.get("delivery_blocking") is True
        for item in unresolved
    ):
        _add(
            issues,
            "rfp_unresolved_blocker",
            "unresolved_items",
            "rfp cannot contain an open delivery-blocking unresolved item.",
        )


def _validate_financial_model(
    report: dict[str, Any], issues: list[dict[str, str]]
) -> None:
    artifacts = _artifacts(report)
    primary = [
        item
        for item in artifacts
        if item.get("artifact_id") == report.get("primary_artifact_id")
        and item.get("role") == "primary"
    ]
    if len(primary) != 1 or not _format_is(primary[0], "xlsx"):
        _add(
            issues,
            "financial_model_primary_xlsx_required",
            "primary_artifact_id",
            "financial-model primary artifact must be XLSX.",
        )
    for role in ("source", "source_ledger"):
        if not any(item.get("role") == role for item in artifacts):
            _add(
                issues,
                "financial_model_{}_missing".format(role),
                "artifacts",
                "financial-model requires a {} artifact.".format(role),
            )
    for category in ("source", "cross_artifact", "calculation"):
        _require_profile_category(report, category, "financial-model", issues)
        for check in _category_checks(report, category):
            if not isinstance(check.get("tolerance"), str) or not check[
                "tolerance"
            ].strip():
                _add(
                    issues,
                    "financial_model_tolerance_missing",
                    "acceptance_checks[{}].tolerance".format(
                        check.get("check_id", "?")
                    ),
                    "{} acceptance requires an explicit tolerance.".format(category),
                )
            if category != "calculation":
                continue
            check_id = check.get("check_id", "?")
            location = "acceptance_checks[{}]".format(check_id)
            numeric_fields = (
                "expected",
                "observed",
                "actual",
                "difference",
                "absolute_tolerance",
                "relative_tolerance",
                "effective_tolerance",
            )
            if any(not _number(check.get(field)) for field in numeric_fields):
                _add(
                    issues,
                    "financial_model_numeric_evidence_missing",
                    location,
                    "calculation acceptance requires numeric expected, observed, "
                    "actual, difference, absolute_tolerance, relative_tolerance, "
                    "and effective_tolerance.",
                )
                continue
            expected = float(check["expected"])
            observed = float(check["observed"])
            actual = float(check["actual"])
            difference = float(check["difference"])
            absolute_tolerance = float(check["absolute_tolerance"])
            relative_tolerance = float(check["relative_tolerance"])
            effective_tolerance = float(check["effective_tolerance"])
            calculated_difference = actual - expected
            calculated_tolerance = max(
                absolute_tolerance,
                relative_tolerance * max(abs(expected), abs(actual), 1.0),
            )
            if not math.isclose(observed, actual, rel_tol=1e-12, abs_tol=1e-12):
                _add(
                    issues,
                    "financial_model_observed_actual_mismatch",
                    "{}.observed".format(location),
                    "observed and actual must identify the same measured value.",
                )
            if not math.isclose(
                difference,
                calculated_difference,
                rel_tol=1e-12,
                abs_tol=1e-12,
            ):
                _add(
                    issues,
                    "financial_model_difference_mismatch",
                    "{}.difference".format(location),
                    "difference must equal actual minus expected.",
                )
            if not math.isclose(
                effective_tolerance,
                calculated_tolerance,
                rel_tol=1e-12,
                abs_tol=1e-12,
            ):
                _add(
                    issues,
                    "financial_model_effective_tolerance_mismatch",
                    "{}.effective_tolerance".format(location),
                    "effective_tolerance must equal max(absolute_tolerance, "
                    "relative_tolerance * max(abs(expected), abs(actual), 1)).",
                )
            if abs(calculated_difference) > calculated_tolerance:
                _add(
                    issues,
                    "financial_model_tolerance_exceeded",
                    location,
                    "A PASS calculation acceptance exceeds its effective "
                    "tolerance.",
                )
            if not isinstance(check.get("owner"), str) or not check["owner"].strip():
                _add(
                    issues,
                    "financial_model_owner_missing",
                    "{}.owner".format(location),
                    "calculation acceptance requires a named owner.",
                )
            if not isinstance(check.get("difference_classification"), str):
                _add(
                    issues,
                    "financial_model_difference_classification_missing",
                    "{}.difference_classification".format(location),
                    "calculation acceptance requires a difference classification.",
                )
    for name in GATE_NAMES:
        gate = report.get(name)
        if not isinstance(gate, dict) or gate.get("required") is not True:
            _add(
                issues,
                "financial_model_required_gate",
                "{}.required".format(name),
                "financial-model requires {} in status aggregation.".format(name),
            )
    render = report.get("render")
    inventory = render.get("inventory") if isinstance(render, dict) else None
    inventory_kinds = {
        item.get("kind")
        for item in inventory
        if isinstance(item, dict)
    } if isinstance(inventory, list) else set()
    if (
        not isinstance(inventory, list)
        or not inventory
        or len(inventory_kinds) != 1
        or any(
            not isinstance(item, dict)
            or item.get("kind") not in {"sheet", "print_page"}
            or item.get("artifact_id") != report.get("primary_artifact_id")
            for item in inventory
        )
    ):
        _add(
            issues,
            "financial_model_sheet_inventory_required",
            "render.inventory",
            "financial-model render inventory must use one physical-unit kind and "
            "contain only primary-workbook sheets or print pages.",
        )


def validate_report(
    report: Any,
    profile: str,
    expected_count: int | None = None,
    schema_path: str | Path | None = None,
) -> tuple[int, dict[str, Any]]:
    schema_status, schema_issues, schema_capabilities, resolved_schema_path = (
        _schema_validation(report, schema_path)
    )
    if schema_status != "PASS":
        exit_code = INCONCLUSIVE if schema_status == "INCONCLUSIVE" else REJECT
        report_object = report if isinstance(report, dict) else {}
        payload: dict[str, Any] = {
            "aggregate_status": None,
            "exit_code": exit_code,
            "issues": schema_issues,
            "jsonschema_version": JSONSCHEMA_VERSION,
            "limitations": list(LIMITATIONS),
            "missing_capabilities": schema_capabilities,
            "profile": profile,
            "report_status": report_object.get("overall_status"),
            "schema_path": resolved_schema_path,
            "schema_validation": schema_status,
            "semantic_validation": "not_run",
            "semantic_validator_version": 3,
            "status": schema_status,
            "summary": {
                "artifacts": len(_artifacts(report_object)),
                "issues": len(schema_issues),
                "required_acceptance_checks": sum(
                    item.get("required") is True
                    for item in _checks(report_object)
                ),
            },
            "tool": "validate_evidence_report",
        }
        return exit_code, payload

    issues: list[dict[str, str]] = []
    missing_capabilities: list[str] = []
    aggregate: str | None = None

    if not isinstance(report, dict):
        _add(
            issues,
            "report_not_object",
            "$",
            "Evidence report root must be a JSON object.",
        )
        report = {}
    else:
        aggregate, missing_capabilities = _validate_common(
            report, profile, expected_count, issues
        )
        if profile == "proposal":
            _validate_proposal(report, issues)
        elif profile == "rfp":
            _validate_rfp(report, issues)
        elif profile == "financial-model":
            _validate_financial_model(report, issues)

    final_issues = _sorted_issues(issues)
    report_status = report.get("overall_status")
    if final_issues:
        status = "REJECT"
        exit_code = REJECT
    elif report_status in STATUS_EXIT:
        status = report_status
        exit_code = STATUS_EXIT[report_status]
    else:
        status = "REJECT"
        exit_code = REJECT
        final_issues = [
            _issue(
                "overall_status_invalid",
                "overall_status",
                "overall_status must be PASS, REJECT, or INCONCLUSIVE.",
            )
        ]

    payload: dict[str, Any] = {
        "aggregate_status": aggregate,
        "exit_code": exit_code,
        "issues": final_issues,
        "jsonschema_version": JSONSCHEMA_VERSION,
        "limitations": list(LIMITATIONS),
        "missing_capabilities": missing_capabilities,
        "profile": profile,
        "report_status": report_status,
        "schema_path": resolved_schema_path,
        "schema_validation": "PASS",
        "semantic_validation": "REJECT" if final_issues else "PASS",
        "semantic_validator_version": 3,
        "status": status,
        "summary": {
            "artifacts": len(_artifacts(report)),
            "issues": len(final_issues),
            "required_acceptance_checks": sum(
                item.get("required") is True for item in _checks(report)
            ),
        },
        "tool": "validate_evidence_report",
    }
    return exit_code, payload


def _artifact(
    artifact_id: str,
    role: str,
    path: str,
    file_format: str,
    **extra: Any,
) -> dict[str, Any]:
    artifact = {
        "artifact_id": artifact_id,
        "format": file_format,
        "path": path,
        "role": role,
        "sha256": "0" * 64,
        "size_bytes": 1,
    }
    artifact.update(extra)
    return artifact


def _evidence() -> list[dict[str, str]]:
    return [{"artifact_id": "evidence", "description": "fixture evidence"}]


def _acceptance(category: str, check_id: str) -> dict[str, Any]:
    acceptance = {
        "category": category,
        "check_id": check_id,
        "evidence": _evidence(),
        "expected": 1 if category == "exact_target" else "verified",
        "limitations": [],
        "met": True,
        "method": "fixture",
        "observed": 1 if category == "exact_target" else "verified",
        "required": True,
        "status": "PASS",
        "tolerance": "exact",
    }
    if category == "exact_target":
        acceptance.update(
            {
                "inventory_item_ids": ["render-1"],
                "target_artifact_id": "primary",
                "target_kind": "page",
            }
        )
    if category == "calculation":
        acceptance.update(
            {
                "absolute_tolerance": 0.0,
                "actual": 100.0,
                "difference": 0.0,
                "difference_classification": "within_tolerance",
                "effective_tolerance": 0.0,
                "expected": 100.0,
                "observed": 100.0,
                "owner": "finance owner",
                "relative_tolerance": 0.0,
            }
        )
    return acceptance


def _gate(name: str) -> dict[str, Any]:
    common = {
        "completed": True,
        "evidence": _evidence(),
        "findings": [],
        "required": True,
        "status": "PASS",
    }
    if name == "reopen":
        common.update(
            {
                "application": "Office",
                "application_version": "fixture",
                "checked_at": "2026-01-01T00:00:00Z",
                "method": "fixture",
                "opened_artifact_id": "primary",
                "opened_path": "deliverable.docx",
                "readback": {"fixture_count": 1},
            }
        )
    elif name == "scan":
        common.update(
            {
                "command": "fixture",
                "exit_code": 0,
                "finished_at": "2026-01-01T00:00:00Z",
                "issue_count": 0,
                "scope": ["all"],
                "started_at": "2026-01-01T00:00:00Z",
                "tool": "fixture",
            }
        )
    elif name == "render":
        common.update(
            {
                "actual_count": 1,
                "count_match": True,
                "expected_count": 1,
                "finished_at": "2026-01-01T00:00:00Z",
                "inventory": [
                    {
                        "artifact_id": "primary",
                        "findings": [],
                        "inspected": True,
                        "inspected_at": "2026-01-01T00:00:00Z",
                        "inspector": "self-test",
                        "inspection_status": "PASS",
                        "item_id": "render-1",
                        "kind": "page",
                        "ordinal": 1,
                        "render_path": "render-1.png",
                        "render_sha256": "1" * 64,
                        "source_location": "1",
                    }
                ],
                "inventory_complete": True,
                "renderer": "fixture",
                "renderer_version": "1",
                "started_at": "2026-01-01T00:00:00Z",
            }
        )
    elif name == "runtime":
        common.update(
            {
                "applicable": True,
                "application": "Office",
                "application_version": "fixture",
                "checked_at": "2026-01-01T00:00:00Z",
                "tests": [
                    {
                        "evidence": _evidence(),
                        "expected": "works",
                        "feature": "fixture",
                        "limitations": [],
                        "method": "fixture",
                        "observed": "works",
                        "status": "PASS",
                        "test_id": "runtime-1",
                        "tolerance": "exact",
                    }
                ],
            }
        )
    else:
        common.update(
            {
                "checked_at": "2026-01-01T00:00:00Z",
                "checker": "fixture",
                "checker_version": "1",
                "checks": [
                    {
                        "category": "fixture",
                        "check_id": "accessibility-1",
                        "method": "fixture",
                        "result": "pass",
                        "scope": "all",
                        "status": "PASS",
                    }
                ],
            }
        )
    return common


def _base_fixture(primary_format: str = "docx") -> dict[str, Any]:
    extension = "." + primary_format
    report: dict[str, Any] = {
        "acceptance_checks": [_acceptance("exact_target", "exact")],
        "accessibility": _gate("accessibility"),
        "artifacts": [
            _artifact("primary", "primary", "deliverable" + extension, primary_format),
            _artifact("evidence", "evidence", "evidence.json", "json"),
        ],
        "created_at": "2026-01-01T00:00:00Z",
        "environment": {
            "locale": "en-US",
            "operating_system": "fixture",
            "time_zone": "UTC",
        },
        "overall_status": "PASS",
        "profile": "generic",
        "primary_artifact_id": "primary",
        "render": _gate("render"),
        "reopen": _gate("reopen"),
        "report_id": "self-test",
        "runtime": _gate("runtime"),
        "scan": _gate("scan"),
        "schema_version": "1.0.0",
        "status_reason": "All required checks passed.",
        "unresolved_items": [],
        "verifier": {"name": "self-test", "role": "validator"},
    }
    report["reopen"]["opened_path"] = "deliverable" + extension
    return report


def _profile_fixture(profile: str) -> dict[str, Any]:
    if profile == "financial-model":
        report = _base_fixture("xlsx")
        report["profile"] = profile
        report["render"]["inventory"][0]["kind"] = "sheet"
        report["acceptance_checks"][0]["target_kind"] = "sheet"
        report["artifacts"].extend(
            [
                _artifact("source", "source", "source.xlsx", "xlsx"),
                _artifact("ledger", "source_ledger", "source-ledger.xlsx", "xlsx"),
            ]
        )
        report["acceptance_checks"].extend(
            [
                _acceptance("source", "source"),
                _acceptance("cross_artifact", "cross-artifact"),
                _acceptance("calculation", "calculation"),
            ]
        )
        return report

    report = _base_fixture("pptx" if profile == "proposal" else "docx")
    report["profile"] = profile
    if profile == "proposal":
        report["render"]["inventory"][0]["kind"] = "slide"
        report["acceptance_checks"][0]["target_kind"] = "slide"
        report["artifacts"].append(
            _artifact("ledger", "source_ledger", "source-ledger.xlsx", "xlsx")
        )
        for category in (
            "source",
            "cross_artifact",
            "customer_evidence",
            "security_evidence",
            "economic_evidence",
        ):
            report["acceptance_checks"].append(_acceptance(category, category))
    elif profile == "rfp":
        report["artifacts"].extend(
            [
                _artifact("ledger", "source_ledger", "compliance-matrix.xlsx", "xlsx"),
                _artifact(
                    "baseline",
                    "baseline",
                    "baseline.docx",
                    "docx",
                    author={"organization": "Fixture authority"},
                    sha256="a" * 64,
                ),
                _artifact(
                    "redline",
                    "redline",
                    "redline.docx",
                    "docx",
                    sha256="b" * 64,
                    source_artifact_id="baseline",
                ),
            ]
        )
        for category in ("source", "cross_artifact", "baseline"):
            report["acceptance_checks"].append(_acceptance(category, category))
        report["render"]["inventory"].append(
            {
                "artifact_id": "ledger",
                "findings": [],
                "inspected": True,
                "inspected_at": "2026-01-01T00:00:00Z",
                "inspector": "self-test",
                "inspection_status": "PASS",
                "item_id": "render-2",
                "kind": "sheet",
                "ordinal": 1,
                "render_path": "matrix-sheet-1.png",
                "render_sha256": "2" * 64,
                "source_location": "compliance-matrix.xlsx!Requirements",
            }
        )
        report["render"]["expected_count"] = 2
        report["render"]["actual_count"] = 2
        report["live_source_checks"] = [
            {
                "check_id": "live-1",
                "claim_id": "claim-1",
                "content_status": "verified",
                "exact_location": "section 1",
                "excerpt": "fixture",
                "issuing_authority": "Fixture authority",
                "official_url": "https://example.invalid/official",
                "retrieved_at": "2026-01-01T00:00:00Z",
                "reviewer": "self-test",
            }
        ]
    return report


def _self_test(
    schema_path: str | Path | None = None,
) -> tuple[int, dict[str, Any]]:
    results: list[dict[str, Any]] = []
    capability_failures: list[str] = []

    def run(
        name: str,
        report: dict[str, Any],
        profile: str,
        expected_exit: int,
        expect_issues: bool,
        expected_schema: str = "PASS",
        expected_count_value: int = 1,
    ) -> None:
        exit_code, payload = validate_report(
            report,
            profile,
            expected_count=expected_count_value,
            schema_path=schema_path,
        )
        has_issues = bool(payload["issues"])
        if payload["schema_validation"] == "INCONCLUSIVE":
            capability_failures.extend(payload["missing_capabilities"])
        results.append(
            {
                "actual_exit": exit_code,
                "actual_schema": payload["schema_validation"],
                "expected_exit": expected_exit,
                "expected_issues": expect_issues,
                "expected_schema": expected_schema,
                "has_issues": has_issues,
                "name": name,
                "passed": (
                    exit_code == expected_exit
                    and has_issues is expect_issues
                    and payload["schema_validation"] == expected_schema
                ),
                "status": payload["status"],
            }
        )

    for profile in PROFILES:
        run(
            "{}_positive".format(profile),
            _profile_fixture(profile),
            profile,
            PASS,
            False,
        )

    generic_negative = _profile_fixture("generic")
    generic_negative["artifacts"][1]["artifact_id"] = "primary"
    run("generic_negative", generic_negative, "generic", REJECT, True)

    schema_version_negative = _profile_fixture("generic")
    del schema_version_negative["schema_version"]
    run(
        "schema_version_missing",
        schema_version_negative,
        "generic",
        REJECT,
        True,
        "REJECT",
    )

    profile_mismatch = _profile_fixture("generic")
    profile_mismatch["profile"] = "proposal"
    run("profile_mismatch", profile_mismatch, "generic", REJECT, True)

    proposal_negative = _profile_fixture("proposal")
    proposal_negative["acceptance_checks"] = [
        item
        for item in proposal_negative["acceptance_checks"]
        if item["category"] != "economic_evidence"
    ]
    run("proposal_negative", proposal_negative, "proposal", REJECT, True)

    proposal_three_slides = _profile_fixture("proposal")
    proposal_render_template = proposal_three_slides["render"]["inventory"][0]
    for ordinal in range(2, 4):
        render_item = copy.deepcopy(proposal_render_template)
        render_item.update(
            {
                "item_id": "render-{}".format(ordinal),
                "ordinal": ordinal,
                "render_path": "render-{}.png".format(ordinal),
                "render_sha256": str(ordinal) * 64,
                "source_location": str(ordinal),
            }
        )
        proposal_three_slides["render"]["inventory"].append(render_item)
    proposal_three_slides["render"]["expected_count"] = 3
    proposal_three_slides["render"]["actual_count"] = 3
    proposal_three_slides["acceptance_checks"][0].update(
        {
            "expected": 3,
            "observed": 3,
            "inventory_item_ids": ["render-1", "render-2", "render-3"],
        }
    )
    run(
        "proposal_three_unique_slides",
        proposal_three_slides,
        "proposal",
        PASS,
        False,
        expected_count_value=3,
    )

    proposal_duplicate_units = _profile_fixture("proposal")
    duplicate_render_template = proposal_duplicate_units["render"]["inventory"][0]
    for ordinal in range(2, 13):
        render_item = copy.deepcopy(duplicate_render_template)
        render_item.update(
            {
                "item_id": "render-{}".format(ordinal),
                "render_path": "render-{}.png".format(ordinal),
                "render_sha256": format(ordinal, "x")[-1] * 64,
            }
        )
        proposal_duplicate_units["render"]["inventory"].append(render_item)
    proposal_duplicate_units["render"]["expected_count"] = 12
    proposal_duplicate_units["render"]["actual_count"] = 12
    proposal_duplicate_units["acceptance_checks"][0].update(
        {
            "expected": 12,
            "observed": 12,
            "inventory_item_ids": [
                "render-{}".format(ordinal) for ordinal in range(1, 13)
            ],
        }
    )
    run(
        "proposal_duplicate_physical_units",
        proposal_duplicate_units,
        "proposal",
        REJECT,
        True,
        expected_count_value=12,
    )

    rfp_negative = _profile_fixture("rfp")
    next(
        item for item in rfp_negative["artifacts"] if item["role"] == "redline"
    )["source_artifact_id"] = "primary"
    run("rfp_negative", rfp_negative, "rfp", REJECT, True)

    rfp_same_path = _profile_fixture("rfp")
    same_path_baseline = next(
        item for item in rfp_same_path["artifacts"] if item["role"] == "baseline"
    )
    same_path_redline = next(
        item for item in rfp_same_path["artifacts"] if item["role"] == "redline"
    )
    same_path_redline["path"] = same_path_baseline["path"]
    run("rfp_redline_same_path", rfp_same_path, "rfp", REJECT, True)

    rfp_same_hash = _profile_fixture("rfp")
    same_hash_baseline = next(
        item for item in rfp_same_hash["artifacts"] if item["role"] == "baseline"
    )
    same_hash_redline = next(
        item for item in rfp_same_hash["artifacts"] if item["role"] == "redline"
    )
    same_hash_redline["sha256"] = same_hash_baseline["sha256"]
    run("rfp_redline_same_hash", rfp_same_hash, "rfp", REJECT, True)

    rfp_pdf_redline = _profile_fixture("rfp")
    pdf_redline = next(
        item for item in rfp_pdf_redline["artifacts"] if item["role"] == "redline"
    )
    pdf_redline["format"] = "pdf"
    pdf_redline["path"] = "redline.pdf"
    run("rfp_pdf_redline", rfp_pdf_redline, "rfp", REJECT, True)

    expected_count_negative = _profile_fixture("rfp")
    expected_count_negative["acceptance_checks"][0]["observed"] = 2
    run(
        "expected_count_negative",
        expected_count_negative,
        "rfp",
        REJECT,
        True,
    )

    rfp_inflated_page_target = _profile_fixture("rfp")
    rfp_inflated_page_target["acceptance_checks"][0].update(
        {"expected": 25, "observed": 25}
    )
    run(
        "rfp_inflated_page_target",
        rfp_inflated_page_target,
        "rfp",
        REJECT,
        True,
        expected_count_value=25,
    )

    financial_negative = _profile_fixture("financial-model")
    next(
        item
        for item in financial_negative["acceptance_checks"]
        if item["category"] == "calculation"
    )["tolerance"] = " "
    run(
        "financial_model_negative",
        financial_negative,
        "financial-model",
        REJECT,
        True,
    )

    financial_math_negative = _profile_fixture("financial-model")
    next(
        item
        for item in financial_math_negative["acceptance_checks"]
        if item["category"] == "calculation"
    )["effective_tolerance"] = 1.0
    run(
        "financial_model_tolerance_math_negative",
        financial_math_negative,
        "financial-model",
        REJECT,
        True,
    )

    inconclusive = _profile_fixture("generic")
    inconclusive["overall_status"] = "INCONCLUSIVE"
    inconclusive["status_reason"] = "Office runtime capability is unavailable."
    inconclusive["runtime"].update(
        {
            "completed": False,
            "reason": "Office runtime capability is unavailable.",
            "status": "INCONCLUSIVE",
        }
    )
    run("inconclusive_exit", inconclusive, "generic", INCONCLUSIVE, False)

    rejected = _profile_fixture("generic")
    rejected["overall_status"] = "REJECT"
    rejected["status_reason"] = "The scan found a blocking defect."
    rejected["scan"].update({"exit_code": 1, "issue_count": 1, "status": "REJECT"})
    run("reject_exit", rejected, "generic", REJECT, False)

    failures = [item["name"] for item in results if not item["passed"]]
    missing_capabilities = sorted(set(capability_failures))
    if not failures:
        exit_code = PASS
        status = "PASS"
    elif missing_capabilities:
        exit_code = INCONCLUSIVE
        status = "INCONCLUSIVE"
    else:
        exit_code = REJECT
        status = "REJECT"
    payload = {
        "exit_code": exit_code,
        "failures": failures,
        "jsonschema_version": JSONSCHEMA_VERSION,
        "limitations": list(LIMITATIONS),
        "missing_capabilities": missing_capabilities,
        "schema_path": str(
            Path(schema_path).expanduser().resolve(strict=False)
            if schema_path is not None
            else DEFAULT_SCHEMA_PATH
        ),
        "schema_validation": "exercised_by_self_test",
        "self_test": results,
        "semantic_validator_version": 3,
        "status": status,
        "tool": "validate_evidence_report",
    }
    return exit_code, payload


class _JsonArgumentParser(argparse.ArgumentParser):
    def error(self, message: str) -> None:
        payload = {
            "exit_code": REJECT,
            "issues": [_issue("invalid_arguments", "command_line", message)],
            "jsonschema_version": JSONSCHEMA_VERSION,
            "limitations": list(LIMITATIONS),
            "schema_validation": "not_run",
            "semantic_validator_version": 3,
            "status": "REJECT",
            "tool": "validate_evidence_report",
        }
        print(json.dumps(payload, ensure_ascii=True, indent=2, sort_keys=True))
        raise SystemExit(REJECT)


def main() -> int:
    parser = _JsonArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("evidence_json", nargs="?", type=Path)
    parser.add_argument("--profile", choices=PROFILES)
    parser.add_argument(
        "--expected-count",
        type=int,
        help="require exact_target expected and observed to equal this count",
    )
    parser.add_argument(
        "--schema",
        type=Path,
        help=(
            "Draft 2020-12 evidence schema path; defaults to "
            "references/evidence-report.schema.json beside this script"
        ),
    )
    parser.add_argument(
        "--self-test",
        action="store_true",
        help="run deterministic in-memory positive and negative fixtures",
    )
    args = parser.parse_args()

    if args.self_test:
        if (
            args.evidence_json is not None
            or args.profile is not None
            or args.expected_count is not None
        ):
            parser.error("--self-test cannot be combined with report arguments")
        exit_code, payload = _self_test(args.schema)
        print(json.dumps(payload, ensure_ascii=True, indent=2, sort_keys=True))
        return exit_code

    if args.evidence_json is None:
        parser.error("provide an evidence JSON path")
    if args.profile is None:
        parser.error("--profile is required")
    if args.expected_count is not None and args.expected_count < 0:
        parser.error("--expected-count must be zero or greater")

    path = args.evidence_json.resolve(strict=False)
    try:
        with path.open("r", encoding="utf-8") as handle:
            report = json.load(handle)
    except FileNotFoundError:
        payload = {
            "exit_code": REJECT,
            "issues": [
                _issue("file_missing", "evidence_json", "Input file does not exist.")
            ],
            "jsonschema_version": JSONSCHEMA_VERSION,
            "limitations": list(LIMITATIONS),
            "path": str(path),
            "profile": args.profile,
            "schema_validation": "not_run",
            "semantic_validator_version": 3,
            "status": "REJECT",
            "tool": "validate_evidence_report",
        }
        print(json.dumps(payload, ensure_ascii=True, indent=2, sort_keys=True))
        return REJECT
    except (OSError, UnicodeError, json.JSONDecodeError) as exc:
        payload = {
            "exit_code": REJECT,
            "issues": [
                _issue(
                    "input_unreadable",
                    "evidence_json",
                    "{}: {}".format(type(exc).__name__, str(exc)),
                )
            ],
            "jsonschema_version": JSONSCHEMA_VERSION,
            "limitations": list(LIMITATIONS),
            "path": str(path),
            "profile": args.profile,
            "schema_validation": "not_run",
            "semantic_validator_version": 3,
            "status": "REJECT",
            "tool": "validate_evidence_report",
        }
        print(json.dumps(payload, ensure_ascii=True, indent=2, sort_keys=True))
        return REJECT

    exit_code, payload = validate_report(
        report,
        args.profile,
        expected_count=args.expected_count,
        schema_path=args.schema,
    )
    payload["path"] = str(path)
    print(json.dumps(payload, ensure_ascii=True, indent=2, sort_keys=True))
    return exit_code


if __name__ == "__main__":
    raise SystemExit(main())

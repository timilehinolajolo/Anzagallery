#!/usr/bin/env python3
"""Validate data/orgs.json before it is merged.

Checks:
- Every entry has all required fields.
- No duplicate IDs.
- `type` is one of the allowed values.
- At least one of `website` or `github` is present and non-empty.
"""

import json
import sys

REQUIRED     = {"id", "name", "type", "description"}
VALID_TYPES  = {"Project", "Product", "Education", "Design"}


def is_present(value):
    return bool(value and str(value).strip())


def main():
    path = "data/orgs.json"

    try:
        with open(path, encoding="utf-8") as f:
            orgs = json.load(f)
    except FileNotFoundError:
        print(f"ERROR: {path} not found")
        sys.exit(1)
    except json.JSONDecodeError as exc:
        print(f"ERROR: invalid JSON — {exc}")
        sys.exit(1)

    if not isinstance(orgs, list):
        print("ERROR: orgs.json must be a JSON array")
        sys.exit(1)

    errors   = []
    seen_ids = set()

    for index, org in enumerate(orgs):
        label = f"Entry {index} (id={org.get('id', '<missing>')})"

        missing = REQUIRED - set(org.keys())
        if missing:
            errors.append(f"{label}: missing required fields: {sorted(missing)}")

        org_id = org.get("id")
        if org_id in seen_ids:
            errors.append(f"{label}: duplicate id '{org_id}'")
        if org_id:
            seen_ids.add(org_id)

        org_type = org.get("type")
        if org_type not in VALID_TYPES:
            errors.append(
                f"{label}: 'type' must be one of {sorted(VALID_TYPES)}, got '{org_type}'"
            )

        if not is_present(org.get("website")) and not is_present(org.get("github")):
            errors.append(f"{label}: at least one of 'website' or 'github' must be present")

    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        print(f"\nValidation failed with {len(errors)} error(s).")
        sys.exit(1)

    print(f"OK: {len(orgs)} organization(s) validated successfully.")


if __name__ == "__main__":
    main()

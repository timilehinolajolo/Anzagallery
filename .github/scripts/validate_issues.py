#!/usr/bin/env python3
"""Validate data/issues.json before it is merged.

Checks:
- Every entry has all required fields.
- No duplicate IDs.
- `languages` is a non-empty list.
- `date_added` matches YYYY-MM-DD.
- `issue_number` is an integer.
"""

import json
import re
import sys

REQUIRED = {"id", "org", "repo", "title", "url", "languages", "issue_number", "date_added"}
DATE_RE  = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def main():
    path = "data/issues.json"

    try:
        with open(path, encoding="utf-8") as f:
            issues = json.load(f)
    except FileNotFoundError:
        print(f"ERROR: {path} not found")
        sys.exit(1)
    except json.JSONDecodeError as exc:
        print(f"ERROR: invalid JSON — {exc}")
        sys.exit(1)

    if not isinstance(issues, list):
        print("ERROR: issues.json must be a JSON array")
        sys.exit(1)

    errors = []
    seen_ids = set()

    for index, issue in enumerate(issues):
        label = f"Entry {index} (id={issue.get('id', '<missing>')})"

        missing = REQUIRED - set(issue.keys())
        if missing:
            errors.append(f"{label}: missing required fields: {sorted(missing)}")

        issue_id = issue.get("id")
        if issue_id in seen_ids:
            errors.append(f"{label}: duplicate id '{issue_id}'")
        if issue_id:
            seen_ids.add(issue_id)

        languages = issue.get("languages")
        if not isinstance(languages, list) or len(languages) == 0:
            errors.append(f"{label}: 'languages' must be a non-empty array")

        date = issue.get("date_added", "")
        if not DATE_RE.match(str(date)):
            errors.append(f"{label}: 'date_added' must be YYYY-MM-DD, got '{date}'")

        issue_number = issue.get("issue_number")
        if not isinstance(issue_number, int):
            errors.append(f"{label}: 'issue_number' must be an integer, got '{issue_number}'")

    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        print(f"\nValidation failed with {len(errors)} error(s).")
        sys.exit(1)

    print(f"OK: {len(issues)} issue(s) validated successfully.")


if __name__ == "__main__":
    main()

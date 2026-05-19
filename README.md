# SatsIssues

A static, community-maintained gallery of good first issues across Bitcoin open-source projects.
Browsable by org, filterable by language — powered entirely by a JSON file anyone can PR into.

**Live site:** [nkatha23.github.io/Issuesgallery](https://nkatha23.github.io/Issuesgallery)

---

## Contributing

The only file you need to edit is `data/issues.json`.

### Step-by-step

1. **Fork** this repository.
2. Open `data/issues.json`.
3. Add your entry using the template below (at the top of the array, so newest issues appear first).
4. Commit: `git commit -m "feat: add <org> issue #<number>"`
5. Open a pull request — CI will validate your entry automatically.
6. Once merged, the site updates within minutes.

### Entry template

```json
{
  "id": "org-name-12345",
  "org": "Org Display Name",
  "repo": "owner/repo",
  "logo": "https://avatars.githubusercontent.com/u/GITHUB_ORG_ID",
  "issue_number": 12345,
  "title": "Short description of the issue",
  "url": "https://github.com/owner/repo/issues/12345",
  "languages": ["Rust"],
  "tags": ["docs", "testing"],
  "date_added": "2025-05-19"
}
```

### Field reference

| Field          | Required | Notes                                      |
|----------------|----------|--------------------------------------------|
| `id`           | Yes      | `org-issue_number`, kebab-case, must be unique |
| `org`          | Yes      | Display name shown on the card             |
| `repo`         | Yes      | `owner/repo` format                        |
| `logo`         | No       | GitHub org avatar URL works well           |
| `issue_number` | Yes      | Integer, no quotes                         |
| `title`        | Yes      | Copy the issue title from GitHub           |
| `url`          | Yes      | Full link to the GitHub issue              |
| `languages`    | Yes      | Array, e.g. `["Rust", "Python"]`           |
| `tags`         | No       | Array, e.g. `["docs", "testing", "cli"]`   |
| `date_added`   | Yes      | `YYYY-MM-DD` format                        |

### Finding issues to add

Good sources:
- Search GitHub: `label:"good first issue" language:rust bitcoin`
- Browse [bitcoin.org](https://bitcoin.org/en/development) contributor resources
- Follow your favourite Bitcoin repo and watch for newly-labelled issues

---

## CI / Validation

Every pull request that touches `data/issues.json` runs two checks:

1. **JSON syntax** — `python -m json.tool` catches malformed JSON immediately.
2. **Schema validation** — `.github/scripts/validate_issues.py` verifies required fields, unique IDs, and correct types.

The deploy to GitHub Pages only runs on merge to `main`, after both checks pass.

---

## Running locally

No build step required. Open `index.html` directly in a browser, or serve it with any static file server:

```bash
# Python
python -m http.server 8000

# Node
npx serve .
```

---

## Project structure

```
.
├── index.html                        # Single-page app shell
├── styles.css                        # Indigo + white design system
├── js/
│   └── app.js                        # Filter, search, and render logic
├── data/
│   └── issues.json                   # The community-maintained data file
├── .github/
│   ├── scripts/
│   │   └── validate_issues.py        # CI validation script
│   └── workflows/
│       └── validate.yml              # GitHub Actions: validate + deploy
└── README.md
```

---

## Enabling GitHub Pages

1. Go to **Settings > Pages** in your fork.
2. Set **Source** to `GitHub Actions`.
3. The next push to `main` will deploy the site automatically.

---

## License

MIT

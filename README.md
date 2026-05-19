# Anzagallery

A static, community-maintained directory of Bitcoin open-source organizations.
Filterable by type — powered entirely by a JSON file anyone can PR into.

**Live site:** [nkatha23.github.io/Anzagallery](https://nkatha23.github.io/Anzagallery/)

Anzagallery is open source — contributions are welcome.

---

## Contributing

The only file you need to edit is `data/orgs.json`.

### Step-by-step

1. **Fork** this repository on [GitHub](https://github.com/nkatha23/Anzagallery).
2. Open `data/orgs.json`.
3. Add your entry using the template below (entries are displayed alphabetically by name).
4. Commit: `git commit -m "feat: add <org name>"`
5. Open a pull request — CI will validate your entry automatically.
6. Once merged, the site updates within minutes.

### Entry template

```json
{
  "id": "org-name",
  "name": "Org Display Name",
  "type": "Project",
  "description": "One or two sentences describing what this organization does.",
  "website": "https://example.org",
  "github": "https://github.com/org-name",
  "community": "https://discord.com/invite/..."
}
```

### Field reference

| Field         | Required | Notes                                                         |
|---------------|----------|---------------------------------------------------------------|
| `id`          | Yes      | Kebab-case, must be unique across all entries                 |
| `name`        | Yes      | Display name shown on the card                                |
| `type`        | Yes      | One of: `Project`, `Product`, `Education`, `Design`          |
| `description` | Yes      | One or two sentences                                          |
| `website`     | No*      | Full URL — at least one of `website` or `github` is required  |
| `github`      | No*      | Full GitHub org or repo URL                                   |
| `community`   | No       | Discord, Telegram, Slack, or forum link                       |

\* At least one of `website` or `github` must be present.

### Type guide

| Type        | When to use                                             |
|-------------|---------------------------------------------------------|
| `Project`   | Open protocols, libraries, node implementations         |
| `Product`   | Applications, wallets, payment processors, tools        |
| `Education` | Courses, games, learning resources, developer programs  |
| `Design`    | Design systems, UX research, visual resources           |

---

## CI / Validation

Every pull request that touches `data/orgs.json` runs two checks automatically:

1. **JSON syntax** — `python -m json.tool` catches malformed JSON immediately.
2. **Schema validation** — `.github/scripts/validate_orgs.py` verifies:
   - All required fields are present.
   - No duplicate IDs.
   - `type` is one of the four valid values.
   - At least one of `website` or `github` is present.

The deploy to GitHub Pages only runs on merge to `main`, after both checks pass.

---

## Running locally

No build step required. Serve the project root with any static file server:

```bash
# Python
python3 -m http.server 8000

# Node
npx serve .
```

Then open **http://localhost:8000** in your browser.

> Opening `index.html` directly as a `file://` URL will not work because the app
> uses `fetch` to load `data/orgs.json`, which browsers block on `file://`.

---

## Project structure

```
.
├── index.html                        # Single-page app shell
├── styles.css                        # Slate + white design system
├── js/
│   └── app.js                        # Filter, search, and render logic
├── data/
│   └── orgs.json                     # The community-maintained data file
├── .github/
│   ├── scripts/
│   │   └── validate_orgs.py          # CI validation script
│   └── workflows/
│       └── validate.yml              # GitHub Actions: validate + deploy
└── README.md
```

---

## License

MIT

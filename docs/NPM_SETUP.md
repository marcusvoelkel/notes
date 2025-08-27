# NPM Auto-Publishing Setup

## 1. NPM Token erstellen

1. Gehe zu https://www.npmjs.com/settings/marcusvoelkel/tokens
2. Klicke auf "Generate New Token" → "Classic Token"
3. **Token Type: "Automation"** (WICHTIG! Nicht "Publish" oder "Read-only")
4. Name: z.B. "github-actions-notes"
5. Kopiere den Token (beginnt mit npm_...)

## 2. GitHub Secret hinzufügen

### Schritt-für-Schritt:
1. Gehe zu deinem Repository: https://github.com/marcusvoelkel/notes
2. Klicke auf **"Settings"** (oben im Repo-Menü)
3. Links in der Sidebar: **"Secrets and variables"** → **"Actions"**
4. Klicke auf den grünen Button **"New repository secret"**
5. Fülle aus:
   - **Name:** `NPM_TOKEN` (genau so schreiben!)
   - **Secret:** [Dein npm_... Token von Schritt 1]
6. Klicke auf **"Add secret"**

Direktlink: https://github.com/marcusvoelkel/notes/settings/secrets/actions

## 3. Verwendung

### Automatisch bei Release:
Wenn du ein Release auf GitHub erstellst, wird automatisch zu NPM gepublished.

### Manuell via GitHub Actions:
1. Gehe zu https://github.com/marcusvoelkel/notes/actions
2. Wähle "NPM Publish" workflow
3. Klicke "Run workflow"
4. Wähle Version-Typ (patch/minor/major)
5. Klicke "Run workflow"

### Lokal (wie bisher):
```bash
npm version patch  # oder minor/major
npm publish
git push --tags
```

## Aktuelle Version
- NPM: v1.1.1
- Installieren: `npm install -g apple-notes-cli@latest`
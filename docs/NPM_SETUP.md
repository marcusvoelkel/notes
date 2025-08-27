# NPM Auto-Publishing Setup

## 1. NPM Token erstellen

1. Gehe zu https://www.npmjs.com/settings/marcusvoelkel/tokens
2. Klicke auf "Generate New Token" 
3. Wähle "Classic Token"
4. Wähle Type: "Automation"
5. Kopiere den Token

## 2. GitHub Secret hinzufügen

1. Gehe zu https://github.com/marcusvoelkel/notes/settings/secrets/actions
2. Klicke auf "New repository secret"
3. Name: `NPM_TOKEN`
4. Value: [Dein NPM Token]
5. Klicke auf "Add secret"

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
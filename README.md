# Apple Notes CLI

CLI tool for creating notes in Apple Notes.

## Requirements

- macOS
- Node.js ≥ 14.0.0

## Installation

### Via npm (recommended)
```bash
npm install -g apple-notes-cli@latest
```

### Via GitHub
```bash
# Clones the repository and automatically creates a "notes" folder
git clone https://github.com/marcusvoelkel/notes.git
cd notes
npm install
npm link
```

### Setup Integration (Opt-in)
During install, you'll be asked to confirm before modifying shell config files. Nothing is changed without your consent.

What it can configure (if approved):
- Shell aliases (`note`, `n`) in .zshrc/.bashrc
- Claude Code Slash Command (`/note`)
- Codex CLI Integration (if installed)

Manual setup:
```bash
# From a local clone
npm run setup

# Auto-approve during install (global)
NOTES_SETUP_CONFIRM=1 npm install -g apple-notes-cli@latest

# Or run the setup script directly (global install)
NOTES_SETUP_CONFIRM=1 node "$(npm root -g)/apple-notes-cli/scripts/setup-integrations.js"
```

### Update
```bash
# Check for updates
notes-cli --update

# Update via npm (when published)
npm update -g apple-notes-cli

# Update via git
cd ~/notes && git pull && npm install

# Disable networked update checks (optional)
NO_UPDATE_CHECK=true notes-cli --update
```

## Usage

### Shortcuts/Aliases
After installation, the following shortcuts are configured:
- `note` - Alias for `notes-cli`
- `n` - Short alias for `notes-cli`

```bash
# With alias
note "My note"
n "Quick note"

# Natural language in Claude, Code, Codex CLI etc.
"Summarize this chat in an Apple Note..."
"Create an Apple Note about..."
"Write an article about and save it in Apple Notes"

# Simple note
notes-cli "Title"
note "Title"
n "Title"

# Note with content
notes-cli "Title" "Note content"
note "Title" "Note content"
n "Title" "Note content"

# Multi-line with Markdown
notes-cli "Meeting" "## Agenda\n- Point 1\n- Point 2"

# Show version
notes-cli --version

# Check for updates
notes-cli --update

# Show help
notes-cli --help
```

## Markdown Support

- `# Heading` - Headings
- `**bold**` and `*italic*`
- `- List` - Bullet points
- `` `code` `` - Inline code

## Debug

```bash
DEBUG=true notes-cli "Test" "Debug content"
```

## License

MIT

---

## Deutsch / German

CLI-Tool zum Erstellen von Notizen in Apple Notes.

### Voraussetzungen

- macOS
- Node.js ≥ 14.0.0

### Installation

#### Via npm (empfohlen)
```bash
npm install -g apple-notes-cli@latest
```

#### Via GitHub
```bash
# Klont das Repository und erstellt automatisch einen "notes" Ordner
git clone https://github.com/marcusvoelkel/notes.git
cd notes
npm install
npm link
```

#### Setup-Integration (Opt-in)
Bei der Installation wirst du vor Änderungen an Shell-Startdateien gefragt. Ohne Bestätigung passiert nichts.

Optional konfigurierbar (nach Zustimmung):
- Shell-Aliases (`note`, `n`) in .zshrc/.bashrc
- Claude Code Slash Command (`/note`)
- Codex CLI Integration (falls installiert)

Manuell einrichten:
```bash
# Aus lokalem Klon
npm run setup

# Automatische Bestätigung während Installation (global)
NOTES_SETUP_CONFIRM=1 npm install -g apple-notes-cli@latest

# Setup-Script direkt ausführen (global installiert)
NOTES_SETUP_CONFIRM=1 node "$(npm root -g)/apple-notes-cli/scripts/setup-integrations.js"
```

#### Update
```bash
# Check for updates
notes-cli --update

# Update via npm (when published)
npm update -g apple-notes-cli

# Update via git
cd ~/notes && git pull && npm install

# Netzwerk-Update-Check deaktivieren (optional)
NO_UPDATE_CHECK=true notes-cli --update
```

### Verwendung

#### Shortcuts/Aliases
Nach der Installation wurden folgende Shortcuts eingerichtet:
- `note` - Alias für `notes-cli`
- `n` - Kurz-Alias für `notes-cli`

```bash
# Mit Alias
note "Meine Notiz"
n "Schnelle Notiz"

# Natürliche Sprache nutzen in Claude, Code, Codex CLI o.ä.
"Fasse mir den Chat in einer Apple-Note zusammen..."
"Erstelle eine Apple-Note zu..."
'Schreibe einen Artikel über und speichere ihn in Apple Notes"

# Simple note
notes-cli "Title"
note "Title"
n "Title"

# Note with content
notes-cli "Title" "Note content"
note "Title" "Note content"
n "Title" "Note content"

# Multi-line with Markdown
notes-cli "Meeting" "## Agenda\n- Point 1\n- Point 2"

# Show version
notes-cli --version

# Check for updates
notes-cli --update

# Show help
notes-cli --help
```

### Markdown-Support

- `# Heading` - Überschriften
- `**fett**` und `*kursiv*`
- `- Liste` - Bullet Points
- `` `code` `` - Inline Code

### Debug

```bash
DEBUG=true notes-cli "Test" "Debug-Inhalt"
```

### Lizenz

MIT

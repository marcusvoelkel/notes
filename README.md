# Apple Notes CLI

CLI-Tool zum Erstellen von Notizen in Apple Notes.

## Voraussetzungen

- macOS
- Node.js ≥ 14.0.0

## Installation

### Via npm (recommended - coming soon)
```bash
npm install -g apple-notes-cli
```

### Via GitHub
```bash
git clone https://github.com/marcusvoelkel/notes.git
cd notes
npm install
npm link
```

### Update
```bash
# Check for updates
notes-cli --update

# Update via npm (when published)
npm update -g apple-notes-cli

# Update via git
cd ~/notes && git pull && npm install
```

## Verwendung

```bash
# Natürliche Sprache nutzen in Claude, Code, Codex CLI o.ä.
"Fasse mir den Chat in einer Apple-Note zusammen..."
"Erstelle eine Apple-Note zu..."
'Schreibe einen Artikel über und speichere ihn in Apple Notes"

# Simple note
notes-cli "Title"

# Note with content
notes-cli "Title" "Note content"

# Multi-line with Markdown
notes-cli "Meeting" "## Agenda\n- Point 1\n- Point 2"

# Show version
notes-cli --version

# Check for updates
notes-cli --update

# Show help
notes-cli --help
```

## Markdown-Support

- `# Heading` - Überschriften
- `**fett**` und `*kursiv*`
- `- Liste` - Bullet Points
- `` `code` `` - Inline Code

## Debug

```bash
DEBUG=true notes-cli "Test" "Debug-Inhalt"
```

## Lizenz

MIT
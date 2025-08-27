# Apple Notes CLI

CLI-Tool zum Erstellen von Notizen in Apple Notes.

## Voraussetzungen

- macOS
- Node.js ≥ 14.0.0

## Installation

```bash
git clone https://github.com/marcusvoelkel/notes.git
cd notes
npm install
npm link
```

## Verwendung

```bash
# Natürliche Sprache nutzen in Claude, Code, Codex CLI o.ä.
notes-cli "Meeting" "## Agenda\n- Punkt 1\n- Punkt 2"

# Einfache Notiz
notes-cli "Titel"

# Notiz mit Inhalt
notes-cli "Titel" "Inhalt der Notiz"

# Mehrzeilig mit Markdown
notes-cli "Meeting" "## Agenda\n- Punkt 1\n- Punkt 2"
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
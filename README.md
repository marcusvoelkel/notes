# Apple Notes CLI - Quick Note Creator

Ein schlankes und schnelles CLI-Tool zum Erstellen von Notizen in Apple Notes. Perfekt für schnelle Gedanken, Todos oder Meeting-Notizen direkt vom Terminal.

## ✨ Features

- **⚡ Blitzschnell** - Erstelle Notizen in Sekunden
- **📝 Markdown-Support** - Formatierte Notizen mit Markdown
- **🎨 HTML-Rendering** - Schöne Darstellung in Apple Notes
- **🚀 Zero-Config** - Funktioniert sofort ohne Setup

## 📋 Voraussetzungen

- macOS
- Node.js ≥ 14.0.0
- Terminal-Zugriff auf Apple Notes

## 🚀 Installation

### Via npm
```bash
npm install -g apple-notes-cli
```

### Manuell von GitHub
```bash
git clone https://github.com/marcusvoelkel/apple-notes-cli.git
cd apple-notes-cli
npm link
```

## 📖 Verwendung

### Claude Code, Codex CLI u.ä.
```bash
Natürliche Sprache nutzen:
"Erstelle eine Apple-Note zu..."
"Fasse diesen Chat in einer Apple-Note zusammen..."
```

### Einfachste Form
```bash
apple-notes "Meine Notiz"
```

### Mit Inhalt
```bash
apple-notes "Meeting Notes" "Diskussion über Q4 Ziele"
```

## Code
\`npm install\`"
```

### Mehrzeilige Notizen
```bash
apple-notes "Projekt Status" "## Frontend
Fertig zu 90%

## Backend
- API implementiert
- Tests ausstehend

---

```

## 🎯 Markdown-Unterstützung

| Syntax | Ausgabe |
|--------|---------|
| `# Heading` | Große Überschrift |
| `## Heading` | Mittlere Überschrift |
| `**fett**` | **Fetter Text** |
| `*kursiv*` | *Kursiver Text* |
| `` `code` `` | Inline Code |
| `- Item` | Bullet List |
| `1. Item` | Nummerierte Liste |
| `---` | Horizontale Linie |

## 🔧 Debug-Modus

```bash
DEBUG=true apple-notes "Test" "Debug-Inhalt"
```

## 💡 Tipps & Tricks

### Git Commits dokumentieren
```bash
apple-notes "Commits $(date +%Y-%m-%d)" "$(git log --oneline -5)"
```

### Clipboard als Notiz
```bash
apple-notes "Clipboard $(date +%H:%M)" "$(pbpaste)"
```

### Shell-Alias erstellen
```bash
# In ~/.zshrc oder ~/.bashrc
alias note='apple-notes'
alias todo='apple-notes "TODO $(date +%Y-%m-%d)"'

# Verwendung
note "Schnelle Idee"
todo "- Meeting vorbereiten"
```

## 🏗️ Architektur

```
apple-notes-cli/
├── notes-cli.js    # CLI Interface
├── notes-core.js   # Core mit AppleScript
└── package.json    # NPM Konfiguration
```

## Warum nur "Create"?

Bei Hunderten oder Tausenden von Notizen wird das Durchsuchen über AppleScript extrem langsam. Dieses Tool fokussiert sich daher auf das, was schnell und zuverlässig funktioniert: **Neue Notizen erstellen**.

Zum Lesen und Durchsuchen nutze einfach die Apple Notes App direkt - sie ist dafür optimiert.

## Lizenz

MIT License - siehe [LICENSE](LICENSE)

## Autor

**Marcus Völkel**  
GitHub: [@marcusvoelkel](https://github.com/marcusvoelkel)

---

*Nicht verbunden mit Apple Inc.*
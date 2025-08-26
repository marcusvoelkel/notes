# Apple Notes CLI für Claude Code

Dein User heißt "Marcus".

Ein CLI-Tool zur Integration von Apple Notes in Claude Code für automatisierte Notizen-Workflows.

## Installation

Das Script ist bereits als `notes-cli.js` verfügbar und ausführbar gemacht.

## Verwendung in Claude Code

### Basis-Befehle

Du kannst Claude Code einfach natürliche Anweisungen geben:

#### **"Schreibe eine Notiz: [Text]"**
```
Beispiel: "Schreibe eine Notiz mit dem Titel 'Meeting Notes' und dem Inhalt 'Diskussion über Q4 Ziele'"
→ Claude führt aus: ./notes-cli.js create "Meeting Notes" "Diskussion über Q4 Ziele"
```

#### **"Liste alle meine Notizen auf"**
```
Beispiel: "Zeige mir alle Notizen"
→ Claude führt aus: ./notes-cli.js list
```

#### **"Suche nach [Begriff]"**
```
Beispiel: "Suche in meinen Notizen nach 'Projekt'"
→ Claude führt aus: ./notes-cli.js search "Projekt"
```

#### **"Hole den Inhalt von [Notiz-Name]"**
```
Beispiel: "Was steht in meiner 'Todo List' Notiz?"
→ Claude führt aus: ./notes-cli.js get "Todo List"
```

### Erweiterte Anwendungsfälle

#### **Notizen zusammenfassen**
```
"Fasse mir die Notizen der letzten Woche zum Thema Marketing zusammen"

Claude wird:
1. ./notes-cli.js search "Marketing" ausführen
2. Die Ergebnisse analysieren
3. Eine Zusammenfassung erstellen
```

#### **Automatische Dokumentation**
```
"Dokumentiere die heutigen Code-Änderungen in einer Notiz"

Claude wird:
1. git log analysieren
2. Eine strukturierte Notiz erstellen mit:
   ./notes-cli.js create "Dev Log $(date)" "Änderungen: ..."
```

#### **Todo-Management**
```
"Erstelle eine Todo-Liste aus meinen offenen GitHub Issues"

Claude wird:
1. GitHub Issues abrufen (gh api)
2. Eine formatierte Notiz erstellen:
   ./notes-cli.js create "GitHub TODOs" "- [ ] Issue #1\n- [ ] Issue #2..."
```

#### **Meeting-Vorbereitung**
```
"Bereite mein Weekly Meeting vor basierend auf meinen Notizen"

Claude wird:
1. Relevante Notizen suchen
2. Wichtige Punkte extrahieren
3. Eine neue Meeting-Agenda erstellen
```

## Praktische Beispiel-Prompts für Claude Code

### Tägliche Arbeit
- "Schreibe eine Notiz über den aktuellen Projektstand"
- "Finde alle Notizen mit 'Bug' oder 'Error'"
- "Erstelle eine Notiz mit meinen heutigen Commits"
- "Update meine 'Ideen' Notiz mit: [neuer Text]"

### Wöchentliche Reviews
- "Sammle alle Meeting-Notizen dieser Woche"
- "Erstelle einen Wochenrückblick aus meinen Notizen"
- "Finde alle TODOs in meinen Notizen"

### Projekt-Dokumentation
- "Dokumentiere die neue Feature-Implementation in einer Notiz"
- "Erstelle Release Notes aus den letzten Commits"
- "Archiviere alle Notizen zum Projekt X"

## Tipps für Claude Code

1. **Natürliche Sprache verwenden**: Claude versteht Kontext und führt die richtigen Befehle aus
2. **Batch-Operations**: "Erstelle für jeden Branch eine Notiz mit dessen Status"
3. **Integration mit anderen Tools**: Claude kann Git, GitHub, npm etc. mit Notes kombinieren

## Limitierungen

- Funktioniert nur auf macOS mit Apple Notes
- Keine Unterstützung für Ordner/Tags
- Bei Sonderzeichen in Titeln/Texten auf Escaping achten
- AppleScript-Timeouts bei sehr vielen Notizen möglich

## Beispiel-Workflow

```bash
# Morgens
"Erstelle eine Notiz mit meinen Zielen für heute"

# Während der Arbeit  
"Dokumentiere diesen Bug-Fix in einer Notiz"
"Füge zur 'Sprint Notes' Notiz hinzu: Feature X abgeschlossen"

# Abends
"Fasse meinen Arbeitstag in einer Notiz zusammen"
"Aktualisiere meine Todo-Liste für morgen"
```

## Automatisierung

Claude kann auch regelmäßige Aufgaben übernehmen:
- Tägliche Standup-Notizen aus Git-Commits
- Wöchentliche Projekt-Summaries
- Automatische Dokumentation von Deployments
- Sammlung von Error-Logs in Notizen
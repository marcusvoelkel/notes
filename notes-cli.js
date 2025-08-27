#!/usr/bin/env node

/**
 * Apple Notes CLI - Simplified
 * Schnelles Erstellen von Notizen in Apple Notes
 */

const NotesCore = require('./notes-core');

// ANSI Colors
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

class NotesCLI {
  constructor() {
    this.core = new NotesCore({ 
      debug: process.env.DEBUG === 'true' 
    });
  }

  /**
   * Zeigt die Hilfe an
   */
  showHelp() {
    console.log(`
${colors.cyan}Apple Notes CLI - Quick Note Creator${colors.reset}

${colors.yellow}Verwendung:${colors.reset}
  notes-cli <title> [body]

${colors.yellow}Beispiele:${colors.reset}
  notes-cli "Meine Notiz"
  notes-cli "Meeting Notes" "Diskussion über Q4 Ziele"
  notes-cli "Todo" "- Aufgabe 1\\n- Aufgabe 2\\n- Aufgabe 3"

${colors.yellow}Markdown wird unterstützt:${colors.reset}
  # Überschriften
  **Fett** und *Kursiv*
  - Listen
  \`Code\`

${colors.gray}Umgebungsvariablen:${colors.reset}
  DEBUG=true    Aktiviert Debug-Ausgaben
`);
  }

  /**
   * Erstellt eine Notiz
   */
  async createNote(title, body = '') {
    try {
      if (!title) {
        console.error(`${colors.red}Fehler: Titel erforderlich${colors.reset}`);
        this.showHelp();
        process.exit(1);
      }
      
      const result = await this.core.create(title, body);
      console.log(`${colors.green}✓${colors.reset} ${result}`);
    } catch (error) {
      console.error(`${colors.red}Fehler: ${error.message}${colors.reset}`);
      if (process.env.DEBUG === 'true') {
        console.error(colors.gray, error.stack, colors.reset);
      }
      process.exit(1);
    }
  }
}

// Main
async function main() {
  const cli = new NotesCLI();
  const args = process.argv.slice(2);
  // Optionales Subcommand erlauben: `create`
  if (args[0] === 'create') args.shift();
  
  // Hilfe anzeigen
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h' || args[0] === 'help') {
    cli.showHelp();
    process.exit(0);
  }
  
  // Notiz erstellen
  const title = args[0];
  const body = args.slice(1).join(' ');
  
  await cli.createNote(title, body);
}

// Fehlerbehandlung
process.on('unhandledRejection', (error) => {
  console.error(`${colors.red}Unerwarteter Fehler: ${error.message}${colors.reset}`);
  if (process.env.DEBUG === 'true') {
    console.error(error);
  }
  process.exit(1);
});

// Starte die CLI
if (require.main === module) {
  main();
}

module.exports = NotesCLI;

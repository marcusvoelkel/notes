#!/usr/bin/env node

/**
 * Apple Notes CLI - Simplified
 * Schnelles Erstellen von Notizen in Apple Notes
 */

const NotesCore = require('./notes-core');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const packageJson = require('./package.json');

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
${colors.cyan}Apple Notes CLI${colors.reset} v${packageJson.version}

${colors.yellow}Usage:${colors.reset}
  notes-cli <title> [body]    Create a new note
  notes-cli --version          Show version
  notes-cli --update           Check for updates
  notes-cli --help             Show this help

${colors.yellow}Examples:${colors.reset}
  notes-cli "My Note"
  notes-cli "Meeting" "## Agenda\\n- Point 1\\n- Point 2"
  notes-cli "Todo" "- Task 1\\n- Task 2\\n- Task 3"

${colors.yellow}Markdown Support:${colors.reset}
  # Headings
  **bold** and *italic*
  - Lists
  \`code\`

${colors.gray}Environment:${colors.reset}
  DEBUG=true    Enable debug output
`);
  }

  /**
   * Show version
   */
  showVersion() {
    console.log(`${colors.cyan}apple-notes-cli${colors.reset} v${packageJson.version}`);
  }

  /**
   * Check for updates
   */
  async checkUpdate() {
    try {
      console.log(`${colors.cyan}Checking for updates...${colors.reset}`);
      
      // Get latest version from npm
      const latestVersion = execSync('npm view apple-notes-cli version', { encoding: 'utf8' }).trim();
      const currentVersion = packageJson.version;
      
      if (latestVersion === currentVersion) {
        console.log(`${colors.green}✓${colors.reset} You have the latest version (v${currentVersion})`);
      } else {
        console.log(`${colors.yellow}Update available:${colors.reset} v${currentVersion} → v${latestVersion}`);
        console.log(`\nTo update, run:\n  ${colors.cyan}npm install -g apple-notes-cli${colors.reset}`);
      }
    } catch (error) {
      // Try checking GitHub if npm fails
      try {
        console.log(`${colors.gray}Checking GitHub...${colors.reset}`);
        const gitLog = execSync('cd $(npm root -g)/apple-notes-cli && git fetch && git status -uno', { encoding: 'utf8' });
        
        if (gitLog.includes('Your branch is behind')) {
          console.log(`${colors.yellow}Update available on GitHub${colors.reset}`);
          console.log(`\nTo update, run:\n  ${colors.cyan}cd $(npm root -g)/apple-notes-cli && git pull${colors.reset}`);
        } else {
          console.log(`${colors.green}✓${colors.reset} You have the latest version`);
        }
      } catch (gitError) {
        console.log(`${colors.gray}Could not check for updates${colors.reset}`);
      }
    }
  }

  /**
   * Create a note
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
  
  // Handle commands
  const command = args[0];
  
  // Version
  if (command === '--version' || command === '-v') {
    cli.showVersion();
    process.exit(0);
  }
  
  // Update
  if (command === '--update' || command === '-u') {
    await cli.checkUpdate();
    process.exit(0);
  }
  
  // Help
  if (!command || command === '--help' || command === '-h' || command === 'help' || command === '/help') {
    cli.showHelp();
    process.exit(0);
  }
  
  // Optional 'create' or 'add' subcommand
  if (command === 'create' || command === 'add') {
    args.shift();
  }
  
  // Create note
  const title = args[0];
  const body = args.slice(1).join(' ');
  
  if (!title) {
    console.error(`${colors.red}Error: Title required${colors.reset}`);
    cli.showHelp();
    process.exit(1);
  }
  
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

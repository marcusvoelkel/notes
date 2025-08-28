#!/usr/bin/env node

/**
 * Post-Install Setup Script
 * Konfiguriert Aliases und Slash Commands für verschiedene CLIs
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const readline = require('readline');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

class SetupIntegrations {
  constructor() {
    this.homeDir = os.homedir();
    this.shellConfigFiles = [
      '.zshrc',
      '.bashrc', 
      '.bash_profile',
      '.profile'
    ];
  }

  /**
   * Setup Shell Aliases
   */
  setupShellAliases() {
    console.log(`\n${colors.cyan}Setting up shell aliases...${colors.reset}`);

    const header = "# Apple Notes CLI shortcuts";
    const aliasLines = [
      "alias note='notes-cli'",
      "alias n='notes-cli'",
    ];
    const aliasPatterns = [
      /^\s*alias\s+note\s*=\s*['"]notes-cli['"]/m,
      /^\s*alias\s+n\s*=\s*['"]notes-cli['"]/m,
    ];

    let setupCount = 0;

    for (const configFile of this.shellConfigFiles) {
      const configPath = path.join(this.homeDir, configFile);

      if (fs.existsSync(configPath)) {
        const content = fs.readFileSync(configPath, 'utf8');

        // Determine which aliases are missing
        const missing = aliasLines.filter((_, i) => !aliasPatterns[i].test(content));
        if (missing.length === 0) {
          console.log(`  ${colors.gray}✓ Aliases already configured in ${configFile}${colors.reset}`);
          continue;
        }

        // Build append content only for missing lines
        const aliasContent = `\n${header}\n${missing.join('\n')}\n`;

        try {
          // Create a tiny backup before modifying
          try {
            const backupPath = `${configPath}.bak.${Date.now()}`;
            fs.copyFileSync(configPath, backupPath);
          } catch (_e) {}
          fs.appendFileSync(configPath, aliasContent);
          console.log(`  ${colors.green}✓ Added ${missing.length} alias(es) to ${configFile}${colors.reset}`);
          setupCount++;
        } catch (error) {
          console.log(`  ${colors.yellow}⚠ Could not modify ${configFile}: ${error.message}${colors.reset}`);
        }
      }
    }

    if (setupCount > 0) {
      console.log(`\n  ${colors.green}Shell aliases configured! Restart your terminal or run 'source ~/.zshrc' (or ~/.bashrc)${colors.reset}`);
    }
  }

  /**
   * Setup Claude Code Slash Commands
   */
  setupClaudeCommands() {
    console.log(`\n${colors.cyan}Setting up Claude Code slash commands...${colors.reset}`);
    
    // Possible Claude config locations
    const claudeConfigPaths = [
      path.join(this.homeDir, '.claude', 'commands.json'),
      path.join(this.homeDir, '.config', 'claude', 'commands.json'),
      path.join(this.homeDir, 'Library', 'Application Support', 'Claude', 'commands.json')
    ];
    
    const noteCommand = {
      name: 'note',
      description: 'Create a new Apple Note',
      command: 'notes-cli',
      args: ['$1', '$2'],
      example: '/note "Meeting Notes" "## Agenda\\n- Item 1\\n- Item 2"'
    };
    
    let configured = false;
    
    for (const configPath of claudeConfigPaths) {
      const configDir = path.dirname(configPath);
      try {
        if (!fs.existsSync(configDir)) {
          fs.mkdirSync(configDir, { recursive: true });
          console.log(`  ${colors.gray}Created ${configDir}${colors.reset}`);
        }

        let commands = [];
        if (fs.existsSync(configPath)) {
          try {
            const content = fs.readFileSync(configPath, 'utf8');
            const parsed = JSON.parse(content);
            commands = Array.isArray(parsed) ? parsed : [];
          } catch (_) {
            commands = [];
          }
        }

        if (commands.find(cmd => cmd.name === 'note')) {
          console.log(`  ${colors.gray}✓ /note command already configured${colors.reset}`);
          configured = true;
          break;
        }

        commands.push(noteCommand);

        if (fs.existsSync(configPath)) {
          try {
            fs.copyFileSync(configPath, `${configPath}.bak.${Date.now()}`);
          } catch (_) {}
        }
        fs.writeFileSync(configPath, JSON.stringify(commands, null, 2));
        console.log(`  ${colors.green}✓ Added /note command to Claude at ${configPath}${colors.reset}`);
        configured = true;
        break;
      } catch (error) {
        console.log(`  ${colors.gray}Could not configure ${configPath}${colors.reset}`);
      }
    }
    
    if (!configured) {
      console.log(`  ${colors.yellow}ℹ Claude config not found. You can manually add the /note command later.${colors.reset}`);
    }
  }

  /**
   * Info about Codex CLI usage
   */
  showCodexInfo() {
    console.log(`\n${colors.cyan}Codex CLI Integration:${colors.reset}`);
    console.log(`  ${colors.gray}Codex CLI can use the shell aliases directly.${colors.reset}`);
    console.log(`  ${colors.gray}In Codex, you can say:${colors.reset}`);
    console.log(`    • "note 'Title' 'Content'" - uses the alias`);
    console.log(`    • "create a note about X" - natural language`);
    console.log(`    • "n 'Quick note'" - uses short alias`);
  }

  /**
   * Main setup
   */
  async run() {
    console.log(`${colors.cyan}🔧 Apple Notes CLI - Integration Setup${colors.reset}`);

    // Require explicit confirmation to proceed (safe postinstall behavior)
    const autoConfirm = (process.env.NOTES_SETUP_CONFIRM || '').toLowerCase();
    const isTTY = process.stdin.isTTY && process.stdout.isTTY;

    const proceed = async () => {
      // Setup shell aliases
      this.setupShellAliases();

      // Setup Claude commands
      this.setupClaudeCommands();

      // Show Codex info
      this.showCodexInfo();

      console.log(`\n${colors.green}✅ Setup complete!${colors.reset}`);
      console.log(`\n${colors.gray}You can now use:${colors.reset}`);
      console.log(`  • ${colors.cyan}note "Title" "Content"${colors.reset} - Shell alias (works in terminal & Codex CLI)`);
      console.log(`  • ${colors.cyan}n "Title"${colors.reset} - Short alias`);
      console.log(`  • ${colors.cyan}/note "Title" "Content"${colors.reset} - Claude Code slash command`);
    };

    if (autoConfirm === '1' || autoConfirm === 'true' || autoConfirm === 'yes') {
      await proceed();
      return;
    }

    if (!isTTY) {
      console.log(`${colors.yellow}ℹ Skipping setup: no TTY and no explicit confirmation (NOTES_SETUP_CONFIRM=1).${colors.reset}`);
      console.log(`${colors.gray}Run manually later:${colors.reset} npm run setup`);
      return;
    }

    // Interactive confirmation
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    await new Promise((resolve) => {
      rl.question(
        `${colors.yellow}This will modify your shell config (e.g. ~/.zshrc) and create a Claude commands file. Proceed? [y/N] ${colors.reset}`,
        async (answer) => {
          rl.close();
          const yes = (answer || '').trim().toLowerCase();
          if (yes === 'y' || yes === 'yes') {
            await proceed();
          } else {
            console.log(`${colors.gray}Setup skipped by user. You can run 'npm run setup' later.${colors.reset}`);
          }
          resolve();
        }
      );
    });
  }
}

// Run setup if called directly
if (require.main === module) {
  const setup = new SetupIntegrations();
  setup.run().catch(console.error);
}

module.exports = SetupIntegrations;

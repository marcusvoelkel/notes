#!/usr/bin/env node

/**
 * Post-Install Setup Script
 * Konfiguriert Aliases und Slash Commands für verschiedene CLIs
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

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
    
    const aliasContent = `
# Apple Notes CLI shortcuts
alias note='notes-cli'
alias n='notes-cli'
`;

    let setupCount = 0;
    
    for (const configFile of this.shellConfigFiles) {
      const configPath = path.join(this.homeDir, configFile);
      
      if (fs.existsSync(configPath)) {
        const content = fs.readFileSync(configPath, 'utf8');
        
        // Check if aliases already exist
        if (content.includes("alias note='notes-cli'")) {
          console.log(`  ${colors.gray}✓ Aliases already configured in ${configFile}${colors.reset}`);
          continue;
        }
        
        // Add aliases
        try {
          fs.appendFileSync(configPath, aliasContent);
          console.log(`  ${colors.green}✓ Added aliases to ${configFile}${colors.reset}`);
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
      
      if (fs.existsSync(configDir)) {
        try {
          let commands = [];
          
          // Read existing commands if file exists
          if (fs.existsSync(configPath)) {
            const content = fs.readFileSync(configPath, 'utf8');
            commands = JSON.parse(content);
            
            // Check if command already exists
            if (commands.find(cmd => cmd.name === 'note')) {
              console.log(`  ${colors.gray}✓ /note command already configured${colors.reset}`);
              configured = true;
              continue;
            }
          }
          
          // Add our command
          commands.push(noteCommand);
          
          // Write back
          fs.writeFileSync(configPath, JSON.stringify(commands, null, 2));
          console.log(`  ${colors.green}✓ Added /note command to Claude${colors.reset}`);
          configured = true;
          break;
        } catch (error) {
          console.log(`  ${colors.gray}Could not configure ${configPath}${colors.reset}`);
        }
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
  }
}

// Run setup if called directly
if (require.main === module) {
  const setup = new SetupIntegrations();
  setup.run().catch(console.error);
}

module.exports = SetupIntegrations;
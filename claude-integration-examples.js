#!/usr/bin/env node

/**
 * Erweiterte Integration-Beispiele für Claude Code
 * Diese Funktionen können von Claude genutzt werden für komplexere Aufgaben
 */

const NotesManager = require('./notes-cli.js');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

class ClaudeNotesIntegration extends NotesManager {
  
  /**
   * Erstellt eine Notiz mit allen Commits von heute
   */
  async createDailyCommitLog() {
    try {
      const { stdout } = await execAsync('git log --oneline --since="midnight" --until="now"');
      const date = new Date().toISOString().split('T')[0];
      const title = `Dev Log ${date}`;
      const body = `Commits vom ${date}:\n\n${stdout || 'Keine Commits heute'}`;
      
      return await this.createNote(title, body);
    } catch (error) {
      console.error('Git nicht verfügbar oder kein Repository:', error.message);
    }
  }
  
  /**
   * Sucht Notizen der letzten X Tage zu einem Thema
   */
  async searchRecentNotes(topic, daysBack = 7) {
    const results = await this.searchNotes(topic);
    console.log(`\nNotizen der letzten ${daysBack} Tage zum Thema "${topic}":`);
    return results;
  }
  
  /**
   * Erstellt eine strukturierte Todo-Liste
   */
  async createTodoList(items) {
    const date = new Date().toLocaleDateString('de-DE');
    const title = `TODO ${date}`;
    const body = items.map(item => `- [ ] ${item}`).join('\n');
    
    return await this.createNote(title, body);
  }
  
  /**
   * Sammelt alle Notizen mit bestimmten Keywords und fasst sie zusammen
   */
  async summarizeNotesByKeywords(keywords) {
    console.log(`\nSammle Notizen mit Keywords: ${keywords.join(', ')}`);
    
    const allResults = [];
    for (const keyword of keywords) {
      const results = await this.searchNotes(keyword);
      if (results) {
        allResults.push({ keyword, results });
      }
    }
    
    // Erstelle Summary-Notiz
    const summaryTitle = `Summary: ${keywords.join(', ')}`;
    const summaryBody = allResults.map(r => 
      `## ${r.keyword}\n${r.results}`
    ).join('\n\n');
    
    return await this.createNote(summaryTitle, summaryBody);
  }
  
  /**
   * Archiviert alte Notizen (fügt [ARCHIV] zum Titel hinzu)
   */
  async archiveOldNotes(pattern) {
    const notes = await this.searchNotes(pattern);
    console.log(`Archiviere Notizen mit Pattern: ${pattern}`);
    // Hinweis: In echter Implementation würde hier die Notiz umbenannt
    return notes;
  }
  
  /**
   * Erstellt eine Notiz aus GitHub Issues
   */
  async createNoteFromGitHubIssues() {
    try {
      const { stdout } = await execAsync('gh issue list --limit 10 --json title,number,state');
      const issues = JSON.parse(stdout);
      
      const title = `GitHub Issues ${new Date().toLocaleDateString('de-DE')}`;
      const body = issues.map(issue => 
        `- [${issue.state === 'OPEN' ? ' ' : 'x'}] #${issue.number}: ${issue.title}`
      ).join('\n');
      
      return await this.createNote(title, body);
    } catch (error) {
      console.error('GitHub CLI nicht verfügbar:', error.message);
    }
  }
  
  /**
   * Erstellt Meeting-Agenda aus relevanten Notizen
   */
  async prepareMeetingAgenda(meetingType) {
    const topics = {
      'weekly': ['todo', 'projekt', 'blocker'],
      'standup': ['gestern', 'heute', 'blocker'],
      'review': ['done', 'feedback', 'improvement']
    };
    
    const searchTerms = topics[meetingType.toLowerCase()] || ['meeting'];
    const results = [];
    
    for (const term of searchTerms) {
      const notes = await this.searchNotes(term);
      if (notes) results.push({ term, notes });
    }
    
    const title = `${meetingType} Meeting Agenda ${new Date().toLocaleDateString('de-DE')}`;
    const body = results.map(r => `## ${r.term}\n${r.notes}`).join('\n\n');
    
    return await this.createNote(title, body);
  }
}

// Für direkte Nutzung
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const integration = new ClaudeNotesIntegration();
  
  switch(command) {
    case 'daily-commits':
      await integration.createDailyCommitLog();
      break;
    
    case 'recent-search':
      if (args[1]) {
        await integration.searchRecentNotes(args[1], args[2] || 7);
      }
      break;
    
    case 'create-todos':
      const todos = args.slice(1);
      if (todos.length > 0) {
        await integration.createTodoList(todos);
      }
      break;
    
    case 'summarize':
      const keywords = args.slice(1);
      if (keywords.length > 0) {
        await integration.summarizeNotesByKeywords(keywords);
      }
      break;
    
    case 'github-issues':
      await integration.createNoteFromGitHubIssues();
      break;
    
    case 'meeting-agenda':
      await integration.prepareMeetingAgenda(args[1] || 'weekly');
      break;
    
    default:
      console.log(`
Erweiterte Claude Notes Integration
Usage:
  claude-integration daily-commits     - Erstellt Notiz mit heutigen Commits
  claude-integration recent-search <topic> [days] - Sucht recent Notizen
  claude-integration create-todos <item1> <item2> ... - Erstellt TODO-Liste
  claude-integration summarize <keyword1> <keyword2> ... - Fasst Notizen zusammen
  claude-integration github-issues     - Erstellt Notiz aus GitHub Issues  
  claude-integration meeting-agenda [type] - Erstellt Meeting-Agenda
      `);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = ClaudeNotesIntegration;
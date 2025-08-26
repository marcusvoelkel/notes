#!/usr/bin/env node

const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

class NotesManager {
  convertToHTML(text) {
    // Konvertiere Text zu HTML
    let html = text;
    
    // Überschriften mit # 
    html = html.replace(/^### (.+)$/gm, '<br><h3>$1</h3><br>');
    html = html.replace(/^## (.+)$/gm, '<br><h2>$1</h2><br>');
    html = html.replace(/^# (.+)$/gm, '<br><h1>$1</h1><br>');
    
    // Listen mit - oder * 
    // Sammle alle Listenelemente und erstelle eine saubere Liste
    html = html.replace(/((?:^[\*\-] .+$\n?)+)/gm, (match) => {
      const items = match.trim().split('\n').map(item => 
        '<li>' + item.replace(/^[\*\-] /, '') + '</li>'
      ).join('');
      return '<ul>' + items + '</ul>';
    });
    
    // Horizontale Linie
    html = html.replace(/^---+$/gm, '<hr>');
    
    // Absätze (zwei oder mehr Zeilenumbrüche)
    html = html.replace(/\n\n+/g, '</p><p>');
    
    // Einzelne Zeilenumbrüche
    html = html.replace(/(?<!<\/li>)\n(?!<li>)/g, '<br>');
    
    // Wrap alles in einen Container
    html = '<div style=font-size:16px>' + html + '</div>';
    
    return html;
  }

  async executeAppleScript(script) {
    try {
      const { stdout, stderr } = await execAsync(`osascript -e '${script}'`);
      if (stderr) console.error('AppleScript error:', stderr);
      return stdout.trim();
    } catch (error) {
      console.error('Error executing AppleScript:', error.message);
      return null;
    }
  }

  async searchNotes(query) {
    const script = `
      tell application "Notes"
        set searchResults to {}
        repeat with n in notes
          if (name of n contains "${query}") or (body of n contains "${query}") then
            set end of searchResults to {name: name of n, body: body of n, id: id of n}
          end if
        end repeat
        return searchResults
      end tell
    `;
    
    const result = await this.executeAppleScript(script);
    if (result) {
      console.log('Search Results:');
      console.log(result);
    }
    return result;
  }

  async createNote(title, body = '') {
    // Konvertiere Body zu HTML wenn vorhanden
    const htmlBody = body ? this.convertToHTML(body) : '';
    
    // Escape für AppleScript - ersetze " mit \"
    const escapedBody = htmlBody.replace(/"/g, '\\"');
    const escapedTitle = title.replace(/"/g, '\\"');
    
    const script = `
      tell application "Notes"
        make new note with properties {name:"${escapedTitle}", body:"${escapedBody}"}
        return "Note created: ${escapedTitle}"
      end tell
    `;
    
    const result = await this.executeAppleScript(script);
    console.log(result);
    return result;
  }

  async editNote(noteTitle, newBody) {
    // Konvertiere Body zu HTML
    const htmlBody = this.convertToHTML(newBody);
    
    // Escape für AppleScript - ersetze " mit \"
    const escapedBody = htmlBody.replace(/"/g, '\\"');
    const escapedTitle = noteTitle.replace(/"/g, '\\"');
    
    const script = `
      tell application "Notes"
        repeat with n in notes
          if name of n is "${escapedTitle}" then
            set body of n to "${escapedBody}"
            return "Note updated: ${escapedTitle}"
          end if
        end repeat
        return "Note not found: ${escapedTitle}"
      end tell
    `;
    
    const result = await this.executeAppleScript(script);
    console.log(result);
    return result;
  }

  async listNotes() {
    const script = `
      tell application "Notes"
        set noteList to {}
        repeat with n in notes
          set end of noteList to name of n
        end repeat
        return noteList
      end tell
    `;
    
    const result = await this.executeAppleScript(script);
    if (result) {
      console.log('All Notes:');
      console.log(result);
    }
    return result;
  }

  async getNoteContent(noteTitle) {
    const script = `
      tell application "Notes"
        repeat with n in notes
          if name of n is "${noteTitle}" then
            return body of n
          end if
        end repeat
        return "Note not found: ${noteTitle}"
      end tell
    `;
    
    const result = await this.executeAppleScript(script);
    console.log(result);
    return result;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const notesManager = new NotesManager();

  switch (command) {
    case 'search':
      if (args[1]) {
        await notesManager.searchNotes(args[1]);
      } else {
        console.log('Usage: notes-cli search <query>');
      }
      break;

    case 'create':
      if (args[1]) {
        const title = args[1];
        const body = args.slice(2).join(' ');
        await notesManager.createNote(title, body);
      } else {
        console.log('Usage: notes-cli create <title> [body]');
      }
      break;

    case 'edit':
      if (args[1] && args[2]) {
        const title = args[1];
        const newBody = args.slice(2).join(' ');
        await notesManager.editNote(title, newBody);
      } else {
        console.log('Usage: notes-cli edit <title> <new-body>');
      }
      break;

    case 'list':
      await notesManager.listNotes();
      break;

    case 'get':
      if (args[1]) {
        await notesManager.getNoteContent(args[1]);
      } else {
        console.log('Usage: notes-cli get <title>');
      }
      break;

    default:
      console.log(`
Apple Notes CLI Tool
Usage:
  notes-cli search <query>     - Search notes by title or content
  notes-cli create <title> [body] - Create a new note
  notes-cli edit <title> <new-body> - Edit existing note
  notes-cli list               - List all notes
  notes-cli get <title>        - Get content of specific note
Examples:
  notes-cli search "meeting"
  notes-cli create "My Note" "This is the content"
  notes-cli edit "My Note" "Updated content"
  notes-cli list
  notes-cli get "My Note"
      `);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = NotesManager;
/**
 * Apple Notes Core Module - Simplified
 * Nur Notizen erstellen - schnell und zuverlässig
 */

const { spawn } = require('child_process');

class NotesCore {
  constructor(options = {}) {
    this.debug = options.debug || false;
    this.timeoutMs = typeof options.timeoutMs === 'number' ? options.timeoutMs : 15000;
  }

  /**
   * Führt AppleScript sicher aus
   */
  async executeAppleScript(script) {
    return new Promise((resolve, reject) => {
      const osascript = spawn('osascript', ['-']);
      let stdout = '';
      let stderr = '';

      const timer = setTimeout(() => {
        try {
          osascript.kill('SIGTERM');
        } catch (_) {}
        reject(new Error('AppleScript timeout'));
      }, this.timeoutMs);

      osascript.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      osascript.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      osascript.on('close', (code) => {
        clearTimeout(timer);
        if (code !== 0) {
          reject(new Error(stderr || 'AppleScript fehlgeschlagen'));
        } else {
          if (this.debug && stderr) {
            console.error('AppleScript Warnung:', stderr);
          }
          resolve(stdout.trim());
        }
      });

      osascript.on('error', (err) => {
        clearTimeout(timer);
        reject(err);
      });

      // Sende Script an stdin
      osascript.stdin.write(script);
      osascript.stdin.end();
    });
  }

  /**
   * Validiert und bereinigt Input
   */
  validateInput(input, type = 'text') {
    if (!input || typeof input !== 'string') {
      throw new Error('Ungültiger Input: Text erwartet');
    }
    
    if (type === 'title' && input.length > 255) {
      throw new Error('Titel zu lang (max. 255 Zeichen)');
    }
    
    if (type === 'title' && input.trim().length === 0) {
      throw new Error('Titel darf nicht leer sein');
    }
    
    return input.trim();
  }

  /**
   * Escaped Text für AppleScript (sicher gegen Injection)
   */
  escapeForAppleScript(text) {
    if (!text) return '';
    
    // Ersetze Backslashes zuerst
    return text
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
  }

  /**
   * Konvertiert Markdown zu HTML für Apple Notes
   */
  convertToHTML(text) {
    let html = text;
    
    // Code-Blöcke
    html = html.replace(/```([\s\S]*?)```/g, 
      '<blockquote style="background:#f5f5f5;padding:12px;border-left:4px solid #ddd;font-family:monospace;white-space:pre-wrap">$1</blockquote>');
    
    // Inline-Code
    html = html.replace(/`([^`]+)`/g, 
      '<code style="background:#f0f0f0;padding:2px 6px;border-radius:3px;font-family:monospace">$1</code>');
    
    // Überschriften
    html = html.replace(/^### (.+)$/gm, '<h3 style="font-size:20px;margin:20px 0 16px">$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2 style="font-size:24px;margin:24px 0 16px">$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1 style="font-size:28px;margin:28px 0 20px">$1</h1>');
    
    // Listen
    html = html.replace(/((?:^[\*\-] .+$\n?)+)/gm, (match) => {
      const items = match.trim().split('\n').map(item => 
        '<li style="margin-bottom:8px">' + item.replace(/^[\*\-] /, '') + '</li>'
      ).join('');
      return '<ul style="margin:16px 0;padding-left:24px">' + items + '</ul>';
    });
    
    // Nummerierte Listen
    html = html.replace(/((?:^\d+\. .+$\n?)+)/gm, (match) => {
      const items = match.trim().split('\n').map(item => 
        '<li style="margin-bottom:8px">' + item.replace(/^\d+\. /, '') + '</li>'
      ).join('');
      return '<ol style="margin:16px 0;padding-left:24px">' + items + '</ol>';
    });
    
    // Fett und Kursiv
    html = html.replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([^\*]+)\*/g, '<em>$1</em>');
    
    // Horizontale Linie
    html = html.replace(/^---+$/gm, '<hr style="border:none;border-top:1px solid #ddd;margin:24px 0">');
    
    // Absätze
    html = html.replace(/\n\n+/g, '</p><p style="margin:12px 0">');
    html = html.replace(/\n/g, '<br>');
    
    // Container
    return '<div style="font-size:16px;line-height:1.6;font-family:-apple-system,sans-serif"><p style="margin:12px 0">' + 
           html + '</p></div>';
  }

  /**
   * Erstellt eine neue Notiz
   */
  async create(title, body = '') {
    const validTitle = this.validateInput(title, 'title');
    const escapedTitle = this.escapeForAppleScript(validTitle);
    const htmlBody = body ? this.convertToHTML(body) : '';
    const escapedBody = this.escapeForAppleScript(htmlBody);
    
    const script = `
      tell application "Notes"
        make new note with properties {name:"${escapedTitle}", body:"${escapedBody}"}
        return "Notiz erstellt: ${escapedTitle}"
      end tell
    `;
    
    return await this.executeAppleScript(script);
  }
}

module.exports = NotesCore;

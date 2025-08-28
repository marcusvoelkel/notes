/**
 * Apple Notes Core Module
 * Fast and reliable note creation for macOS
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
          reject(new Error(stderr || 'AppleScript failed'));
        } else {
          if (this.debug && stderr) {
            console.error('AppleScript warning:', stderr);
          }
          resolve(stdout.trim());
        }
      });

      osascript.on('error', (err) => {
        clearTimeout(timer);
        reject(err);
      });

      // Send script to stdin
      osascript.stdin.write(script);
      osascript.stdin.end();
    });
  }

  /**
   * Validate and clean input
   */
  validateInput(input, type = 'text') {
    if (!input || typeof input !== 'string') {
      throw new Error('Invalid input: expected string');
    }
    
    if (type === 'title' && input.length > 255) {
      throw new Error('Title too long (max 255 chars)');
    }
    
    if (type === 'title' && input.trim().length === 0) {
      throw new Error('Title cannot be empty');
    }
    
    return input.trim();
  }

  /**
   * Escaped Text für AppleScript (sicher gegen Injection)
   */
  escapeForAppleScript(text) {
    if (!text) return '';
    
    // First remove any dangerous AppleScript commands before any escaping
    // This ensures they are removed even if surrounded by special characters
    text = text.replace(/\btell\b/gi, 't_e_l_l');  // Neutralize 'tell'
    text = text.replace(/\bend\s+tell\b/gi, 'e_n_d_t_e_l_l');  // Neutralize 'end tell'
    
    // Remove dangerous control characters but keep common ones
    text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    
    // Remove Unicode control characters except newlines
    text = text.replace(/[\u2028\u2029]/g, '');
    
    // Remove zero-width characters that could be used for obfuscation  
    text = text.replace(/[\u200B-\u200F\u202A-\u202E\u2060-\u2064\u206A-\u206F\uFEFF]/g, '');
    
    // Escape special AppleScript characters
    // WICHTIG: Reihenfolge ist kritisch!
    text = text
      .replace(/\\/g, '\\\\')       // Backslashes first
      .replace(/"/g, '\\"')         // Double quotes
      .replace(/\r\n/g, '\\n')      // Windows line endings to Unix
      .replace(/\r/g, '\\n')        // Mac line endings to Unix  
      .replace(/\n/g, '\\n')        // Preserve newlines as escaped
      .replace(/[\t]/g, '\\t')      // Preserve tabs
      .replace(/[\f\v]/g, ' ')      // Replace other whitespace with space
      .replace(/}/g, '')            // Remove closing braces (prevent breaking out)
      .replace(/{/g, '');           // Remove opening braces
    
    // Truncate very long texts to prevent AppleScript issues
    const maxLength = 50000; // Safe limit for AppleScript
    if (text.length > maxLength) {
      text = text.substring(0, maxLength) + '... (truncated)';
    }
    
    return text;
  }

  /**
   * Remove dangerous HTML while keeping safe formatting
   */
  sanitizeHTML(text) {
    // Remove script tags and content
    text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // Remove event handlers
    text = text.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
    text = text.replace(/javascript:/gi, '');
    
    // Remove dangerous tags only
    const dangerous = ['script', 'iframe', 'object', 'embed', 'form'];
    dangerous.forEach(tag => {
      const regex = new RegExp(`<${tag}\\b[^>]*>(?:.*?<\\/${tag}>)?`, 'gi');
      text = text.replace(regex, '');
    });
    
    return text;
  }

  /**
   * Convert Markdown to HTML for Apple Notes
   */
  convertToHTML(text) {
    // Sanitize dangerous content only
    text = this.sanitizeHTML(text);
    
    let html = text;
    
    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, 
      '<blockquote style="background:#f5f5f5;padding:12px;border-left:4px solid #ddd;font-family:monospace;white-space:pre-wrap">$1</blockquote>');
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, 
      '<code style="background:#f0f0f0;padding:2px 6px;border-radius:3px;font-family:monospace">$1</code>');
    
    // Headings
    html = html.replace(/^### (.+)$/gm, '<h3 style="font-size:20px;margin:20px 0 16px">$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2 style="font-size:24px;margin:24px 0 16px">$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1 style="font-size:28px;margin:28px 0 20px">$1</h1>');
    
    // Bullet lists
    html = html.replace(/((?:^[\*\-] .+$\n?)+)/gm, (match) => {
      const items = match.trim().split('\n').map(item => {
        const content = item.replace(/^[\*\-] /, '');
        return '<li style="margin-bottom:8px">' + content + '</li>';
      }).join('');
      return '<ul style="margin:16px 0;padding-left:24px">' + items + '</ul>';
    });
    
    // Numbered lists
    html = html.replace(/((?:^\d+\. .+$\n?)+)/gm, (match) => {
      const items = match.trim().split('\n').map(item => {
        const content = item.replace(/^\d+\. /, '');
        return '<li style="margin-bottom:8px">' + content + '</li>';
      }).join('');
      return '<ol style="margin:16px 0;padding-left:24px">' + items + '</ol>';
    });
    
    // Bold and italic
    html = html.replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([^\*]+)\*/g, '<em>$1</em>');
    
    // Horizontal rule
    html = html.replace(/^---+$/gm, '<hr style="border:none;border-top:1px solid #ddd;margin:24px 0">');
    
    // Paragraphs
    html = html.replace(/\n\n+/g, '</p><p style="margin:12px 0">');
    html = html.replace(/\n/g, '<br>');
    
    // Container
    return '<div style="font-size:16px;line-height:1.6;font-family:-apple-system,sans-serif"><p style="margin:12px 0">' + 
           html + '</p></div>';
  }

  /**
   * Create a new note
   */
  async create(title, body = '') {
    const validTitle = this.validateInput(title, 'title');
    const escapedTitle = this.escapeForAppleScript(validTitle);
    const htmlBody = body ? this.convertToHTML(body) : '';
    const escapedBody = this.escapeForAppleScript(htmlBody);
    
    const script = `
      tell application "Notes"
        make new note with properties {name:"${escapedTitle}", body:"${escapedBody}"}
        return "Note created: ${escapedTitle}"
      end tell
    `;
    
    return await this.executeAppleScript(script);
  }
}

module.exports = NotesCore;

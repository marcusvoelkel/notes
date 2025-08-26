#!/usr/bin/env node

const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function searchNotesByDateRange(startDate, endDate) {
  const script = `
    set startDate to date "${startDate}"
    set endDate to date "${endDate}"
    
    tell application "Notes"
      set foundNotes to {}
      set noteCount to 0
      
      repeat with aNote in notes
        try
          set noteDate to creation date of aNote
          if noteDate ≥ startDate and noteDate ≤ endDate then
            set noteCount to noteCount + 1
            if noteCount ≤ 50 then
              set noteTitle to name of aNote
              set noteBody to text 1 thru (minimum of 500, length of (body of aNote as text)) of (body of aNote as text)
              set end of foundNotes to "===== " & noteTitle & " (" & (noteDate as string) & ") =====" & return & noteBody & return & return
            end if
          end if
        end try
      end repeat
      
      if noteCount > 50 then
        set end of foundNotes to "... und " & (noteCount - 50) & " weitere Notizen im Zeitraum"
      end if
      
      if noteCount = 0 then
        return "Keine Notizen im Zeitraum " & (startDate as string) & " bis " & (endDate as string) & " gefunden"
      else
        return foundNotes as text
      end if
    end tell
  `;
  
  try {
    console.log(`Suche Notizen vom ${startDate} bis ${endDate}...`);
    const { stdout, stderr } = await execAsync(`osascript -e '${script}'`, { 
      timeout: 60000,
      maxBuffer: 10 * 1024 * 1024 // 10MB buffer
    });
    if (stderr) console.error('AppleScript error:', stderr);
    return stdout;
  } catch (error) {
    if (error.killed || error.signal === 'SIGTERM') {
      return 'Timeout: Zu viele Notizen zum Durchsuchen. Bitte Zeitraum eingrenzen.';
    }
    console.error('Error:', error.message);
    return null;
  }
}

// Main
const args = process.argv.slice(2);
if (args.length !== 2) {
  console.log('Usage: ./notes-date-search.js "MM/DD/YYYY" "MM/DD/YYYY"');
  console.log('Example: ./notes-date-search.js "08/20/2025" "08/26/2025"');
} else {
  searchNotesByDateRange(args[0], args[1]).then(result => {
    if (result) console.log(result);
  });
}
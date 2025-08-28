const assert = require('node:assert');
const NotesCore = require('../notes-core');

test('escapeForAppleScript escapes quotes/backslashes and strips control chars', () => {
  const core = new NotesCore();
  const input = 'a"b\\c\u0007\u2028d';
  const out = core.escapeForAppleScript(input);
  assert.ok(out.includes('\\"'), 'should escape double quote');
  assert.ok(out.includes('\\\\'), 'should escape backslash');
  assert.ok(!/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u2028\u2029]/.test(out), 'should strip control chars');
});

test('convertToHTML escapes raw HTML', () => {
  const core = new NotesCore();
  const out = core.convertToHTML('<script>alert(1)</script>');
  assert.ok(out.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
});

test('convertToHTML renders headings and lists', () => {
  const core = new NotesCore();
  const out = core.convertToHTML('# T\n- a\n- b');
  assert.ok(out.includes('<h1'), 'heading');
  assert.ok(out.includes('<ul'), 'list');
  assert.ok(out.includes('<li'), 'list items');
});

test('inline code wrapped', () => {
  const core = new NotesCore();
  const out = core.convertToHTML('use `x`');
  assert.ok(out.includes('<code'));
});

test('paragraphs: double newline => new <p>', () => {
  const core = new NotesCore();
  const out = core.convertToHTML('a\n\nb');
  assert.ok(out.includes('</p><p'));
});


#!/usr/bin/env node

/**
 * Comprehensive Test Suite for Apple Notes CLI
 */

const NotesCore = require('./notes-core');
const { spawn } = require('child_process');
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

let passedTests = 0;
let failedTests = 0;

/**
 * Test runner
 */
async function test(name, testFunc) {
  process.stdout.write(`Testing ${name}... `);
  try {
    await testFunc();
    console.log(`${colors.green}✓${colors.reset}`);
    passedTests++;
  } catch (error) {
    console.log(`${colors.red}✗${colors.reset}`);
    console.log(`  ${colors.red}Error: ${error.message}${colors.reset}`);
    if (process.env.DEBUG === 'true') {
      console.error(error.stack);
    }
    failedTests++;
  }
}

/**
 * Test CLI directly
 */
async function testCLI(args, expectedToWork = true) {
  return new Promise((resolve, reject) => {
    const proc = spawn('node', ['notes-cli.js', ...args]);
    let stdout = '';
    let stderr = '';
    
    proc.stdout.on('data', data => stdout += data);
    proc.stderr.on('data', data => stderr += data);
    
    proc.on('close', code => {
      if (expectedToWork && code !== 0) {
        reject(new Error(`CLI failed: ${stderr || stdout}`));
      } else if (!expectedToWork && code === 0) {
        reject(new Error('CLI should have failed but didn\'t'));
      } else {
        resolve({ stdout, stderr, code });
      }
    });
  });
}

/**
 * Test AppleScript escaping
 */
async function testAppleScriptEscaping() {
  const core = new NotesCore();
  
  // Test basic escaping
  const tests = [
    { input: 'Hello "World"', desc: 'double quotes' },
    { input: 'Line 1\nLine 2', desc: 'newlines' },
    { input: 'Tab\there', desc: 'tabs' },
    { input: 'Back\\slash', desc: 'backslashes' },
    { input: 'Mixed "quotes" and\nnewlines\\backslash', desc: 'mixed special chars' },
    { input: "It's a test", desc: 'single quotes (apostrophes)' },
    { input: 'Emoji 😀 test', desc: 'emoji characters' },
    { input: 'Ümläuts äöü ÄÖÜ ß', desc: 'German umlauts' },
    { input: 'Français: à è é ê ë', desc: 'French accents' },
    { input: '中文测试', desc: 'Chinese characters' },
    { input: '日本語テスト', desc: 'Japanese characters' },
    { input: 'Кириллица тест', desc: 'Cyrillic characters' }
  ];
  
  for (const t of tests) {
    const escaped = core.escapeForAppleScript(t.input);
    if (!escaped || escaped.length === 0) {
      throw new Error(`Escaping failed for ${t.desc}: result is empty`);
    }
    // Basic check - should not contain raw control characters
    if (escaped.includes('\0') || escaped.includes('\x1F')) {
      throw new Error(`Escaping failed for ${t.desc}: contains control characters`);
    }
  }
}

/**
 * Test HTML conversion
 */
async function testHTMLConversion() {
  const core = new NotesCore();
  
  const tests = [
    { 
      input: '# Heading 1', 
      shouldContain: '<h1',
      desc: 'H1 heading' 
    },
    { 
      input: '## Heading 2', 
      shouldContain: '<h2',
      desc: 'H2 heading' 
    },
    { 
      input: '**bold text**', 
      shouldContain: '<strong>bold text</strong>',
      desc: 'bold text' 
    },
    { 
      input: '*italic text*', 
      shouldContain: '<em>italic text</em>',
      desc: 'italic text' 
    },
    { 
      input: '`code`', 
      shouldContain: '<code',
      desc: 'inline code' 
    },
    { 
      input: '- Item 1\n- Item 2', 
      shouldContain: '<ul',
      desc: 'bullet list' 
    },
    { 
      input: '1. First\n2. Second', 
      shouldContain: '<ol',
      desc: 'numbered list' 
    },
    { 
      input: '<script>alert("xss")</script>', 
      shouldNotContain: '<script',
      desc: 'XSS prevention' 
    }
  ];
  
  for (const t of tests) {
    const html = core.convertToHTML(t.input);
    if (t.shouldContain && !html.includes(t.shouldContain)) {
      throw new Error(`HTML conversion failed for ${t.desc}: missing "${t.shouldContain}"`);
    }
    if (t.shouldNotContain && html.includes(t.shouldNotContain)) {
      throw new Error(`HTML conversion failed for ${t.desc}: contains dangerous "${t.shouldNotContain}"`);
    }
  }
}

/**
 * Test input validation
 */
async function testInputValidation() {
  const core = new NotesCore();
  
  // Valid inputs
  core.validateInput('Valid Title', 'title');
  core.validateInput('Valid Body Text', 'text');
  
  // Invalid inputs
  try {
    core.validateInput('   ', 'title');  // Only whitespace
    throw new Error('Should reject empty title');
  } catch (e) {
    if (!e.message.includes('cannot be empty')) {
      throw e;
    }
  }
  
  try {
    core.validateInput('a'.repeat(256), 'title');
    throw new Error('Should reject too long title');
  } catch (e) {
    if (!e.message.includes('too long')) {
      throw e;
    }
  }
  
  try {
    core.validateInput(null, 'title');
    throw new Error('Should reject null input');
  } catch (e) {
    if (!e.message.includes('expected string')) {
      throw e;
    }
  }
}

/**
 * Test CLI arguments
 */
async function testCLIArguments() {
  // Test help
  await testCLI(['--help']);
  
  // Test version
  await testCLI(['--version']);
  
  // Test with no arguments (should show help)
  await testCLI([]);
}

/**
 * Integration test - actually create a note
 */
async function testActualNoteCreation() {
  const core = new NotesCore({ debug: false });
  
  const testCases = [
    {
      title: 'Test Note Simple',
      body: 'This is a simple test note.',
      desc: 'simple note'
    },
    {
      title: 'Test Note with Markdown',
      body: '# Heading\n\n**Bold** and *italic* text.\n\n- Item 1\n- Item 2',
      desc: 'markdown note'
    },
    {
      title: 'Test Note with Special Chars',
      body: 'Quote: "Hello"\nApostrophe: It\'s working\nNewline: Line1\nLine2',
      desc: 'special characters'
    },
    {
      title: 'Test Note with International',
      body: 'Deutsch: äöü ÄÖÜ ß\nFrançais: à è é\n中文: 你好\n日本語: こんにちは',
      desc: 'international characters'
    },
    {
      title: 'Test Note with Code',
      body: 'Code example:\n```\nfunction test() {\n  return "Hello";\n}\n```',
      desc: 'code block'
    }
  ];
  
  for (const tc of testCases) {
    try {
      const result = await core.create(tc.title, tc.body);
      if (!result || !result.includes('Note created')) {
        throw new Error(`Failed to create ${tc.desc}: ${result}`);
      }
    } catch (error) {
      // Check if it's a permission/Notes app issue
      if (error.message.includes('keine Berechtigung') || 
          error.message.includes('permission') ||
          error.message.includes('access')) {
        console.log(`${colors.yellow}  (Skipped - Notes permission required)${colors.reset}`);
      } else {
        throw error;
      }
    }
  }
}

/**
 * Test security features
 */
async function testSecurity() {
  const core = new NotesCore();
  
  // Test XSS prevention
  const xssAttempts = [
    '<script>alert("XSS")</script>',
    '<img src=x onerror="alert(\'XSS\')">',
    'javascript:alert("XSS")',
    '<iframe src="evil.com"></iframe>',
    '<form action="evil.com"><input name="password"></form>'
  ];
  
  for (const xss of xssAttempts) {
    const safe = core.sanitizeHTML(xss);
    if (safe.includes('<script') || safe.includes('onerror') || 
        safe.includes('javascript:') || safe.includes('<iframe') ||
        safe.includes('<form')) {
      throw new Error(`Security: XSS not prevented for: ${xss}`);
    }
  }
  
  // Test command injection prevention in AppleScript
  const injectionAttempts = [
    'Title" } end tell\ntell application "System Events" to delete file',
    'Test tell application "Finder" to delete',
    'end tell } malicious code'
  ];
  
  for (const injection of injectionAttempts) {
    const safe = core.escapeForAppleScript(injection);
    
    // Check that 'tell' commands are removed/neutralized
    if (safe.toLowerCase().includes('tell')) {
      throw new Error(`Security: 'tell' command not removed from: ${safe}`);
    }
    
    // The escapeForAppleScript should neutralize injection attempts
    // Just verify the result doesn't contain dangerous patterns
    if (safe.includes('} ')) {
      // This pattern could break out of AppleScript string
      throw new Error(`Security: Dangerous pattern "} " found in: ${safe}`);
    }
  }
}

/**
 * Main test runner
 */
async function runTests() {
  console.log(`${colors.cyan}🧪 Running Comprehensive Tests${colors.reset}\n`);
  
  // Core functionality tests
  await test('AppleScript escaping', testAppleScriptEscaping);
  await test('HTML conversion', testHTMLConversion);
  await test('Input validation', testInputValidation);
  await test('Security features', testSecurity);
  
  // CLI tests
  await test('CLI arguments', testCLIArguments);
  
  // Integration tests (may require Notes app permission)
  console.log(`\n${colors.cyan}Integration Tests:${colors.reset}`);
  await test('Actual note creation', testActualNoteCreation);
  
  // Summary
  console.log(`\n${colors.cyan}Test Results:${colors.reset}`);
  console.log(`  ${colors.green}Passed: ${passedTests}${colors.reset}`);
  console.log(`  ${colors.red}Failed: ${failedTests}${colors.reset}`);
  
  if (failedTests > 0) {
    console.log(`\n${colors.red}❌ Tests failed!${colors.reset}`);
    process.exit(1);
  } else {
    console.log(`\n${colors.green}✅ All tests passed!${colors.reset}`);
    process.exit(0);
  }
}

// Run tests
runTests().catch(error => {
  console.error(`${colors.red}Test runner error: ${error.message}${colors.reset}`);
  if (process.env.DEBUG === 'true') {
    console.error(error.stack);
  }
  process.exit(1);
});
#!/usr/bin/env node

/**
 * Minimal Security Tests
 * Only test critical security functions
 */

const NotesCore = require('./notes-core');
const assert = require('assert');

// Test runner
const tests = [];
let passed = 0;
let failed = 0;

function test(name, fn) {
  tests.push({ name, fn });
}

function run() {
  console.log('Running Security Tests...\n');
  
  tests.forEach(({ name, fn }) => {
    try {
      fn();
      console.log('✓', name);
      passed++;
    } catch (err) {
      console.log('✗', name);
      console.log('  ', err.message);
      failed++;
    }
  });
  
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

// TESTS

const core = new NotesCore();

test('blocks script injection in HTML', () => {
  const input = 'Hello <script>alert("xss")</script> world';
  const result = core.sanitizeHTML(input);
  assert(!result.includes('<script>'), 'Script tag not removed');
  assert(result.includes('Hello'), 'Text content lost');
});

test('removes event handlers', () => {
  const input = '<div onclick="alert(1)">Click me</div>';
  const result = core.sanitizeHTML(input);
  assert(!result.includes('onclick'), 'Event handler not removed');
});

test('blocks javascript: protocol', () => {
  const input = '<a href="javascript:alert(1)">Link</a>';
  const result = core.sanitizeHTML(input);
  assert(!result.includes('javascript:'), 'JavaScript protocol not removed');
});

test('escapes AppleScript special characters', () => {
  const input = 'Test " quote \\ backslash \n newline';
  const result = core.escapeForAppleScript(input);
  assert(result.includes('\\\"'), 'Quotes not escaped');
  assert(result.includes('\\\\'), 'Backslash not escaped');
  assert(result.includes('\\n'), 'Newline not escaped');
});

test('removes control characters from AppleScript', () => {
  const input = 'Test\x00\x08\x1F';
  const result = core.escapeForAppleScript(input);
  assert(!result.includes('\x00'), 'Null byte not removed');
  assert(!result.includes('\x08'), 'Control char not removed');
});

test('validates title input', () => {
  assert.throws(() => core.validateInput(null, 'title'), /expected string/);
  assert.throws(() => core.validateInput(' ', 'title'), /Title cannot be empty/);
  assert.throws(() => core.validateInput('x'.repeat(256), 'title'), /too long/);
});

// Run tests
run();
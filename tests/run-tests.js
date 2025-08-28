#!/usr/bin/env node
const assert = require('node:assert');

const tests = [];
global.test = (name, fn) => tests.push({ name, fn });

const files = [
  require.resolve('./notes-core.test.js'),
  require.resolve('./cli-update.test.js'),
];

for (const f of files) {
  try {
    require(f);
  } catch (e) {
    console.error(`Failed to load ${f}:`, e);
    process.exitCode = 1;
  }
}

(async () => {
  let passed = 0;
  for (const { name, fn } of tests) {
    try {
      const res = fn();
      if (res && typeof res.then === 'function') await res;
      passed++;
      process.stdout.write(`✔ ${name}\n`);
    } catch (e) {
      console.error(`✖ ${name}`);
      console.error(e && e.stack ? e.stack : e);
      process.exitCode = 1;
    }
  }
  console.log(`\n${passed}/${tests.length} tests passed`);
})();


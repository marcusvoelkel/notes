const assert = require('node:assert');
const { spawnSync } = require('node:child_process');
const path = require('node:path');

test('NO_UPDATE_CHECK skips network in --update', () => {
  const cli = path.join(__dirname, '..', 'notes-cli.js');
  const res = spawnSync(process.execPath, [cli, '--update'], {
    env: { ...process.env, NO_UPDATE_CHECK: 'true' },
    encoding: 'utf8'
  });
  assert.strictEqual(res.status, 0);
  assert.match(res.stdout || '', /skipped/i);
});


// ESLint flat config (v9+)
const globals = require('globals');

module.exports = [
  {
    files: ['**/*.js'],
    ignores: [
      'examples/**',
      'notes',
      '**/*.md',
      '**/*.yml',
      '**/*.yaml',
      '**/*.json'
    ],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'script',
      globals: {
        ...globals.node
      }
    },
    rules: {
      'no-var': 'error',
      'prefer-const': 'error',
      'no-console': 'off'
    }
  }
];


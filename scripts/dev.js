const { spawn } = require('child_process');
const path = require('path');

// Use require.resolve to find next binary
let nextPath;
try {
  nextPath = require.resolve('next/dist/bin/next');
} catch (e) {
  // Fallback to node_modules path
  nextPath = path.join(__dirname, '..', 'node_modules', 'next', 'dist', 'bin', 'next');
}

const args = ['dev'];

const child = spawn('node', [nextPath, ...args], {
  stdio: 'inherit',
  shell: false,
  cwd: path.join(__dirname, '..'),
});

child.on('exit', (code) => {
  process.exit(code || 0);
});


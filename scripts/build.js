const { spawn } = require('child_process');
const path = require('path');

let nextPath;
try {
  nextPath = require.resolve('next/dist/bin/next');
} catch (e) {
  nextPath = path.join(__dirname, '..', 'node_modules', 'next', 'dist', 'bin', 'next');
}

const args = ['build'];

const child = spawn('node', [nextPath, ...args], {
  stdio: 'inherit',
  shell: false,
  cwd: path.join(__dirname, '..'),
});

child.on('exit', (code) => {
  process.exit(code || 0);
});


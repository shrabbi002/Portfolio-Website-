const { spawn } = require('child_process');
const path = require('path');

console.log('Starting both backend and frontend servers...');

// Helper to spawn a child process and inherit stdio
const runProcess = (command, args, cwd, label) => {
    const child = spawn(command, args, { 
        cwd, 
        shell: true, 
        stdio: 'inherit' 
    });

    child.on('error', (err) => {
        console.error(`[${label}] Error:`, err);
    });

    child.on('close', (code) => {
        console.log(`[${label}] Exited with code ${code}`);
    });

    return child;
};

// Start backend
runProcess('npm', ['run', 'dev'], path.join(__dirname, 'backend'), 'Backend');

// Start frontend
runProcess('npm', ['run', 'dev'], path.join(__dirname, 'frontend'), 'Frontend');

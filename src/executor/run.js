const { spawn } = require('child_process');
const config = require('../config');
const { resolve } = require('dns');

function run(binaryPath, input = ''){
    return new Promise((resolve) => {
        const child = spawn(binaryPath, [], {timeout: config.runTimeoutMs});

        let stdout = '';
        let stderr = '';
        let killedForTimeout = false;

        child.stdout.on('data', (data) => {
            stdout += data.toString();
            if(Buffer.byteLength(stdout) > config.maxOutputBytes){
                child.kill('SIGKILL');
            }
        });

        child.stderr.on('data', (data) => {
            stderr += data.toString();
        });
// send input if the program reads from stdin
        if (input) child.stdin.write(input);
        child.stdin.end();

        child.on('error', (err) => {
            resolve({ verdict: 'RUNTIME_ERROR', error: err.message, stdout, stderr});
        });

        child.on('close', (code, signal) => {
            if (signal === 'SIGTERM' || signal === 'SIGKILL') {
                return resolve({verdict: 'TIME_LIMIT_EXCEEDED', stdout, stderr});
            }
            if(code !== 0){
                return resolve({verdict: 'RUNTIME_ERROR', code, stdout, stderr});
            }
            resolve({ verdict: 'SUCCESS', stdout, stderr});
        });
    });
}

module.exports = run;
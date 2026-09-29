const {exec} = require('child_process');
const path = require('path');
const config = require('../config');
const { error } = require('console');

function compile(sourcePath, outputPath) {
    return new Promise((resolve) => {
        const cmd = `g++ "${sourcePath}" -o "${outputPath}"`;

        exec(cmd, { timeout: config.compileTimeoutMs }, (error,stdout, stderr) => {
            if (error){
                return resolve({
                    success : false,
                    verdict: error.killed ? 'COMPILE_TIMEOUT' : 'COMPILE_ERROR',
                    error: stderr || error.message
                });
            }
            resolve({ success: true });
        });
    });
}

module.exports = compile;
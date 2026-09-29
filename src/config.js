const path = require('path');

module.exports = {
    tempDir : path.join(__dirname, '..', 'temp'),
    compileTimeoutMs: 10000,
    runTimeoutMs: 5000,
    maxOutputBytes: 1024 * 100,
    dockerImage: 'gcc:latest',
    dockerMemoryLimit: '128m',
    dockerCpuLimit: '0.5'
};
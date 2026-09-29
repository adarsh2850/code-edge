const {exec} = require('child_process');
const config = require('../config');
const { error } = require('console');
const { stderr, exitCode } = require('process');

function dockerRun(hostDir){
    return new Promise((resolve) => {
        const runTimeoutSec = Math.ceil(config.runTimeoutMs/1000);
        const cmd = `docker run --rm ` +
        `--memory=${config.dockerMemoryLimit} ` +
        `--cpus=${config.dockerCpuLimit} ` +
        `--network none ` +
        `-v "${hostDir}:/app" ` +
        `${config.dockerImage} ` +
        // `bash -c "g++ /app/main.cpp -o /app/main.out 2> /app/compile_err.txt && /app/main.out"` +
        `bash -c "g++ /app/main.cpp -o /app/main.out 2> /app/compile_err.txt && timeout ${runTimeoutSec} /app/main.out < /app/input.txt"`;

        exec(cmd, { timeout: config.runTimeoutMs + config.compileTimeoutMs }, (error, stdout, stderr) => {
            resolve({ error, stdout, stderr, killed: error?.killed, exitCode: error?.code});
        });
    }) ;

}

module.exports = dockerRun;
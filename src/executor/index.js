const fs = require('fs/promises');
const path = require('path');
const dockerRun = require('./dockerRun');
const generatedId = require('../utils/generateId');
const { createSubmissionDir, writeSourceFile, cleanup} = require('../utils/fileManager');
const config = require('../config');
const { stdout, stderr } = require('process');


async function executeCpp(code, input = '') {   
    const id = generatedId();
    const dir = await createSubmissionDir(config.tempDir, id);
    await writeSourceFile(dir, 'main.cpp', code);
    await writeSourceFile(dir, 'input.txt', input);

    try {
        const result =  await dockerRun(dir);

        let compileErr = '';
        try{
            compileErr = await fs.readFile(path.join(dir, 'compile_err.txt'), 'utf8');
            
        }catch(e){
            // file may not exist
        }
        if(compileErr.trim().length > 0){
            return{verdict: 'COMPILE_ERROR', error: compileErr};
        }
        if(result.exitCode === 124){
            return {verdict: 'TIME_LIMIT_EXCEEDED'};
        }

        if(result.killed){
            return {verdict: 'TIME_LIMIT_EXCEEDED'};

        }
        if(result.error){
            return {verdict: 'RUNTIME_ERROR', error: result.stderr || result.error.message};
        }

        return{verdict: 'SUCCESS', stdout: result.stdout, stderr: result.stderr};
    }finally {
        await cleanup(dir);
    }
}

module.exports = executeCpp;
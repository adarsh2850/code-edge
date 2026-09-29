const fs = require('fs/promises');
const path = require('path');

async function createSubmissionDir(baseDir, id) {
    const dir = path.join(baseDir, id);
    await fs.mkdir(dir, {recursive: true});
    return dir;
    
}

async function writeSourceFile(dir, filename, code) {
    const filePath = path.join(dir, filename);
    await fs.writeFile(filePath, code);
    return filePath;
}

async function cleanup(dir){
    await fs.rm(dir, {recursive: true, force: true});
}

module.exports = { createSubmissionDir, writeSourceFile, cleanup};
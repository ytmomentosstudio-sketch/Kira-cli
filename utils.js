const fs = require('fs').promises;

async function readFile(filePath) {
    return fs.readFile(filePath, 'utf8');
}

async function writeFile(filePath, content) {
    return fs.writeFile(filePath, content, 'utf8');
}

module.exports = {
    readFile,
    writeFile,
};

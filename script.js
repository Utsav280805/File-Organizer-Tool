const path = require('path');
const fs = require('fs');
const port = 4500;
const readline = require('readline');
const express = require('express');
const app = express();

let folderpath = '';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Please enter folder path: ', (answer) => {
    folderpath = answer;
    if (!fs.existsSync(folderpath)) {
        console.log('File not exists');
        rl.close();
        return;
    }
    fs.readdirSync(folderpath).forEach((file) => {
        switch (path.extname(file)) {
            case '.pdf':
            case '.doc':
            case '.docx':
            case '.txt':
                mkdirAndMove(folderpath, 'docs', file);
                logOperation(file, 'docs');
                break;

            case '.jpg':
            case '.jpeg':
            case '.png':
            case '.gif':
                mkdirAndMove(folderpath, 'images', file);
                logOperation(file, 'images');
                break;

            default:
                mkdirAndMove(folderpath, 'others', file);
                logOperation(file, 'others');
                break;
        }
    });

    function mkdirAndMove(folderpath, category, file) {
        const categoryPath = path.join(folderpath, category);
        if (!fs.existsSync(categoryPath)) {
            fs.mkdirSync(categoryPath);
        }
        fs.renameSync(path.join(folderpath, file), path.join(categoryPath, file));
    }

    function logOperation(fileName, category) {
        const logMessage = `${new Date().toISOString()} - Moved ${fileName} to ${category}\n`;
        fs.appendFileSync('summary.txt', logMessage);
    }

    rl.close();
});

app.listen(port, () => {
    console.log(`requets recived of port ${port} sucessfully`);
});


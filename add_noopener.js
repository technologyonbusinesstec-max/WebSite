const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        if (f === 'node_modules' || f === '.git') return;
        const isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir(__dirname, (filePath) => {
    if (filePath.endsWith('.html') || filePath.endsWith('.js')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        // Add rel="noopener noreferrer" to target="_blank" rel="noopener noreferrer"
        // Regex handles cases where rel might not exist, but we must be careful not to duplicate if it already exists
        const regex = /target="_blank" rel="noopener noreferrer"(?!\s+rel="noopener noreferrer")/g;
        if (regex.test(content)) {
            content = content.replace(/target="_blank" rel="noopener noreferrer"(?:\s+rel="noopener")?/g, 'target="_blank" rel="noopener noreferrer" rel="noopener noreferrer"');
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Modified target=_blank in:', filePath);
        }
    }
});

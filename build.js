const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

const jsFiles = [
    'main/script.js',
    'main/lang.js',
    'speakers/script.js',
    'programa/script.js',
    'programa/storytelling.js',
    'coordinacion/app.js',
    'galeria/index.js' // just in case
];

async function minifyFiles() {
    for (const file of jsFiles) {
        const fullPath = path.join(__dirname, file);
        if (fs.existsSync(fullPath)) {
            const code = fs.readFileSync(fullPath, 'utf8');
            const result = await minify(code);
            if (result.code) {
                fs.writeFileSync(fullPath, result.code);
                console.log(`Minified ${file}`);
            }
        }
    }
}

minifyFiles();

const fs = require('fs');
const path = require('path');

function fixFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory() && file !== 'node_modules' && file !== '.expo' && file !== '.git') {
            fixFiles(fullPath);
        } else if (fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;
            
            // Replace literal ` with `
            if (content.includes('\`')) {
                content = content.replace(/\`/g, '`');
                modified = true;
            }
            // Replace literal $ with $
            if (content.includes('\$')) {
                content = content.replace(/\\$/g, '$');
                modified = true;
            }
            
            if (modified) {
                fs.writeFileSync(fullPath, content);
                console.log('Fixed', fullPath);
            }
        }
    }
}

fixFiles('.');

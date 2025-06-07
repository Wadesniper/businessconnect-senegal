const fs = require('fs-extra');
fs.copySync('src/generated', 'dist/generated');
console.log('Copied src/generated to dist/generated'); 
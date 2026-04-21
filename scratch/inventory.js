const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('dist') && !file.includes('features')) {
        results = results.concat(walk(file));
      }
    } else {
      if (file.endsWith('.js') && !file.endsWith('eslint.config.js')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./server');
const inventory = files.map(f => {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n').length;
  // match requires like require('express') or require('../utils/handleError')
  const requireRegex = /require\(['"](.*?)['"]\)/g;
  let match;
  const requires = [];
  while ((match = requireRegex.exec(content)) !== null) {
    requires.push(match[1]);
  }
  return { file: f.replace(/\\/g, '/').replace('server/', './'), lines, requires };
});

console.log(JSON.stringify(inventory, null, 2));

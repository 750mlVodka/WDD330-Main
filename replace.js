const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (fullPath.includes('partials')) continue;
      processDir(fullPath);
    } else if (fullPath.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace header
      const headerRegex = /<header class="divider">[\s\S]*?<\/header>/;
      content = content.replace(headerRegex, '<header id="main-header"></header>');
      
      // Replace footer
      const footerRegex = /<footer>[\s\S]*?<\/footer>/;
      content = content.replace(footerRegex, '<footer id="main-footer"></footer>');
      
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log('Updated ' + fullPath);
    }
  }
}

processDir(path.join(__dirname, 'src'));

const fs = require('fs');
const path = require('path');

const walkSync = function(dir, filelist) {
  files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist') {
        filelist = walkSync(path.join(dir, file), filelist);
      }
    }
    else {
      if (file.endsWith('.css') || file.endsWith('.jsx')) {
        filelist.push(path.join(dir, file));
      }
    }
  });
  return filelist;
};

const cssFiles = walkSync(path.join(__dirname, 'src'));

cssFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  if (file.endsWith('.css')) {
    content = content.replace(/#0090f0/gi, 'var(--main-color)');
    content = content.replace(/#f3f3f3/gi, 'var(--bg_color)');
    content = content.replace(/#ffffff/gi, 'var(--white_color)');
    content = content.replace(/#fff\b/gi, 'var(--white_color)');
    content = content.replace(/#333333/gi, 'var(--color_heading)');
    content = content.replace(/#333\b/gi, 'var(--color_heading)');
    content = content.replace(/#253237/gi, 'var(--color_heading)');
    
    // In index.css, we MUST NOT replace the :root and body.dark variables declarations themselves
    // Let's just fix index.css manually if it gets messed up, or we can just skip index.css root vars.
    // Actually, skipping index.css is safer, we already did it manually.
    if (file.endsWith('index.css')) {
        return; // skip index.css because it defines the variables
    }
    
    // Let's skip header.css if we already did it, but it's safe to replace there too.
  } else if (file.endsWith('.jsx')) {
     // For JSX, replace tailwind classes or style colors if any
     // specifically bg-[#0090f0] -> bg-[var(--main-color)]
     // bg-[#f3f3f3] -> bg-[var(--bg_color)]
     // bg-white -> bg-[var(--white_color)]
     // text-[#0090f0] -> text-[var(--main-color)]
     // Actually, replacing exact strings is safe:
     content = content.replace(/bg-\[#0090f0\]/g, 'bg-[var(--main-color)]');
     content = content.replace(/bg-\[#f3f3f3\]/g, 'bg-[var(--bg_color)]');
     content = content.replace(/text-\[#0090f0\]/g, 'text-[var(--main-color)]');
  }

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
  }
});

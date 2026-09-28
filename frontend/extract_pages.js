import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

const screens = {
  'ApprenantPlanning': 'db6e1f52d3f34a2baf80fd4e62733107.html',
  'ApprenantEvaluations': '94374ecf963140cbbc4a4e03de7b759e.html',
  'ApprenantPaiements': '6c8f019bb8884d5cbd5a8cd3694d2b68.html',
  'ApprenantFormations': '44108317cc1945469b9c6a2ae1ae2887.html',
  'ApprenantDocuments': '7b18377ba6bd43a6a433350771501dd3.html',
};

const inputDir = path.join(process.cwd(), '.stitch', 'designs');
const outputDir = path.join(process.cwd(), 'src', 'features', 'formation', 'pages');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function htmlToJsx(html) {
  return html
    .replace(/class=/g, 'className=')
    .replace(/for=/g, 'htmlFor=')
    .replace(/<!--(.*?)-->/g, '{/* $1 */}')
    .replace(/<img([^>]+)>/g, (match, p1) => {
      // Ensure img tags are self-closing
      if (p1.endsWith('/')) return match;
      return `<img${p1} />`;
    })
    .replace(/<input([^>]+)>/g, (match, p1) => {
      if (p1.endsWith('/')) return match;
      return `<input${p1} />`;
    })
    .replace(/<hr([^>]+)>/g, (match, p1) => {
      if (p1.endsWith('/')) return match;
      return `<hr${p1} />`;
    })
    .replace(/<br>/g, '<br />');
}

for (const [componentName, fileName] of Object.entries(screens)) {
  const filePath = path.join(inputDir, fileName);
  if (fs.existsSync(filePath)) {
    const html = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(html);
    
    // Stitch generally places the content in <main>
    const mainHtml = $('main').html() || '';
    
    if (mainHtml) {
      const jsxContent = htmlToJsx(mainHtml);
      const reactCode = `import React from 'react';\n\nexport const ${componentName} = () => {\n  return (\n    <div className="flex-1 pb-10">\n      ${jsxContent}\n    </div>\n  );\n};\n\nexport default ${componentName};\n`;
      
      fs.writeFileSync(path.join(outputDir, `${componentName}.jsx`), reactCode, 'utf8');
      console.log(`Created ${componentName}.jsx`);
    } else {
      console.log(`Could not find <main> in ${fileName}`);
    }
  } else {
    console.log(`File not found: ${filePath}`);
  }
}

const fs = require('fs');
const html = fs.readFileSync('.stitch/designs/97f3ce08d79042d799ed3e0620ca7d59.html', 'utf8');
const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
if (mainMatch) {
  let inner = mainMatch[1];
  inner = inner.replace(/class=/g, 'className=');
  inner = inner.replace(/<img([^>]*)>/g, '<img$1 />');
  inner = inner.replace(/<input([^>]*)>/g, '<input$1 />');
  inner = inner.replace(/<br>/g, '<br />');
  inner = inner.replace(/<hr>/g, '<hr />');
  inner = inner.replace(/style="([^"]+)"/g, (match, p1) => {
    // Basic style object conversion for width: 98.8%
    if (p1.includes('width:')) {
      return `style={{ width: "${p1.split(':')[1].trim()}" }}`;
    }
    return `style={{ "${p1}": "1" }}`; // fallback
  });
  inner = inner.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');
  
  const comp = `import React from 'react';

const InfrastructureManager = () => {
  return (
    <div className="w-full">
      ${inner}
    </div>
  );
};

export default InfrastructureManager;
`;

  fs.writeFileSync('src/features/collaborateur/pages/InfrastructureManager.jsx', comp);
  console.log('Saved to src/features/collaborateur/pages/InfrastructureManager.jsx');
} else {
  console.log('No main tag found');
}

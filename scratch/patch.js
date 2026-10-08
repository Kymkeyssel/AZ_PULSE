
const fs = require('fs');
let content = fs.readFileSync('frontend/src/features/collaborateur/pages/InfrastructureManager.jsx', 'utf8');

const aside = fs.readFileSync('scratch/extracted-sidebar.jsx', 'utf8').trim();
const header = fs.readFileSync('scratch/extracted-header.jsx', 'utf8').trim();

content = content.replace(
  '<div className=\"w-full\">\n      <div className=\"flex flex-col w-full gap-space-lg\">',
  '<div className=\"bg-surface font-body-md text-on-surface antialiased flex\">\n' +
  aside + '\n' +
  '<div className=\"pl-72 flex flex-col min-h-screen w-full\">\n' +
  header + '\n' +
  '<main className=\"w-full pt-16 bg-surface px-space-lg py-space-lg flex-1\">\n' +
  '<div className=\"flex flex-col w-full gap-space-lg\">'
);

content = content.replace(
  '<div className={\ixed inset-0 bg-primary/40 backdrop-blur-sm z-40 transition-opacity \\} onClick={() => setSelected(null)}></div>\n</div>\n</div>',
  '<div className={\ixed inset-0 bg-primary/40 backdrop-blur-sm z-40 transition-opacity \\} onClick={() => setSelected(null)}></div>\n</div>\n</main>\n</div>\n</div>'
);

fs.writeFileSync('frontend/src/features/collaborateur/pages/InfrastructureManager.jsx', content);
console.log('Modified InfrastructureManager.jsx');


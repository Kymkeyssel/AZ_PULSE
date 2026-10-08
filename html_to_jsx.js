const fs = require('fs');

const file = process.argv[2];
let html = fs.readFileSync(file, 'utf8');

// Extraire l'intérieur de <main ...> ... </main>
const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
if (!mainMatch) {
  console.log("No main found");
  process.exit(1);
}

let jsx = mainMatch[0];

// Strip script tags
jsx = jsx.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

// html to jsx

jsx = jsx.replace(/class=/g, 'className=');
jsx = jsx.replace(/for=/g, 'htmlFor=');
jsx = jsx.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');
jsx = jsx.replace(/<img([^>]+[^\/])>/g, '<img$1 />');
jsx = jsx.replace(/<input([^>]+[^\/])>/g, '<input$1 />');
jsx = jsx.replace(/<br([^>]+[^\/])>/g, '<br$1 />');
jsx = jsx.replace(/<hr([^>]+[^\/])>/g, '<hr$1 />');
jsx = jsx.replace(/style="([^"]*)"/g, (match, p1) => {
  // Very basic style to object (not perfect but mostly works for simple inline styles)
  const styles = p1.split(';').filter(s => s.trim());
  const obj = styles.map(s => {
    const [k, v] = s.split(':');
    if (!k || !v) return '';
    const camelK = k.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
    return `${camelK}: '${v.trim()}'`;
  }).filter(Boolean).join(', ');
  return `style={{ ${obj} }}`;
});

// Replace "°" or weird chars if needed (the downloaded file had encoding issues in PS log, but raw might be fine)

fs.writeFileSync(file + '.jsx', jsx);
console.log("Written to " + file + ".jsx");

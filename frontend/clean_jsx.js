import fs from 'fs';
import path from 'path';

const pagesDir = path.join(process.cwd(), 'src', 'features', 'formation', 'pages');
const pages = [
  'ApprenantPlanning.jsx',
  'ApprenantEvaluations.jsx',
  'ApprenantPaiements.jsx',
  'ApprenantFormations.jsx',
  'ApprenantDocuments.jsx'
];

for (const page of pages) {
  const filePath = path.join(pagesDir, page);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove <script>...</script>
    content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // Also style tags shouldn't contain bare CSS inside JSX without dangerouslySetInnerHTML
    content = content.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Cleaned ${page}`);
  }
}

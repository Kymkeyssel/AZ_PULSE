import fs from 'fs';
import https from 'https';
import path from 'path';

const dataPath = 'C:/Users/Keyssel YMELE/.gemini/antigravity-ide/brain/bdb2ca58-8f67-48ba-9994-0d128f7360aa/.system_generated/steps/381/output.txt';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const targetScreens = [
  'db6e1f52d3f34a2baf80fd4e62733107', // Planning
  '94374ecf963140cbbc4a4e03de7b759e', // Evaluations
  '6c8f019bb8884d5cbd5a8cd3694d2b68', // Paiements
  '44108317cc1945469b9c6a2ae1ae2887', // Formations
  '7b18377ba6bd43a6a433350771501dd3', // Documents
];

const outDir = path.join(process.cwd(), '.stitch', 'designs');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 302 || response.statusCode === 301) {
        https.get(response.headers.location, (res2) => {
          res2.pipe(file);
          file.on('finish', () => { file.close(); resolve(); });
        });
      } else {
        response.pipe(file);
        file.on('finish', () => { file.close(); resolve(); });
      }
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  for (const s of data.screens) {
    const screenId = s.name.split('/').pop();
    if (targetScreens.includes(screenId) && s.htmlCode && s.htmlCode.downloadUrl) {
      console.log(`Downloading ${s.title}...`);
      await download(s.htmlCode.downloadUrl, path.join(outDir, `${screenId}.html`));
      console.log(`Saved ${screenId}.html`);
    }
  }
}

run().catch(console.error);

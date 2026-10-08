#!/usr/bin/env node
/**
 * Converts a Postman v2.1 JSON collection to Postman v3 YAML collection format.
 */

const fs = require('fs');
const path = require('path');

// ─── Configuration ────────────────────────────────────────────────────────────
const SOURCE_FILE = 'H:\\PROJETS\\VS_Projects\\L3_LICENCE_ING\\AZ_PULSE\\postman\\AZPULSE.postman_collection.json';
const TARGET_DIR  = 'H:\\PROJETS\\VS_Projects\\L3_LICENCE_ING\\AZ_PULSE\\postman\\postman\\collections\\AZ PULSE — Tests de recette API';

// ─── YAML helpers ─────────────────────────────────────────────────────────────

/** Characters that require single-quoting a scalar value */
const NEEDS_QUOTE_RE = /[:{}&*!\[\]#,|>?@`"'\\]|^\s|\s$|^(true|false|null|~|\d.*)$/;

function needsQuote(str) {
  if (typeof str !== 'string') return false;
  if (str === '') return true;
  return NEEDS_QUOTE_RE.test(str) || str.includes('{{') || str.includes('}}');
}

function singleQuote(str) {
  // Escape single quotes inside by doubling them
  return "'" + str.replace(/'/g, "''") + "'";
}

function yamlScalar(str) {
  if (str === null || str === undefined) return 'null';
  if (typeof str !== 'string') return String(str);
  if (needsQuote(str)) return singleQuote(str);
  return str;
}

/** Block scalar (literal, strip trailing newlines) */
function blockScalar(str, indent = 2) {
  const pad = ' '.repeat(indent);
  const lines = str.split('\n');
  return '|-\n' + lines.map(l => pad + l).join('\n');
}

function isMultiline(str) {
  return typeof str === 'string' && str.includes('\n');
}

function yamlValue(str, indent = 2) {
  if (str === null || str === undefined) return 'null';
  if (typeof str !== 'string') return String(str);
  if (isMultiline(str)) return blockScalar(str, indent);
  return yamlScalar(str);
}

// ─── Filename sanitisation ────────────────────────────────────────────────────

function sanitizeFilename(name) {
  return name.replace(/[\/\\:*?"<>|]/g, '-').trim();
}

// ─── Auth mapping ─────────────────────────────────────────────────────────────

function mapAuth(auth) {
  if (!auth || auth.type === 'noauth') return null;

  const type = auth.type;
  const raw  = auth[type] || [];

  // raw can be array of {key,value} or object
  function getVal(key) {
    if (Array.isArray(raw)) {
      const found = raw.find(e => e.key === key);
      return found ? found.value : undefined;
    }
    return raw[key];
  }

  switch (type) {
    case 'bearer':
      return { type: 'bearer', credentials: [{ key: 'token', value: getVal('token') || '' }] };
    case 'basic':
      return { type: 'basic', credentials: [
        { key: 'username', value: getVal('username') || '' },
        { key: 'password', value: getVal('password') || '' }
      ]};
    case 'apikey':
      return { type: 'apikey', credentials: [
        { key: 'key',   value: getVal('key')   || '' },
        { key: 'value', value: getVal('value') || '' },
        { key: 'in',    value: getVal('in')    || 'header' }
      ]};
    case 'oauth2':
      return { type: 'oauth2', credentials: [
        { key: 'accessToken', value: getVal('accessToken') || '' }
      ]};
    default:
      return { type, credentials: [] };
  }
}

function renderAuth(auth, indent = 0) {
  if (!auth) return '';
  const pad = ' '.repeat(indent);
  let out = `${pad}auth:\n${pad}  type: ${auth.type}\n`;
  if (auth.credentials && auth.credentials.length > 0) {
    out += `${pad}  credentials:\n`;
    for (const c of auth.credentials) {
      out += `${pad}    - key: ${yamlScalar(c.key)}\n`;
      out += `${pad}      value: ${yamlValue(String(c.value ?? ''), indent + 6)}\n`;
    }
  }
  return out;
}

// ─── Body rendering ───────────────────────────────────────────────────────────

function renderBody(body) {
  if (!body || !body.mode) return '';
  const mode = body.mode;

  if (mode === 'raw') {
    const lang = (body.options && body.options.raw && body.options.raw.language)
      ? body.options.raw.language.toLowerCase()
      : 'json';
    const content = body.raw || '';
    let out = `body:\n  type: ${lang}\n  content: `;
    if (isMultiline(content)) {
      out += blockScalar(content, 4) + '\n';
    } else {
      out += yamlScalar(content) + '\n';
    }
    return out;
  }

  if (mode === 'formdata') {
    const items = body.formdata || [];
    let out = 'body:\n  type: formdata\n  content:\n';
    for (const item of items) {
      out += `    - key: ${yamlScalar(item.key)}\n`;
      if (item.type === 'file') {
        out += `      type: file\n`;
        out += `      src: ${yamlScalar(item.src || '')}\n`;
      } else {
        out += `      type: text\n`;
        out += `      value: ${yamlValue(String(item.value ?? ''), 8)}\n`;
      }
      if (item.description) {
        out += `      description: ${yamlValue(item.description, 8)}\n`;
      }
      if (item.disabled) {
        out += `      disabled: true\n`;
      }
    }
    return out;
  }

  if (mode === 'urlencoded') {
    const items = body.urlencoded || [];
    let out = 'body:\n  type: urlencoded\n  content:\n';
    for (const item of items) {
      out += `    - key: ${yamlScalar(item.key)}\n`;
      out += `      value: ${yamlValue(String(item.value ?? ''), 8)}\n`;
      if (item.description) {
        out += `      description: ${yamlValue(item.description, 8)}\n`;
      }
      if (item.disabled) {
        out += `      disabled: true\n`;
      }
    }
    return out;
  }

  if (mode === 'file') {
    return `body:\n  type: file\n  src: ${yamlScalar(body.file && body.file.src || '')}\n`;
  }

  if (mode === 'graphql') {
    const q = (body.graphql && body.graphql.query) || '';
    const v = (body.graphql && body.graphql.variables) || '';
    let out = 'body:\n  type: graphql\n';
    out += `  query: ${yamlValue(q, 4)}\n`;
    if (v) out += `  variables: ${yamlValue(v, 4)}\n`;
    return out;
  }

  return '';
}

// ─── URL rendering ────────────────────────────────────────────────────────────

function buildUrl(urlObj) {
  if (!urlObj) return '';
  if (typeof urlObj === 'string') return urlObj;

  // Reconstruct from parts
  const protocol = (urlObj.protocol || 'http');
  const host     = Array.isArray(urlObj.host) ? urlObj.host.join('.') : (urlObj.host || '');
  const portPart = urlObj.port ? `:${urlObj.port}` : '';
  const pathParts = Array.isArray(urlObj.path) ? urlObj.path : [];
  const pathStr  = pathParts.length ? '/' + pathParts.join('/') : '';

  let url = `${protocol}://${host}${portPart}${pathStr}`;

  // Query params already handled separately via queryParams field
  return url;
}

// ─── Request rendering ────────────────────────────────────────────────────────

function renderRequest(item, order) {
  const req     = item.request;
  const name    = item.name || 'Unnamed';
  const method  = (req.method || 'GET').toUpperCase();

  // URL
  let url = '';
  if (req.url) {
    if (typeof req.url === 'string') {
      url = req.url;
    } else {
      url = req.url.raw || buildUrl(req.url);
    }
  }

  // Query params (from url.query)
  let queryParams = [];
  if (req.url && typeof req.url === 'object' && Array.isArray(req.url.query)) {
    queryParams = req.url.query;
  }

  // Path variables
  let pathVariables = [];
  if (req.url && typeof req.url === 'object' && Array.isArray(req.url.variable)) {
    pathVariables = req.url.variable;
  }

  // Headers
  const headers = req.header || [];

  // Auth
  const auth = req.auth ? mapAuth(req.auth) : null;

  // Body
  const body = req.body || null;

  // Scripts
  const preScript  = (item.event || []).find(e => e.listen === 'prerequest');
  const testScript = (item.event || []).find(e => e.listen === 'test');

  const preCode  = preScript  && preScript.script  && preScript.script.exec
    ? (Array.isArray(preScript.script.exec)  ? preScript.script.exec.join('\n')  : preScript.script.exec)
    : '';
  const testCode = testScript && testScript.script && testScript.script.exec
    ? (Array.isArray(testScript.script.exec) ? testScript.script.exec.join('\n') : testScript.script.exec)
    : '';

  // Build YAML
  let yaml = `$kind: http-request\n`;
  yaml += `name: ${yamlScalar(name)}\n`;
  yaml += `order: ${order}\n`;
  yaml += `method: ${method}\n`;
  yaml += `url: ${yamlScalar(url)}\n`;

  // Headers
  const filteredHeaders = headers.filter(h => h.key && !h.disabled);
  if (filteredHeaders.length > 0) {
    yaml += `headers:\n`;
    for (const h of filteredHeaders) {
      yaml += `  - key: ${yamlScalar(h.key)}\n`;
      yaml += `    value: ${yamlValue(String(h.value ?? ''), 4)}\n`;
      if (h.description) yaml += `    description: ${yamlValue(h.description, 4)}\n`;
    }
  }

  // Query params
  const filteredQP = queryParams.filter(p => p.key);
  if (filteredQP.length > 0) {
    yaml += `queryParams:\n`;
    for (const p of filteredQP) {
      yaml += `  - key: ${yamlScalar(p.key)}\n`;
      yaml += `    value: ${yamlValue(String(p.value ?? ''), 4)}\n`;
      if (p.description) yaml += `    description: ${yamlValue(p.description, 4)}\n`;
      if (p.disabled)    yaml += `    disabled: true\n`;
    }
  }

  // Path variables
  const filteredPV = pathVariables.filter(v => v.key);
  if (filteredPV.length > 0) {
    yaml += `pathVariables:\n`;
    for (const v of filteredPV) {
      yaml += `  - key: ${yamlScalar(v.key)}\n`;
      yaml += `    value: ${yamlValue(String(v.value ?? ''), 4)}\n`;
    }
  }

  // Body
  if (body && body.mode && body.mode !== 'none') {
    yaml += renderBody(body);
  }

  // Auth
  if (auth) {
    yaml += renderAuth(auth);
  }

  // Scripts
  const scripts = [];
  if (preCode.trim())  scripts.push({ type: 'beforeRequest', code: preCode });
  if (testCode.trim()) scripts.push({ type: 'afterResponse',  code: testCode });

  if (scripts.length > 0) {
    yaml += `scripts:\n`;
    for (const s of scripts) {
      yaml += `  - type: ${s.type}\n`;
      yaml += `    language: text/javascript\n`;
      yaml += `    code: ${blockScalar(s.code, 6)}\n`;
    }
  }

  return yaml;
}

// ─── Folder / collection definition rendering ─────────────────────────────────

function renderFolderDef(name) {
  return `$kind: collection\nname: ${yamlScalar(name)}\n`;
}

// ─── Recursive walker ─────────────────────────────────────────────────────────

function walk(items, dir, depth) {
  let order = 1000;

  for (const item of items) {
    const isFolder = Array.isArray(item.item);

    if (isFolder) {
      const folderName     = item.name || 'Unnamed Folder';
      const sanitized      = sanitizeFilename(folderName);
      const folderDir      = path.join(dir, sanitized);
      const resourcesDir   = path.join(folderDir, '.resources');

      fs.mkdirSync(folderDir,    { recursive: true });
      fs.mkdirSync(resourcesDir, { recursive: true });

      // Write definition.yaml
      const defYaml = renderFolderDef(folderName);
      fs.writeFileSync(path.join(resourcesDir, 'definition.yaml'), defYaml, 'utf8');

      // Recurse
      walk(item.item, folderDir, depth + 1);

    } else if (item.request) {
      const reqName   = item.name || 'Unnamed';
      const sanitized = sanitizeFilename(reqName);
      const filename  = sanitized + '.request.yaml';
      const filepath  = path.join(dir, filename);

      const yaml = renderRequest(item, order);
      fs.writeFileSync(filepath, yaml, 'utf8');
      order += 1000;
    }
  }
}

// ─── Collection-level YAML ────────────────────────────────────────────────────

const COLLECTION_YAML = `$kind: collection
name: 'AZ PULSE — Tests de recette API'
auth:
  type: bearer
  credentials:
    - key: token
      value: '{{token}}'
variables:
  - key: baseUrl
    value: 'http://localhost:8000/api'
  - key: suffix
    value: PM01
  - key: token
    value: ''
scripts:
  - type: beforeRequest
    language: text/javascript
    code: |-
      // Horodatage : apparaît dans le nom des entités créées.
      if (!pm.collectionVariables.get('suffix') || pm.collectionVariables.get('suffix') === 'PM01') {
        pm.collectionVariables.set('suffix', 'PM' + String(Date.now()).slice(-5));
      }
`;

// ─── Main ─────────────────────────────────────────────────────────────────────

console.log('Reading source collection…');
// Strip BOM if present (UTF-8 BOM = EF BB BF)
let raw = fs.readFileSync(SOURCE_FILE, 'utf8');
if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
const collection = JSON.parse(raw);

console.log('Creating target directory…');
fs.mkdirSync(TARGET_DIR, { recursive: true });

// Write collection.yaml (definition at root)
const resourcesRoot = path.join(TARGET_DIR, '.resources');
fs.mkdirSync(resourcesRoot, { recursive: true });
fs.writeFileSync(path.join(resourcesRoot, 'definition.yaml'), COLLECTION_YAML, 'utf8');

console.log('Walking items…');
walk(collection.item || [], TARGET_DIR, 0);

console.log('Done! Collection written to:', TARGET_DIR);

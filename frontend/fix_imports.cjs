const fs = require('fs');
const path = require('path');
function processDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      let changed = false;
      if (/import (?:React, )?\{.*\} from 'react';/g.test(content) || /import React from 'react';/g.test(content) || /import \{\} from 'react';/g.test(content)) {
        const hooks = ['useState', 'useEffect', 'useCallback', 'useMemo', 'useRef', 'useContext', 'useReducer', 'useLayoutEffect', 'Fragment', 'Suspense', 'lazy', 'memo'];
        const usedHooks = hooks.filter(hook => new RegExp('\\b' + hook + '\\b').test(content) && !new RegExp("import .*\\b" + hook + "\\b.*from 'react'").test(content));
        
        content = content.replace(/^import .* from 'react';\r?\n?/gm, '');
        if (usedHooks.length > 0) {
          content = "import { " + usedHooks.join(', ') + " } from 'react';\n" + content;
        }
        changed = true;
      }
      
      if (changed) {
        fs.writeFileSync(fullPath, content);
      }
    }
  });
}
processDir(path.join(__dirname, 'src'));
console.log('Done');

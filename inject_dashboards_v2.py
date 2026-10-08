import os
import re

mappings = {
    'frontend/src/pages/AdminDashboard.jsx': '.stitch/designs/14038fe81aa04e778f7e59755af78a0c.html.jsx',
    'frontend/src/features/client/pages/ClientDashboard.jsx': '.stitch/designs/b4867c97beb34b3a902ab84f4a8322c5.html.jsx',
    'frontend/src/pages/SuperAdminDashboard.jsx': '.stitch/designs/e2ca3872512e43ee96bdfa3429cf79ac.html.jsx',
    'frontend/src/features/formation/pages/FormateurDashboard.jsx': '.stitch/designs/d95a1a38fefe417cadddc1c8aa1df92f.html.jsx',
    'frontend/src/pages/ParentDashboard.jsx': '.stitch/designs/347a6efa6f92479a8a9234744525a084.html.jsx'
}

def clean_jsx(content):
    # Fix SVG attributes
    content = re.sub(r'stroke-dasharray=', 'strokeDasharray=', content)
    content = re.sub(r'stroke-dashoffset=', 'strokeDashoffset=', content)
    content = re.sub(r'stroke-width=', 'strokeWidth=', content)
    content = re.sub(r'stroke-linecap=', 'strokeLinecap=', content)
    content = re.sub(r'stroke-linejoin=', 'strokeLinejoin=', content)
    content = re.sub(r'fill-rule=', 'fillRule=', content)
    content = re.sub(r'clip-rule=', 'clipRule=', content)
    content = re.sub(r'stop-color=', 'stopColor=', content)
    content = re.sub(r'stop-opacity=', 'stopOpacity=', content)
    
    # Empty tags that must be closed
    content = re.sub(r'<img([^>]*[^/])>', r'<img\1 />', content)
    content = re.sub(r'<input([^>]*[^/])>', r'<input\1 />', content)
    content = re.sub(r'<br>', r'<br />', content)
    content = re.sub(r'<hr>', r'<hr />', content)
    return content

for dest, src in mappings.items():
    if not os.path.exists(src):
        print(f"Skipping {src}, does not exist")
        continue

    with open(src, 'r', encoding='utf-8') as f:
        new_jsx = f.read()
        
    new_jsx = clean_jsx(new_jsx)
    
    # We will completely overwrite the dashboard files with a generic React component
    component_name = os.path.basename(dest).split('.')[0]
    
    # Create the new code
    new_code = f"""import React from 'react';
import {{ useAuth }} from '../../contexts/AuthContext'; // Might be wrong path, we'll fix it if needed

const {component_name} = () => {{
  // const {{ fullName }} = useAuth();
  
  return (
    {new_jsx}
  );
}};

export default {component_name};
"""
    # Fix import path for AuthContext depending on depth
    depth = dest.count('/') - 2 # frontend/src/...
    auth_import_path = '../' * depth + 'contexts/AuthContext'
    new_code = new_code.replace('../../contexts/AuthContext', auth_import_path)

    os.makedirs(os.path.dirname(dest), exist_ok=True)
    with open(dest, 'w', encoding='utf-8') as f:
        f.write(new_code)
    
    print(f"Injected {dest}")

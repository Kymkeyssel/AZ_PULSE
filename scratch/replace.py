import os

rbac_content = open('scratch/rbac_stitch.html.jsx', 'r', encoding='utf-8').read()

# Fix inline JS onclicks to standard React onClick syntax
import re
# Remove onclick="document.getElementById('exportDialog').classList.toggle('hidden')"
rbac_content = re.sub(r'onclick="[^"]+"', 'onClick={() => toast.info("Action non implémentée")}', rbac_content)

new_content = f"""import React, {{ useState }} from 'react';
import {{ Link }} from 'react-router-dom';
import {{ toast }} from 'sonner';

export default function RolesPermissions() {{
  const toggleAuditDrawer = () => {{ toast.info('Analyse IA des rôles lancée...'); }};
  const filterMatrix = () => {{}};
  const toggleHighlightValidations = () => {{}};
  
  return (
    {rbac_content}
  );
}}
"""

open('frontend/src/pages/RolesPermissions.jsx', 'w', encoding='utf-8').write(new_content)

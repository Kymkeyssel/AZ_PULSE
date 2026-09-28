import os
import re

def add_upload_to_file(filepath, import_statement, upload_logic, replace_pairs):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add import if not exists
    if 'import { academyService }' not in content and 'import {academyService}' not in content:
        # Find the last import
        import_match = list(re.finditer(r'^import .*?;$', content, re.MULTILINE))
        if import_match:
            last_import = import_match[-1]
            content = content[:last_import.end()] + '\n' + import_statement + content[last_import.end():]

    # Add upload logic inside the component
    # Find the component declaration
    comp_match = re.search(r'export const \w+ = \([^)]*\) => {', content)
    if comp_match:
        content = content[:comp_match.end()] + '\n' + upload_logic + content[comp_match.end():]

    for old_str, new_str in replace_pairs:
        content = content.replace(old_str, new_str)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {filepath}")


# 1. WelcomeBanner.jsx
wb_path = r"h:\PROJETS\VS_Projects\L3_LICENCE_ING\AZ_PULSE\frontend\src\features\formation\components\dashboard\WelcomeBanner.jsx"
wb_import = "import { academyService } from '../../../../services/api';"
wb_logic = """  const handleUploadClick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.doc,.docx,.zip';
    fileInput.onchange = async (e) => {
      if (e.target.files.length > 0) {
        try {
          await academyService.uploadDocument(e.target.files[0], 'submission');
          alert(`TP "${e.target.files[0].name}" téléversé avec succès !`);
        } catch (err) {
          alert(`Erreur d'upload: ${err.message}`);
        }
      }
    };
    fileInput.click();
  };"""

with open(wb_path, 'r', encoding='utf-8') as f:
    wb_content = f.read()
# Replace the onclick in WelcomeBanner
old_onClick = """onClick={() => {
              const fileInput = document.createElement('input');
              fileInput.type = 'file';
              fileInput.accept = '.pdf,.doc,.docx,.zip';
              fileInput.onchange = e => {
                if (e.target.files.length > 0) alert(`TP "${e.target.files[0].name}" tAclAcversAc avec succA"s !`);
              };
              fileInput.click();
            }}"""
add_upload_to_file(wb_path, wb_import, wb_logic, [(old_onClick, "onClick={handleUploadClick}")])

# 2. UpcomingDeadlineCard.jsx
uc_path = r"h:\PROJETS\VS_Projects\L3_LICENCE_ING\AZ_PULSE\frontend\src\features\formation\components\dashboard\UpcomingDeadlineCard.jsx"
uc_import = "import { academyService } from '../../../../services/api';"
uc_logic = """  const handleUploadClick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.doc,.docx,.zip';
    fileInput.onchange = async (e) => {
      if (e.target.files.length > 0) {
        try {
          await academyService.uploadDocument(e.target.files[0], 'submission');
          alert(`Document "${e.target.files[0].name}" déposé avec succès !`);
        } catch (err) {
          alert(`Erreur d'upload: ${err.message}`);
        }
      }
    };
    fileInput.click();
  };"""
add_upload_to_file(uc_path, uc_import, uc_logic, [("onClick={() => alert('Déposer un devoir')}", "onClick={handleUploadClick}")])

# 3. ApprenantPlanning.jsx
pl_path = r"h:\PROJETS\VS_Projects\L3_LICENCE_ING\AZ_PULSE\frontend\src\features\formation\pages\ApprenantPlanning.jsx"
pl_import = "import { academyService } from '../../../services/api';"
pl_logic = """  const handleUploadClick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.doc,.docx,.zip';
    fileInput.onchange = async (e) => {
      if (e.target.files.length > 0) {
        try {
          await academyService.uploadDocument(e.target.files[0], 'submission');
          alert(`TP déposé avec succès !`);
        } catch (err) {
          alert(`Erreur d'upload: ${err.message}`);
        }
      }
    };
    fileInput.click();
  };"""
add_upload_to_file(pl_path, pl_import, pl_logic, [("onClick={() => alert('Déposer un TP')}", "onClick={handleUploadClick}")])

# 4. ApprenantFormations.jsx
fm_path = r"h:\PROJETS\VS_Projects\L3_LICENCE_ING\AZ_PULSE\frontend\src\features\formation\pages\ApprenantFormations.jsx"
fm_import = "import { academyService } from '../../../services/api';"
fm_logic = """  const handleUploadClick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.doc,.docx,.zip';
    fileInput.onchange = async (e) => {
      if (e.target.files.length > 0) {
        try {
          await academyService.uploadDocument(e.target.files[0], 'submission');
          alert(`TP déposé avec succès !`);
        } catch (err) {
          alert(`Erreur d'upload: ${err.message}`);
        }
      }
    };
    fileInput.click();
  };"""
add_upload_to_file(fm_path, fm_import, fm_logic, [("onClick={() => alert('Déposer TP final')}", "onClick={handleUploadClick}")])


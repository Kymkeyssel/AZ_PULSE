import os
import re

directory = r"h:\PROJETS\VS_Projects\L3_LICENCE_ING\AZ_PULSE\frontend\src\features\formation\pages"

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace oninput="..." with onChange={() => {}} or similar valid syntax
    content = re.sub(r'oninput="([^"]+)"', r'onChange={() => {\1}}', content)
    content = re.sub(r'onclick="([^"]+)"', r'onClick={() => {\1}}', content)
    content = re.sub(r'tabindex=', r'tabIndex=', content)
    content = re.sub(r'maxlength=', r'maxLength=', content)
    
    # Fix the missing this.value in onChange string if present
    content = content.replace("onChange={() => {searchModules(this.value)}}", "onChange={(e) => {alert('Search: ' + e.target.value)}}")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Fixed {filepath}")

for filename in os.listdir(directory):
    if filename.endswith(".jsx"):
        fix_file(os.path.join(directory, filename))

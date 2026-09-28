import os
import re

count = 0
for root, dirs, files in os.walk(r'h:\PROJETS\VS_Projects\L3_LICENCE_ING\AZ_PULSE\frontend\src'):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.js'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Add notranslate to standard classNames
            new_content = re.sub(r'className=([\'\"])material-symbols-outlined', r'className=\g<1>material-symbols-outlined notranslate', content)
            
            # Add notranslate to template literal classNames
            new_content = re.sub(r'className=\{`material-symbols-outlined', r'className={`material-symbols-outlined notranslate', new_content)
            
            # Also handle cases where it's part of a larger string
            new_content = re.sub(r'material-symbols-outlined(?! notranslate)', r'material-symbols-outlined notranslate', new_content)
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                count += 1

print(f'Updated {count} files.')

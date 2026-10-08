import re

knowledge_jsx_path = 'frontend/src/features/collaborateur/pages/KnowledgeHub.jsx'
stitch_jsx_path = '.stitch/designs/c2702603fabf496fa7624aa7f02f71f3.html.jsx'

with open(knowledge_jsx_path, 'r', encoding='utf-8') as f:
    knowledge_jsx = f.read()

with open(stitch_jsx_path, 'r', encoding='utf-8') as f:
    new_jsx = f.read()

parts = knowledge_jsx.split('return (')
header = parts[0]

new_code = header + 'return (\n' + new_jsx + '\n);\n};\n\nexport default KnowledgeHub;\n'

with open(knowledge_jsx_path, 'w', encoding='utf-8') as f:
    f.write(new_code)
print('Injected KnowledgeHub.')

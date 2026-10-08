import os

mappings = {
    'frontend/src/pages/AdminDashboard.jsx': '.stitch/designs/14038fe81aa04e778f7e59755af78a0c.html.jsx',
    'frontend/src/features/client/pages/ClientDashboard.jsx': '.stitch/designs/b4867c97beb34b3a902ab84f4a8322c5.html.jsx',
    'frontend/src/pages/SuperAdminDashboard.jsx': '.stitch/designs/e2ca3872512e43ee96bdfa3429cf79ac.html.jsx',
    'frontend/src/features/formation/pages/FormateurDashboard.jsx': '.stitch/designs/d95a1a38fefe417cadddc1c8aa1df92f.html.jsx'
}

for dest, src in mappings.items():
    if not os.path.exists(dest):
        print(f"Skipping {dest}, does not exist")
        continue

    with open(src, 'r', encoding='utf-8') as f:
        new_jsx = f.read()
    
    with open(dest, 'r', encoding='utf-8') as f:
        original = f.read()
    
    # We want to replace the FIRST `return (` ... `);` inside the component
    # Actually, the safest way is just to rewrite the header like I did for KnowledgeHub.
    # But each dashboard has different imports and auth checks.
    
    # Let's do a smart replace: find the last `return (` and the last `);`
    idx_return = original.rfind('return (')
    if idx_return == -1:
        print(f"Error: Could not find return in {dest}")
        continue
        
    header = original[:idx_return]
    
    # Check if there is an export default at the end
    idx_export = original.rfind('export default')
    footer = ''
    if idx_export != -1:
        # We find the `};` before `export default`
        idx_brace = original.rfind('};', 0, idx_export)
        if idx_brace != -1:
            footer = '\n  );\n' + original[idx_brace:]
        else:
            footer = '\n  );\n};\n\n' + original[idx_export:]
    else:
        footer = '\n  );\n};\n'
        
    new_code = header + 'return (\n' + new_jsx + footer
    
    with open(dest, 'w', encoding='utf-8') as f:
        f.write(new_code)
    
    print(f"Injected {dest}")


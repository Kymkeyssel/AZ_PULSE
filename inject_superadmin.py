import re

with open('frontend/src/pages/SuperAdminDashboard.jsx', 'r', encoding='utf-8') as f:
    old_content = f.read()

# Extract the header part (imports, component definition, useEffect)
header_match = re.search(r'(import [\s\S]*?const closeModal = \(\) => setModalOpen\(false\);)', old_content)
if not header_match:
    print("Could not find header")
    exit(1)

header = header_match.group(1)

with open('.stitch/designs/e2ca3872512e43ee96bdfa3429cf79ac.html.jsx', 'r', encoding='utf-8') as f:
    jsx = f.read()

# Make the JSX dynamic

# 1. Hero Name
jsx = jsx.replace('Bonjour, Administrateur Système', 'Bonjour, {fullName ?? "Administrateur Système"}')

# 2. KPI 1: Active Users
jsx = re.sub(r'(>Utilisateurs<[\s\S]*?<div className="text-2xl[^>]*>)1 248(</div>)', r'\1{n(stats?.users)}\2', jsx)

# 3. KPI 3: Requests
jsx = re.sub(r'(>Accès &amp; Privilèges<[\s\S]*?<div className="text-2xl[^>]*>)\s*17\s*(<span)', r'\1\n{pendingRequests === null ? "—" : pendingRequests.length}\n\2', jsx)

# 4. Clients
jsx = re.sub(r'(>Clients CRM<[\s\S]*?<div className="text-2xl[^>]*>)126(</div>)', r'\1{n(stats?.customers)}\2', jsx) # Wait, is it 126 in the mock? The mock has Sessions PAM (126). Let's let the previous python handle exact matches.

# Convert triggerQuickAction to openModal
jsx = jsx.replace('onclick="triggerQuickAction(\'new-user\')"', 'onClick={() => openModal(\'new-user\')}')
jsx = jsx.replace('onclick="triggerQuickAction(\'rbac\')"', 'onClick={() => openModal(\'rbac\')}')
jsx = jsx.replace('onclick="triggerQuickAction(\'new-admin\')"', 'onClick={() => openModal(\'new-admin\')}')

# Convert alert()
jsx = jsx.replace('onclick="alert(\'Audit prédictif exécuté : PostgreSQL à 28% de charge, cache Redis optimal (hit ratio 94.2%), stockage S3 WORM préservé.\')"', 'onClick={() => toast.info(\'Audit prédictif exécuté : PostgreSQL à 28% de charge, cache Redis optimal (hit ratio 94.2%), stockage S3 WORM préservé.\')}')
jsx = jsx.replace('onclick="alert(\'Génération en cours du Rapport d\\\'Intégrité IA en direct (SHA-256 scellé)...\')"', 'onClick={() => toast.info(\'Génération en cours du Rapport d\\\'Intégrité IA en direct (SHA-256 scellé)...\')}')
# The python replaces above won't catch everything if the quotes are different, but we'll use a regex for onclick.
jsx = re.sub(r'onclick="([^"]+)"', r'onClick={() => {\1}}', jsx)

# Fix class= to className= again just in case
jsx = jsx.replace('class=', 'className=')

# Combine
final_code = header + f"\n\n  return (\n    <>\n{jsx}\n\n      {{/* Modal logic */}}\n      {{modalOpen && (\n        <div className=\"fixed inset-0 z-[100] flex items-center justify-center\">\n          <div className=\"absolute inset-0 bg-black/60 backdrop-blur-sm\" onClick={{closeModal}}></div>\n          <div className=\"relative w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden flex flex-col\">\n            <div className=\"flex items-center justify-between p-4 border-b border-surface-container\">\n              <div className=\"flex items-center gap-2\">\n                <span className=\"material-symbols-outlined text-secondary\">{{modalData.icon}}</span>\n                <h3 className=\"font-bold text-on-surface\">{{modalData.title}}</h3>\n              </div>\n              <button onClick={{closeModal}} className=\"p-1 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors\">\n                <span className=\"material-symbols-outlined\">close</span>\n              </button>\n            </div>\n            <div className=\"p-4\">\n              {{modalData.content}}\n            </div>\n            <div className=\"p-4 bg-surface-container-low/30 border-t border-surface-container flex justify-end gap-2\">\n              <button onClick={{closeModal}} className=\"px-4 py-2 rounded-xl text-on-surface-variant font-bold hover:bg-surface-container-low transition-colors\">Annuler</button>\n              <button className=\"px-4 py-2 rounded-xl bg-secondary hover:bg-secondary-container text-on-secondary font-bold transition-colors\">Valider</button>\n            </div>\n          </div>\n        </div>\n      )}}\n    </>\n  );\n}};\n\nexport default SuperAdminDashboard;\n"

with open('frontend/src/pages/SuperAdminDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(final_code)

print("SuperAdminDashboard.jsx updated!")

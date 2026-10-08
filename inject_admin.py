import re

with open('frontend/src/pages/AdminDashboard.jsx', 'r', encoding='utf-8') as f:
    old_content = f.read()

# Extract the header part (imports, component definition, useEffect)
header_match = re.search(r'(import [\s\S]*?const AdminDashboard = \(\) => \{[\s\S]*?const recentReq = stats\?\.recentRequests \?\? \[\];)', old_content)
if not header_match:
    print("Could not find header")
    exit(1)

header = header_match.group(1)

with open('.stitch/designs/14038fe81aa04e778f7e59755af78a0c.html.jsx', 'r', encoding='utf-8') as f:
    jsx = f.read()

# Make the JSX dynamic

# 1. Hero
jsx = jsx.replace('Bonjour, Dr. Marc V.', 'Bonjour, {fullName ?? "Administrateur"}')

# 2. KPI 1: Active Users
jsx = re.sub(r'(>Utilisateurs actifs<[\s\S]*?<span[^>]*>)248(</span>)', r'\1{stats?.activeUsers ?? "—"}\2', jsx)

# 3. KPI 2: Pending
jsx = re.sub(r'(>Demandes d\'accès<[\s\S]*?<span[^>]*>)12(</span>)', r'\1{req?.pending ?? "—"}\2', jsx)

# 4. KPI 3: Suspended
jsx = re.sub(r'(>Comptes suspendus<[\s\S]*?<span[^>]*>)3(</span>)', r'\1{stats?.blockedUsers ?? "—"}\2', jsx)

# 5. Demandes en attente list
list_html_start = jsx.find('{/*  Liste des demandes  */}')
list_html_end = jsx.find('{/*  DROITE : RÉPARTITION & STATS (5 COLS)  */}')

if list_html_start != -1 and list_html_end != -1:
    list_html = jsx[list_html_start:list_html_end]
    dynamic_list = """
{/* Liste dynamique des demandes */}
<div className="flex flex-col gap-space-sm max-h-[380px] overflow-y-auto pr-1">
  {loading ? (
    <div className="p-4 text-center text-on-surface-variant">Chargement des demandes...</div>
  ) : recentReq.length === 0 ? (
    <div className="p-4 text-center text-on-surface-variant">Aucune demande en attente.</div>
  ) : (
    recentReq.map((request) => (
      <div key={request.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all gap-space-sm">
        <div className="flex items-start gap-space-sm">
          <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary font-bold flex items-center justify-center text-label-md font-label-md shrink-0">
            {request.user?.fullName ? request.user.fullName.substring(0, 2).toUpperCase() : '?'}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs flex-wrap">
              <span className="text-label-lg font-label-lg text-on-surface">{request.user?.fullName ?? 'Inconnu'}</span>
              <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-label-sm font-label-sm">{request.requestedDomain}</span>
            </div>
            <div className="flex items-center gap-space-xs text-body-sm font-body-sm text-on-surface-variant mt-0.5">
              <span className="">Status : <strong className="text-on-surface font-label-md">{request.status}</strong></span>
            </div>
            <span className="text-label-sm font-label-sm text-on-surface-variant mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">schedule</span> {new Date(request.createdAt).toLocaleDateString('fr-FR')}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-space-xs self-end sm:self-center">
          <button className="px-space-sm py-1.5 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-on-surface text-label-sm font-label-sm shadow-sm transition-colors" type="button">
            Examiner
          </button>
          <button className="px-space-sm py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-label-sm font-label-sm shadow-sm transition-colors" type="button">
            Valider
          </button>
        </div>
      </div>
    ))
  )}
</div>
"""
    jsx = jsx[:list_html_start] + dynamic_list + jsx[list_html_end:]

# Combine
final_code = header + f"\n  return (\n    {jsx}\n  );\n}};\n\nexport default AdminDashboard;\n"

with open('frontend/src/pages/AdminDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(final_code)

print("AdminDashboard.jsx updated!")

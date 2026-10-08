import re
import os

with open('.stitch/designs/347a6efa6f92479a8a9234744525a084.html.jsx', 'r', encoding='utf-8') as f:
    mock_jsx = f.read()

# Extract view-dashboard
dashboard_match = re.search(r'(<div[^>]*id="view-dashboard"[^>]*>.*?)\{\/\*\s*Tab: Mes Enfants\s*\*\*\/\}', mock_jsx, re.DOTALL)
if not dashboard_match:
    # Try just splitting if the comment format is tricky
    parts = mock_jsx.split('id="view-mes-enfants"')
    if len(parts) > 1:
        # Get everything from view-dashboard to the end of the previous div before view-mes-enfants
        dashboard_match = re.search(r'(<div[^>]*id="view-dashboard"[^>]*>.*?)<div[^>]*id="view-mes-enfants"', mock_jsx, re.DOTALL)

if not dashboard_match:
    print("Could not find view-dashboard")
    exit(1)

dashboard_jsx = dashboard_match.group(1)

# Make dynamic replacements
# 1. Child switcher button
dashboard_jsx = re.sub(
    r'<div className="w-9 h-9[^>]*>[\s\S]*?JD[\s\S]*?</div>',
    r'<div className="w-9 h-9 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-sm">{activeChild.initials}</div>',
    dashboard_jsx, count=1
)
dashboard_jsx = dashboard_jsx.replace('>Junior Dupont<', '>{activeChild.fullName}<')
dashboard_jsx = dashboard_jsx.replace('>Promo Dev Web &amp; Mobile MINEFOP<', '>{activeChild.promoName}<')

# Remove the dropdown in the mock and replace with our dynamic dropdown from the old code
# The mock dropdown starts at <div className="hidden absolute right-0... id="childDropdown">
# Actually, let's just let React handle the dropdown toggle by replacing "hidden" with "{dropdownOpen ? '' : 'hidden'}"
dashboard_jsx = dashboard_jsx.replace('id="childSelectorBtn"', 'onClick={() => setDropdownOpen(!dropdownOpen)}')
dashboard_jsx = dashboard_jsx.replace('id="childDropdown"', '')
dashboard_jsx = dashboard_jsx.replace('className="hidden absolute', 'className={`${dropdownOpen ? "" : "hidden"} absolute')

# 2. Hero Profile Bento
dashboard_jsx = re.sub(r'2 Apprenants rattachés', r'{children.length} Apprenants rattachés', dashboard_jsx)
# The mock has two cards: JD and SD. We should map over children instead.
bento_grid_match = re.search(r'(<div className="grid grid-cols-1 lg:grid-cols-2[^>]*>)([\s\S]*?)(</section>)', dashboard_jsx)
if bento_grid_match:
    grid_start = bento_grid_match.group(1)
    grid_end = bento_grid_match.group(3)
    dynamic_cards = """
                {children.map((child, idx) => (
                  <div key={child.id} 
                      onClick={() => setActiveChildIndex(idx)}
                      className={`flex flex-col md:flex-row md:items-center justify-between p-space-sm rounded-xl border cursor-pointer transition-colors gap-space-sm ${idx === activeChildIndex ? 'bg-surface-container-low border-secondary/40 shadow-sm' : 'bg-surface-container-low/60 hover:bg-surface-container-low border-transparent hover:border-surface-variant'}`}>
                    <div className="flex items-center gap-space-sm min-w-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${idx === activeChildIndex ? 'bg-primary text-on-primary ring-2 ring-secondary/30' : 'bg-secondary text-on-secondary'}`}>
                        {child.initials}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-label-lg text-label-lg text-primary font-bold truncate">{child.fullName}</span>
                          {child.status === 'ACTIVE' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-800 text-[11px] font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>Actif
                            </span>
                          )}
                        </div>
                        <span className="font-label-sm text-label-sm text-on-surface-variant truncate">{child.promoName}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-space-md shrink-0">
                      <div className="flex items-center gap-space-md text-right">
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase text-on-surface-variant font-medium">Moyenne</span>
                          <span className="font-label-md text-label-md font-bold text-primary">{child.average} / 20</span>
                        </div>
                      </div>
                      {idx === activeChildIndex ? (
                        <span className="p-1.5 rounded-lg bg-secondary text-on-secondary flex items-center justify-center">
                          <span className="material-symbols-outlined text-[18px]">check</span>
                        </span>
                      ) : (
                        <button className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold transition-colors flex items-center gap-1">
                          Basculer <span className="material-symbols-outlined text-[14px]">sync_alt</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
    """
    dashboard_jsx = dashboard_jsx[:bento_grid_match.start(2)] + dynamic_cards + dashboard_jsx[bento_grid_match.end(2):]

# 3. KPI: Moyenne
dashboard_jsx = re.sub(r'(>Moyenne Générale<[\s\S]*?tracking-tight">)15\.8(</span>)', r'\1{activeChild.average}\2', dashboard_jsx)

# 4. KPI: Evals
dashboard_jsx = re.sub(r'(>Évaluations à venir<[\s\S]*?tracking-tight">)2(</span>)', r'\1{activeChild.upcomingEvals.length}\2', dashboard_jsx)

# 5. KPI: Scolarite
dashboard_jsx = re.sub(r'(>Scolarité &amp; Solde<[\s\S]*?tracking-tight">)350,000(</span>)', r'\1{activeChild.financial?.totalAmount?.toLocaleString("fr-FR") ?? 0}\2', dashboard_jsx)
dashboard_jsx = re.sub(r'(Solde: )100,000( XAF)', r'\1{activeChild.financial?.remainingBalance?.toLocaleString("fr-FR") ?? 0}\2', dashboard_jsx)

# 6. Planning loop
# Replace the whole <div className="mt-space-md flex flex-col gap-space-sm"> content
planning_match = re.search(r'(<h2[^>]*>Planning des cours.*?</h2>[\s\S]*?<div className="mt-space-md flex flex-col gap-space-sm">)([\s\S]*?)(</div>\s*</div>\s*<div className="pt-space-md mt-space-md flex items-center justify-between)', dashboard_jsx)
if planning_match:
    dynamic_planning = """
                    {activeChild.schedule.length === 0 ? (
                      <div className="text-center py-6 text-sm text-gray-500">Aucun cours planifié</div>
                    ) : (
                      activeChild.schedule.slice(0, 3).map((session, i) => (
                        <div key={i} className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-start justify-between gap-space-md">
                          <div className="flex items-start gap-space-sm">
                            <div className="flex flex-col items-center justify-center w-12 py-1.5 rounded-lg bg-surface-container text-primary font-bold shrink-0">
                              <span className="font-label-sm text-label-sm uppercase">{session.day}</span>
                              <span className="font-headline-sm text-headline-sm">{session.dayNum}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="font-label-lg text-label-lg text-primary font-bold">{session.course}</span>
                              <div className="flex flex-wrap items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm mt-0.5">
                                <span className="material-symbols-outlined text-[16px]">schedule</span> {session.startTime.split(' ')[1]} - {session.endTime}
                                <span className="mx-1">•</span>
                                <span className="material-symbols-outlined text-[16px]">meeting_room</span> {session.room}
                              </div>
                              <span className="font-label-sm text-label-sm text-secondary font-medium mt-1">Intervenant: {session.teacher}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
    """
    dashboard_jsx = dashboard_jsx[:planning_match.start(2)] + dynamic_planning + dashboard_jsx[planning_match.end(2):]

# 7. Grades loop
# Replace <tbody ...> ... </tbody>
tbody_match = re.search(r'(<tbody[^>]*>)([\s\S]*?)(</tbody>)', dashboard_jsx)
if tbody_match:
    dynamic_grades = """
                        {activeChild.recentGrades.length === 0 ? (
                          <tr><td colSpan="4" className="text-center py-6 text-sm text-on-surface-variant">Aucune note pour le moment</td></tr>
                        ) : (
                          activeChild.recentGrades.map((grade, i) => (
                            <tr key={i} className="hover:bg-surface-container-low/50 transition-colors">
                              <td className="py-3 px-space-sm">
                                <div className="font-label-md text-label-md font-bold text-primary">{grade.course}</div>
                              </td>
                              <td className="py-3 px-space-sm font-label-sm text-label-sm text-on-surface-variant">{grade.date}</td>
                              <td className="py-3 px-space-sm">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-surface-container-high text-primary font-bold font-label-md text-label-md">
                                  {grade.score} / 20
                                </span>
                              </td>
                              <td className="py-3 px-space-sm font-body-sm text-body-sm text-on-surface-variant">
                                {grade.comment || '-'}
                              </td>
                            </tr>
                          ))
                        )}
    """
    dashboard_jsx = dashboard_jsx[:tbody_match.start(2)] + dynamic_grades + dashboard_jsx[tbody_match.end(2):]

# Clean up onclicks in the whole dashboard_jsx
dashboard_jsx = re.sub(r'onclick="[^"]+"', '', dashboard_jsx)
dashboard_jsx = dashboard_jsx.replace('class=', 'className=')
dashboard_jsx = dashboard_jsx.replace('</div></div></div>', '</div>') # Fix unclosed div from regex slice maybe, or just trust it.

# Now read ParentDashboard.jsx
with open('frontend/src/pages/ParentDashboard.jsx', 'r', encoding='utf-8') as f:
    parent_code = f.read()

# Replace <main ...> ... </main> inside ParentDashboard.jsx
new_main = f'<main className="relative pt-16 w-full px-space-lg">\n{dashboard_jsx}\n</main>'

parent_code = re.sub(r'<main className="relative pt-16 w-full px-6">[\s\S]*?</main>', new_main, parent_code)

with open('frontend/src/pages/ParentDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(parent_code)

print("ParentDashboard.jsx updated!")

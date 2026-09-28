const fs = require('fs');
const path = require('path');

const dir = 'h:/PROJETS/VS_Projects/L3_LICENCE_ING/AZ_PULSE/frontend/src/features/formation';

const files = {
  'pages/ApprenantDashboard.jsx': `import React, { useState, useEffect } from 'react';
import { academyService } from '../../../services/api';
import { WelcomeBanner } from '../components/dashboard/WelcomeBanner';
import { ProgramProgressCard } from '../components/dashboard/ProgramProgressCard';
import { UpcomingDeadlineCard } from '../components/dashboard/UpcomingDeadlineCard';
import { FinancialDeadlineCard } from '../components/dashboard/FinancialDeadlineCard';
import { MetricsGrid } from '../components/dashboard/MetricsGrid';
import { ScheduleCard } from '../components/dashboard/ScheduleCard';
import { EvaluationsCard } from '../components/dashboard/EvaluationsCard';
import { FinancialCard } from '../components/dashboard/FinancialCard';
import { DocumentsCard } from '../components/dashboard/DocumentsCard';

export const ApprenantDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    academyService.getApprenantDashboard()
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-az-blue border-t-transparent rounded-full animate-spin"></div>
          <span className="text-slate-500 font-medium animate-pulse">Chargement de votre espace...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600">
        <h3 className="font-bold text-lg mb-2">Erreur de connexion</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700">Réessayer</button>
      </div>
    );
  }

  return (
    <>
      <WelcomeBanner bordereauxPublished={data?.program?.bordereauxPublished} />
      
      <div className="mt-space-md grid grid-cols-1 xl:grid-cols-12 gap-space-md">
        <ProgramProgressCard data={data.program} />
        <div className="xl:col-span-4 flex flex-col gap-space-md">
          <UpcomingDeadlineCard data={data.tasks} />
          <FinancialDeadlineCard data={data.financial} />
        </div>
      </div>
      
      <MetricsGrid data={data} />
      
      {/* Bento Section 1: Timetable & Upcoming Tasks */}
      <div className="mt-space-lg grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        <ScheduleCard data={data.schedule} />
        <EvaluationsCard data={data.grades} />
      </div>
      
      {/* Bento Section 2: Financial Transparency & Course Documents */}
      <div className="mt-space-lg grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        <FinancialCard data={data.financial} />
        <DocumentsCard data={data.documents} />
      </div>
    </>
  );
};

export default ApprenantDashboard;
`,
  'components/dashboard/UpcomingDeadlineCard.jsx': `import React from 'react';

export const UpcomingDeadlineCard = ({ data = [] }) => {
  const tasks = data || [];
  
  return (
    <div className="bg-gradient-to-br from-error/10 to-surface-container-lowest rounded-xl p-space-lg border border-error/20 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
      <div className="absolute top-0 right-0 w-32 h-32 bg-error/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-error/10 transition-colors"></div>
      
      <div className="flex items-center gap-space-sm relative z-10">
        <div className="w-10 h-10 rounded-full bg-error/20 flex items-center justify-center text-error animate-pulse">
          <span className="material-symbols-outlined text-[20px]">assignment_late</span>
        </div>
        <div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Échéances Académiques</h3>
          <p className="font-label-sm text-label-sm text-error font-semibold uppercase tracking-wider">{tasks.length} devoirs en attente</p>
        </div>
      </div>
      
      <div className="mt-space-md relative z-10 flex flex-col gap-3">
        {tasks.length > 0 ? tasks.map((task, idx) => (
          <div key={idx} className="bg-surface-container-lowest p-3 rounded-lg border border-surface-variant flex flex-col">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{task.title}</span>
            <span className="font-body-md text-body-md font-bold text-on-surface">{task.description}</span>
            <span className="font-label-sm text-label-sm text-error mt-1">Avant le {task.dueDate || 'Bientôt'}</span>
            <button className="mt-2 w-full py-1.5 border border-primary/20 text-primary font-bold text-xs rounded-lg hover:bg-primary/5 transition-colors">
              Déposer le TP ({task.formatRequired})
            </button>
          </div>
        )) : (
          <div className="text-sm text-slate-500 italic">Aucune tâche en attente.</div>
        )}
      </div>
    </div>
  );
};
`,
  'components/dashboard/FinancialDeadlineCard.jsx': `import React from 'react';

export const FinancialDeadlineCard = ({ data }) => {
  if (!data) return null;
  const { nextDeadline, amountDue } = data;
  
  if (!nextDeadline) {
    return (
      <div className="bg-emerald-50 rounded-xl p-space-md border border-emerald-100 shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
          <span className="material-symbols-outlined">check_circle</span>
        </div>
        <div>
          <h3 className="font-bold text-emerald-800 text-sm">Finances à jour</h3>
          <p className="text-xs text-emerald-600">Aucun paiement en attente.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-space-md border border-amber-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-100/50 rounded-full blur-xl group-hover:scale-110 transition-transform"></div>
      
      <div className="flex items-start gap-3 relative z-10">
        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
          <span className="material-symbols-outlined">payments</span>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-amber-900 text-sm">Règlement de scolarité</h3>
          <p className="text-xs text-amber-700 mt-1 font-medium">Tranche de {amountDue.toLocaleString()} XAF</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-1 rounded-md">Avant le {new Date(nextDeadline).toLocaleDateString('fr-FR')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
`,
  'components/dashboard/MetricsGrid.jsx': `import React from 'react';

export const MetricsGrid = ({ data }) => {
  if (!data) return null;
  const program = data.program || {};
  
  return (
    <div className="mt-space-lg grid grid-cols-2 md:grid-cols-4 gap-space-md">
      {/* Metric 1 */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md border border-surface-variant flex flex-col gap-1 hover:-translate-y-1 transition-transform shadow-sm hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">
            Assiduité
          </span>
          <span className="material-symbols-outlined text-secondary text-[20px]">how_to_reg</span>
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="font-headline-lg text-headline-lg font-bold text-primary">94</span>
          <span className="font-body-md text-body-md text-on-surface-variant">%</span>
        </div>
        <span className="font-label-sm text-[10px] text-emerald-600 font-medium bg-emerald-50 self-start px-1.5 py-0.5 rounded">+2% ce mois</span>
      </div>
      
      {/* Metric 2 */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md border border-surface-variant flex flex-col gap-1 hover:-translate-y-1 transition-transform shadow-sm hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">
            Moyenne Générale
          </span>
          <span className="material-symbols-outlined text-secondary text-[20px]">school</span>
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="font-headline-lg text-headline-lg font-bold text-primary">14.5</span>
          <span className="font-body-md text-body-md text-on-surface-variant">/ 20</span>
        </div>
        <span className="font-label-sm text-[10px] text-on-surface-variant font-medium">Trimestre 1</span>
      </div>
      
      {/* Metric 3 */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md border border-surface-variant flex flex-col gap-1 hover:-translate-y-1 transition-transform shadow-sm hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">
            Crédits ECTS
          </span>
          <span className="material-symbols-outlined text-secondary text-[20px]">stars</span>
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="font-headline-lg text-headline-lg font-bold text-primary">42</span>
          <span className="font-body-md text-body-md text-on-surface-variant">/ 60</span>
        </div>
        <span className="font-label-sm text-[10px] text-on-surface-variant font-medium">Validés (L3)</span>
      </div>
      
      {/* Metric 4 */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md border border-surface-variant flex flex-col gap-1 hover:-translate-y-1 transition-transform shadow-sm hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">
            Heures Pratiques
          </span>
          <span className="material-symbols-outlined text-secondary text-[20px]">laptop_mac</span>
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="font-headline-lg text-headline-lg font-bold text-primary">120</span>
          <span className="font-body-md text-body-md text-on-surface-variant">h</span>
        </div>
        <span className="font-label-sm text-[10px] text-on-surface-variant font-medium">Lab &amp; Projets</span>
      </div>
    </div>
  );
};
`,
  'components/dashboard/ScheduleCard.jsx': `import React from 'react';

export const ScheduleCard = ({ data = [] }) => {
  return (
    <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl border border-surface-variant shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-space-md border-b border-surface-variant flex items-center justify-between bg-surface-container/30">
        <div className="flex items-center gap-space-sm">
          <span className="material-symbols-outlined text-secondary">calendar_month</span>
          <h3 className="font-title-md text-title-md font-bold text-on-surface">Emploi du temps (Aujourd'hui)</h3>
        </div>
        <button className="text-primary font-label-md text-label-md font-bold hover:underline">
          Voir le planning complet
        </button>
      </div>
      
      <div className="p-space-md flex-1 overflow-y-auto custom-scrollbar">
        <div className="flex flex-col gap-space-md relative">
          <div className="absolute left-[39px] top-4 bottom-4 w-0.5 bg-surface-variant rounded-full z-0"></div>
          
          {data.length > 0 ? data.map((session, idx) => (
            <div key={idx} className="flex gap-space-md relative z-10 group">
              <div className="flex flex-col items-center justify-start shrink-0 w-[80px]">
                <span className="font-label-md text-label-md font-bold text-on-surface">{session.startTime.split(' ')[1]}</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">{session.endTime}</span>
              </div>
              
              <div className={\`flex-1 rounded-lg p-space-sm border transition-all \${session.isLive ? 'bg-secondary/5 border-secondary/30 ring-1 ring-secondary/20 scale-[1.02]' : 'bg-surface-container-lowest border-surface-variant group-hover:border-primary/30'}\`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-title-sm text-title-sm font-bold text-primary">{session.course}</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{session.teacher}</p>
                  </div>
                  {session.isLive ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-error/10 text-error font-label-sm text-[10px] font-bold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span> En cours
                    </span>
                  ) : null}
                </div>
                <div className="mt-3 flex items-center gap-4">
                  <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    {session.room}
                  </div>
                  {session.room === 'Visioconférence' && (
                    <button className="flex items-center gap-1 text-primary font-label-sm text-label-sm font-bold bg-primary/10 px-2 py-0.5 rounded hover:bg-primary/20 transition-colors">
                      <span className="material-symbols-outlined text-[16px]">video_camera_front</span>
                      Rejoindre
                    </button>
                  )}
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center p-4 text-slate-500 italic">Aucun cours aujourd'hui.</div>
          )}
        </div>
      </div>
    </div>
  );
};
`,
  'components/dashboard/EvaluationsCard.jsx': `import React from 'react';

export const EvaluationsCard = ({ data = [] }) => {
  return (
    <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl border border-surface-variant shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-space-md border-b border-surface-variant flex items-center justify-between bg-surface-container/30">
        <div className="flex items-center gap-space-sm">
          <span className="material-symbols-outlined text-secondary">analytics</span>
          <h3 className="font-title-md text-title-md font-bold text-on-surface">Dernières Évaluations</h3>
        </div>
      </div>
      
      <div className="p-space-md flex-1 flex flex-col gap-space-sm overflow-y-auto">
        {data.length > 0 ? data.map((grade, idx) => (
          <div key={idx} className="bg-surface-container-lowest border border-surface-variant rounded-lg p-3 flex flex-col gap-2 hover:shadow-sm transition-shadow group">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{grade.date}</span>
                <span className="font-title-sm text-title-sm font-bold text-on-surface">{grade.course}</span>
              </div>
              <div className={\`px-2 py-1 rounded text-white font-bold text-sm \${grade.score >= 12 ? 'bg-emerald-500' : (grade.score >= 10 ? 'bg-amber-500' : 'bg-rose-500')}\`}>
                {grade.score} / 20
              </div>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant italic border-l-2 border-primary/20 pl-2">
              "{grade.comment}"
            </p>
          </div>
        )) : (
          <div className="text-center p-4 text-slate-500 italic">Aucune note récente.</div>
        )}
        <button className="mt-auto w-full py-2 bg-surface-container hover:bg-surface-variant text-on-surface font-bold text-sm rounded-lg transition-colors">
          Voir toutes mes notes
        </button>
      </div>
    </div>
  );
};
`,
  'components/dashboard/FinancialCard.jsx': `import React from 'react';

export const FinancialCard = ({ data }) => {
  if (!data) return null;
  const progressPercent = (data.paidTranches / data.totalTranches) * 100;

  return (
    <div className="lg:col-span-5 bg-gradient-to-br from-az-navy to-[#0b2545] rounded-xl shadow-lg overflow-hidden flex flex-col h-full text-white relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-az-blue/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
      
      <div className="p-space-md border-b border-white/10 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-space-sm">
          <span className="material-symbols-outlined text-az-blue">account_balance</span>
          <h3 className="font-title-md text-title-md font-bold">Situation Financière</h3>
        </div>
      </div>
      
      <div className="p-space-md flex-1 flex flex-col justify-between relative z-10">
        <div>
          <span className="font-label-sm text-label-sm text-white/60 uppercase tracking-wider">Reste à payer</span>
          <div className="flex items-end gap-2 mt-1">
            <span className="font-headline-xl text-headline-xl font-extrabold">{data.remainingBalance.toLocaleString()}</span>
            <span className="font-title-md text-title-md text-white/80 pb-1">XAF</span>
          </div>
          <span className="font-label-sm text-label-sm text-white/60">sur {data.totalAmount.toLocaleString()} XAF au total</span>
        </div>
        
        <div className="mt-space-lg">
          <div className="flex justify-between items-center font-label-sm text-label-sm mb-2">
            <span className="text-white/80">Tranches réglées : {data.paidTranches} / {data.totalTranches}</span>
            <span className="font-bold text-az-blue">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full bg-az-blue relative overflow-hidden" style={{ width: \`\${progressPercent}%\` }}>
              <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>
        </div>
        
        <div className="mt-space-lg flex gap-space-sm">
          <button className="flex-1 py-2.5 bg-az-blue hover:bg-blue-600 text-white font-bold text-sm rounded-lg transition-colors shadow-md">
            Payer en ligne
          </button>
          <button className="py-2.5 px-4 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold rounded-lg transition-colors">
            <span className="material-symbols-outlined text-[20px]">receipt_long</span>
          </button>
        </div>
      </div>
    </div>
  );
};
`,
  'components/dashboard/DocumentsCard.jsx': `import React from 'react';

export const DocumentsCard = ({ data = [] }) => {
  return (
    <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl border border-surface-variant shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-space-md border-b border-surface-variant flex items-center justify-between bg-surface-container/30">
        <div className="flex items-center gap-space-sm">
          <span className="material-symbols-outlined text-secondary">folder_special</span>
          <h3 className="font-title-md text-title-md font-bold text-on-surface">Documents Récents (Cours &amp; TP)</h3>
        </div>
        <button className="text-primary font-label-md text-label-md font-bold hover:underline">
          Voir la bibliothèque
        </button>
      </div>
      
      <div className="p-space-md flex-1 grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
        {data.length > 0 ? data.map((doc, idx) => (
          <div key={idx} className="bg-surface-container-lowest border border-surface-variant rounded-lg p-3 flex items-start gap-3 hover:border-primary/40 hover:shadow-sm transition-all group cursor-pointer">
            <div className="w-10 h-10 rounded bg-red-50 text-red-500 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined">{doc.type === 'PDF' ? 'picture_as_pdf' : 'description'}</span>
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="font-title-sm text-title-sm font-bold text-on-surface truncate group-hover:text-primary transition-colors">{doc.title}</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant truncate">{doc.course}</span>
              <div className="flex items-center justify-between mt-2">
                <span className="font-label-sm text-[10px] text-on-surface-variant bg-surface-container px-1.5 py-0.5 rounded">{doc.size}</span>
                <button className="text-primary hover:bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center transition-colors">
                  <span className="material-symbols-outlined text-[16px]">download</span>
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-2 text-center p-4 text-slate-500 italic">Aucun document récent.</div>
        )}
        
        {/* Dropzone mockup */}
        <div className="col-span-1 sm:col-span-2 mt-2 border-2 border-dashed border-surface-variant rounded-lg p-4 flex flex-col items-center justify-center text-center bg-surface-container/20 hover:bg-surface-container/50 hover:border-primary/50 transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined">cloud_upload</span>
          </div>
          <p className="font-label-sm text-sm text-on-surface-variant font-bold mt-2">Glissez-déposez un document ici</p>
          <p className="text-xs text-on-surface-variant/70 mt-1">ou cliquez pour parcourir (Max 10MB)</p>
        </div>
      </div>
    </div>
  );
};
`
};

for (const [filename, content] of Object.entries(files)) {
  const fullPath = path.join(dir, filename);
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Updated', fullPath);
}

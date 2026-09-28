import React from 'react';

export const ScheduleCard = ({ data = [] }) => {
  const todaySession = data.find(s => s.isLive) || data[0];
  const upcomingSessions = data.filter(s => s !== todaySession).slice(0, 3);

  return (
    <div className="lg:col-span-7 flex flex-col gap-space-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <div className="w-2.5 h-6 bg-secondary rounded-full shadow-[0_2px_6px_rgba(0,74,209,0.4)]"></div>
          <h2 className="font-headline-md text-headline-md text-primary font-bold">Mon Emploi du Temps Personnel &amp; Salles</h2>
        </div>
        <span className="font-label-md text-label-md text-on-surface-variant font-mono bg-surface-container px-3 py-1 rounded-full">
          Semaine 46 • Nov 2025
        </span>
      </div>

      {todaySession ? (
        <div className="relative bg-gradient-to-r from-primary via-primary-container to-[#0b2b54] text-on-primary rounded-2xl p-space-md shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md border border-primary-container">
          <div className="flex items-center gap-space-md">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-surface-container-lowest/15 backdrop-blur-md flex items-center justify-center text-tertiary-fixed-dim shadow-inner border border-surface/20">
                <span className="material-symbols-outlined notranslate text-[30px]">sensors</span>
              </div>
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary-fixed-dim opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-tertiary-fixed-dim shadow-[0_0_8px_#ffba20]"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-label-sm text-label-sm clay-btn-amber text-primary px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Aujourd'hui • {todaySession.startTime.split(' ')[1]} - {todaySession.endTime}
                </span>
                <span className="font-label-sm text-label-sm text-primary-fixed-dim font-mono">
                  {todaySession.room}
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-primary font-bold mt-1">
                {todaySession.course}
              </h3>
              <p className="font-body-sm text-body-sm text-on-primary-container">
                Intervenant: {todaySession.teacher}
              </p>
            </div>
          </div>
          <button 
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl clay-btn-primary text-on-secondary font-label-md text-label-md font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0" 
            type="button"
          >
            <span className="material-symbols-outlined notranslate text-[18px]">launch</span>
            Rejoindre le salon virtuel
          </button>
        </div>
      ) : (
        <div className="bg-surface-container-low rounded-2xl p-space-md border border-surface-container/60 text-center text-on-surface-variant font-label-md">
          Aucun cours aujourd'hui
        </div>
      )}

      <div className="clay-card rounded-2xl p-space-md flex flex-col gap-space-sm">
        <div className="flex items-center justify-between pb-space-xs border-b border-surface-container">
          <span className="font-label-md text-label-md font-bold text-primary flex items-center gap-1.5">
            <span className="material-symbols-outlined notranslate text-secondary text-[18px]">calendar_month</span>
            Prochaines Séances
          </span>
          <span className="font-label-sm text-label-sm text-secondary font-bold bg-secondary/10 px-2.5 py-0.5 rounded-full">
            Planning synchronisé
          </span>
        </div>
        
        {upcomingSessions.map((session, idx) => (
          <div key={idx} className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-all border border-surface-container/60">
            <div className="flex items-center gap-space-sm min-w-0">
              <div className="px-3 py-2 rounded-xl bg-surface-container-lowest font-mono text-center shrink-0 shadow-sm border border-surface-container">
                <span className="block font-label-sm text-label-sm text-on-surface-variant uppercase font-bold">Jour</span>
                <span className="block font-headline-sm text-headline-sm font-extrabold text-primary">{idx + 13}</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-label-md font-bold text-primary truncate">{session.course}</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-2">
                  <span>{session.startTime.split(' ')[1]} - {session.endTime}</span> • 
                  <span>{session.room}</span> • 
                  <span className="font-medium text-primary">{session.teacher}</span>
                </span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-bold shadow-sm shrink-0">
              Prévu
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

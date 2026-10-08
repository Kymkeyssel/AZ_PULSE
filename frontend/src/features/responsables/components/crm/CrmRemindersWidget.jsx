import { useState, useEffect } from 'react';
import { crmService } from '../../../../services/api';
import { toast } from 'sonner';

const CrmRemindersWidget = () => {
  const [reminders, setReminders] = useState([]);
  const [filter, setFilter] = useState('upcoming'); // overdue, today, upcoming
  const [summary, setSummary] = useState({ overdue: 0, today: 0, upcoming: 0 });

  const load = async () => {
    try {
      const summaryRes = await crmService.getReminderSummary();
      if (summaryRes?.data) {
        setSummary(summaryRes.data);
      }
      
      const res = await crmService.listReminders({ filter });
      setReminders(res?.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    load();
  }, [filter]);

  const handleComplete = async (id) => {
    try {
      await crmService.completeReminder(id);
      toast.success('Relance complétée');
      load();
    } catch (e) {
      toast.error('Erreur lors de la validation');
    }
  };

  const handleDelete = async (id) => {
    try {
      await crmService.deleteReminder(id);
      toast.success('Relance supprimée');
      load();
    } catch (e) {
      toast.error('Erreur lors de la suppression');
    }
  };

  return (
    <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 flex flex-col h-full animate-fade-in">
      <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant/20">
        <div className="flex items-center gap-space-sm">
          <div className="p-2 rounded-lg bg-primary text-on-primary">
            <span className="material-symbols-outlined text-[20px]">alarm</span>
          </div>
          <div>
            <h3 className="font-headline-sm text-headline-sm text-primary font-bold">Relances & Actions Commerciales</h3>
            <p className="font-body-sm text-[12px] text-on-surface-variant">Priorités et relances actives</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 py-space-sm">
        <button 
          className={`p-2 rounded-lg flex flex-col items-center transition-colors ${filter === 'overdue' ? 'bg-error-container text-error' : 'bg-error-container/40 text-error hover:bg-error-container'}`}
          onClick={() => setFilter('overdue')}
        >
          <span className="text-xs font-bold uppercase">En retard</span>
          <span className="text-lg font-extrabold">{summary.overdue}</span>
        </button>
        <button 
          className={`p-2 rounded-lg flex flex-col items-center transition-colors ${filter === 'today' ? 'bg-amber-200 text-amber-900' : 'bg-amber-100 text-amber-900 hover:bg-amber-200'}`}
          onClick={() => setFilter('today')}
        >
          <span className="text-xs font-bold uppercase">Aujourd'hui</span>
          <span className="text-lg font-extrabold">{summary.today}</span>
        </button>
        <button 
          className={`p-2 rounded-lg flex flex-col items-center transition-colors ${filter === 'upcoming' ? 'bg-surface-container-high text-secondary' : 'bg-surface-container text-secondary hover:bg-surface-container-high'}`}
          onClick={() => setFilter('upcoming')}
        >
          <span className="text-xs font-bold uppercase">À venir</span>
          <span className="text-lg font-extrabold">{summary.upcoming}</span>
        </button>
      </div>

      <div className="space-y-space-xs flex-1 overflow-y-auto max-h-[360px] pr-1 mt-2">
        {reminders.length === 0 && (
          <p className="text-center text-sm text-on-surface-variant py-4">Aucune relance pour ce filtre.</p>
        )}
        
        {reminders.map(r => (
          <div key={r.id} className={`p-3 rounded-lg bg-surface-container-low flex items-center justify-between border-l-4 ${filter === 'overdue' ? 'border-l-error' : filter === 'today' ? 'border-l-amber-500' : 'border-l-secondary'}`}>
            <div className="flex items-start gap-2.5">
              <span className={`p-1 rounded text-[16px] material-symbols-outlined ${filter === 'overdue' ? 'bg-error-container text-error' : filter === 'today' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-secondary'}`}>
                {r.type === 'CALL' ? 'call' : r.type === 'EMAIL' ? 'mail' : 'event'}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-headline-sm text-xs font-bold text-primary">{r.title}</span>
                  {r.priority === 'HIGH' && <span className="px-1.5 py-0.2 rounded bg-error text-white text-[10px] font-bold">HAUTE</span>}
                </div>
                <div className="text-[12px] text-on-surface-variant">{r.description || r.dueDate}</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-lg bg-surface-container hover:bg-emerald-100 text-on-surface-variant hover:text-emerald-700" onClick={() => handleComplete(r.id)} title="Marquer Complétée">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
              </button>
              <button className="p-1.5 rounded-lg bg-surface-container hover:bg-error-container hover:text-error text-on-surface-variant" onClick={() => handleDelete(r.id)} title="Supprimer">
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CrmRemindersWidget;

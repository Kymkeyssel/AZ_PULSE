import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../../contexts/AuthContext';
import { crmService } from '../../../services/api';
import ReminderForm from '../components/crm/ReminderForm';
import {
  formatRelativeDue,
  reminderTypeIcon,
  reminderTypeLabel,
} from '../lib/format';

const TONES = {
  danger:  { chip: 'bg-red-50 text-red-700 border-red-200',   icon: 'error',       accent: '#dc2626' },
  warning: { chip: 'bg-amber-50 text-amber-700 border-amber-200', icon: 'schedule',  accent: '#f59e0b' },
  neutral: { chip: 'bg-[#f4f7fb] text-[#6b7a99] border-[#dde3ef]', icon: 'event',    accent: '#64748b' },
};

/** Compteurs à zéro : état neutre quand l'API ne répond pas. */
const EMPTY_SUMMARY = { overdue: 0, today: 0, upcoming: 0 };

/**
 * Mes relances.
 *
 * C'est l'écran le plus consulté de l'espace commercial : il répond à une
 * seule question — « qu'est-ce que j'ai à faire aujourd'hui ? »
 *
 * L'ordre n'est pas celui de la saisie mais celui de l'urgence : en retard,
 * aujourd'hui, à venir, puis ce qui est traité.
 */
const CrmReminders = () => {
  const { hasPermission } = useAuth();
  const canCreate = hasPermission('crm.create');
  const canUpdate = hasPermission('crm.update');
  const canDelete = hasPermission('crm.delete');

  const [reminders, setReminders] = useState([]);
  const [summary, setSummary] = useState({ overdue: 0, today: 0, upcoming: 0 });
  const [loaded, setLoaded] = useState(false);
  const [showDone, setShowDone] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // Tant que le premier chargement n'est pas terminé, on affiche le
  // spinner. Un `setLoading(true)` dans l'effet provoquerait un rendu en
  // cascade à chaque changement de filtre.
  const loading = !loaded;

  const load = useCallback(async () => {
    try {
      const [list, stats] = await Promise.all([
        crmService.listReminders(showDone ? {} : { status: 'PENDING' }),
        crmService.getReminderSummary(),
      ]);
      setReminders(list.data ?? []);
      setSummary(stats.data ?? EMPTY_SUMMARY);
    } catch (err) {
      // Un échec doit aboutir à un état vide, pas à un chargement infini.
      setReminders([]);
      setSummary(EMPTY_SUMMARY);
      toast.error(err.message || 'Chargement des relances impossible.');
    } finally {
      setLoaded(true);
    }
  }, [showDone]);

  useEffect(() => {
    // Les mises à jour d'état de `load` ont toutes lieu après un `await`,
    // donc hors du rendu courant : aucun rendu en cascade. Le linter ne
    // descendant pas dans la fonction asynchrone pour le vérifier.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const complete = async reminder => {
    try {
      await crmService.completeReminder(reminder.id);
      toast.success('Relance marquée comme faite.');
      load();
    } catch (err) {
      toast.error(err.message || 'Opération impossible.');
    }
  };

  const reopen = async reminder => {
    try {
      await crmService.reopenReminder(reminder.id);
      load();
    } catch (err) {
      toast.error(err.message || 'Opération impossible.');
    }
  };

  const remove = async reminder => {
    if (!window.confirm(`Supprimer la relance « ${reminder.title} » ?`)) return;

    try {
      await crmService.deleteReminder(reminder.id);
      toast.success('Relance supprimée.');
      load();
    } catch (err) {
      toast.error(err.message || 'Suppression impossible.');
    }
  };

  /**
   * Regroupe les relances en sections. Fait en mémoire : le volume d'un
   * carnet individuel tient largement en une réponse, et le découpage
   * côté interface permet de l'animer sans second appel réseau.
   */
  const groups = useMemo(() => {
    const pending = reminders.filter(r => r.status === 'PENDING');
    const done = reminders.filter(r => r.status !== 'PENDING');

    const overdue = pending.filter(r => r.overdue);
    const today = pending.filter(r => !r.overdue && r.dueAt?.slice(0, 10) === new Date().toISOString().slice(0, 10));
    const later = pending.filter(r => !r.overdue && r.dueAt?.slice(0, 10) !== new Date().toISOString().slice(0, 10));

    return [
      { key: 'overdue', title: 'En retard', tone: 'danger', items: overdue },
      { key: 'today', title: "Aujourd'hui", tone: 'warning', items: today },
      { key: 'later', title: 'À venir', tone: 'neutral', items: later },
      ...(showDone ? [{ key: 'done', title: 'Traitées', tone: 'neutral', items: done }] : []),
    ].filter(g => g.items.length > 0);
  }, [reminders, showDone]);

  const renderCard = reminder => {
    const relative = formatRelativeDue(reminder.dueAt);
    const tone = TONES[relative.tone];
    const isDone = reminder.status !== 'PENDING';

    return (
      <li
        key={reminder.id}
        className={[
          'bg-white rounded-xl border p-4 shadow-sm transition-colors',
          isDone ? 'border-[#e2e8f0] opacity-60' : 'border-[#dde3ef] hover:border-[#c7d2e3]',
        ].join(' ')}
      >
        <div className="flex items-start gap-3.5">
          <span
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: `${tone.accent}15`, color: tone.accent }}
          >
            <span className="material-symbols-outlined notranslate text-[19px]">
              {reminderTypeIcon(reminder.type)}
            </span>
          </span>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <p className={[
                'text-sm font-bold text-[#001026] leading-snug',
                isDone ? 'line-through' : '',
              ].join(' ')}>
                {reminder.title}
              </p>

              {!isDone && (
                <span className={[
                  'text-[10px] font-bold px-2 py-1 rounded-md border flex-shrink-0 whitespace-nowrap',
                  tone.chip,
                ].join(' ')}>
                  {relative.label}
                </span>
              )}
            </div>

            {reminder.description && (
              <p className="text-[12px] text-[#6b7a99] mt-1 leading-relaxed line-clamp-2">
                {reminder.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2.5 text-[11px] text-[#94a3b8]">
              <span>{reminderTypeLabel(reminder.type)}</span>
              {reminder.customer?.name && (
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined notranslate text-[13px]">business</span>
                  {reminder.customer.name}
                </span>
              )}
              {reminder.opportunity?.title && (
                <span className="flex items-center gap-1 truncate max-w-[220px]">
                  <span className="material-symbols-outlined notranslate text-[13px]">ads_click</span>
                  <span className="truncate">{reminder.opportunity.title}</span>
                </span>
              )}
              {reminder.priority === 'HIGH' && (
                <span className="text-red-600 font-bold">Priorité haute</span>
              )}
            </div>

            {/* ── Actions ─────────────────────────────────────────────── */}
            {!isDone && (
              <div className="flex items-center gap-2 mt-3">
                {canUpdate && (
                  <button
                    onClick={() => complete(reminder)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0b2545] text-white text-[11px] font-bold hover:opacity-90 transition-opacity"
                  >
                    <span className="material-symbols-outlined notranslate text-[15px]">check</span>
                    C&apos;est fait
                  </button>
                )}

                {canUpdate && (
                  <button
                    onClick={() => { setEditing(reminder); setFormOpen(true); }}
                    className="px-2.5 py-1.5 rounded-lg border border-[#dde3ef] text-[#6b7a99] text-[11px] font-bold hover:bg-[#f4f7fb] transition-colors"
                  >
                    Modifier
                  </button>
                )}

                {canDelete && (
                  <button
                    onClick={() => remove(reminder)}
                    className="px-2 py-1.5 rounded-lg text-[#94a3b8] hover:text-red-600 transition-colors"
                    aria-label="Supprimer la relance"
                  >
                    <span className="material-symbols-outlined notranslate text-[16px]">delete</span>
                  </button>
                )}
              </div>
            )}

            {isDone && canUpdate && (
              <button
                onClick={() => reopen(reminder)}
                className="mt-2.5 text-[11px] font-bold text-[#004ad1] hover:underline"
              >
                Rouvrir
              </button>
            )}
          </div>
        </div>
      </li>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin w-9 h-9 border-4 border-[#004ad1] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">

      {/* ── En-tête ─────────────────────────────────────────────────────── */}
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#001026]">Mes relances</h1>
          <p className="text-sm text-[#6b7a99] mt-1">
            Ce qui reste à faire pour ne laisser filer aucune affaire.
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => { setEditing(null); setFormOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0b2545] text-white text-sm font-bold hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined notranslate text-[18px]">add_task</span>
            Planifier une relance
          </button>
        )}
      </header>

      {/* ── Compteurs ───────────────────────────────────────────────────── */}
      <section className="grid grid-cols-3 gap-3">
        {[
          { key: 'overdue', label: 'En retard', value: summary.overdue, tone: 'text-red-600', bg: 'bg-red-50 border-red-200' },
          { key: 'today', label: "Aujourd'hui", value: summary.today, tone: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
          { key: 'upcoming', label: 'À venir', value: summary.upcoming, tone: 'text-[#004ad1]', bg: 'bg-[#eff6ff] border-[#bfdbfe]' },
        ].map(card => (
          <div key={card.key} className={['rounded-xl border p-4', card.bg].join(' ')}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#6b7a99]">{card.label}</p>
            <p className={['text-3xl font-black mt-1', card.tone].join(' ')}>{card.value ?? 0}</p>
          </div>
        ))}
      </section>

      {/* ── Contenu ─────────────────────────────────────────────────────── */}
      <label className="flex items-center gap-2 text-xs text-[#6b7a99] cursor-pointer">
        <input
          type="checkbox"
          checked={showDone}
          onChange={e => setShowDone(e.target.checked)}
          className="accent-[#004ad1]"
        />
        Afficher aussi les relances traitées
      </label>

      {groups.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-[#cbd5e1] py-16 text-center">
          <span className="material-symbols-outlined notranslate text-[40px] text-[#cbd5e1]">task_alt</span>
          <p className="text-sm font-bold text-[#0b2545] mt-3">Rien à faire pour l&apos;instant</p>
          <p className="text-xs text-[#6b7a99] mt-1">
            {canCreate
              ? 'Planifiez vos relances pour ne rien oublier.'
              : 'Vos relances apparaîtront ici.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map(group => (
            <section key={group.key}>
              <h2 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#6b7a99] mb-3">
                {group.title}
                <span className="text-[#94a3b8]">({group.items.length})</span>
              </h2>
              <ul className="space-y-2.5">
                {group.items.map(renderCard)}
              </ul>
            </section>
          ))}
        </div>
      )}

      {/* ── Modal ───────────────────────────────────────────────────────── */}
      {formOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#001026]/50 backdrop-blur-sm"
            onClick={() => { setFormOpen(false); setEditing(null); }}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <header className="px-6 py-4 border-b border-[#dde3ef]">
              <h2 className="text-base font-extrabold text-[#001026]">
                {editing ? 'Modifier la relance' : 'Planifier une relance'}
              </h2>
            </header>

            <div className="px-6 py-5">
              <ReminderForm
                key={editing?.id ?? 'nouvelle'}
                reminder={editing}
                onSaved={() => {
                  setFormOpen(false);
                  setEditing(null);
                  toast.success(editing ? 'Relance mise à jour.' : 'Relance planifiée.');
                  load();
                }}
                onCancel={() => { setFormOpen(false); setEditing(null); }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrmReminders;

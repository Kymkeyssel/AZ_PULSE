/**
 * Formatage partagé des données CRM.
 *
 * Isolé dans un module sans React pour rester testable et réutilisable
 * par n'importe quel écran (Kanban, liste de relances, tableaux de bord).
 */

/** Locale d'affichage des montants et des dates. */
const LOCALE = 'fr-FR';

/**
 * Montant en euros. Les deals commerciaux vont de 500 à 500 000 € :
 * on abrège au-delà d'un million, sinon la colonne déborde.
 *
 * @param {number|string|null|undefined} value
 * @returns {string}
 */
export function formatAmount(value) {
  if (value === null || value === undefined || value === '') return '—';

  const number = Number(value);
  if (Number.isNaN(number)) return '—';

  if (Math.abs(number) >= 1_000_000) {
    return `${(number / 1_000_000).toFixed(1).replace('.', ',')} M€`;
  }

  if (Math.abs(number) >= 10_000) {
    return `${Math.round(number / 1000).toLocaleString(LOCALE)} k€`;
  }

  return `${number.toLocaleString(LOCALE, { maximumFractionDigits: 0 })} €`;
}

/**
 * Montant compact pour les indicateurs étroits (KPI).
 *
 * @param {number|string|null|undefined} value
 * @returns {string}
 */
export function formatAmountCompact(value) {
  if (value === null || value === undefined || value === '') return '—';

  const number = Number(value);
  if (Number.isNaN(number)) return '—';

  if (Math.abs(number) >= 1_000_000) {
    return `${(number / 1_000_000).toFixed(1).replace('.', ',')} M`;
  }

  return `${Math.round(number / 1000).toLocaleString(LOCALE)} k`;
}

/**
 * Date lisible en français court : « 12 mars 2026 ».
 *
 * @param {string|null|undefined} value
 * @returns {string}
 */
export function formatDate(value) {
  if (!value) return '—';

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleDateString(LOCALE, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Échéance relative, plus parlante qu'une date pour une relance :
 * « En retard de 3 jours », « Aujourd'hui », « Demain ».
 *
 * @param {string|null|undefined} value
 * @returns {{ label: string, tone: 'danger'|'warning'|'neutral' }}
 */
export function formatRelativeDue(value) {
  if (!value) return { label: 'Sans échéance', tone: 'neutral' };

  const due = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(due.getTime())) return { label: 'Sans échéance', tone: 'neutral' };

  // On compare à minuit, pas à l'instant présent : une relance prévue
  // aujourd'hui à 18 h n'est pas en retard à 9 h.
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const days = Math.round(
    (new Date(due.getFullYear(), due.getMonth(), due.getDate())
      - new Date(startOfToday.getFullYear(), startOfToday.getMonth(), startOfToday.getDate()))
    / 86_400_000
  );

  if (days < 0) {
    const late = Math.abs(days);
    return { label: `En retard de ${late} jour${late > 1 ? 's' : ''}`, tone: 'danger' };
  }

  if (days === 0) return { label: "Aujourd'hui", tone: 'warning' };
  if (days === 1) return { label: 'Demain', tone: 'neutral' };
  if (days <= 7) return { label: `Dans ${days} jours`, tone: 'neutral' };

  return { label: formatDate(due), tone: 'neutral' };
}

/** Types de relances, avec leur libellé et leur icône Material. */
export const REMINDER_TYPES = [
  { value: 'CALL', label: 'Appel', icon: 'call' },
  { value: 'EMAIL', label: 'Email', icon: 'mail' },
  { value: 'MEETING', label: 'Réunion', icon: 'event' },
  { value: 'TASK', label: 'Tâche', icon: 'task_alt' },
];

/** Niveaux de priorité. */
export const REMINDER_PRIORITIES = [
  { value: 'LOW', label: 'Basse' },
  { value: 'NORMAL', label: 'Normale' },
  { value: 'HIGH', label: 'Haute' },
];

/**
 * Retrouve le libellé d'un type de relance.
 *
 * @param {string} value
 * @returns {string}
 */
export function reminderTypeLabel(value) {
  return REMINDER_TYPES.find(t => t.value === value)?.label ?? value;
}

/**
 * Retrouve l'icône Material d'un type de relance.
 *
 * @param {string} value
 * @returns {string}
 */
export function reminderTypeIcon(value) {
  return REMINDER_TYPES.find(t => t.value === value)?.icon ?? 'task_alt';
}

/** Étapes du pipeline, dans l'ordre du cycle de vente. */
export const STAGE_ORDER = ['PROSPECTING', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'];

/** Étapes ouvertes : celles qui apparaissent sur le Kanban par défaut. */
export const OPEN_STAGES = ['PROSPECTING', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION'];

/** Palette de chaque étape, alignée sur celle du design global. */
export const STAGE_STYLES = {
  PROSPECTING:   { label: 'Prospection',  accent: '#64748b', bg: '#f1f5f9' },
  QUALIFICATION: { label: 'Qualification', accent: '#0ea5e9', bg: '#e0f2fe' },
  PROPOSAL:      { label: 'Proposition',   accent: '#8b5cf6', bg: '#ede9fe' },
  NEGOTIATION:   { label: 'Négociation',   accent: '#f59e0b', bg: '#fef3c7' },
  WON:           { label: 'Gagné',         accent: '#16a34a', bg: '#dcfce7' },
  LOST:          { label: 'Perdu',         accent: '#dc2626', bg: '#fee2e2' },
};

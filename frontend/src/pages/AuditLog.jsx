import React, { useState, useEffect, useCallback } from 'react';

import { auditService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

// ── Design tokens AZ PULSE ────────────────────────────────────────────────────
// Utilisation des utilitaires Tailwind glass-panel définis dans index.css

/** Libellés français des codes de catégorie et de gravité renvoyés par l'API. */
const CATEGORY_LABELS = {
  IAM:        'Identité & Accès',
  CRM:        'CRM',
  WORKSPACE:  'Workspace',
  FORMATION:  'Formation',
  KNOWLEDGE:  'Knowledge Hub',
  INFRA:      'Infrastructure',
  AI:         'IA',
  SECURITY:   'Sécurité',
};

const SEVERITY_STYLE = {
  INFO:     { label: 'Info',     color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
  WARNING:  { label: 'Avert.',   color: '#d97706', bg: '#fef3c7', border: '#fde68a' },
  CRITICAL: { label: 'Critique', color: '#dc2626', bg: '#fee2e2', border: '#fecaca' },
};

/**
 * `ACCESS_REQUEST_APPROVED` → `Accès · Demande approuvée`.
 *
 * Les codes d'action sont générés à partir du nom de l'événement
 * (`access_request.approved`), donc la traduction affichée est un confort de
 * lecture. En cas de code inconnu, on affiche le code brut plutôt que de
 * masquer la trace : mieux vaut une ligne techniquement illisible qu'une ligne
 * absente.
 */
function humanizeAction(action = '') {
  const [domain, ...rest] = action.toLowerCase().split('_');
  const domainLabels = {
    access: 'Accès', opportunity: 'Opportunité', task: 'Tâche',
    project: 'Projet', grade: 'Note', tuition: 'Scolarité',
    document: 'Document', incident: 'Incident', enrollment: 'Inscription',
    user: 'Utilisateur', ai: 'IA',
  };
  const domainLabel = domainLabels[domain] ?? (domain || 'trace');
  const restLabel = rest.join(' ').replace(/_/g, ' ').trim();
  return restLabel ? `${domainLabel} · ${restLabel}` : domainLabel;
}

/** Datetime lisible, en heure locale. */
function formatDateTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

/**
 * Journal d'audit.
 *
 * Lecture seule par construction : l'API n'expose ni création ni suppression
 * d'entrée. L'écran ne propose donc aucun bouton d'écriture — il n'y a rien à
 * écrire depuis l'interface, et ajouter un tel bouton serait mentir sur les
 * capacités du système.
 *
 * L'accès est protégé deux fois : par la permission `audit.read` côté API, et
 * par `ProtectedRoute` côté interface. La seconde barrière est un confort, pas
 * une sécurité — c'est Symfony qui refuse réellement.
 */
const AuditLog = () => {
  const { hasPermission } = useAuth();
  const canRead = hasPermission('audit.read');

  const [entries,   setEntries]   = useState([]);
  const [meta,      setMeta]      = useState(null);
  const [filters,   setFilters]   = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [expanded,  setExpanded]  = useState(null);

  const [page,       setPage]       = useState(1);
  const [category,   setCategory]   = useState('');
  const [severity,   setSeverity]   = useState('');
  const [actorQuery, setActorQuery] = useState('');

  // Un changement de filtre ramène à la première page : rester en page 7 avec
  // un nouveau filtre afficherait le plus souvent un écran vide.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setPage(1); }, [category, severity]);

  const loadFilters = useCallback(async () => {
    try {
      const res = await auditService.getFilters();
      if (res?.success) setFilters(res.data);
    } catch {
      // Sans la liste des filtres, l'écran reste consultable avec les valeurs
      // par défaut ; on n'interrompt pas la lecture du journal.
    }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await auditService.list({
        page,
        limit: 50,
        category: category || undefined,
        severity: severity || undefined,
        actor: actorQuery || undefined,
      });
      if (res?.success) {
        setEntries(res.data ?? []);
        setMeta(res.meta ?? null);
      } else {
        setError('Réponse inattendue du serveur.');
      }
    } catch {
      // Pas de repli sur un journal d'exemple : on affiche l'échec, sinon
      // l'administrateur croirait le journal complet alors qu'il est vide.
      setEntries([]);
      setMeta(null);
      setError('Le journal d\'audit n\'a pas pu être chargé.');
    } finally {
      setLoading(false);
    }
  }, [page, category, severity, actorQuery]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!canRead) { setLoading(false); return; }
    loadFilters();
  }, [canRead, loadFilters]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (canRead) load();
  }, [canRead, load]);

  if (!canRead) {
    return (
      <div className="p-8">
        <div className="rounded-2xl glass-panel p-8 text-center max-w-lg mx-auto mt-12 border-red-200">
          <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 mx-auto mb-4 border border-red-200">
            <span className="material-symbols-outlined notranslate text-[32px]">block</span>
          </div>
          <p className="font-extrabold text-slate-800 text-lg">Accès refusé</p>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            La permission <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded-md text-slate-600 border border-slate-200">audit.read</code> est nécessaire pour consulter le journal d'audit.
          </p>
        </div>
      </div>
    );
  }

  const counts = meta?.byCategory ?? {};
  const totalEntries = meta?.total ?? 0;

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* En-tête */}
      <div className="flex flex-wrap items-end justify-between gap-4 glass-panel-dark p-6 rounded-2xl border border-slate-800/60 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <span className="material-symbols-outlined notranslate text-[24px]">history</span>
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Journal d'audit</h1>
            <p className="mt-1 text-sm text-slate-400 font-medium">
              Trace nominative des actions réalisées sur la plateforme. Lecture seule.
            </p>
          </div>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-all shadow-sm"
        >
          <span className="material-symbols-outlined notranslate text-[18px]">refresh</span>
          Actualiser
        </button>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl glass-panel p-4 border border-slate-200/60 shadow-sm">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <span className="material-symbols-outlined notranslate text-[18px] text-slate-400">filter_alt</span>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white/50 px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">Tous les modules</option>
            {(filters?.categories ?? Object.keys(CATEGORY_LABELS)).map(c => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c] ?? c}{counts[c] !== undefined ? ` (${counts[c]})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <span className="material-symbols-outlined notranslate text-[18px] text-slate-400">error</span>
          <select
            value={severity}
            onChange={e => setSeverity(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white/50 px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">Toutes gravités</option>
            {(filters?.severities ?? ['INFO', 'WARNING', 'CRITICAL']).map(s => (
              <option key={s} value={s}>{SEVERITY_STYLE[s]?.label ?? s}</option>
            ))}
          </select>
        </div>

        <div className="relative flex-1 min-w-[250px]">
          <span className="material-symbols-outlined notranslate absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">search</span>
          <input
            value={actorQuery}
            onChange={e => setActorQuery(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') load(); }}
            placeholder="Rechercher un auteur (email)…"
            className="w-full rounded-xl border border-slate-200 bg-white/50 pl-9 pr-3 py-2 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {(category || severity || actorQuery) && (
          <button
            onClick={() => { setCategory(''); setSeverity(''); setActorQuery(''); }}
            className="px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* État d'erreur */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50/80 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined notranslate text-red-500">error</span>
            <p className="text-sm font-bold text-red-700">{error}</p>
          </div>
          <button onClick={load} className="text-xs font-bold text-red-600 hover:underline px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors">
            Réessayer
          </button>
        </div>
      )}

      {loading && entries.length === 0 && (
        <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-3">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
          <p className="text-sm font-medium">Chargement du journal…</p>
        </div>
      )}

      {!loading && !error && entries.length === 0 && (
        <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2 glass-panel rounded-2xl border border-dashed border-slate-300">
          <span className="material-symbols-outlined notranslate text-[32px] text-slate-300">search_off</span>
          <p className="text-sm font-bold text-slate-500">
            Aucune entrée pour ces critères.
          </p>
        </div>
      )}

      {/* Tableau */}
      {entries.length > 0 && (
        <div className="overflow-hidden rounded-2xl glass-panel shadow-sm border border-slate-200/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-50/80 text-[10px] uppercase tracking-widest text-slate-500 font-extrabold border-b border-slate-200">
                <tr>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Action</th>
                  <th className="px-5 py-4">Auteur</th>
                  <th className="px-5 py-4">Description</th>
                  <th className="px-5 py-4">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {entries.map(entry => {
                  const sev = SEVERITY_STYLE[entry.severity] ?? SEVERITY_STYLE.INFO;
                  const isOpen = expanded === entry.id;

                  return (
                    <React.Fragment key={entry.id}>
                      <tr className={`align-top transition-colors hover:bg-slate-50/50 ${isOpen ? 'bg-slate-50/80' : ''}`}>
                        <td className="px-5 py-4 text-slate-500 font-medium text-[11px]">
                          {formatDateTime(entry.createdAt)}
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-extrabold text-slate-800">{humanizeAction(entry.action)}</div>
                          <div className="mt-1.5 flex flex-wrap gap-1.5">
                            <span className="rounded-md px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest border"
                                  style={{ color: sev.color, backgroundColor: sev.bg, borderColor: sev.border }}>
                              {sev.label}
                            </span>
                            <span className="rounded-md bg-slate-100 border border-slate-200 px-1.5 py-0.5 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                              {CATEGORY_LABELS[entry.category] ?? entry.category}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          {entry.actor?.name ? (
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0 border border-blue-200">
                                {entry.actor.name.substring(0,2).toUpperCase()}
                              </div>
                              <div className="flex flex-col">
                                <div className="font-bold text-slate-800 text-[12px]">{entry.actor.name}</div>
                                <div className="text-[10px] text-slate-400 font-medium">{entry.actorEmail}</div>
                              </div>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-500">
                              <span className="material-symbols-outlined notranslate text-[14px]">smart_toy</span>
                              {entry.actorEmail ?? 'Système'}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="text-slate-700 font-medium whitespace-normal min-w-[200px]">
                            {entry.description}
                          </div>
                          {entry.metadata && (
                            <button
                              onClick={() => setExpanded(isOpen ? null : entry.id)}
                              className="mt-2 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md hover:bg-blue-100 transition-colors flex items-center gap-1 w-fit"
                            >
                              {isOpen ? 'Masquer les détails' : 'Voir les détails techniques'}
                              <span className="material-symbols-outlined notranslate text-[14px]">{isOpen ? 'expand_less' : 'expand_more'}</span>
                            </button>
                          )}
                        </td>
                        <td className="px-5 py-4 font-mono text-[10px] text-slate-400 font-medium">
                          {entry.actorIp ?? '—'}
                        </td>
                      </tr>

                      {isOpen && entry.metadata && (
                        <tr className="bg-slate-50/80 border-b border-slate-200 shadow-inner">
                          <td colSpan={5} className="px-5 py-4">
                            <div className="rounded-xl bg-slate-900 p-4 overflow-x-auto shadow-inner border border-slate-800">
                              <pre className="font-mono text-[11px] text-emerald-400 whitespace-pre-wrap break-all leading-relaxed">
                                {JSON.stringify(entry.metadata, null, 2)}
                              </pre>
                            </div>
                            {entry.targetType && (
                              <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[10px] font-bold text-slate-500 shadow-sm">
                                <span className="material-symbols-outlined notranslate text-[14px]">target</span>
                                Cible : <span className="text-slate-800">{entry.targetType}#{entry.targetId ?? '—'}</span>
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {meta && meta.pages > 1 && (
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 pt-2">
          <span>{totalEntries} entrée(s) — page {meta.page} sur {meta.pages}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={meta.page <= 1}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:hover:bg-white text-slate-700 shadow-sm flex items-center gap-1"
            >
              <span className="material-symbols-outlined notranslate text-[16px]">chevron_left</span>
              Précédent
            </button>
            <button
              onClick={() => setPage(p => Math.min(meta.pages, p + 1))}
              disabled={meta.page >= meta.pages}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:hover:bg-white text-slate-700 shadow-sm flex items-center gap-1"
            >
              Suivant
              <span className="material-symbols-outlined notranslate text-[16px]">chevron_right</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLog;

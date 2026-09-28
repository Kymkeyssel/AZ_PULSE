import React, { useState, useEffect, useCallback } from 'react';

import { auditService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

// ── Design tokens AZ PULSE ────────────────────────────────────────────────────
const C = {
  navy:      '#001026',
  blue:      '#004ad1',
  blueSoft:  '#eff6ff',
  border:    '#dde3ef',
  textMuted: '#6b7a99',
  textBody:  '#1c2a45',
  green:     '#16a34a',
  greenBg:   '#dcfce7',
  amber:     '#d97706',
  amberBg:   '#fef3c7',
  red:       '#dc2626',
  redBg:     '#fee2e2',
};

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
  INFO:     { label: 'Info',     color: C.blue,   bg: C.blueSoft },
  WARNING:  { label: 'Avert.',   color: C.amber,  bg: C.amberBg },
  CRITICAL: { label: 'Critique', color: C.red,    bg: C.redBg },
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
    if (!canRead) { setLoading(false); return; }
    loadFilters();
  }, [canRead, loadFilters]);

  useEffect(() => {
    if (canRead) load();
  }, [canRead, load]);

  if (!canRead) {
    return (
      <div className="p-8">
        <div className="rounded-2xl border border-[#dde3ef] bg-white p-6 text-center">
          <p className="font-bold text-[#001026]">Accès refusé</p>
          <p className="mt-1 text-sm text-[#6b7a99]">
            La permission <code className="font-mono">audit.read</code> est nécessaire pour consulter le journal d'audit.
          </p>
        </div>
      </div>
    );
  }

  const counts = meta?.byCategory ?? {};
  const totalEntries = meta?.total ?? 0;

  return (
    <div className="p-8 space-y-5">
      {/* En-tête */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-[#001026]">Journal d'audit</h1>
          <p className="mt-1 text-sm text-[#6b7a99]">
            Trace nominative des actions réalisées sur la plateforme. Lecture seule.
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-1.5 rounded-xl border border-[#dde3ef] bg-white px-3 py-2 text-xs font-bold text-[#1c2a45] hover:bg-[#f4f7fb]"
        >
          <span className="material-symbols-outlined notranslate text-[16px]">refresh</span>
          Actualiser
        </button>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#dde3ef] bg-white p-3">
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="rounded-xl border border-[#dde3ef] bg-white px-3 py-2 text-xs font-semibold text-[#1c2a45]"
        >
          <option value="">Tous les modules</option>
          {(filters?.categories ?? Object.keys(CATEGORY_LABELS)).map(c => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c] ?? c}{counts[c] !== undefined ? ` (${counts[c]})` : ''}
            </option>
          ))}
        </select>

        <select
          value={severity}
          onChange={e => setSeverity(e.target.value)}
          className="rounded-xl border border-[#dde3ef] bg-white px-3 py-2 text-xs font-semibold text-[#1c2a45]"
        >
          <option value="">Toutes gravités</option>
          {(filters?.severities ?? ['INFO', 'WARNING', 'CRITICAL']).map(s => (
            <option key={s} value={s}>{SEVERITY_STYLE[s]?.label ?? s}</option>
          ))}
        </select>

        <input
          value={actorQuery}
          onChange={e => setActorQuery(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') load(); }}
          placeholder="Rechercher un auteur (email)…"
          className="flex-1 min-w-48 rounded-xl border border-[#dde3ef] px-3 py-2 text-xs"
        />

        {(category || severity || actorQuery) && (
          <button
            onClick={() => { setCategory(''); setSeverity(''); setActorQuery(''); }}
            className="text-xs font-bold text-[#dc2626] hover:underline"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* État d'erreur — pas de données fictives en repli */}
      {error && (
        <div className="rounded-2xl border border-[#fee2e2] bg-[#fee2e2]/40 p-4">
          <p className="text-sm font-bold text-[#dc2626]">{error}</p>
          <button onClick={load} className="mt-1 text-xs font-bold text-[#dc2626] underline">
            Réessayer
          </button>
        </div>
      )}

      {loading && entries.length === 0 && (
        <p className="py-10 text-center text-sm text-[#6b7a99]">Chargement du journal…</p>
      )}

      {!loading && !error && entries.length === 0 && (
        <p className="py-10 text-center text-sm text-[#6b7a99]">
          Aucune entrée pour ces critères.
        </p>
      )}

      {/* Tableau */}
      {entries.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-[#dde3ef] bg-white">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f4f7fb] text-[10px] uppercase tracking-wider text-[#6b7a99]">
              <tr>
                <th className="px-4 py-3 font-bold">Date</th>
                <th className="px-4 py-3 font-bold">Action</th>
                <th className="px-4 py-3 font-bold">Auteur</th>
                <th className="px-4 py-3 font-bold">Description</th>
                <th className="px-4 py-3 font-bold">IP</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(entry => {
                const sev = SEVERITY_STYLE[entry.severity] ?? SEVERITY_STYLE.INFO;
                const isOpen = expanded === entry.id;

                return (
                  <React.Fragment key={entry.id}>
                    <tr className="border-t border-[#eef1f6] align-top">
                      <td className="whitespace-nowrap px-4 py-3 text-[#6b7a99]">
                        {formatDateTime(entry.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-[#001026]">{humanizeAction(entry.action)}</div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          <span className="rounded-full px-1.5 py-0.5 text-[9px] font-bold"
                                style={{ color: sev.color, backgroundColor: sev.bg }}>
                            {sev.label}
                          </span>
                          <span className="rounded-full bg-[#f4f7fb] px-1.5 py-0.5 text-[9px] font-bold text-[#6b7a99]">
                            {CATEGORY_LABELS[entry.category] ?? entry.category}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {entry.actor?.name ? (
                          <>
                            <div className="font-semibold text-[#1c2a45]">{entry.actor.name}</div>
                            <div className="text-[10px] text-[#6b7a99]">{entry.actorEmail}</div>
                          </>
                        ) : (
                          // Action automatique, ou compte supprimé depuis.
                          <span className="italic text-[#6b7a99]">
                            {entry.actorEmail ?? 'Système'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[#1c2a45]">
                        {entry.description}
                        {entry.metadata && (
                          <button
                            onClick={() => setExpanded(isOpen ? null : entry.id)}
                            className="ml-2 text-[10px] font-bold text-[#004ad1] hover:underline"
                          >
                            {isOpen ? 'masquer' : 'détails'}
                          </button>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-[10px] text-[#6b7a99]">
                        {entry.actorIp ?? '—'}
                      </td>
                    </tr>

                    {isOpen && entry.metadata && (
                      <tr className="border-t border-[#eef1f6] bg-[#f9fbfe]">
                        <td colSpan={5} className="px-4 py-3">
                          <div className="font-mono text-[10px] text-[#1c2a45] whitespace-pre-wrap break-all">
                            {JSON.stringify(entry.metadata, null, 2)}
                          </div>
                          {entry.targetType && (
                            <div className="mt-1 text-[10px] text-[#6b7a99]">
                              Cible : {entry.targetType}#{entry.targetId ?? '—'}
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
      )}

      {/* Pagination */}
      {meta && meta.pages > 1 && (
        <div className="flex items-center justify-between text-xs text-[#6b7a99]">
          <span>{totalEntries} entrée(s) — page {meta.page} sur {meta.pages}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={meta.page <= 1}
              className="rounded-xl border border-[#dde3ef] bg-white px-3 py-1.5 font-bold disabled:opacity-40"
            >
              Précédent
            </button>
            <button
              onClick={() => setPage(p => Math.min(meta.pages, p + 1))}
              disabled={meta.page >= meta.pages}
              className="rounded-xl border border-[#dde3ef] bg-white px-3 py-1.5 font-bold disabled:opacity-40"
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLog;

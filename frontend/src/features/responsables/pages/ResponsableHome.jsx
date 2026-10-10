import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { crmService } from '../../../services/api';
import { formatAmountCompact } from '../lib/format';

/**
 * Accueil de l'espace collaborateur.
 *
 * Un seul écran pour tous les postes : les blocs affichés dépendent de la
 * spécialisation, et les chiffres dépendent des droits réellement accordés.
 * Un collaborateur sans `crm.read` ne voit aucun indicateur CRM — le bloc
 * n'est pas masqué par coquetterie, il n'a rien à afficher.
 */
const ResponsableHome = () => {
  const { fullName, primaryRole, hasPermission, primaryRoleLabel } = useAuth();

  const dedicatedHome = {
    RESPONSABLE_CRM: '/responsable/crm',
    RESPONSABLE_FORMATION: '/responsable/formations',
    FORMATEUR: '/responsable/formations',
    RESPONSABLE_IT: '/responsable/infrastructure',
    RESPONSABLE_KNOWLEDGE: '/responsable/documents',
    RESPONSABLE_WORKSPACE: '/responsable/projets',
    RESPONSABLE_ANALYTICS: '/responsable/analytics',
  }[primaryRole];
  if (dedicatedHome) return <Navigate to={dedicatedHome} replace />;

  const canReadCrm = hasPermission('crm.read');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!canReadCrm) return;

    let cancelled = false;
    crmService.getStats()
      .then(res => { if (!cancelled) setStats(res.data); })
      .catch(() => { if (!cancelled) setStats(null); });

    return () => { cancelled = true; };
  }, [canReadCrm]);

  // Contenu éditorial propre à chaque spécialisation.
  const PROFILE_CONTENT = {
    RESPONSABLE_CRM: {
      icon: 'handshake',
      headline: 'Votre portefeuille commercial',
      intro: 'Suivez vos affaires, faites évoluer le pipeline et ne laissez filer aucune relance.',
      shortcut: { to: '/responsable/crm', label: 'Ouvrir le pipeline', icon: 'arrow_forward' },
    },
    FORMATEUR: {
      icon: 'co_present',
      headline: 'Vos sessions de formation',
      intro: 'Animez vos cohorts et suivez les apprenants qui vous sont confiés.',
      shortcut: { to: '/responsable/formations', label: 'Mes formations', icon: 'arrow_forward' },
    },
    RESPONSABLE_IT: {
      icon: 'support_agent',
      headline: 'Votre centre de support',
      intro: 'Traitez les incidents et suivez la maintenance du parc informatique.',
      shortcut: { to: '/responsable/infrastructure', label: 'Infrastructure & IT', icon: 'arrow_forward' },
    },
    RESPONSABLE_KNOWLEDGE: {
      icon: 'campaign',
      headline: 'Votre espace de communication',
      intro: 'Rédigez et publiez la documentation interne de l’entreprise.',
      shortcut: { to: '/responsable/documents', label: 'Documents', icon: 'arrow_forward' },
    },
    RESPONSABLE_WORKSPACE: {
      icon: 'folder_special',
      headline: 'Espace Projets',
      intro: 'Suivez la progression de vos projets.',
      shortcut: { to: '/responsable/projets', label: 'Projets', icon: 'arrow_forward' },
    },
    GENERIQUE: {
      icon: 'badge',
      headline: 'Bienvenue dans votre espace',
      intro: 'Retrouvez ici les modules et ressources autorisés pour votre poste.',
      shortcut: { to: '/responsable/documents', label: 'Documents', icon: 'arrow_forward' },
    },
  };

  const content = PROFILE_CONTENT[primaryRole] ?? PROFILE_CONTENT.GENERIQUE;

  /**
   * Indicateurs. Les valeurs viennent de l'API ; sans accès CRM, le bloc
   * n'est pas rendu du tout plutôt que d'afficher des tirets.
   */
  const kpis = canReadCrm && stats
    ? [
        { label: 'Affaires ouvertes', value: stats.openOpportunities ?? 0, icon: 'ads_click',      hint: 'Pipeline en cours' },
        { label: 'Montant pondéré',   value: formatAmountCompact(stats.weightedAmount), icon: 'query_stats', hint: 'montant × probabilité' },
        {
          label: 'Relances en retard',
          value: stats.reminders?.overdue ?? 0,
          icon: 'notifications_active',
          hint: 'à traiter en priorité',
          urgent: (stats.reminders?.overdue ?? 0) > 0,
        },
        { label: "Relances aujourd'hui", value: stats.reminders?.today ?? 0, icon: 'today',       hint: 'planifiées' },
      ]
    : [];

  return (
    <div className="max-w-screen-xl mx-auto space-y-6">

      {/* ── Bandeau de bienvenue ───────────────────────────────────────── */}
      <header
        style={{ background: 'linear-gradient(135deg, #001026 0%, #0b2545 100%)' }}
        className="rounded-2xl p-7 relative overflow-hidden shadow-lg"
      >
        <div className="relative z-10 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined notranslate text-[26px] text-[#fbbf24]">{content.icon}</span>
          </div>
          <div>
            <p className="text-[#fbbf24] text-[10px] font-black uppercase tracking-widest mb-1">
              {primaryRoleLabel ?? 'Responsable'}
            </p>
            <h1 className="text-white text-2xl font-extrabold tracking-tight">
              {content.headline}
            </h1>
            <p className="text-white/60 text-sm mt-1.5 max-w-2xl leading-relaxed">
              Bonjour {fullName?.split(' ')[0] ?? ''}, {content.intro}
            </p>
          </div>
        </div>
        <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-white/[0.03] blur-2xl pointer-events-none" />
      </header>

      {/* ── Indicateurs réels ──────────────────────────────────────────── */}
      {kpis.length > 0 && (
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map(kpi => (
            <div
              key={kpi.label}
              className={[
                'bg-white rounded-xl border p-5 shadow-sm',
                kpi.urgent ? 'border-red-200 bg-red-50/40' : 'border-[#dde3ef]',
              ].join(' ')}
            >
              <div className="flex items-start justify-between mb-3 gap-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#6b7a99]">{kpi.label}</p>
                <div
                  className={[
                    'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0',
                    kpi.urgent ? 'bg-red-100 text-red-600' : 'bg-[#eff6ff] text-[#004ad1]',
                  ].join(' ')}
                >
                  <span className="material-symbols-outlined notranslate text-[19px]">{kpi.icon}</span>
                </div>
              </div>
              <p className="text-3xl font-black text-[#001026] leading-none">{kpi.value}</p>
              <p className="text-[11px] text-[#6b7a99] mt-2">{kpi.hint}</p>
            </div>
          ))}
        </section>
      )}

      {/* ── Accès rapides ───────────────────────────────────────────────── */}
      <section className="grid sm:grid-cols-2 gap-4">
        {canReadCrm && (
          <Link
            to="/responsable/relances"
            className="flex items-center justify-between gap-4 bg-white rounded-xl border border-[#dde3ef] p-5 shadow-sm hover:border-[#004ad1] transition-colors group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#0b2545] text-white flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined notranslate text-[20px]">task_alt</span>
              </div>
              <div>
                <p className="text-sm font-bold text-[#001026]">Mes relances</p>
                <p className="text-xs text-[#6b7a99]">Ce qu&apos;il reste à faire</p>
              </div>
            </div>
            <span className="material-symbols-outlined notranslate text-[#004ad1] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </Link>
        )}

        <Link
          to={content.shortcut.to}
          className="flex items-center justify-between gap-4 bg-white rounded-xl border border-[#dde3ef] p-5 shadow-sm hover:border-[#004ad1] transition-colors group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#0b2545] text-white flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined notranslate text-[20px]">{content.icon}</span>
            </div>
            <div>
              <p className="text-sm font-bold text-[#001026]">{content.shortcut.label}</p>
              <p className="text-xs text-[#6b7a99]">
                {canReadCrm ? 'Prospects, affaires et historique' : 'Module de votre poste'}
              </p>
            </div>
          </div>
          <span className="material-symbols-outlined notranslate text-[#004ad1] group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </Link>
      </section>

      {/* ── Planning de la semaine ──────────────────────────────────────── */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Planning */}
        <div className="bg-white rounded-xl border border-[#dde3ef] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-extrabold text-[#001026] text-sm flex items-center gap-2">
              <span className="material-symbols-outlined notranslate text-[20px] text-[#004ad1]">calendar_month</span>
              Planning de la Semaine
              <span className="text-[10px] font-bold text-[#6b7a99] ml-1">
                Semaine {Math.ceil((new Date().getDate() + new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay()) / 7)}
              </span>
            </h2>
            <button type="button" className="text-[11px] font-bold text-[#004ad1] hover:opacity-70 transition-opacity flex items-center gap-1">
              Voir planning complet
              <span className="material-symbols-outlined notranslate text-[13px]">arrow_forward</span>
            </button>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {(['LUN', 'MAR', 'MER', 'JEU', 'VEN']).map((jour, idx) => {
              const today = new Date().getDay(); // 0=dim, 1=lun...
              const isToday = (today === idx + 1);
              const isPast = (today > idx + 1);
              const dayNum = (() => {
                const d = new Date();
                const diff = (idx + 1) - d.getDay();
                const dt = new Date(d); dt.setDate(d.getDate() + diff);
                return dt.getDate();
              })();
              return (
                <div key={jour}
                  className={[
                    'flex flex-col items-center p-2 rounded-xl text-center transition-all',
                    isToday
                      ? 'bg-[#001026] text-white shadow-lg'
                      : isPast
                      ? 'bg-[#f4f7fb] text-[#6b7a99]'
                      : 'bg-[#f4f7fb] hover:bg-[#edf1f7] text-[#1c2a45]',
                  ].join(' ')}
                >
                  <span className={['text-[10px] font-black uppercase tracking-wider', isToday ? 'text-[#fbbf24]' : ''].join(' ')}>{jour}</span>
                  <span className={['text-xl font-extrabold mt-0.5', isToday ? 'text-white' : ''].join(' ')}>{dayNum}</span>
                  {isToday && (
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#fbbf24] animate-pulse" />
                  )}
                  {!isToday && (
                    <span className="mt-1 text-[9px] text-[#6b7a99]">{isPast ? '✓' : '—'}</span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-3 p-3 rounded-lg bg-[#f4f7fb] border border-[#dde3ef] flex items-center gap-2">
            <span className="material-symbols-outlined notranslate text-[16px] text-[#004ad1]">schedule</span>
            <span className="text-[11px] text-[#44474e]">Total heures allouées cette semaine : <strong className="text-[#001026]">—</strong></span>
            <span className="ml-auto text-[10px] text-[#6b7a99]">Données projet en temps réel</span>
          </div>
        </div>

        {/* Incidents & GLPI */}
        <div className="bg-white rounded-xl border border-[#dde3ef] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-extrabold text-[#001026] text-sm flex items-center gap-2">
              <span className="material-symbols-outlined notranslate text-[20px] text-red-500">crisis_alert</span>
              Incidents &amp; GLPI
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />GLPI Sync
              </span>
            </h2>
            <button type="button" className="text-[11px] font-bold text-[#004ad1] hover:opacity-70 transition-opacity flex items-center gap-1">
              Ouvrir console GLPI
              <span className="material-symbols-outlined notranslate text-[13px]">arrow_forward</span>
            </button>
          </div>
          <div className="space-y-3">
            <div className="rounded-lg p-3 bg-[#f4f7fb] border border-[#dde3ef] flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined notranslate text-[16px]">laptop</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-[#001026]">#IT-884</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">Logiciel</span>
                  <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-bold border border-green-200">Validé DSI</span>
                </div>
                <p className="text-xs font-semibold text-[#001026] mt-0.5">Demande de licence Wireshark Enterprise</p>
                <p className="text-[11px] text-[#6b7a99]">Attribution de clé pour analyse de paquets sur le cluster bancaire.</p>
              </div>
            </div>
            <div className="rounded-lg p-3 bg-[#f4f7fb] border border-[#dde3ef] flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined notranslate text-[16px]">device_hub</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-[#001026]">#GLPI-412</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold">Matériel</span>
                  <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200">En attente magasin</span>
                </div>
                <p className="text-xs font-semibold text-[#001026] mt-0.5">Changement switch Cisco Catalyst 2960 test</p>
                <p className="text-[11px] text-[#6b7a99]">Remplacement port 08 défectueux pour banc d'essai lab Yaoundé.</p>
              </div>
            </div>
          </div>
          <button type="button" className="mt-3 w-full py-2 rounded-lg text-[12px] font-bold text-[#004ad1] hover:bg-[#eff6ff] transition-colors border border-dashed border-[#004ad1]/30 flex items-center justify-center gap-1.5">
            <span className="material-symbols-outlined notranslate text-[16px]">add_circle</span>
            + Nouvelle requête GLPI
          </button>
        </div>
      </section>

      {/* ── Mention d'état ──────────────────────────────────────────────── */}

      <p className="text-[11px] text-[#6b7a99] text-center">
        {/* La « spécialisation » a été retirée du modèle (colonne
            `users.collaborator_profile` et colonne `AccessRequest`), mais la
            ligne d'état la référençait encore : le rendu de cet écran levait
            un ReferenceError. `primaryRole` est désormais la seule référence,
            et c'est bien elle qui pilote le contenu ci-dessus. */}
        Rôle : <span className="font-mono font-semibold text-[#0b2545]">{primaryRoleLabel}</span>
        {' · '}Les modules non autorisés par l&apos;administrateur restent inaccessibles.
      </p>
    </div>
  );
};

export default ResponsableHome;

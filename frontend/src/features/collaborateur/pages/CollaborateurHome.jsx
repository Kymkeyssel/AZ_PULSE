import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
const CollaborateurHome = () => {
  const { fullName, collaboratorProfile, collaboratorProfileLabel, hasPermission, primaryRoleLabel } = useAuth();

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
    COMMERCIAL: {
      icon: 'handshake',
      headline: 'Votre portefeuille commercial',
      intro: 'Suivez vos affaires, faites évoluer le pipeline et ne laissez filer aucune relance.',
      shortcut: { to: '/collaborateur/crm', label: 'Ouvrir le pipeline', icon: 'arrow_forward' },
    },
    FORMATEUR: {
      icon: 'co_present',
      headline: 'Vos sessions de formation',
      intro: 'Animez vos cohorts et suivez les apprenants qui vous sont confiés.',
      shortcut: { to: '/collaborateur/formations', label: 'Mes formations', icon: 'arrow_forward' },
    },
    SUPPORT_IT: {
      icon: 'support_agent',
      headline: 'Votre centre de support',
      intro: 'Traitez les incidents et suivez la maintenance du parc informatique.',
      shortcut: { to: '/collaborateur/infrastructure', label: 'Infrastructure & IT', icon: 'arrow_forward' },
    },
    COMMUNICATION: {
      icon: 'campaign',
      headline: 'Votre espace de communication',
      intro: 'Rédigez et publiez la documentation interne de l’entreprise.',
      shortcut: { to: '/collaborateur/documents', label: 'Documents', icon: 'arrow_forward' },
    },
    GENERIQUE: {
      icon: 'badge',
      headline: 'Bienvenue dans votre espace',
      intro: 'Retrouvez ici les modules et ressources autorisés pour votre poste.',
      shortcut: { to: '/collaborateur/documents', label: 'Documents', icon: 'arrow_forward' },
    },
  };

  const content = PROFILE_CONTENT[collaboratorProfile] ?? PROFILE_CONTENT.GENERIQUE;

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
              {collaboratorProfileLabel ?? 'Collaborateur'}
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
            to="/collaborateur/relances"
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

      {/* ── Mention d'état ──────────────────────────────────────────────── */}
      <p className="text-[11px] text-[#6b7a99] text-center">
        Spécialisation : <span className="font-mono font-semibold text-[#0b2545]">{collaboratorProfile ?? '—'}</span>
        {' · '}Rôle : <span className="font-mono font-semibold text-[#0b2545]">{primaryRoleLabel}</span>
        {' · '}Les modules non autorisés par l&apos;administrateur restent inaccessibles.
      </p>
    </div>
  );
};

export default CollaborateurHome;

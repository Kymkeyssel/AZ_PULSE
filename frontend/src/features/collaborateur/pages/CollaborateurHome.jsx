import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { crmService } from '../../../services/api';
import { formatAmountCompact } from '../lib/format';
import AIInsightsWidget from '../components/AIInsightsWidget';
import AIChatDrawer from '../components/AIChatDrawer';
import { Sparkles, Bot } from 'lucide-react';

/**
 * Accueil de l'espace collaborateur.
 *
 * Un seul écran pour tous les postes : les blocs affichés dépendent de la
 * spécialisation, et les chiffres dépendent des droits réellement accordés.
 * Un collaborateur sans `crm.read` ne voit aucun indicateur CRM — le bloc
 * n'est pas masqué par coquetterie, il n'a rien à afficher.
 */
const CollaborateurHome = () => {
  const { fullName, primaryRole, collaboratorProfile, collaboratorProfileLabel, hasPermission, primaryRoleLabel } = useAuth();

  const canReadCrm = hasPermission('crm.read');
  const [stats, setStats] = useState(null);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

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
    RESPONSABLE_KNOWLEDGE: {
      icon: 'menu_book',
      headline: 'Votre Knowledge Hub',
      intro: 'Gérez la base de connaissances, validez les articles et supervisez la documentation interne.',
      shortcut: { to: '/collaborateur/documents', label: 'Ouvrir le Knowledge Hub', icon: 'arrow_forward' },
    },
    GENERIQUE: {
      icon: 'badge',
      headline: 'Bienvenue dans votre espace',
      intro: 'Retrouvez ici les modules et ressources autorisés pour votre poste.',
      shortcut: { to: '/collaborateur/documents', label: 'Documents', icon: 'arrow_forward' },
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
      <header className="glass-panel-dark rounded-3xl p-8 relative overflow-hidden mb-8 border-0 ring-1 ring-white/20">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-blue-900/40 to-transparent mix-blend-overlay"></div>
        <div className="relative z-10 flex items-start gap-5">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0 backdrop-blur-md shadow-inner border border-white/10 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined notranslate text-[32px] text-blue-300 drop-shadow-md">{content.icon}</span>
          </div>
          <div className="flex-1">
            <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest mb-1.5 drop-shadow">
              {collaboratorProfileLabel ?? 'Collaborateur'}
            </p>
            <h1 className="text-white text-3xl font-extrabold tracking-tight drop-shadow-lg">
              {content.headline}
            </h1>
            <p className="text-blue-100/80 text-sm mt-2 max-w-2xl leading-relaxed font-medium">
              Bonjour {fullName?.split(' ')[0] ?? ''}, {content.intro}
            </p>
          </div>

          <button
            onClick={() => setIsAiChatOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 border border-white/20 transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Assistant IA Métier</span>
          </button>
        </div>
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-400/20 blur-3xl pointer-events-none mix-blend-screen" />
      </header>

      {/* ── Widget IA Global Spécialisation ─────────────────────────────── */}
      <AIInsightsWidget
        metrics={{
          profil: collaboratorProfile,
          role: primaryRoleLabel,
          stats: stats || {},
        }}
        scope={`Espace ${collaboratorProfileLabel || 'Collaborateur'}`}
        title="Synthèse Stratégique & Suggestions IA"
      />

      {/* ── Indicateurs réels ──────────────────────────────────────────── */}
      {kpis.length > 0 && (
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {kpis.map(kpi => (
            <div
              key={kpi.label}
              className={[
                'rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group',
                kpi.urgent ? 'bg-red-50/80 border border-red-200/50 shadow-red-500/10' : 'glass-panel hover:shadow-xl'
              ].join(' ')}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-start justify-between mb-4 gap-2 relative z-10">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{kpi.label}</p>
                <div
                  className={[
                    'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner group-hover:scale-110 transition-transform',
                    kpi.urgent ? 'bg-red-100 text-red-600' : 'bg-blue-50/50 text-blue-600'
                  ].join(' ')}
                >
                  <span className="material-symbols-outlined notranslate text-[22px]">{kpi.icon}</span>
                </div>
              </div>
              <p className="text-4xl font-black text-slate-800 leading-none relative z-10 drop-shadow-sm">{kpi.value}</p>
              <p className="text-xs text-slate-500 mt-3 font-medium relative z-10">{kpi.hint}</p>
              
              {/* Decorative background glow */}
              <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-blue-400/10 blur-2xl group-hover:bg-blue-400/20 transition-colors"></div>
            </div>
          ))}
        </section>
      )}

      {/* ── Accès rapides ───────────────────────────────────────────────── */}
      <section className="grid sm:grid-cols-2 gap-5 pt-4">
        {canReadCrm && (
          <Link
            to="/collaborateur/relances"
            className="flex items-center justify-between gap-4 glass-panel p-6 hover:border-blue-300 hover:shadow-lg transition-all group rounded-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-slate-800 text-white flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined notranslate text-[24px]">task_alt</span>
              </div>
              <div>
                <p className="text-base font-extrabold text-slate-800">Mes relances</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Ce qu&apos;il reste à faire</p>
              </div>
            </div>
            <span className="material-symbols-outlined notranslate text-blue-600 text-3xl group-hover:translate-x-2 transition-transform relative z-10 drop-shadow-sm">
              arrow_circle_right
            </span>
          </Link>
        )}

        <Link
          to={content.shortcut.to}
          className="flex items-center justify-between gap-4 glass-panel p-6 hover:border-blue-300 hover:shadow-lg transition-all group rounded-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined notranslate text-[24px]">{content.icon}</span>
            </div>
            <div>
              <p className="text-base font-extrabold text-slate-800">{content.shortcut.label}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {canReadCrm ? 'Prospects, affaires et historique' : 'Module de votre poste'}
              </p>
            </div>
          </div>
          <span className="material-symbols-outlined notranslate text-blue-600 text-3xl group-hover:translate-x-2 transition-transform relative z-10 drop-shadow-sm">
            arrow_circle_right
          </span>
        </Link>
      </section>

      {/* ── Mention d'état ──────────────────────────────────────────────── */}
      <p className="text-[11px] text-[#6b7a99] text-center">
        Spécialisation : <span className="font-mono font-semibold text-[#0b2545]">{collaboratorProfile ?? '—'}</span>
        {' · '}Rôle : <span className="font-mono font-semibold text-[#0b2545]">{primaryRoleLabel}</span>
        {' · '}Les modules non autorisés par l&apos;administrateur restent inaccessibles.
      </p>

      {/* ── Chat Assistant IA Drawer ─────────────────────────────────────── */}
      <AIChatDrawer
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        currentContext={{
          module: 'COLLABORATEUR_HOME',
          profile: collaboratorProfile,
          role: primaryRoleLabel,
          stats,
        }}
      />
    </div>
  );
};

export default CollaborateurHome;

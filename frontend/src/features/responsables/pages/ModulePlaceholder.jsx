import { Link } from 'react-router-dom';

/**
 * Écran provisoire pour un module pas encore livré.
 *
 * Plutôt que d'afficher une page vide ou une 404, on explique honnêtement ce
 * qui manque. Les wiringDone reste visibles pendant la construction du MVP.
 */
const ModulePlaceholder = ({ icon, title, description, permHint }) => (
  <div className="max-w-screen-xl mx-auto">
    <div className="glass-card p-6 sm:p-10 text-center overflow-hidden">
      <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-500/25 animate-[blob-float_8s_ease-in-out_infinite]">
        <span className="material-symbols-outlined notranslate text-[28px]">{icon}</span>
      </div>

      <span className="glass-chip text-amber-700 bg-amber-50/80"><span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"/> Module en préparation</span>

      <h1 className="text-xl font-extrabold text-[#001026] tracking-tight">{title}</h1>
      <p className="text-sm text-[#6b7a99] mt-2 max-w-xl mx-auto leading-relaxed">{description}</p>

      {permHint && (
        <p className="text-[11px] text-[#6b7a99] mt-4 inline-block px-3 py-1.5 rounded-lg bg-[#f4f7fb] border border-[#dde3ef]">
          Accès conditionné par la permission{' '}
          <span className="font-mono font-semibold text-[#004ad1]">{permHint}</span>
        </p>
      )}

      <div className="max-w-md mx-auto mt-7 space-y-2.5 text-left" aria-label="Module en cours de préparation">
        <div className="az-skeleton h-3 w-3/4 rounded-full" />
        <div className="az-skeleton h-3 w-full rounded-full" />
        <div className="az-skeleton h-3 w-2/3 rounded-full" />
        <div className="grid grid-cols-3 gap-2 pt-2"><div className="az-skeleton h-14 rounded-xl"/><div className="az-skeleton h-14 rounded-xl"/><div className="az-skeleton h-14 rounded-xl"/></div>
      </div>

      <Link
        to="/redirect"
        className="glass-btn glass-btn-primary mt-6"
      >
        <span className="material-symbols-outlined notranslate text-[18px]">arrow_back</span>
        Retour au tableau de bord
      </Link>
    </div>
  </div>
);

export default ModulePlaceholder;

import { Link } from 'react-router-dom';

/**
 * Écran provisoire pour un module pas encore livré.
 *
 * Plutôt que d'afficher une page vide ou une 404, on explique honnêtement ce
 * qui manque. Les wiringDone reste visibles pendant la construction du MVP.
 */
const ModulePlaceholder = ({ icon, title, description, permHint }) => (
  <div className="max-w-screen-xl mx-auto">
    <div className="bg-white rounded-2xl border border-[#dde3ef] p-10 text-center shadow-sm">
      <div className="w-14 h-14 rounded-2xl bg-[#0b2545] text-white flex items-center justify-center mx-auto mb-5">
        <span className="material-symbols-outlined notranslate text-[28px]">{icon}</span>
      </div>

      <h1 className="text-xl font-extrabold text-[#001026] tracking-tight">{title}</h1>
      <p className="text-sm text-[#6b7a99] mt-2 max-w-xl mx-auto leading-relaxed">{description}</p>

      {permHint && (
        <p className="text-[11px] text-[#6b7a99] mt-4 inline-block px-3 py-1.5 rounded-lg bg-[#f4f7fb] border border-[#dde3ef]">
          Accès conditionné par la permission{' '}
          <span className="font-mono font-semibold text-[#004ad1]">{permHint}</span>
        </p>
      )}

      <Link
        to="/collaborateur"
        className="inline-flex items-center gap-2 mt-6 px-4 py-2.5 rounded-lg bg-[#0b2545] text-white text-sm font-bold hover:opacity-90 transition-opacity"
      >
        <span className="material-symbols-outlined notranslate text-[18px]">arrow_back</span>
        Retour au tableau de bord
      </Link>
    </div>
  </div>
);

export default ModulePlaceholder;

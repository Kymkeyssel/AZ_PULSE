import React from 'react';

const AdminDashboard = () => {
  return (
    <>
      {/* PERSONA & IDENTITÉ */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#001026] via-[#0b2545] to-[#001c3b] text-white p-6 shadow-xl border border-white/10 mt-2">
        <div className="relative z-10 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-white text-[11px] font-bold">
                <span className="material-symbols-outlined text-[13px]">verified</span>Espace Administrateur
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white">Bonjour, Administrateur</h1>
            <p className="text-xs text-[#778db2]">Vos habilitations vous permettent de gérer les utilisateurs et ressources de votre périmètre.</p>
          </div>
        </div>
      </section>

      {/* Placeholder Content */}
      <section className="bg-white rounded-2xl border border-[#dfe3e7] p-5 shadow-sm mt-5">
        <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-[#f0f4f8] text-[#004ad1] flex items-center justify-center">
            <span className="material-symbols-outlined text-[32px]">construction</span>
          </div>
          <h3 className="text-lg font-extrabold text-[#001026]">Tableau de bord en construction</h3>
          <p className="text-sm text-[#44474e] max-w-md">Le contenu spécifique à l'administrateur sera bientôt intégré ici en conservant le même style premium que le Super Admin.</p>
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;

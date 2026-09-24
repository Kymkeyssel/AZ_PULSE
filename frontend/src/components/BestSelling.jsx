import React from 'react';

const BestSelling = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16" id="formation">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1D63FF] bg-[#1D63FF]/10 px-3.5 py-1 rounded-full uppercase tracking-wider mb-3">
          Offres Packagées Clé en Main
        </div>
        <h2 className="font-syne text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0B2545]">
          Packs & Formations Vedettes
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 mt-3 leading-relaxed">
          Choisissez la formule la plus adaptée à vos objectifs d'expansion ou développez les compétences certifiées de votre personnel grâce à notre institut agréé.
        </p>
      </div>
      
      {/* 3 Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col justify-between group">
          <div>
            <div className="h-56 w-full overflow-hidden relative">
              <img alt="Pack Transformation Numérique PME" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_acPxVAKyvLZWE9R00Muop7HKp7woAdC7o6-nkjtZS6hT6nVgjTfZ2VD1ALO3nmESO-kAd3QA3iYUywde2ZMmN2TUm9RzbiNWBxw6AiiKTRPuujRON1TR491lGyJqsOqKEjyQUXmTs9aRDIkw-HJWYpfC91QNlw3lGYX-h9JoRwpKs56nHDzMjR4nh3q7pwza2NFUzGe7oSo_HwUiV7ouNuwQfhpQgHOriVL_2l2RtwTc66hLCYbF"/>
              <div className="absolute top-3 left-3 bg-[#0B2545]/90 text-[#FFB800] text-[10px] font-bold px-3 py-1 rounded-full">PME Essentiel</div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-[#0B2545] text-base">Transformation Numérique PME</h3>
                <span className="font-bold text-[#1D63FF] text-sm">Sur Mesure</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">Intégration CRM + Maintenance préventive IT + 5 Licences d'accès AZ Pulse configurées.</p>
            </div>
          </div>
          <div className="px-5 pb-5 pt-3 flex items-center justify-between text-[11px] text-gray-600 border-t border-gray-100 font-medium">
            <span>✓ Déploiement 48h</span>
            <span>✓ Support Dédié</span>
            <span className="text-[#0B2545] font-bold">5 Utilisateurs</span>
          </div>
        </div>
        
        {/* Card 2 */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all border-2 border-[#1D63FF] flex flex-col justify-between group relative">
          <div className="absolute -top-3 right-5 bg-[#1D63FF] text-white text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full shadow-md z-10">
            Recommandé
          </div>
          <div>
            <div className="h-56 w-full overflow-hidden relative">
              <img alt="Suite Entreprise Intégrale" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhti5TyPUvieyO0ZIDUCbthmKsOcbw11WObV21jRg0Ro7q8_WUALeoXIrjPgMWETALsQgidX415w7gO2tzCzqW1QndxUnZEdlMIDNHVRdyryhkP0LSBHnZcN4L4UWwBa8CbQFIvsIMNG8tnCntCZbmdkXzDt9Iw30b5Ezxaps3I5NQW4KPwvjz9_SU43Ek3q868WDDiJGdJakRM6Ecg4fY3Y_aMFMPU83b7203sSPTskeoUf3mBXPY"/>
              <div className="absolute top-3 left-3 bg-[#0B2545]/90 text-[#FFB800] text-[10px] font-bold px-3 py-1 rounded-full">Institutionnel & Corporate</div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-[#0B2545] text-base">Suite Entreprise Intégrale</h3>
                <span className="font-bold text-[#1D63FF] text-sm">Full Pack</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">Cloud complet, IA Workspace, Déploiement sur site (On-Premise) & Audit Réseau trimestriel inclus.</p>
            </div>
          </div>
          <div className="px-5 pb-5 pt-3 flex items-center justify-between text-[11px] text-gray-600 border-t border-gray-100 font-medium">
            <span>✓ Multi-sites</span>
            <span>✓ IA Dédiée</span>
            <span className="text-[#1D63FF] font-bold">Illimité</span>
          </div>
        </div>
        
        {/* Card 3 */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col justify-between group">
          <div>
            <div className="h-56 w-full overflow-hidden relative">
              <img alt="Parcours Formation Certifiante" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPVnNCYgivZHBKS2xEiiNO-jGFjsqpF0BA1vXHxIAslM4EBLt01d3mpEGEI6Nn9CtBg64wJllK3WUDg0AnzUz5vXXto5G6viB3BZf_uT20UE1nRpgxdR7O4cUaVQyxkvJISecWc7VgER03QFDGLYKaTxZcwPTiHbpE483_anqwXjNNj_8x7Z4XJf6-oSHMjrbCz_cQreT2IzgYYbM7HTE6gnV-0zy4XFi1rLnLp2hY188PeCrSd7sU"/>
              <div className="absolute top-3 left-3 bg-[#FFB800] text-[#0B2545] text-[10px] font-extrabold px-3 py-1 rounded-full">Agrément MINEFOP</div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-[#0B2545] text-base">Cursus Certifiant & Suivi</h3>
                <span className="font-bold text-[#1D63FF] text-sm">Certifié</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">Parcours certifiant MINEFOP : Développement Web, Administration Réseaux, Gestion de Projet Numérique.</p>
            </div>
          </div>
          <div className="px-5 pb-5 pt-3 flex items-center justify-between text-[11px] text-gray-600 border-t border-gray-100 font-medium">
            <span>✓ Examen Officiel</span>
            <span>✓ Ateliers Pratiques</span>
            <span className="text-[#0B2545] font-bold">Sessions 2025</span>
          </div>
        </div>
      </div>
      
      {/* See More Button */}
      <div className="mt-12 text-center">
        <a className="inline-flex items-center gap-2 bg-[#0B2545]/10 backdrop-blur-sm border border-[#0B2545]/20 hover:bg-[#0B2545]/20 text-[#0B2545] text-xs font-bold px-7 py-3.5 rounded-xl transition shadow-lg" href="#solutions">
          Explorer tout le catalogue de services <span>↗</span>
        </a>
      </div>
    </section>
  );
};

export default BestSelling;

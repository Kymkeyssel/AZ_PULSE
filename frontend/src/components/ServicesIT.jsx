import React from 'react';

const ServicesIT = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16" id="services-it">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Search & Text */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#1D63FF] bg-[#1D63FF]/10 px-3 py-1 rounded-full uppercase tracking-wider">
            Audit & Diagnostic Personnalisé
          </div>
          <h2 className="font-syne text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0B2545] leading-[1.15]">
            Calculez l'Impact<br/>d'AZ Pulse sur Votre Organisation
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Bénéficiez de l'expertise éprouvée d'AZ CORPORATION SARL. Avec plus d'une décennie d'accompagnement auprès d'institutions publiques et privées, nous configurons une solution taillée sur mesure pour vos impératifs de rentabilité.
          </p>
          {/* Search Bar / Simulator */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-[#0B2545] mb-2">Simuler l'intégration dans votre structure</label>
            <div className="flex items-center bg-white rounded-xl p-1.5 border border-gray-200 shadow-sm focus-within:border-[#1D63FF] focus-within:ring-2 focus-within:ring-[#1D63FF]/20 transition">
              <input className="w-full bg-transparent border-0 text-xs px-3 text-gray-800 placeholder-gray-400 focus:ring-0 focus:outline-none" placeholder="Entrez le nom de votre entreprise ou secteur..." type="text"/>
              <button className="bg-[#0B2545]/10 backdrop-blur-sm border border-[#0B2545]/20 hover:bg-[#0B2545]/20 text-[#0B2545] text-xs font-bold px-5 py-2.5 rounded-lg transition shadow-md whitespace-nowrap">
                Lancer l'audit gratuit
              </button>
            </div>
          </div>
        </div>
        
        {/* Right Column: Image with Location Floating Card */}
        <div className="lg:col-span-7 relative">
          {/* Floating Location Preview Badge */}
          <div className="absolute -top-4 sm:top-6 sm:-left-8 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-[#0B2545]/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1D63FF]/15 text-[#1D63FF] flex items-center justify-center font-bold">
              <svg className="w-5 h-5 text-[#1D63FF]" fill="currentColor" viewBox="0 0 20 20">
                <path clipRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" fillRule="evenodd"></path>
              </svg>
            </div>
            <div>
              <h5 className="text-xs font-bold text-[#0B2545]">Siège AZ CORPORATION</h5>
              <p className="text-[10px] text-gray-600 font-medium">Biyem-Assi (Carrefour Kameni), Yaoundé<br/>Cameroun & Déploiement International</p>
            </div>
          </div>
          
          {/* Big Rounded Tech/Infrastructure Image */}
          <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] w-full border border-gray-200 relative">
            <img alt="Infrastructure Réseaux et Datacenter AZ Corporation" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuARlCjvZOoMZYN-uq-on2Eb0oXphm83cJbXoVD8sNjIXOEll_NbZFANq89IaG0vi51UJqSdw5AmOJEoO1q5obYK2V0z1TQeugmhAKCEPV5jtfd1r-M_A8sDBgGvmeQ_Msw75mB_pVRp9nLI0Aq5Prk6WyNTtgH4g8cNR0GIa39efbARlYQopG8Qq3Y2VKS9VQnubDHwgukh_B381tlG1eb_GfbRfvjdlRT0k5BgqVvCmP171yrE7KVj"/>
            <div className="absolute bottom-4 right-4 bg-[#0B2545]/90 backdrop-blur-md px-4 py-2 rounded-xl text-white text-xs border border-white/20 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Supervision Réseau & IT Opérationnelle</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesIT;

import React from 'react';

const DiscoverExcellence = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20" id="solutions">
      {/* Category Filter Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
        <button className="px-5 py-2.5 rounded-lg text-xs md:text-sm font-semibold bg-[#0B2545]/10 backdrop-blur-sm border border-[#0B2545]/20 hover:bg-[#0B2545]/20 text-[#0B2545] shadow-md transition flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FFB800]"></span>
          Modules SaaS & IA
        </button>
        <button className="px-5 py-2.5 rounded-lg text-xs md:text-sm font-medium border border-[#0B2545]/10 text-gray-700 bg-white/50 backdrop-blur-sm hover:bg-white/80 transition">
          Ingénierie & Services IT
        </button>
        <button className="px-5 py-2.5 rounded-lg text-xs md:text-sm font-medium border border-[#0B2545]/10 text-gray-700 bg-white/50 backdrop-blur-sm hover:bg-white/80 transition">
          Centre de Formation Professionnelle
        </button>
      </div>
      
      {/* 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Card: Compound Architecture Card */}
        <div className="lg:col-span-6 bg-[#0B2545] text-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-[#1D63FF]/20">
          {/* Image Half */}
          <div className="md:w-1/2 h-64 md:h-auto min-h-[300px] relative bg-[#001c3b]">
            <img alt="AZ PULSE Enterprise OS" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_rCnDHJ8OWgagxdiEvoy7Ax1pfGwAWufrRhODYln3fXBlGAcPudmR0m2KZyk-JwgZqSIx1NVrqFTGXnN717o0WWAivJPppB-B6hfm9tjcsNBM8AgPzTWnuwHdSHWowNHbXCahbRIHn2ouaqZBTJ_rE-a5Oq8UwdN2f02h4k-BC7dXwyEYT4ANhAQLeYgAYuRlOOyJVu2R6R1uGrwUW-JFN5GmMBxMlsxAtovqt-Z1JInjK9C3xDz-"/>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B2545] via-transparent to-transparent opacity-80"></div>
            <div className="absolute bottom-3 left-3 bg-[#0B2545]/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-semibold text-[#FFB800] border border-white/20">
              Supervision 360° en Temps Réel
            </div>
          </div>
          {/* Content Half */}
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold text-[#8fc7fe] tracking-wider mb-2">Architecture SaaS Native</div>
              <h3 className="text-base md:text-lg font-bold leading-snug text-white">
                AZ Pulse Enterprise OS : L'écosystème unifié pour vos opérations critiques
              </h3>
              <p className="text-xs text-white/75 mt-3 leading-relaxed">
                Centralisez flux commerciaux, gestion des ressources humaines, maintenance des réseaux et rapports analytiques automatiques.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-white/15 flex items-center justify-between">
              <span className="text-xs tracking-wider text-[#FFB800] font-semibold">1 / 6 Modules Actifs</span>
              <div className="flex items-center gap-2">
                <a className="bg-[#FFB800]/20 backdrop-blur-md border border-[#FFB800]/40 text-[#FFB800] px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-[#FFB800]/30 transition" href="#demo">
                  Démarrer
                  <span className="text-[10px]">→</span>
                </a>
                <button className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-xs hover:bg-white/10 transition">←</button>
                <button className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-xs hover:bg-white/10 transition">→</button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column: Heading & Property Specs Details */}
        <div className="lg:col-span-6 flex flex-col justify-between h-full">
          <div>
            <h2 className="font-syne text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0B2545] leading-[1.15]">
              Découvrez l'Excellence Technologique & le Pilotage Réinventé
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 mt-8 items-center">
            {/* Thumbnail */}
            <div className="sm:col-span-5 rounded-3xl overflow-hidden shadow-lg h-52 relative border border-gray-200">
              <img alt="Interface de Supervision IT" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIN1jq7Rk5wP8abmCSDGBXSKaL03HF2CITodigHConJFVLCb-qhHQCDxG5gEhgD4H-fjXoN7fZbIFLwmzR5VbcwnKL2HrX3bH6mvq-IT0xaIj1qIuQHV1iNv0CJJOQ6LMUnlmcokaTjSDxZ1XKZUrjNhDD_KSytpf4yCrfhduWeyZMZrCukqpcyb1hNoX1BqlpBbqCSi85rZEjWh2CpYzVVXP-cawyPgpg_ulm5Tl01HsMPPKZLDH6"/>
              <div className="absolute inset-0 bg-[#0B2545]/20"></div>
            </div>
            {/* Specs List */}
            <div className="sm:col-span-7">
              <h4 className="text-sm font-bold tracking-wide text-[#0B2545] border-b border-[#1D63FF]/30 pb-1.5 inline-block mb-3">
                Spécifications du Système
              </h4>
              <ul className="space-y-3 text-xs text-gray-700">
                <li className="grid grid-cols-12 gap-1">
                  <span className="col-span-4 font-bold text-[#0B2545]">Sécurité & Cloud</span>
                  <span className="col-span-8 text-gray-600">: Chiffrement bancaire bout-en-bout, hébergement souverain et redondance 99.9%.</span>
                </li>
                <li className="grid grid-cols-12 gap-1">
                  <span className="col-span-4 font-bold text-[#0B2545]">Intelligence Artificielle</span>
                  <span className="col-span-8 text-gray-600">: Modèles IA spécialisés en analyse prédictive et automatisation des tâches.</span>
                </li>
                <li className="grid grid-cols-12 gap-1">
                  <span className="col-span-4 font-bold text-[#0B2545]">Interconnexion IT</span>
                  <span className="col-span-8 text-gray-600">: Synchronisation matérielle, supervision réseaux et support technique 24/7.</span>
                </li>
                <li className="grid grid-cols-12 gap-1">
                  <span className="col-span-4 font-bold text-[#0B2545]">Hub Formation</span>
                  <span className="col-span-8 text-gray-600">: Accès direct aux parcours e-learning et formations présentielles certifiées.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscoverExcellence;

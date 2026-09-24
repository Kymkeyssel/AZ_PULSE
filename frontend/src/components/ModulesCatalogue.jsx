import React from 'react';

const ModulesCatalogue = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16" id="ia-workspace">
      {/* Header with split text */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <p className="text-xs sm:text-sm text-gray-600 max-w-md leading-relaxed">
          Découvrez les briques logicielles intelligentes et services IT conçus par AZ CORPORATION SARL pour automatiser vos tâches répétitives, sécuriser votre patrimoine numérique et décupler la productivité de vos collaborateurs.
        </p>
        <h2 className="font-syne text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0B2545]">
          Catalogue des Modules<br/>& Solutions AZ Pulse
        </h2>
      </div>
      
      {/* Filter Bar Component */}
      <div className="bg-[#0B2545] rounded-2xl p-4 sm:p-5 text-white mb-12 shadow-xl border border-[#1D63FF]/30">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 items-center">
          {/* Field 1 */}
          <div>
            <label className="block text-[11px] text-white/70 mb-1">Type de besoin</label>
            <div className="border border-white/25 rounded-lg px-3 py-2 text-xs text-white bg-white/5 font-medium">
              Tous les Modules
            </div>
          </div>
          {/* Field 2 */}
          <div>
            <label className="block text-[11px] text-white/70 mb-1">Déploiement</label>
            <div className="border border-white/25 rounded-lg px-3 py-2 text-xs text-white flex justify-between items-center bg-white/5 font-medium">
              <span>Cloud SaaS</span>
              <span className="text-[#FFB800]">⌵</span>
            </div>
          </div>
          {/* Field 3 */}
          <div>
            <label className="block text-[11px] text-white/70 mb-1">Taille entreprise</label>
            <div className="border border-white/25 rounded-lg px-3 py-2 text-xs text-white flex justify-between items-center bg-white/5 font-medium">
              <span>PME / TPE</span>
              <span className="text-[#FFB800]">⌵</span>
            </div>
          </div>
          {/* Field 4 */}
          <div>
            <label className="block text-[11px] text-white/70 mb-1">Support & SLA</label>
            <div className="border border-white/25 rounded-lg px-3 py-2 text-xs text-white flex justify-between items-center bg-white/5 font-medium">
              <span>24/7 Illimité</span>
              <span className="text-[#FFB800]">⌵</span>
            </div>
          </div>
          {/* Filter Action Button */}
          <div className="col-span-2 sm:col-span-1 flex items-end h-full">
            <button className="w-full bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 rounded-lg py-2.5 text-xs font-bold text-white flex items-center justify-center gap-2 transition shadow-md">
              <span>Filtrer les solutions</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* 6 Card Grid (3 columns, 2 rows) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Card 1 */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col justify-between group">
          <div>
            <div className="h-56 w-full overflow-hidden relative">
              <img alt="Module CRM & Relation Client 360°" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsfVf1zxO1U-E6XWF0r1sifShm0f-f19GZN__ujZqO4SbQg5XdIGCq8m2OdOqSG7bNQaONkDqbRtLgP-qfPDUSsZowOtCKkagChXf5jhyATqT-pwoADmAnuFv1Jv-tYGXsTji_aPM7TCkfPjyogbc-InfTtWQfWiky8aFaExb7PjqSdCI6PcpcM1lvVgAEE-9Bpr3oVzAFvjQHfeCBo9BuOcNbZozIZwDWKh-WSeYJZX3RRG9Woq3S"/>
              <span className="absolute top-3 right-3 bg-[#0B2545]/85 backdrop-blur-md text-[#FFB800] text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">SaaS Cloud</span>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-[#0B2545] text-base group-hover:text-[#1D63FF] transition">Module CRM & Relation Client 360°</h3>
                <span className="font-extrabold text-[#1D63FF] text-sm">4.9 ★</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">Gestion du pipeline de vente, prospection omnicanale, devis & facturation automatisée en un clic.</p>
            </div>
          </div>
          <div className="px-5 pb-5 pt-2 flex items-center justify-between text-[11px] text-gray-500 border-t border-gray-100">
            <span className="flex items-center gap-1 font-medium">⚡ 500+ Clients</span>
            <span className="flex items-center gap-1 font-medium">📊 Facturation Auto</span>
            <span className="flex items-center gap-1 font-medium text-[#1D63FF]">✓ Sync ERP</span>
          </div>
        </div>
        
        {/* Card 2 */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col justify-between group">
          <div>
            <div className="h-56 w-full overflow-hidden relative">
              <img alt="IA Workspace & Automatisation Métier" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnaELh9OVrNvRCmajHyTdQQaPG5Xl3IGqLs0huHA0Vi9ezzYdsbe2sTXwydMJaOvUs4W8flc9sAHKWnZDf6zmhU2n1bezAWg1-yESMz3WcTdLMFTKemX5oQeynVTHiF1cJlZtCX1_KygupUa_FHmLIHvYsrjuKpLopobTBA4ZREH6tpNkuPbrOuoZ-5UfcP32fHV-bvKRA8rlHzjVZWHjtJ0YCrQtlOfb1kwRVuMzFo01NGm3boZjM"/>
              <span className="absolute top-3 right-3 bg-[#1D63FF] text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">IA Générative</span>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-[#0B2545] text-base group-hover:text-[#1D63FF] transition">IA Workspace & Automatisation</h3>
                <span className="font-extrabold text-[#1D63FF] text-sm">5.0 ★</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">Agents intelligents sur mesure, génération de rapports automatisés et assistance décisionnelle instantanée.</p>
            </div>
          </div>
          <div className="px-5 pb-5 pt-2 flex items-center justify-between text-[11px] text-gray-500 border-t border-gray-100">
            <span className="flex items-center gap-1 font-medium">🤖 LLM Sécurisé</span>
            <span className="flex items-center gap-1 font-medium">⏱ Gain x4 Tâches</span>
            <span className="flex items-center gap-1 font-medium text-[#1D63FF]">✓ API Ouverte</span>
          </div>
        </div>
        
        {/* Card 3 */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col justify-between group">
          <div>
            <div className="h-56 w-full overflow-hidden relative">
              <img alt="Ingénierie Réseaux & Sécurité IT" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvvzdnsst8ZtMKb6acoK4SrpYUIiazZ5ium_dbB10G6QrA479UpOj6YYodqWXrVs3YltcybBQlPChieuw8SluajJz6C5LRAKe8NmAy6aOpILdRc4H1EdbF6GVq8yf2rAA5zm9JMIRT_9dN62PFdvYCUgpsa_RGZm5iSxHqZH_VWG5nx8Mysrxewx4rEKQmOiU52Vmh3GrWIkl0ZLXx7EWNY1TGubxn9S92Kw8RRQws5ulSeqUMId5m"/>
              <span className="absolute top-3 right-3 bg-[#0B2545]/85 backdrop-blur-md text-[#FFB800] text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">Infogérance</span>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-[#0B2545] text-base group-hover:text-[#1D63FF] transition">Ingénierie Réseaux & Sécurité IT</h3>
                <span className="font-extrabold text-[#1D63FF] text-sm">99.9%</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">Supervision de serveurs, audit de cybersécurité, câblage structuré et maintenance proactive continue.</p>
            </div>
          </div>
          <div className="px-5 pb-5 pt-2 flex items-center justify-between text-[11px] text-gray-500 border-t border-gray-100">
            <span className="flex items-center gap-1 font-medium">🔒 Firewall & VPN</span>
            <span className="flex items-center gap-1 font-medium">📡 Fibre / Câblage</span>
            <span className="flex items-center gap-1 font-medium text-[#1D63FF]">✓ Support 24/7</span>
          </div>
        </div>
        
        {/* Card 4 */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col justify-between group">
          <div>
            <div className="h-56 w-full overflow-hidden relative">
              <img alt="Institut de Formation IFP AZ Corporation" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8jhpx9OkZqU4wOVarWl776GbsXfAMyCwGgUH0ZoqcLI84X4FFnAfy-Y6rUCmERb5wklYpucaaNBybq7zliTON8KRjo6X_GK7upotJ03qBKltgs4VPhQEyRgxhWuHx6bw5ICeqX5Q0zPywJN1MYmgibLvEVQAobIHXebpEFgkAybP8a2qyXXUHn_BIXYMmp-tPUpsKhUs_RIdPu3t-aqDaxUXs5vdG0ZrN4rUfG1kcA-7UfAAUo37m"/>
              <span className="absolute top-3 right-3 bg-[#FFB800] text-[#0B2545] text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-white/20">MINEFOP Agréé</span>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-[#0B2545] text-base group-hover:text-[#1D63FF] transition">Institut de Formation IFP AZ</h3>
                <span className="font-extrabold text-[#1D63FF] text-sm">Diplômant</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">Formations professionnelles certifiées : Informatique, Développement Web, Bureautique, Langues & Management.</p>
            </div>
          </div>
          <div className="px-5 pb-5 pt-2 flex items-center justify-between text-[11px] text-gray-500 border-t border-gray-100">
            <span className="flex items-center gap-1 font-medium">🎓 Certificat DQP</span>
            <span className="flex items-center gap-1 font-medium">💻 Salles Équipées</span>
            <span className="flex items-center gap-1 font-medium text-[#1D63FF]">✓ Présentiel / E-learn</span>
          </div>
        </div>
        
        {/* Card 5 */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col justify-between group">
          <div>
            <div className="h-56 w-full overflow-hidden relative">
              <img alt="Knowledge Hub & Espaces Collaboratifs" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVu8jv1sbyxhaekH1KgRZftxxc9Z1xfIR_7rwFl9qQ1jOYFFl9YoX1acDcRZwb6KXPQjRh13jO2NPZ1BbMNeUzAg8yDYHN3LBTXIynv7Yq-bFEQf7MlyC81Vc0Bh5Q1dCXAymJOQR5iffinUmZzHK8aXlbN5VD0TqVL2lbW2naq-cyBuWHDv6Y0v9byFdlTFXuwQGG8f59GPhnXjhvPSu7ap8YiqYgv1VIGS9yQFtMJi1Lxm7ySWgW"/>
              <span className="absolute top-3 right-3 bg-[#0B2545]/85 backdrop-blur-md text-[#FFB800] text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">Collaboratif</span>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-[#0B2545] text-base group-hover:text-[#1D63FF] transition">Knowledge Hub Collaboratif</h3>
                <span className="font-extrabold text-[#1D63FF] text-sm">4.8 ★</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">Gestion documentaire sécurisée (GED), onboarding collaborateur, bases de connaissances unifiées et chat interne.</p>
            </div>
          </div>
          <div className="px-5 pb-5 pt-2 flex items-center justify-between text-[11px] text-gray-500 border-t border-gray-100">
            <span className="flex items-center gap-1 font-medium">📁 GED Chiffrée</span>
            <span className="flex items-center gap-1 font-medium">👥 Multi-équipes</span>
            <span className="flex items-center gap-1 font-medium text-[#1D63FF]">✓ Versioning</span>
          </div>
        </div>
        
        {/* Card 6 */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col justify-between group">
          <div>
            <div className="h-56 w-full overflow-hidden relative">
              <img alt="Business Analytics & BI Dashboard" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1ON8U7F8J3VF6zHDPBRUHCu-fSYCZJXzbY82jueXBYymbskViz3YwpC7ma4CuXndyM065jgqmtzZhcwKjJHblnEf20cTgd7Vs64uYGMtgqSMtjeSxte9TFAkMaN2qknYTgGH5SFyvLtxeydnzX8SK3lbwCsMWoEdxFKnBzvkUfAudPbjRqZMrUX3BdVu7OgPBV2Yo-z8uNxgLQX0Qe33CtBQzlbrXH-RP8rkm-s3T4MVGLXO5ojcc"/>
              <span className="absolute top-3 right-3 bg-[#0B2545]/85 backdrop-blur-md text-[#FFB800] text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">Temps Réel</span>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-[#0B2545] text-base group-hover:text-[#1D63FF] transition">Business Analytics & BI Dashboard</h3>
                <span className="font-extrabold text-[#1D63FF] text-sm">Live</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">Indicateurs clés en direct, prévisions de trésorerie, rapports personnalisés exportables et alertes prédictives.</p>
            </div>
          </div>
          <div className="px-5 pb-5 pt-2 flex items-center justify-between text-[11px] text-gray-500 border-t border-gray-100">
            <span className="flex items-center gap-1 font-medium">📈 KPIs Stratégiques</span>
            <span className="flex items-center gap-1 font-medium">📑 Exports PDF/Excel</span>
            <span className="flex items-center gap-1 font-medium text-[#1D63FF]">✓ Alertes SMS/Email</span>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default ModulesCatalogue;

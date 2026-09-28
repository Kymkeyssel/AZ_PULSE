import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import './Auth.css';

const RejectedAccess = () => {
  const navigate = useNavigate();

  const handleNewRequest = (e) => {
    e.preventDefault();
    navigate('/?mode=register');
  };

  const handleContactAdmin = () => {
    toast.info("Support Administratif AZ Corporation\nEmail : admin-access@azcorporation.net\nGuichet Sécurité : Lundi - Vendredi, 8h00 - 18h00 UTC+1.");
  };

  const handleReturnToLogin = (e) => {
    e.preventDefault();
    navigate('/?mode=login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-6 lg:p-8 selection:bg-az-blue selection:text-white relative overflow-hidden">
      {/* Background Image with Blur */}
      <div 
        className="absolute -inset-4 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/AZ facade.jpg')`, filter: 'blur(8px)' }}
      ></div>
      {/* Dark Overlay */}
      <div className="absolute inset-0 z-0 bg-slate-900/50"></div>

      {/* Return to Home Button */}
      <button 
        onClick={() => navigate('/')} 
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50 p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-105 shadow-lg group flex items-center justify-center"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        
        {/* Custom Tooltip */}
        <span className="absolute left-full ml-4 px-3.5 py-2 bg-slate-900/90 backdrop-blur-md text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none border border-white/10 shadow-xl">
          Retour à la page d'accueil
        </span>
      </button>

      <svg aria-hidden="true" className="absolute w-0 h-0 pointer-events-none">
        <defs>
          <clipPath clipPathUnits="objectBoundingBox" id="arcanaCardClip">
            <path d="
              M 0, 0.14
              C 0, 0.06 0.025, 0 0.06, 0
              L 0.68, 0
              C 0.72, 0 0.74, 0.05 0.75, 0.12
              C 0.765, 0.26 0.79, 0.34 0.84, 0.34
              L 0.94, 0.34
              C 0.975, 0.34 1, 0.40 1, 0.47
              L 1, 0.86
              C 1, 0.94 0.975, 1 0.94, 1
              L 0.06, 1
              C 0.025, 1 0, 0.94 0, 0.86
              Z
            "></path>
          </clipPath>
        </defs>
      </svg>

      <main className="w-full max-w-[1240px] bg-white rounded-[44px] shadow-card-elevated border border-slate-200/70 p-3.5 sm:p-5 lg:p-6 grid grid-cols-1 lg:grid-cols-12 min-h-[820px] relative transition-all duration-300 z-10">
        <section className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between p-6 sm:p-8 xl:p-10 bg-white relative z-10" data-purpose="auth-panel-container">
          <header className="flex items-center justify-between mb-4 sm:mb-6" data-purpose="brand-header">
            <a className="inline-flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-az-blue/40 rounded-xl p-1 -m-1" href="/">
              <img alt="AZ Pulse Logo" className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105" src="/AZ PULSE_logo.png" />
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-widest text-az-blue">Internal Portal</span>
                <span className="text-sm font-semibold text-slate-800 -mt-0.5">AZ Corporation</span>
              </div>
            </a>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Système Actif
            </span>
          </header>

          <div className="flex-1 flex flex-col justify-center my-auto space-y-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80 mb-2.5">
                <svg className="w-3.5 h-3.5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
                <span>Accès refusé</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                Demande d'accès rejetée
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed font-normal">
                Après examen, notre équipe d'administration a décidé de ne pas donner suite à votre demande de création de compte sur le portail AZ Pulse.
              </p>
            </div>

            <div className="bg-[#f8fafc] border border-rose-100 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
              
              <div className="flex items-center gap-2 pb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Motif du refus</span>
              </div>

              <div className="bg-white border border-slate-200/70 rounded-xl p-3.5 text-sm text-slate-800 leading-relaxed font-medium">
                « Les informations fournies ne permettent pas de confirmer votre affiliation à un partenaire, un client ou une unité interne d'AZ Corporation. Veuillez vérifier l'adresse email professionnelle utilisée. »
              </div>

              <div className="pt-2 border-t border-slate-200/70 flex flex-col gap-2">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Détails de la demande originale</span>
                <ul className="text-xs text-slate-600 space-y-1.5">
                  <li className="flex items-start gap-2">
                    <strong className="text-slate-800 min-w-[70px]">Email :</strong>
                    <span className="truncate">utilisateur@domaine-inconnu.com</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <strong className="text-slate-800 min-w-[70px]">Date :</strong>
                    <span>14 Novembre 2024, 09:42 UTC</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <strong className="text-slate-800 min-w-[70px]">Réf. :</strong>
                    <span className="font-mono text-[10px]">REF-AZP-994A2B</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-2 text-xs text-slate-600 bg-amber-50/50 p-3 rounded-xl border border-amber-100/50">
                <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
                <span className="leading-snug">Si vous pensez qu'il s'agit d'une erreur, vous pouvez soumettre une nouvelle demande en utilisant une adresse email institutionnelle valide, ou contacter un administrateur.</span>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <button className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm text-white bg-[#191919] hover:bg-black active:scale-[0.99] transition-all duration-200 shadow-md flex items-center justify-center gap-2 group" onClick={handleNewRequest} type="button">
                <span>Soumettre une nouvelle demande</span>
                <svg className="h-4 w-4 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </button>
              
              <div className="flex items-center justify-between text-xs pt-1 px-1">
                <button className="font-medium text-slate-500 hover:text-az-navy transition-colors flex items-center gap-1.5 focus:outline-none" onClick={handleContactAdmin} type="button">
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                  <span>Contacter le support</span>
                </button>
                <a className="font-semibold text-az-blue hover:underline transition-colors flex items-center gap-1" href="/" onClick={handleReturnToLogin}>
                  <span>Retour à la connexion</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <footer className="mt-5 pt-3.5 text-center lg:text-left text-[11px] text-slate-400 border-t border-slate-100/80 flex items-center justify-between">
            <span>© 2025 AZ Corporation. Tous droits réservés.</span>
            <span className="hover:text-slate-600 transition-colors">v3.4.2 Enterprise</span>
          </footer>
        </section>

        {/* Right Panel (Brand Showcase) */}
        <section className="hidden lg:flex lg:col-span-6 xl:col-span-7 relative p-1 xl:p-2" data-purpose="brand-showcase-panel">
          <div className="w-full h-full rounded-[42px] bg-gradient-to-b from-[#07152b] via-[#0b1f3a] to-[#050e1c] p-8 xl:p-11 flex flex-col justify-between relative overflow-hidden text-white shadow-2xl border border-white/[0.08]">
            <div className="beam-reverse-wide bottom-10 -left-20 pointer-events-none"></div>
            <div className="beam-reverse-thin bottom-10 -left-20 pointer-events-none"></div>
            <div className="arcana-fixed-beam"></div>
            
            <div className="relative z-10 flex flex-col items-start pt-3 select-none" data-purpose="3d-emblem-visual">
              <div className="w-full flex items-center justify-center -mt-2 mb-2">
                <div className="relative w-64 h-56 flex items-center justify-center pulse-glow-anim">
                  <div className="relative flex items-center justify-center w-full h-full">
                    <div className="absolute inset-0 bg-az-blue/20 blur-2xl rounded-full scale-90 pointer-events-none"></div>
                    <img src="/AZ PULSE_logo.png" alt="AZ Pulse Official Emblem" className="max-h-44 w-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)] filter transition-transform duration-500 hover:scale-105 relative z-10" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-white text-xs sm:text-sm font-semibold tracking-wide">AZ Pulse</span>
              </div>
              <div className="max-w-md" data-purpose="hero-copy">
                <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight">
                    Bienvenue sur <span className="text-white">AZ Pulse</span>
                </h2>
                <p className="text-neutral-400 text-xs sm:text-sm mt-3 leading-relaxed font-normal">
                    AZ Pulse aide les développeurs et les équipes opérationnelles à concevoir des workflows d'entreprise unifiés, des réseaux cloud, des certifications MINEFOP et des tableaux de bord intelligents dotés d'outils automatisés puissants.
                </p>
                <p className="text-neutral-400 text-xs mt-2 font-light">
                    Plus de 17 000 collaborateurs nous ont déjà rejoints, c'est à votre tour.
                </p>
              </div>
            </div>

            <div className="relative z-10 mt-6 w-full pt-4">
              <div className="arcana-notched-card w-full p-6 sm:p-7 xl:p-8 relative transition-all duration-300" style={{ background: 'linear-gradient(135deg, rgba(20, 48, 89, 0.75) 0%, rgba(14, 36, 69, 0.85) 100%)', borderTop: '1px solid rgba(255, 255, 255, 0.12)' }}>
                <div className="flex flex-col justify-between min-h-[148px]">
                  <div className="max-w-[70%]">
                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
                      Trouvez votre place au sein de notre écosystème unifié.
                    </h3>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-3">
                    <p className="text-xs text-neutral-300/85 max-w-[62%] leading-relaxed">
                      Faites partie des pionniers à expérimenter la manière la plus simple de lancer et développer vos opérations.
                    </p>
                    <div className="flex items-center -space-x-2 self-end flex-shrink-0" data-purpose="avatar-pile">
                      <img alt="Collaborateur 1" className="w-7 h-7 rounded-full ring-2 ring-[#2b2b2b] object-cover" src="https://i.pravatar.cc/100?img=1" />
                      <img alt="Collaborateur 2" className="w-7 h-7 rounded-full ring-2 ring-[#2b2b2b] object-cover" src="https://i.pravatar.cc/100?img=2" />
                      <img alt="Collaborateur 3" className="w-7 h-7 rounded-full ring-2 ring-[#2b2b2b] object-cover" src="https://i.pravatar.cc/100?img=3" />
                      <div className="w-7 h-7 rounded-full ring-2 ring-[#2b2b2b] bg-[#111111] text-white flex items-center justify-center text-[10px] font-bold tracking-tight">
                        +2
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default RejectedAccess;

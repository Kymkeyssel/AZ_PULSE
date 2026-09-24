import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const PendingAccess = () => {
  const navigate = useNavigate();

  const copyTicketRef = () => {
    const code = document.getElementById('refTicketCode').innerText;
    const copyLabel = document.getElementById('copyLabel');
    
    navigator.clipboard.writeText(code).then(() => {
      copyLabel.innerText = "Copié !";
      setTimeout(() => {
        copyLabel.innerText = "Copier";
      }, 2000);
    }).catch(() => {
      alert("Numéro de référence : " + code);
    });
  };

  const handleRefreshStatus = () => {
    const btn = document.getElementById('refreshStatusBtn');
    const text = document.getElementById('refreshBtnText');
    const spinner = document.getElementById('refreshSpinner');

    btn.disabled = true;
    spinner.classList.add('animate-spin');
    text.innerText = "Vérification en direct...";

    setTimeout(() => {
      spinner.classList.remove('animate-spin');
      btn.disabled = false;
      text.innerText = "Statut à jour";
      
      setTimeout(() => {
        text.innerText = "Actualiser le statut";
      }, 2200);

      alert("Statut vérifié auprès de l'annuaire AZ Pulse :\nVotre dossier est toujours en attente (Revue administrateur). Vous recevrez un e-mail dès validation.");
    }, 1200);
  };

  const handleContactAdmin = () => {
    alert("Support Administratif AZ Corporation\nEmail : admin-access@azcorporation.net\nGuichet Sécurité : Lundi - Vendredi, 8h00 - 18h00 UTC+1.");
  };

  const handleReturnToLogin = (e) => {
    e.preventDefault();
    const confirmReturn = window.confirm("Voulez-vous retourner à la page de connexion ? Votre dossier de demande restera actif.");
    if (confirmReturn) {
      navigate('/?mode=login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-6 lg:p-8 selection:bg-az-blue selection:text-white bg-[#f4f5f8]">
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

      <main className="w-full max-w-[1240px] bg-white rounded-[44px] shadow-card-elevated border border-slate-200/70 p-3.5 sm:p-5 lg:p-6 grid grid-cols-1 lg:grid-cols-12 min-h-[820px] relative transition-all duration-300">
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80 mb-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="amber-pulse-dot absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span>Demande en cours de traitement</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                Demande en attente de validation
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed font-normal">
                Votre demande d'accès au portail interne AZ Pulse a bien été enregistrée et est actuellement en cours d'examen par nos administrateurs de sécurité.
              </p>
            </div>

            <div className="bg-[#f8fafc] border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/70">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Réf. Ticket</span>
                  <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200" id="refTicketCode">REF-AZP-ENATTENTE</span>
                </div>
                <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-az-blue hover:text-az-navy transition-colors px-2 py-1 rounded-md hover:bg-blue-50 focus:outline-none" id="copyRefBtn" onClick={copyTicketRef} title="Copier la référence" type="button">
                  <svg className="w-3.5 h-3.5" fill="none" id="copyIcon" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                  <span id="copyLabel">Copier</span>
                </button>
              </div>

              <div className="pt-1 border-t border-slate-200/70 space-y-2.5">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Progression du dossier</span>
                <div className="relative pl-5 space-y-3.5 before:absolute before:left-[8px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
                  <div className="relative flex items-center gap-3">
                    <div className="absolute -left-5 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-4 ring-white">
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
                      </svg>
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-800">Demande soumise</span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">Validée</span>
                    </div>
                  </div>
                  <div className="relative flex items-center gap-3">
                    <div className="absolute -left-5 w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center ring-4 ring-white">
                      <svg className="w-2.5 h-2.5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" d="M4 12a8 8 0 018-8v8H4z" fill="currentColor"></path>
                      </svg>
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <span className="text-xs font-semibold text-amber-900">Revue par l'administrateur système</span>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                        En cours
                      </span>
                    </div>
                  </div>
                  <div className="relative flex items-center gap-3">
                    <div className="absolute -left-5 w-4 h-4 rounded-full bg-slate-300 text-slate-500 flex items-center justify-center ring-4 ring-white">
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-400">Activation du compte</span>
                      <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">En attente</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <svg className="w-4 h-4 text-az-blue flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
                <span><strong>Délai moyen de réponse :</strong> moins de 24h ouvrées.</span>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              <button className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm text-white bg-[#191919] hover:bg-black active:scale-[0.99] transition-all duration-200 shadow-md flex items-center justify-center gap-2 group" id="refreshStatusBtn" onClick={handleRefreshStatus} type="button">
                <svg className="h-4 w-4 text-white group-hover:rotate-180 transition-transform duration-500" fill="none" id="refreshSpinner" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
                <span id="refreshBtnText">Actualiser le statut</span>
              </button>
              <div className="flex items-center justify-between text-xs pt-1 px-1">
                <button className="font-medium text-slate-500 hover:text-az-navy transition-colors flex items-center gap-1.5 focus:outline-none" onClick={handleContactAdmin} type="button">
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                  <span>Contacter l'administrateur</span>
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

export default PendingAccess;

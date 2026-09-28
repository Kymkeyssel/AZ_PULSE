import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/api';
import { toast } from 'sonner';
import './Auth.css';

const ActivateAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Try to get email from state if redirected from Auth
  const defaultEmail = location.state?.email || '';

  const handleActivationSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    const form = e.target;
    
    const email = form.email.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if (password !== confirmPassword) {
      setErrorMsg("Les mots de passe ne correspondent pas.");
      setIsSubmitting(false);
      return;
    }

    try {
      await authService.activate(email, password);
      toast.success("Compte activé avec succès ! Vous pouvez maintenant vous connecter.");
      navigate('/?mode=login');
    } catch (err) {
      setErrorMsg(err.message || "Erreur lors de l'activation du compte.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactSupport = () => {
    toast.info("Support Informatique AZ Corporation\nEmail : support-it@azcorporation.net\nTéléphone : +33 1 00 00 00 00");
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

          <div className="flex-1 flex flex-col justify-center my-auto space-y-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 mb-2.5">
                <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
                <span>Accès Validé</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                Activez votre compte
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed font-normal">
                Félicitations ! Votre demande d'accès a été approuvée. Veuillez définir votre mot de passe pour finaliser l'activation de votre compte AZ Pulse.
              </p>
              {errorMsg && (
                <div className="mt-4 p-3 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl">
                  {errorMsg}
                </div>
              )}
            </div>

            <form className="space-y-4" id="activationForm" onSubmit={handleActivationSubmit}>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider" htmlFor="actEmail">
                  Email Professionnel
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                  </div>
                  <input className="w-full pl-10 pr-4 py-3 bg-[#f8fafc] hover:bg-slate-100/80 focus:bg-white text-slate-800 text-sm rounded-xl border border-slate-200 focus:border-az-blue focus:ring-2 focus:ring-az-blue/20 transition-all outline-none tracking-wider" id="actEmail" name="email" placeholder="votre.email@azcorporation.net" required type="email" defaultValue={defaultEmail} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider" htmlFor="actPassword">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                  </div>
                  <input className="w-full pl-10 pr-11 py-3 bg-[#f8fafc] hover:bg-slate-100/80 focus:bg-white text-slate-800 text-sm rounded-xl border border-slate-200 focus:border-az-blue focus:ring-2 focus:ring-az-blue/20 transition-all outline-none tracking-wider font-mono" id="actPassword" name="password" placeholder="••••••••" required type={showPassword ? "text" : "password"} />
                  <button aria-label="Afficher ou masquer le mot de passe" className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none" type="button" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider" htmlFor="actConfirmPassword">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                  </div>
                  <input className="w-full pl-10 pr-11 py-3 bg-[#f8fafc] hover:bg-slate-100/80 focus:bg-white text-slate-800 text-sm rounded-xl border border-slate-200 focus:border-az-blue focus:ring-2 focus:ring-az-blue/20 transition-all outline-none tracking-wider font-mono" id="actConfirmPassword" name="confirmPassword" placeholder="••••••••" required type={showConfirmPassword ? "text" : "password"} />
                  <button aria-label="Afficher ou masquer la confirmation" className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none" type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? (
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300" id="reqLength"></div>
                    <span className="text-[11px] text-slate-500 font-medium">Au moins 8 caractères</span>
                  </div>
                </div>

                <button className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 active:scale-[0.99] transition-all duration-200 shadow-md flex items-center justify-center gap-2 group shadow-emerald-500/20 disabled:opacity-70 disabled:cursor-not-allowed" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                      <span>Activation en cours...</span>
                    </>
                  ) : (
                    <>
                      <span>Activer mon compte</span>
                      <svg className="h-4 w-4 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="pt-1">
              <button className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 hover:text-slate-800 transition-colors flex items-center justify-center gap-2" onClick={handleContactSupport} type="button">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
                <span>J'ai besoin d'aide pour l'activation</span>
              </button>
            </div>
          </div>

          <footer className="mt-4 pt-3.5 text-center lg:text-left text-[11px] text-slate-400 border-t border-slate-100/80 flex items-center justify-between">
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

export default ActivateAccount;

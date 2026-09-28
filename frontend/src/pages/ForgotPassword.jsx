import React, { useState } from 'react';

import { useNavigate, Link } from 'react-router-dom';

import { authService } from '../services/api';

import { toast } from 'sonner';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const email = e.target.email.value;
    
    try {
      await authService.forgotPassword(email);
      toast.success("Si l'adresse existe, un email de récupération a été envoyé.");
      setTimeout(() => navigate('/auth'), 3000);
    } catch (err) {
      toast.error(err.message || "Erreur lors de la demande de réinitialisation");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full min-h-screen bg-slate-100 flex items-center justify-center p-4 antialiased text-slate-800 font-sans">
      <main className="w-full max-w-[900px] min-h-[530px] bg-white rounded-3xl shadow-2xl border border-slate-200/80 grid grid-cols-1 md:grid-cols-12 overflow-hidden relative z-10" data-purpose="auth-card">
        {/* Left Form Column */}
        <section className="md:col-span-6 p-7 sm:p-9 flex flex-col justify-between bg-white" data-purpose="recovery-form-column">
          <div>
            <div className="flex items-center justify-between mb-6">
              <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-az-navy to-slate-900 flex items-center justify-center shadow-md shadow-blue-900/20">
                  <span className="text-white font-extrabold text-sm tracking-tighter">AZ</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-extrabold tracking-wider text-az-navy leading-none">AZ PULSE</span>
                  <span className="text-[9px] text-slate-400 font-medium tracking-tight">CORPORATION</span>
                </div>
              </Link>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
                Sécurité & Accès
              </span>
            </div>
            
            <div className="mb-5">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mot de passe oublié ?</h1>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Saisissez votre adresse e-mail professionnelle pour recevoir un lien sécurisé de réinitialisation.
              </p>
            </div>
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5" htmlFor="work-email">
                  Adresse e-mail professionnelle
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"></path>
                    </svg>
                  </div>
                  <input className="w-full pl-10 pr-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-az-navy/20 focus:border-az-navy transition" id="work-email" name="email" placeholder="jean.dupont@azcorporation.net" required type="email" />
                </div>
                <p className="mt-1.5 text-[11px] text-slate-400 flex items-center gap-1">
                  <svg className="w-3 h-3 text-amber-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5zm0 7.5a.75.75 0 10-1.5 0 .75.75 0 001.5 0z" clipRule="evenodd"></path>
                  </svg>
                  Un lien temporaire valide 15 minutes vous sera transmis.
                </p>
              </div>
              
              <button disabled={isSubmitting} className="w-full py-2.5 px-4 bg-slate-900 hover:bg-black disabled:opacity-70 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl shadow-md shadow-slate-900/10 hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer" type="submit">
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <span>Envoyer le lien de récupération</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] gap-2">
              <Link to="/auth" className="inline-flex items-center text-slate-600 hover:text-slate-900 font-medium transition">
                <span className="mr-1">←</span> Retour à la connexion
              </Link>
              <a className="text-az-navy hover:text-blue-900 hover:underline font-semibold" href="#">
                Support IT & assistance
              </a>
            </div>
          </div>
          
          <footer className="mt-6 pt-3 text-[10px] text-slate-400 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between border-t border-slate-100/80">
            <span>© 2025 AZ Corporation</span>
            <span className="flex items-center gap-1 text-slate-400 font-medium">
              <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd"></path>
              </svg>
              Chiffrement SSL 256-bit
            </span>
          </footer>
        </section>
        
        {/* Right Brand Showcase Column */}
        <aside className="md:col-span-6 p-3 bg-white hidden md:block" data-purpose="branding-panel">
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#07152b] via-[#0b1f3a] to-[#050e1c] p-7 flex flex-col justify-between text-white relative overflow-hidden shadow-inner border border-[#0b2545]">
            <div className="absolute -top-16 -right-16 w-80 h-80 bg-gradient-to-br from-[#f59e0b]/30 via-[#0c356a]/50 to-white/5 opacity-30 rotate-45 pointer-events-none rounded-full blur-2xl"></div>
            <div className="absolute top-1/4 right-0 w-36 h-0.5 bg-gradient-to-r from-transparent via-[#fbbf24] to-transparent opacity-60 rotate-[28deg]"></div>
            
            <div className="relative z-10">
              <div className="relative mb-5 flex items-center justify-center py-2">
                <div className="relative flex items-center justify-center">
                  <svg className="w-24 h-24 text-[#0c356a]/60 drop-shadow-2xl" fill="none" viewBox="0 0 100 100">
                    <polygon fill="currentColor" points="50,10 90,85 70,85 50,45 30,85 10,85"></polygon>
                    <polygon fill="#0c356a" points="50,22 75,76 62,76 50,52 38,76 25,76"></polygon>
                    <polygon fill="#f59e0b" opacity="0.9" points="50,46 59,65 41,65"></polygon>
                  </svg>
                  <span className="absolute w-2 h-2 rounded-full bg-[#f59e0b] ring-4 ring-[#f59e0b]/20 animate-pulse"></span>
                </div>
              </div>
              <div className="text-center">
                <span className="text-xs uppercase tracking-widest text-[#f59e0b] font-semibold">AZ PULSE PORTAL</span>
                <h2 className="text-xl font-bold tracking-tight text-white mt-1">Welcome to AZ Pulse</h2>
                <p className="text-[11px] text-slate-300/80 mt-1.5 max-w-xs mx-auto leading-relaxed">
                  La plateforme centrale unifiée pour vos espaces de travail, outils de gouvernance et flux sécurisés d'entreprise.
                </p>
              </div>
            </div>
            
            <div className="relative z-10 p-4 rounded-xl shadow-lg mt-4" style={{ background: 'rgba(18, 30, 49, 0.85)', border: '1px solid rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(12px)' }}>
              <div className="flex flex-col gap-2">
                <div>
                  <h3 className="text-xs font-semibold text-white tracking-tight leading-snug">
                    Get your right job and right place apply now
                  </h3>
                  <p className="text-[10px] text-slate-300 mt-1 leading-normal">
                    Rejoignez le réseau professionnel AZ pour sécuriser et accélérer vos opérations quotidiennes.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex -space-x-1.5 overflow-hidden">
                    <span className="inline-block h-6 w-6 rounded-full ring-2 ring-[#07152b] bg-slate-600 text-[9px] font-bold text-white flex items-center justify-center">TL</span>
                    <span className="inline-block h-6 w-6 rounded-full ring-2 ring-[#07152b] bg-blue-700 text-[9px] font-bold text-white flex items-center justify-center">MK</span>
                    <span className="inline-block h-6 w-6 rounded-full ring-2 ring-[#07152b] bg-amber-600 text-[9px] font-bold text-white flex items-center justify-center">ED</span>
                    <span className="inline-block h-6 w-6 rounded-full ring-2 ring-[#07152b] bg-slate-800 text-[8px] font-semibold text-slate-200 flex items-center justify-center">+17k</span>
                  </div>
                  <span className="text-[10px] font-medium text-[#f59e0b]/90">Portail Actif 99.9%</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default ForgotPassword;

import React, { useState } from 'react';

import { useNavigate, useSearchParams, Link } from 'react-router-dom';

import { authService } from '../services/api';

import { toast } from 'sonner';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('Jeton de réinitialisation manquant.');
      return;
    }

    setIsSubmitting(true);
    const password = e.target.password.value;
    
    try {
      await authService.resetPassword(token, password);
      toast.success("Votre mot de passe a été réinitialisé avec succès.");
      navigate('/auth');
    } catch (err) {
      toast.error(err.message || "Erreur lors de la réinitialisation du mot de passe");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full min-h-screen bg-slate-100 flex items-center justify-center p-4 antialiased text-slate-800 font-sans">
      <main className="w-full max-w-[900px] min-h-[530px] bg-white rounded-3xl shadow-2xl border border-slate-200/80 grid grid-cols-1 md:grid-cols-12 overflow-hidden relative z-10" data-purpose="auth-card">
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
            </div>
            
            <div className="mb-5">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Nouveau mot de passe</h1>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Veuillez saisir votre nouveau mot de passe.
              </p>
            </div>
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5" htmlFor="password">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                  </div>
                  <input className="w-full pl-10 pr-11 py-2.5 text-xs text-slate-800 placeholder-slate-400 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-az-navy/20 focus:border-az-navy transition" id="password" name="password" placeholder="••••••••" required type={showPassword ? 'text' : 'password'} minLength={8} />
                  <button type="button" className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
              </div>
              
              <button disabled={isSubmitting || !token} className="w-full py-2.5 px-4 bg-slate-900 hover:bg-black disabled:opacity-70 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl shadow-md shadow-slate-900/10 hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer" type="submit">
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>Réinitialisation...</span>
                  </>
                ) : (
                  <span>Réinitialiser mon mot de passe</span>
                )}
              </button>
            </form>
          </div>
        </section>
        
        <aside className="md:col-span-6 p-3 bg-white hidden md:block">
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#07152b] via-[#0b1f3a] to-[#050e1c] p-7 flex flex-col justify-between text-white relative overflow-hidden shadow-inner border border-[#0b2545]">
            {/* Same design as ForgotPassword */}
            <div className="absolute -top-16 -right-16 w-80 h-80 bg-gradient-to-br from-[#f59e0b]/30 via-[#0c356a]/50 to-white/5 opacity-30 rotate-45 pointer-events-none rounded-full blur-2xl"></div>
            <div className="relative z-10 flex flex-col h-full justify-center items-center">
              <svg className="w-24 h-24 text-[#0c356a]/60 drop-shadow-2xl" fill="none" viewBox="0 0 100 100">
                <polygon fill="currentColor" points="50,10 90,85 70,85 50,45 30,85 10,85"></polygon>
                <polygon fill="#0c356a" points="50,22 75,76 62,76 50,52 38,76 25,76"></polygon>
                <polygon fill="#f59e0b" opacity="0.9" points="50,46 59,65 41,65"></polygon>
              </svg>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default ResetPassword;

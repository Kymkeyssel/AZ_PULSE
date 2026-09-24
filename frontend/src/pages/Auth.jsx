import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import './Auth.css';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get('mode');
  const [isLogin, setIsLogin] = useState(mode !== 'register');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    const form = e.target;
    
    try {
      const data = await authService.login(form.email.value, form.password.value);
      localStorage.setItem('az_pulse_token', data.token);
      
      if (data.user.status === 'PENDING_APPROVAL') {
        navigate('/pending');
      } else if (data.user.status === 'REJECTED') {
        navigate('/rejected');
      } else if (data.user.lastLoginAt === null) {
        navigate('/activate');
      } else {
        alert(`Connexion réussie. Bienvenue ${data.user.firstName}!`);
        // navigate('/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.message || "Erreur de connexion");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    const form = e.target;
    
    const payload = {
      lastName: form.reqLastName.value,
      firstName: form.reqFirstName.value,
      email: form.reqEmail.value,
      phone: form.reqPhone.value,
      requestedDomain: form.reqRole.value,
      motivation: form.reqReason.value
    };

    try {
      await authService.register(payload);
      navigate('/pending');
    } catch (err) {
      setErrorMsg(err.message || "Erreur lors de la demande d'accès");
    } finally {
      setIsSubmitting(false);
    }
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
        <section className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between p-6 sm:p-9 xl:p-12 bg-white relative z-10" data-purpose="auth-panel-container">
          <header className="flex items-center justify-between mb-6 sm:mb-8" data-purpose="brand-header">
            <a className="inline-flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-az-blue/40 rounded-xl p-1 -m-1" href="/">
              <img alt="AZ Pulse Logo" className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105" src="/AZ PULSE_logo.png" />
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-widest text-az-blue">Portail Interne</span>
                <span className="text-sm font-semibold text-slate-800 -mt-0.5">AZ Corporation</span>
              </div>
            </a>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Système Actif
            </span>
          </header>

          <div className="relative flex-1 flex flex-col justify-center my-auto min-h-[460px] overflow-hidden">
            {/* Sign In Form */}
            <div className={`form-pane w-full flex flex-col justify-center ${isLogin ? 'form-pane-active' : 'form-pane-hidden-left'}`} data-purpose="sign-in-form-pane">
              <div className="mb-7">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Connexion</h1>
                <p className="text-sm sm:text-base text-slate-500 mt-2 font-normal">
                  Portail interne de pilotage d'entreprise & gouvernance unifiée
                </p>
                {errorMsg && isLogin && (
                  <div className="mt-4 p-3 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl">
                    {errorMsg}
                  </div>
                )}
              </div>
              <form className="space-y-4" onSubmit={handleLoginSubmit}>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider" htmlFor="loginEmail">
                    Adresse Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                      </svg>
                    </div>
                    <input className="w-full pl-10 pr-4 py-3 bg-[#f8fafc] hover:bg-slate-100/80 focus:bg-white text-slate-800 text-sm rounded-xl border border-slate-200 focus:border-az-blue focus:ring-2 focus:ring-az-blue/20 transition-all outline-none" id="loginEmail" name="email" placeholder="Kymekeyss19@gmail.com" required type="email" />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider" htmlFor="loginPassword">
                      Mot de passe
                    </label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                      </svg>
                    </div>
                    <input className="w-full pl-10 pr-11 py-3 bg-[#f8fafc] hover:bg-slate-100/80 focus:bg-white text-slate-800 text-sm rounded-xl border border-slate-200 focus:border-az-blue focus:ring-2 focus:ring-az-blue/20 transition-all outline-none tracking-wider" id="loginPassword" name="password" placeholder="••••••••" required type={showPassword ? 'text' : 'password'} />
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

                <div className="flex items-center justify-between pt-1 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 hover:text-slate-900">
                    <input className="w-4 h-4 rounded border-slate-300 text-az-navy focus:ring-az-blue focus:ring-offset-0 transition-colors" type="checkbox" />
                    <span className="font-medium">Se souvenir de moi</span>
                  </label>
                  <button className="font-medium text-slate-500 hover:text-az-blue transition-colors bg-transparent border-none p-0 cursor-pointer" type="button" onClick={() => alert("Veuillez contacter le support informatique AZ Corporation (support@azcorporation.net) ou votre administrateur d'infrastructure pour réinitialiser vos identifiants.")}>
                    Mot de passe oublié ?
                  </button>
                </div>

                <button className="w-full py-3 px-6 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#191919] via-[#0b2545] to-[#1d63ff] hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                      <span>Vérification...</span>
                    </>
                  ) : (
                    <span>Se connecter</span>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center text-xs text-slate-600">
                <span>Pas encore de compte ? </span>
                <button className="font-bold hover:text-slate-900 text-az-blue hover:underline transition-colors focus:outline-none" type="button" onClick={() => setIsLogin(false)}>
                  S'inscrire
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <p className="text-center text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-4">
                  Ou authentification SSO entreprise
                </p>
                <div className="flex items-center justify-center gap-4">
                  <button className="w-11 h-11 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-all hover:scale-105 shadow-sm active:scale-95" title="Connexion Google Workspace" type="button">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" fill="#4285F4"></path>
                      <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" fill="#34A853"></path>
                      <path d="M5.28 14.27a7.2 7.2 0 0 1 0-4.54V6.58H1.25a11.96 11.96 0 0 0 0 10.84l4.03-3.15z" fill="#FBBC05"></path>
                      <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" fill="#EA4335"></path>
                    </svg>
                  </button>
                  <button className="w-11 h-11 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-all hover:scale-105 shadow-sm active:scale-95" title="Connexion GitHub Enterprise" type="button">
                    <svg className="w-5 h-5 text-slate-800" fill="currentColor" viewBox="0 0 24 24">
                      <path clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fillRule="evenodd"></path>
                    </svg>
                  </button>
                  <button className="w-11 h-11 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-all hover:scale-105 shadow-sm active:scale-95" title="Connexion Microsoft 365 / Facebook" type="button">
                    <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Access Request Form */}
            <div className={`form-pane w-full flex flex-col justify-between ${!isLogin ? 'form-pane-active' : 'form-pane-hidden-right'}`} data-purpose="access-request-pane">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Demande d'accès</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    Protocole AZ
                  </span>
                </div>
                <div className="mt-2 p-2.5 bg-blue-50/70 border border-blue-100 rounded-xl flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-az-blue mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                  <p className="text-xs text-slate-600 leading-snug">
                    <strong className="text-slate-800 font-medium">Validation requise :</strong> Votre compte sera activé après approbation manuelle d'un administrateur interne AZ Corporation.
                  </p>
                </div>
                {errorMsg && !isLogin && (
                  <div className="mt-4 p-3 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl">
                    {errorMsg}
                  </div>
                )}
              </div>
              
              <form className="space-y-3 max-h-[440px] overflow-y-auto pr-1.5 custom-scrollbar" id="accessRequestForm" onSubmit={handleRegisterSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider" htmlFor="reqLastName">
                      Nom <span className="text-rose-500">*</span>
                    </label>
                    <input className="w-full px-3.5 py-2.5 bg-[#f8fafc] focus:bg-white text-slate-800 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-az-blue focus:ring-2 focus:ring-az-blue/20 transition-all outline-none" id="reqLastName" placeholder="Ex: YMELE" required type="text" />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider" htmlFor="reqFirstName">
                      Prénom <span className="text-rose-500">*</span>
                    </label>
                    <input className="w-full px-3.5 py-2.5 bg-[#f8fafc] focus:bg-white text-slate-800 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-az-blue focus:ring-2 focus:ring-az-blue/20 transition-all outline-none" id="reqFirstName" placeholder="Ex: Keyssel" required type="text" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider" htmlFor="reqEmail">
                    Email Professionnel <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                      </svg>
                    </div>
                    <input className="w-full pl-9 pr-3.5 py-2.5 bg-[#f8fafc] focus:bg-white text-slate-800 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-az-blue focus:ring-2 focus:ring-az-blue/20 transition-all outline-none" id="reqEmail" placeholder="nom.prenom@azcorporation.net" required type="email" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider" htmlFor="reqPhone">
                    Numéro de Téléphone <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                      </svg>
                    </div>
                    <input className="w-full pl-9 pr-3.5 py-2.5 bg-[#f8fafc] focus:bg-white text-slate-800 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-az-blue focus:ring-2 focus:ring-az-blue/20 transition-all outline-none" id="reqPhone" placeholder="+237 6XX XX XX XX / +33 6 XX XX XX XX" required type="tel" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider" htmlFor="reqRole">
                    Situation / Statut dans la structure <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select className="w-full px-3.5 py-2.5 bg-[#f8fafc] focus:bg-white text-slate-800 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-az-blue focus:ring-2 focus:ring-az-blue/20 transition-all outline-none appearance-none cursor-pointer" id="reqRole" required defaultValue="">
                      <option disabled value="">Sélectionnez votre situation...</option>
                      <optgroup label="Profils Utilisateurs">
                        <option value="apprenant">Apprenant</option>
                        <option value="parent">Parent / Tuteur</option>
                        <option value="client">Client</option>
                      </optgroup>
                      <optgroup label="Collaborateurs">
                        <option value="formateur">Formateur / Intervenant</option>
                      </optgroup>
                      <optgroup label="Responsables Métier">
                        <option value="resp_formation">Responsable Formation</option>
                        <option value="resp_crm">Responsable CRM</option>
                        <option value="resp_workspace">Responsable Workspace / Projets</option>
                        <option value="resp_analytics">Responsable Analytics / Performance</option>
                        <option value="resp_it">Responsable Infrastructure & IT</option>
                        <option value="resp_knowledge">Responsable Knowledge Hub</option>
                        <option value="resp_ai">Responsable Services AI</option>
                        <option value="resp_rh">Responsable RH</option>
                      </optgroup>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider" htmlFor="reqReason">
                    Justification / Motif de la demande
                  </label>
                  <textarea className="w-full px-3.5 py-2 bg-[#f8fafc] focus:bg-white text-slate-800 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-az-blue focus:ring-2 focus:ring-az-blue/20 transition-all outline-none resize-none" id="reqReason" placeholder="Précisez votre unité, votre fonction ou la raison de votre demande d'accès..." rows="2"></textarea>
                </div>

                <button className="w-full py-3 px-6 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#191919] via-[#0b2545] to-[#1d63ff] hover:opacity-95 active:scale-[0.99] transition-all duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <span>Soumettre la demande d'accès</span>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                      </svg>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-4 pt-3 border-t border-slate-100 text-center text-xs text-slate-600">
                <span>Déjà un compte validé ? </span>
                <button className="font-bold text-az-blue hover:text-az-navy hover:underline transition-colors focus:outline-none" type="button" onClick={() => setIsLogin(true)}>
                  Se connecter
                </button>
              </div>
            </div>
          </div>
          
          <footer className="mt-6 pt-4 text-center lg:text-left text-[11px] text-slate-400 border-t border-slate-100/80 flex items-center justify-between">
            <span>© 2025 AZ Corporation. Tous droits réservés.</span>
            <span className="hover:text-slate-600 transition-colors">v3.4.2 Enterprise</span>
          </footer>
        </section>

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

export default Auth;

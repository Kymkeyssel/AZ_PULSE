import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Error403 = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sessionId] = React.useState(() => Math.random().toString(36).substr(2, 6));
  const [isEscalating, setIsEscalating] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleEscalation = () => {
    setIsEscalating(true);
    setTimeout(() => {
      setIsEscalating(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4500);
    }, 800);
  };

  const handleRelogin = () => {
    if (logout) {
      logout();
    }
    navigate('/auth');
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col justify-between selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes playfulRubber { 0% { transform: scale(0.1) rotate(15deg) translateY(-100px); opacity: 0; filter: drop-shadow(0 0 0 rgba(96,165,250,0)); } 50% { transform: scale(1.25) rotate(-5deg) translateY(15px); opacity: 1; filter: drop-shadow(0 0 35px rgba(96,165,250,0.8)); } 70% { transform: scale(0.9) rotate(3deg) translateY(-8px); } 85% { transform: scale(1.08) rotate(-1deg); } 100% { transform: scale(1) rotate(0deg) translateY(0); opacity: 1; } }
        @keyframes ambientFloat { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-8px) rotate(-1deg); } }
        .rubber-bouncy-403 { animation: playfulRubber 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards, ambientFloat 4s ease-in-out infinite 1.3s; transform-origin: center center; display: inline-block; will-change: transform, opacity; }
      `}} />

      <main className="w-full flex-1 flex flex-col items-center justify-center bg-surface relative">
        <div className="flex flex-col w-full">
          <section className="relative w-full overflow-hidden bg-primary text-on-primary py-space-xl px-margin flex flex-col items-center justify-center min-h-screen">
            <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[550px] bg-gradient-to-b from-secondary-container/40 via-tertiary-fixed-dim/20 to-transparent blur-[140px] rounded-full opacity-80"></div>
            <div className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-[340px] h-[340px] bg-secondary/30 blur-[90px] rounded-full"></div>
            <div className="pointer-events-none absolute -bottom-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary-container/40 blur-[120px] rounded-full"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(26,98,254,0.15),rgba(0,16,38,0))] pointer-events-none"></div>
            
            <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center">
              
              <div className="inline-flex items-center gap-space-xs px-space-md py-1.5 rounded-full bg-surface-container-lowest/10 backdrop-blur-md shadow-sm mb-space-lg">
                <span className="inline-flex h-2 w-2 rounded-full bg-tertiary-fixed-dim animate-ping"></span>
                <span className="inline-flex h-2 w-2 rounded-full bg-tertiary-fixed-dim -ml-space-sm"></span>
                <span className="font-label-sm text-label-sm tracking-wider uppercase text-tertiary-fixed">Matrice RBAC - Alerte de Sécurité Périmétrique</span>
              </div>
              
              <div className="relative select-none my-space-xs flex items-center justify-center">
                <span className="absolute inset-0 text-secondary-container/30 blur-2xl text-[140px] sm:text-[180px] md:text-[220px] font-extrabold tracking-tighter leading-none select-none pointer-events-none">403</span>
                <h1 className="relative text-[120px] sm:text-[160px] md:text-[200px] font-extrabold tracking-tight leading-none bg-gradient-to-b from-white via-primary-fixed to-secondary-fixed-dim bg-clip-text text-transparent drop-shadow-[0_20px_45px_rgba(0,74,209,0.45)] rubber-bouncy-403">
                  403
                </h1>
              </div>
              
              <div className="max-w-2xl mx-auto mt-space-xs flex flex-col items-center gap-space-xs">
                <div className="flex items-center gap-space-xs text-tertiary-fixed font-headline-sm text-headline-sm">
                  <span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>lock</span>
                  <span className="">Accès Non Autorisé / Privilèges Insuffisants</span>
                </div>
                <p className="font-body-lg text-body-lg text-outline-variant max-w-xl text-center leading-relaxed">
                  Votre profil utilisateur actuel ne possède pas les autorisations nécessaires dans la matrice RBAC d'AZ Pulse pour afficher cette vue sensible ou ce dossier de direction.
                </p>
              </div>
              
              <div className="w-full max-w-xl mt-space-lg rounded-xl bg-surface-container-lowest/[0.06] backdrop-blur-xl p-space-md sm:p-space-lg text-left shadow-xl">
                <div className="flex items-center justify-between pb-space-sm mb-space-sm">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-secondary text-[20px]">verified_user</span>
                    <span className="font-label-md text-label-md uppercase tracking-wider text-on-primary">Diagnostic Contrôle d'Accès</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-tertiary-container bg-tertiary-container/80 px-space-xs py-0.5 rounded">Rejet RBAC-0x403</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                  <div className="flex flex-col gap-0.5 p-space-sm rounded-lg bg-surface-container-lowest/[0.04]">
                    <span className="font-label-sm text-label-sm text-outline-variant">Rôle actif détecté</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="h-2 w-2 rounded-full bg-outline-variant"></span>
                      <span className="font-headline-sm text-headline-sm text-on-primary">
                        {user ? user.roles[0] || 'Utilisateur Connecté' : 'Non authentifié'}
                      </span>
                    </div>
                    <span className="font-label-sm text-label-sm text-outline-variant">Profil: {user ? user.email : 'N/A'}</span>
                  </div>
                  
                  <div className="flex flex-col gap-0.5 p-space-sm rounded-lg bg-secondary-container/10">
                    <span className="font-label-sm text-label-sm text-secondary-fixed">Privilège requis</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="material-symbols-outlined text-tertiary-fixed text-[16px]">key</span>
                      <span className="font-headline-sm text-headline-sm text-tertiary-fixed">Direction Générale</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-outline-variant">Super Admin (FIDO2 requis)</span>
                  </div>
                </div>
                
                <div className="mt-space-sm pt-space-sm flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs text-outline-variant font-label-sm text-label-sm">
                  <div className="flex items-center gap-space-xs">
                    <span className="">ID de session :</span>
                    <code className="px-space-xs py-0.5 rounded bg-surface-container-lowest/10 text-primary-fixed font-mono select-all">sess_rbac_sec_{sessionId}</code>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">shield</span>
                    <span className="">Protocole eIDAS Tier-IV vérifié</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-space-lg flex flex-col sm:flex-row items-center justify-center gap-space-md w-full max-w-lg">
                <button 
                  onClick={handleEscalation} 
                  disabled={isEscalating}
                  className={`w-full sm:w-auto px-space-lg py-3 rounded-lg bg-secondary-container hover:bg-secondary text-on-secondary font-label-lg text-label-lg flex items-center justify-center gap-space-xs transition-all duration-200 shadow-md active:scale-95 group ${isEscalating ? 'opacity-75' : ''}`}
                >
                  {isEscalating ? (
                    <>
                      <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                      <span className="">Transmission en cours...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px] group-hover:rotate-12 transition-transform">add_moderator</span>
                      <span className="">Demander une élévation</span>
                    </>
                  )}
                </button>
                <button onClick={handleRelogin} className="w-full sm:w-auto px-space-lg py-3 rounded-lg bg-surface-container-lowest/10 hover:bg-surface-container-lowest/20 text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-space-xs transition-all duration-200 backdrop-blur-md active:scale-95">
                  <span className="material-symbols-outlined text-[18px]">switch_account</span>
                  <span className="">Changer de compte</span>
                </button>
              </div>
              
              <div className="mt-space-lg flex flex-col items-center gap-space-xs max-w-md text-center">
                <p className="font-body-sm text-body-sm text-outline-variant">
                  Si vous venez de changer de fonction au sein d'AZ Corporation, contactez votre responsable hiérarchique pour actualiser vos attributions de poste.
                </p>
                <a className="inline-flex items-center gap-1 font-label-md text-label-md text-secondary-fixed hover:text-white transition-colors mt-space-xs underline underline-offset-4" href="mailto:support-noc@azpulse.net">
                  <span className="material-symbols-outlined text-[16px]">contact_support</span>
                  <span className="">Consulter mon administrateur de pôle</span>
                </a>
              </div>
            </div>
            
            {showToast && (
              <div className="fixed bottom-space-lg z-50 flex items-center gap-space-sm px-space-md py-space-sm rounded-lg bg-surface-container-lowest text-primary shadow-xl animate-bounce">
                <span className="material-symbols-outlined text-secondary">task_alt</span>
                <div className="flex flex-col text-left">
                  <span className="font-headline-sm text-headline-sm">Requête RBAC transmise</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">L'approbateur de pôle a reçu votre demande de jeton d'accès.</span>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
      

    </div>
  );
};

export default Error403;

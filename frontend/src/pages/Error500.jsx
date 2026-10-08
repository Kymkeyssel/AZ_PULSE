import React from 'react';
import { Link } from 'react-router-dom';

const Error500 = () => {
  const [errorId] = React.useState(() => Math.random().toString(36).substr(2, 6));
  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col justify-between selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes playfulImpact { 0% { transform: scale(0.2) translateY(-120px) rotate(-12deg); opacity: 0; filter: blur(8px); } 55% { transform: scale(1.22) translateY(20px) rotate(4deg); opacity: 1; filter: blur(0); } 75% { transform: scale(0.92) translateY(-10px) rotate(-2deg); } 90% { transform: scale(1.05) translateY(4px) rotate(1deg); } 100% { transform: scale(1) translateY(0) rotate(0deg); opacity: 1; } }
        @keyframes pulseFloat500 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .hero-500-anim { animation: playfulImpact 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards, pulseFloat500 4.5s ease-in-out infinite 1.3s; transform-origin: center center; display: inline-block; will-change: transform; }
      `}} />

      <main className="w-full flex-1 flex flex-col items-center justify-center bg-surface relative">
        <div className="flex flex-col w-full">
          <div className="relative w-full overflow-hidden bg-primary text-on-primary py-space-xl px-margin flex flex-col items-center justify-center min-h-screen">
            <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[720px] h-[520px] bg-[radial-gradient(ellipse_at_center,_rgba(0,74,209,0.35)_0%,_rgba(26,98,254,0.15)_45%,_transparent_75%)] blur-2xl"></div>
            <div className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-64 h-32 bg-[radial-gradient(ellipse_at_center,_rgba(255,186,32,0.12)_0%,_transparent_70%)] blur-xl"></div>
            <div className="pointer-events-none absolute -bottom-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_center,_rgba(186,26,26,0.18)_0%,_transparent_70%)] blur-3xl"></div>
            
            <div className="relative z-10 max-w-4xl w-full flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-surface-container-highest/10 backdrop-blur-md mb-space-md shadow-sm">
                <span className="h-2 w-2 rounded-full bg-error animate-ping"></span>
                <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider font-semibold">Incident Système Détecté • Tier-IV Cluster</span>
              </div>
              
              <div className="relative select-none my-space-xs flex items-center justify-center hero-500-anim">
                <span className="font-display-hero text-[120px] md:text-[180px] leading-none tracking-tighter font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white via-primary-fixed to-secondary drop-shadow-[0_20px_35px_rgba(0,74,209,0.45)]">
                  500
                </span>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 blur-lg text-[120px] md:text-[180px] font-extrabold text-secondary leading-none">
                  500
                </div>
              </div>
              
              <h1 className="font-headline-xl text-headline-xl text-on-primary tracking-tight mt-space-xs mb-space-sm">
                500 — Incident Serveur Interne
              </h1>
              <p className="font-body-lg text-body-lg text-on-primary-container max-w-2xl leading-relaxed">
                Une anomalie inattendue s’est produite lors de l’exécution de la requête. Nos équipes d’ingénierie et le SIEM AZ Pulse ont été notifiés automatiquement.
              </p>
              
              <div className="w-full max-w-2xl mt-space-lg text-left bg-primary-container/60 backdrop-blur-xl rounded-xl p-space-md shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary via-tertiary-fixed-dim to-error"></div>
                <div className="flex items-center justify-between pb-space-sm mb-space-sm">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-secondary text-[20px]">terminal</span>
                    <span className="font-label-md text-label-md text-primary-fixed uppercase tracking-wider font-semibold">Console de Télémétrie Incident</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-tertiary-fixed-dim bg-tertiary-container px-space-xs py-0.5 rounded flex items-center gap-1 font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-tertiary-fixed-dim animate-pulse"></span>
                    SIEM Pipeline Actif
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm font-body-sm text-body-sm">
                  <div className="flex flex-col gap-0.5 bg-primary/40 p-space-xs rounded">
                    <span className="font-label-sm text-label-sm text-outline-variant uppercase">Incident ID</span>
                    <span className="font-semibold text-primary-fixed font-mono select-all">err_srv_500_{errorId}</span>
                  </div>
                  <div className="flex flex-col gap-0.5 bg-primary/40 p-space-xs rounded">
                    <span className="font-label-sm text-label-sm text-outline-variant uppercase">Horodatage</span>
                    <span className="font-semibold text-on-primary font-mono">{new Date().toLocaleString()} UTC</span>
                  </div>
                  <div className="flex flex-col gap-0.5 bg-primary/40 p-space-xs rounded sm:col-span-2">
                    <span className="font-label-sm text-label-sm text-outline-variant uppercase">Statut Auto-Diagnostic</span>
                    <span className="font-semibold text-on-secondary-container flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-secondary text-[16px]">cloud_sync</span>
                      Télémétrie transmise avec succès à Grafana / n8n Automation Engine
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5 bg-primary/40 p-space-xs rounded sm:col-span-2">
                    <span className="font-label-sm text-label-sm text-outline-variant uppercase">Microservices</span>
                    <div className="flex flex-wrap items-center gap-space-sm mt-1">
                      <span className="inline-flex items-center gap-1 text-on-primary bg-secondary/20 px-space-xs py-0.5 rounded font-label-sm text-label-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-secondary-fixed"></span> Auth : OK
                      </span>
                      <span className="inline-flex items-center gap-1 text-on-primary bg-secondary/20 px-space-xs py-0.5 rounded font-label-sm text-label-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-secondary-fixed"></span> GLPI : OK
                      </span>
                      <span className="inline-flex items-center gap-1 text-tertiary-fixed-dim bg-tertiary-container/80 px-space-xs py-0.5 rounded font-label-sm text-label-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-tertiary-fixed-dim animate-pulse"></span> Passerelle BD : Reconnexion en cours
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-space-lg flex flex-wrap items-center justify-center gap-space-sm w-full max-w-xl">
                <button className="flex-1 min-w-[200px] h-11 px-space-md rounded-lg bg-secondary text-on-secondary font-label-lg text-label-lg font-semibold flex items-center justify-center gap-space-xs shadow-lg hover:bg-secondary-container transition-all active:scale-[0.98]" onClick={() => window.location.reload()}>
                  <span className="material-symbols-outlined text-[20px]">refresh</span>
                  <span className="">Actualiser la page</span>
                </button>
                <Link to="/" className="flex-1 min-w-[200px] h-11 px-space-md rounded-lg bg-surface-container-highest/15 backdrop-blur-md text-on-primary hover:bg-surface-container-highest/25 font-label-lg text-label-lg font-semibold flex items-center justify-center gap-space-xs transition-all">
                  <span className="material-symbols-outlined text-secondary text-[20px]">pulse_alert</span>
                  <span className="">Retour au Dashboard</span>
                </Link>
                <button className="w-full sm:w-auto h-11 px-space-md rounded-lg bg-transparent text-primary-fixed hover:text-white font-label-md text-label-md flex items-center justify-center gap-space-xs transition-colors" onClick={() => alert('Notification prioritaire transmise au centre NOC AZ Pulse.')}>
                  <span className="material-symbols-outlined text-[18px]">support_agent</span>
                  <span className="">Notifier la permanence IT d’astreinte</span>
                </button>
              </div>
              
              <div className="mt-space-lg flex items-center gap-space-xs text-on-primary-container font-body-sm text-body-sm bg-primary-container/30 px-space-md py-space-xs rounded-full">
                <span className="material-symbols-outlined text-secondary-fixed text-[18px]">verified_user</span>
                <span className="">Intégrité garantie : Aucune altération ni perte de données transactionnelles enregistrée.</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      

    </div>
  );
};

export default Error500;

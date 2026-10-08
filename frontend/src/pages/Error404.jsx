import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Error404 = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [traceId] = React.useState(() => Math.random().toString(36).substr(2, 7));

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col justify-between selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes playfulPop { 0% { transform: scale(0.2) translateY(-80px) rotate(-8deg); opacity: 0; filter: blur(10px); } 60% { transform: scale(1.18) translateY(12px) rotate(3deg); opacity: 1; filter: blur(0); } 80% { transform: scale(0.92) translateY(-6px) rotate(-1deg); } 100% { transform: scale(1) translateY(0) rotate(0deg); opacity: 1; } }
        @keyframes floatBounce { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-10px) rotate(1deg); } }
        @keyframes glowPulse { 0%, 100% { opacity: 0.35; transform: scale(1.15); } 50% { opacity: 0.65; transform: scale(1.35); } }
        .bouncy-404-container { animation: playfulPop 1.1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards, floatBounce 4s ease-in-out infinite 1.2s; transform-origin: center center; will-change: transform, opacity; }
        .glow-pulse-effect { animation: glowPulse 3s ease-in-out infinite; }
      `}} />

      <main className="w-full flex-1 flex flex-col items-center justify-center bg-surface relative">
        <div className="flex flex-col w-full">
          <div className="relative w-full overflow-hidden bg-primary text-on-primary py-space-xl px-margin flex flex-col items-center justify-center min-h-screen">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[650px] h-[580px] bg-secondary-container/25 rounded-full blur-[130px] pointer-events-none"></div>
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[340px] h-[340px] bg-secondary-fixed-dim/20 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-tertiary-fixed-dim/10 rounded-full blur-[60px] pointer-events-none"></div>
            <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{backgroundImage: 'radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)', backgroundSize: '28px 28px'}}></div>
            <div className="relative z-10 w-full max-w-4xl flex flex-col items-center text-center">
              
              <div className="inline-flex items-center gap-space-xs px-space-md py-1.5 rounded-full bg-surface-container-lowest/10 backdrop-blur-md shadow-sm mb-space-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary-fixed-dim opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary-fixed-dim"></span>
                </span>
                <span className="font-label-sm text-label-sm text-surface-bright tracking-wider uppercase">Cluster AZ Pulse Opérationnel (99.98%)</span>
                <span className="text-on-primary-container text-xs">•</span>
                <span className="font-label-sm text-label-sm text-primary-fixed">Nœud Par-02</span>
              </div>
              
              <div className="relative select-none my-space-xs flex items-center justify-center bouncy-404-container">
                <div className="absolute inset-0 bg-secondary/30 blur-3xl rounded-full scale-125 pointer-events-none glow-pulse-effect"></div>
                <span className="relative font-display-hero text-[110px] md:text-[160px] leading-none font-extrabold tracking-tighter bg-gradient-to-b from-[#8aa9ff] via-[#4d79ff] to-[#122b5e] bg-clip-text text-transparent drop-shadow-[0_20px_45px_rgba(0,40,160,0.55)]">404</span>
              </div>
              
              <h1 className="font-headline-xl text-headline-xl text-surface-bright font-bold tracking-tight mt-space-sm mb-space-xs">
                404 — Ressource ou Page Introuvable
              </h1>
              <p className="font-body-lg text-body-lg text-inverse-on-surface/80 max-w-2xl mx-auto leading-relaxed mb-space-lg">
                Le module, le document de formation ou l’espace de travail AZ Pulse auquel vous tentez d’accéder a été déplacé, archivé ou n’a jamais existé dans ce périmètre applicatif.
              </p>
              
              <div className="w-full max-w-lg mb-space-lg relative">
                <div className="flex items-center w-full bg-surface-container-lowest/10 backdrop-blur-xl rounded-xl px-space-md py-2.5 shadow-lg group focus-within:bg-surface-container-lowest/15 transition-all">
                  <span className="material-symbols-outlined text-surface-tint mr-space-sm text-[22px]">search</span>
                  <input ref={inputRef} aria-label="Recherche rapide de ressource" className="bg-transparent text-surface-bright placeholder-surface-container-highest/60 text-body-md font-body-md w-full outline-none" placeholder="Rechercher un module, une formation ou un service AZ Pulse..." type="text" />
                  <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-label-sm font-label-sm text-surface-container-highest bg-surface-container-lowest/15 rounded shadow-sm">
                    <span className="">⌘</span><span className="">K</span>
                  </kbd>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-space-md mb-space-xl">
                <Link to="/" className="inline-flex items-center gap-space-xs px-space-lg py-3 rounded-lg bg-secondary-container hover:bg-secondary text-on-secondary font-headline-sm text-headline-sm shadow-[0_4px_24px_rgba(26,98,254,0.45)] hover:shadow-[0_6px_30px_rgba(26,98,254,0.6)] active:scale-[0.98] transition-all duration-200">
                  <span className="material-symbols-outlined text-[20px]">dashboard</span>
                  <span className="">Retour au Dashboard Principal</span>
                </Link>
                <button onClick={() => window.history.back()} className="inline-flex items-center gap-space-xs px-space-lg py-3 rounded-lg bg-surface-container-lowest/10 hover:bg-surface-container-lowest/20 text-surface-bright font-headline-sm text-headline-sm backdrop-blur-md shadow-md active:scale-[0.98] transition-all duration-200">
                  <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                  <span className="">Page précédente</span>
                </button>
              </div>
              
              <div className="w-full max-w-2xl bg-surface-container-lowest/5 backdrop-blur-2xl rounded-xl p-space-md shadow-xl text-left">
                <div className="flex items-center justify-between pb-space-xs mb-space-xs">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-secondary-fixed text-[18px]">terminal</span>
                    <span className="font-label-md text-label-md text-surface-bright uppercase tracking-wider font-semibold">Télémétrie de la requête</span>
                  </div>
                  <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-error-container text-on-error-container font-bold">404 NOT_FOUND</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm pt-space-xs">
                  <div className="bg-surface-container-lowest/5 rounded-lg p-space-sm flex flex-col">
                    <span className="font-label-sm text-label-sm text-surface-tint uppercase font-semibold">Trace ID</span>
                    <span className="font-body-sm text-body-sm text-surface-bright font-mono mt-0.5 truncate select-all" title="req_azp_404">
                      req_azp_404_{traceId}
                    </span>
                  </div>
                  <div className="bg-surface-container-lowest/5 rounded-lg p-space-sm flex flex-col">
                    <span className="font-label-sm text-label-sm text-surface-tint uppercase font-semibold">URI Sollicité</span>
                    <span className="font-body-sm text-body-sm text-secondary-fixed-dim font-mono mt-0.5 truncate select-all" title={window.location.pathname}>
                      {window.location.pathname}
                    </span>
                  </div>
                  <div className="bg-surface-container-lowest/5 rounded-lg p-space-sm flex flex-col">
                    <span className="font-label-sm text-label-sm text-surface-tint uppercase font-semibold">Passerelle API</span>
                    <span className="font-body-sm text-body-sm text-surface-bright font-mono mt-0.5 truncate">
                      edge-proxy-gw.azp.net
                    </span>
                  </div>
                </div>
                <div className="mt-space-sm flex items-center justify-between pt-space-xs text-surface-tint">
                  <span className="font-label-sm text-label-sm">Incident journalisé dans l’audit de sécurité AZ Corp.</span>
                  <button className="font-label-sm text-label-sm text-secondary-fixed hover:text-surface-bright transition-colors inline-flex items-center gap-1 cursor-pointer" onClick={(e) => {
                    navigator.clipboard.writeText(`Trace: req_azp_404 | URI: ${window.location.pathname}`);
                    const btn = e.currentTarget;
                    const originalHTML = btn.innerHTML;
                    btn.innerText = 'Copié !';
                    setTimeout(() => btn.innerHTML = originalHTML, 2000);
                  }} type="button">
                    <span className="material-symbols-outlined text-[14px]">content_copy</span>
                    <span className="">Copier le diagnostic</span>
                  </button>
                </div>
              </div>
              
              <div className="mt-space-lg flex items-center gap-space-xs text-surface-tint font-body-sm text-body-sm">
                <span className="">Une anomalie critique sur vos accès habilités ?</span>
                <a className="text-secondary-fixed hover:underline font-semibold flex items-center gap-1 ml-1" href="mailto:support-noc@azpulse.net">
                  <span className="material-symbols-outlined text-[16px]">mail</span>
                  <span className="">Contacter le support IT AZ Pulse (24/7)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Error404;

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

const companyPhotos = [
  { file: 'WhatsApp Image 2026-09-04 at 13.00.42.jpeg', label: 'Salle de réunion AZ Corporation' },
  { file: 'WhatsApp Image 2026-09-04 at 13.00.44.jpeg', label: 'Espace de réunion et de travail' },
  { file: 'WhatsApp Image 2026-09-04 at 13.00.45.jpeg', label: 'Salle de formation informatique' },
  { file: 'WhatsApp Image 2026-09-04 at 13.00.47.jpeg', label: 'Bureau AZ Corporation et équipements numériques' },
  { file: 'WhatsApp Image 2026-09-04 at 13.00.48.jpeg', label: 'Salle de cours de l’institut' },
  { file: 'WhatsApp Image 2026-09-04 at 13.00.50.jpeg', label: 'Parc informatique et postes de travail' },
  { file: 'WhatsApp Image 2026-09-04 at 13.00.51.jpeg', label: 'Espace de formation AZ Corporation' },
  { file: 'WhatsApp Image 2026-09-04 at 13.00.53.jpeg', label: 'Salle informatique avec postes de formation' },
  { file: 'WhatsApp Image 2026-09-04 at 13.00.56.jpeg', label: 'Entrée de l’institut AZ Corporation' },
  { file: 'WhatsApp Image 2026-09-04 at 13.00.58.jpeg', label: 'Salle informatique et espace pédagogique' },
  { file: 'WhatsApp Image 2026-09-04 at 13.01.03.jpeg', label: 'Salle de réunion AZ Corporation' },
  { file: 'WhatsApp Image 2026-09-04 at 13.01.05.jpeg', label: 'Salle de classe et tables de formation' },
  { file: 'WhatsApp Image 2026-09-04 at 13.01.09.jpeg', label: 'Espace formateur et matériel de projection' },
  { file: 'WhatsApp Image 2026-09-04 at 13.01.13.jpeg', label: 'Espace de formation en configuration réunion' },
  { file: 'WhatsApp Image 2026-09-04 at 13.01.15.jpeg', label: 'Salle de réunion avec équipement de présentation' },
  { file: 'WhatsApp Image 2026-09-04 at 13.01.19.jpeg', label: 'Salle de formation de l’institut' },
];

const photoUrl = (filename) => `/AZ%20Images/${encodeURIComponent(filename)}`;

const DiscoverExcellence = () => {
  const [activePhoto, setActivePhoto] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const currentPhoto = companyPhotos[activePhoto];

  const showPhoto = (step) => {
    setDirection(step);
    setActivePhoto((current) => (current + step + companyPhotos.length) % companyPhotos.length);
  };

  useEffect(() => {
    if (isPaused || prefersReducedMotion) return undefined;

    const advanceWhenVisible = () => {
      if (document.visibilityState === 'visible') {
        setDirection(1);
        setActivePhoto((current) => (current + 1) % companyPhotos.length);
      }
    };

    const timer = window.setInterval(advanceWhenVisible, 5000);
    return () => window.clearInterval(timer);
  }, [isPaused, prefersReducedMotion]);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 sm:py-14" id="solutions">
      {/* Category Filter Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
        <button className="px-5 py-2.5 rounded-lg text-xs md:text-sm font-semibold bg-[#0B2545]/10 backdrop-blur-sm border border-[#0B2545]/20 hover:bg-[#0B2545]/20 text-[#0B2545] shadow-md transition flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FFB800]"></span>
          Modules SaaS & IA
        </button>
        <button className="px-5 py-2.5 rounded-lg text-xs md:text-sm font-medium border border-[#0B2545]/10 text-gray-700 bg-white/50 backdrop-blur-sm hover:bg-white/80 transition">
          Ingénierie & Services IT
        </button>
        <button className="px-5 py-2.5 rounded-lg text-xs md:text-sm font-medium border border-[#0B2545]/10 text-gray-700 bg-white/50 backdrop-blur-sm hover:bg-white/80 transition">
          Centre de Formation Professionnelle
        </button>
      </div>
      
      {/* 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Card: Compound Architecture Card */}
        <div className="lg:col-span-6 bg-[#0B2545] text-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-[#1D63FF]/20">
          {/* Image Half */}
          <div
            className="md:w-1/2 h-64 md:h-auto min-h-[300px] relative overflow-hidden bg-[#001c3b]"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
            }}
            onKeyDown={(event) => {
              if (event.key === 'ArrowLeft') showPhoto(-1);
              if (event.key === 'ArrowRight') showPhoto(1);
            }}
            aria-label="Galerie photos AZ Corporation"
            aria-roledescription="carrousel"
            role="region"
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.img
                key={currentPhoto.file}
                src={photoUrl(currentPhoto.file)}
                alt={currentPhoto.label}
                className="absolute inset-0 h-full w-full object-cover"
                initial={{ opacity: 0, x: prefersReducedMotion ? 0 : direction * 36, scale: 1.025 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: prefersReducedMotion ? 0 : direction * -28, scale: 0.99 }}
                transition={{ duration: prefersReducedMotion ? 0.01 : 0.48, ease: [0.22, 0.61, 0.36, 1] }}
                loading={activePhoto === 0 ? 'eager' : 'lazy'}
                draggable="false"
              />
            </AnimatePresence>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B2545]/90 via-[#0B2545]/10 to-transparent"></div>

            <div className="absolute left-3 top-3 rounded-full border border-white/20 bg-[#0B2545]/75 px-3 py-1 text-[10px] font-semibold text-white backdrop-blur-md">
              AZ CORPORATION · YAOUNDÉ
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
              <div className="min-w-0 rounded-full border border-white/20 bg-[#0B2545]/85 px-3 py-1.5 text-[10px] font-semibold text-[#FFB800] backdrop-blur-md">
                <span className="sr-only">Photo actuelle : </span>{currentPhoto.label}
              </div>
              <span className="shrink-0 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-bold tabular-nums text-white backdrop-blur-sm" aria-live="polite">
                {String(activePhoto + 1).padStart(2, '0')} / {String(companyPhotos.length).padStart(2, '0')}
              </span>
            </div>
          </div>
          {/* Content Half */}
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold text-[#8fc7fe] tracking-wider mb-2">Architecture SaaS Native</div>
              <h3 className="text-base md:text-lg font-bold leading-snug text-white">
                AZ Pulse Enterprise OS : L'écosystème unifié pour vos opérations critiques
              </h3>
              <p className="text-xs text-white/75 mt-3 leading-relaxed">
                Centralisez flux commerciaux, gestion des ressources humaines, maintenance des réseaux et rapports analytiques automatiques.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-white/15 flex items-center justify-between">
              <span className="text-xs tracking-wider text-[#FFB800] font-semibold">{isPaused ? 'Diaporama en pause' : 'Photos AZ Corporation'}</span>
              <div className="flex items-center gap-2">
                <a className="bg-[#FFB800]/20 backdrop-blur-md border border-[#FFB800]/40 text-[#FFB800] px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-[#FFB800]/30 transition" href="#demo">
                  Démarrer
                  <span className="text-[10px]">→</span>
                </a>
                <button
                  type="button"
                  onClick={() => showPhoto(-1)}
                  aria-label="Afficher la photo précédente"
                  className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-xs hover:bg-white/10 transition focus:outline-none focus:ring-2 focus:ring-[#FFB800]"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => showPhoto(1)}
                  aria-label="Afficher la photo suivante"
                  className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-xs hover:bg-white/10 transition focus:outline-none focus:ring-2 focus:ring-[#FFB800]"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column: Heading & Property Specs Details */}
        <div className="lg:col-span-6 flex flex-col justify-between h-full">
          <div>
            <h2 className="font-syne text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0B2545] leading-[1.15]">
              Découvrez l'Excellence Technologique
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 mt-8 items-center">
            {/* Thumbnail */}
            <div className="sm:col-span-5 rounded-3xl overflow-hidden shadow-lg h-52 relative border border-gray-200">
              <img alt="Salle informatique AZ Corporation avec ses postes de travail" className="w-full h-full object-cover" src="/AZ%20Images/WhatsApp%20Image%202026-09-04%20at%2013.00.50.jpeg" loading="lazy" />
              <div className="absolute inset-0 bg-[#0B2545]/20"></div>
            </div>
            {/* Specs List */}
            <div className="sm:col-span-7">
              <h4 className="text-sm font-bold tracking-wide text-[#0B2545] border-b border-[#1D63FF]/30 pb-1.5 inline-block mb-3">
                Spécifications du Système
              </h4>
              <ul className="space-y-3 text-xs text-gray-700">
                <li className="grid grid-cols-12 gap-1">
                  <span className="col-span-4 font-bold text-[#0B2545]">Sécurité</span>
                  <span className="col-span-8 text-gray-600">:  Hébergement souverain et redondance 99.9%.</span>
                </li>
                <li className="grid grid-cols-12 gap-1">
                  <span className="col-span-4 font-bold text-[#0B2545]">Intelligence Artificielle</span>
                  <span className="col-span-8 text-gray-600">: Modèles IA spécialisés en analyse prédictive et automatisation des tâches.</span>
                </li>
                <li className="grid grid-cols-12 gap-1">
                  <span className="col-span-4 font-bold text-[#0B2545]">Interconnexion IT</span>
                  <span className="col-span-8 text-gray-600">: Synchronisation matérielle, supervision réseaux et support technique 24/7.</span>
                </li>
                <li className="grid grid-cols-12 gap-1">
                  <span className="col-span-4 font-bold text-[#0B2545]">Hub Formation</span>
                  <span className="col-span-8 text-gray-600">: Accès direct aux parcours e-learning et formations présentielles certifiées.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscoverExcellence;

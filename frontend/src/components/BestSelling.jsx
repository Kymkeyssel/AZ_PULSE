import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

const trainingPrograms = [
  {
    title: 'Secrétariat & gestion administrative',
    images: [
      'WhatsApp Image 2026-09-15 at 05.20.20.jpeg',
      'WhatsApp Image 2026-09-15 at 05.20.22.jpeg',
    ],
    summary: 'Un parcours polyvalent pour organiser le travail administratif et soutenir efficacement une équipe.',
    skills: ['Bureautique', 'Comptabilité', 'Secrétariat de direction'],
    careers: 'Assistant administratif, secrétaire de direction, agent de bureau.',
    diploma: 'DQP indiqué sur les affiches',
  },
  {
    title: 'Administration des réseaux informatiques',
    images: [
      'WhatsApp Image 2026-09-15 at 05.20.25.jpeg',
      'WhatsApp Image 2026-09-15 at 05.20.31.jpeg',
    ],
    summary: 'Concevoir, administrer et sécuriser les réseaux, les serveurs et les services informatiques.',
    skills: ['Réseaux', 'Serveurs', 'Sécurité', 'Cloud'],
    careers: 'Technicien réseaux, administrateur systèmes et réseaux.',
    diploma: 'CQP indiqué sur les affiches',
  },
  {
    title: 'Marketing digital',
    images: [
      'WhatsApp Image 2026-09-15 at 05.21.33.jpeg',
      'WhatsApp Image 2026-09-15 at 05.21.34.jpeg',
    ],
    summary: 'Préparer et déployer des actions de communication et de visibilité sur les canaux numériques.',
    skills: ['Stratégie digitale', 'Réseaux sociaux', 'Contenu', 'Campagnes en ligne'],
    careers: 'Assistant marketing digital, community manager, chargé de communication web.',
    diploma: 'DQP indiqué sur l’affiche',
  },
  {
    title: 'Comptabilité informatisée & gestion',
    images: [
      'WhatsApp Image 2026-09-15 at 05.21.35.jpeg',
      'WhatsApp Image 2026-09-15 at 05.21.35 (1).jpeg',
    ],
    summary: 'Maîtriser les opérations comptables et les outils de gestion utilisés en entreprise.',
    skills: ['Logiciels comptables', 'Analyse financière', 'Trésorerie', 'Gestion des stocks'],
    careers: 'Assistant comptable, aide-comptable, gestionnaire de trésorerie ou de stocks.',
    diploma: 'DQP indiqué sur l’affiche',
  },
  {
    title: 'Développement d’applications',
    images: [
      'WhatsApp Image 2026-09-15 at 05.21.36.jpeg',
      'WhatsApp Image 2026-09-15 at 05.21.37.jpeg',
    ],
    summary: 'Passer de la programmation aux applications web et mobiles, jusqu’à leur mise en service.',
    skills: ['Programmation', 'Applications mobiles', 'Frameworks', 'UI/UX', 'API', 'Déploiement'],
    careers: 'Développeur d’applications, développeur web ou mobile.',
    diploma: 'DQP indiqué sur l’affiche',
  },
  {
    title: 'Maintenance informatique',
    images: [
      'WhatsApp Image 2026-09-15 at 05.21.37 (1).jpeg',
      'WhatsApp Image 2026-09-15 at 05.21.38.jpeg',
    ],
    summary: 'Installer, diagnostiquer et entretenir des postes et équipements informatiques.',
    skills: ['Installation', 'Diagnostic', 'Dépannage', 'Sécurité', 'Maintenance préventive'],
    careers: 'Technicien de maintenance informatique, technicien support.',
    diploma: 'DQP indiqué sur l’affiche',
  },
  {
    title: 'Maintenance des réseaux informatiques',
    images: [
      'WhatsApp Image 2026-09-15 at 05.21.38 (1).jpeg',
      'WhatsApp Image 2026-09-15 at 05.21.39.jpeg',
    ],
    summary: 'Déployer et maintenir les réseaux et serveurs, sécuriser les accès et résoudre les incidents.',
    skills: ['Installation réseau', 'Serveurs', 'Sécurisation', 'Dépannage'],
    careers: 'Technicien réseaux, technicien d’exploitation ou support réseau.',
    diploma: 'DQP indiqué sur l’affiche',
  },
  {
    title: 'Montage audiovisuel',
    images: [
      'WhatsApp Image 2026-09-15 at 05.21.39 (1).jpeg',
      'WhatsApp Image 2026-09-15 at 05.21.40 (1).jpeg',
    ],
    summary: 'Créer et assembler des contenus audiovisuels de la préparation à la finition.',
    skills: ['Montage vidéo', 'Premiere Pro', 'After Effects', 'Audition'],
    careers: 'Monteur vidéo, assistant de production audiovisuelle, créateur de contenus.',
    diploma: 'DQP indiqué sur l’affiche',
  },
  {
    title: 'Graphisme de production',
    images: [
      'WhatsApp Image 2026-09-15 at 05.21.40.jpeg',
      'WhatsApp Image 2026-09-15 at 05.21.42.jpeg',
    ],
    summary: 'Concevoir des supports de communication et construire une identité visuelle cohérente.',
    skills: ['Design graphique', 'Typographie', 'Identité visuelle', 'Vectoriel', 'Photomontage'],
    careers: 'Graphiste, infographiste, maquettiste ou opérateur prépresse.',
    diploma: 'DQP indiqué sur l’affiche',
  },
  {
    title: 'Webmestre',
    images: [
      'WhatsApp Image 2026-09-15 at 05.21.41.jpeg',
      'WhatsApp Image 2026-09-15 at 05.21.41 (1).jpeg',
    ],
    summary: 'Créer et administrer des sites web, gérer leur contenu et travailler leur visibilité.',
    skills: ['HTML', 'CSS', 'JavaScript', 'PHP', 'CMS', 'SEO', 'Gestion de contenu'],
    careers: 'Webmestre, intégrateur web, gestionnaire de contenu ou assistant web.',
    diploma: 'DQP indiqué sur l’affiche',
  },
];

const formationImageUrl = (filename) => `/AZ%20Formations/${encodeURIComponent(filename)}`;

const BestSelling = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [visibleCount, setVisibleCount] = useState(3);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const updateVisibleCount = () => {
      setVisibleCount(window.innerWidth >= 1280 ? 3 : window.innerWidth >= 768 ? 2 : 1);
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  const navigatePrograms = (step) => {
    setDirection(step);
    setActiveIndex((current) => (current + step + trainingPrograms.length) % trainingPrograms.length);
  };

  const visiblePrograms = Array.from(
    { length: Math.min(visibleCount, trainingPrograms.length) },
    (_, offset) => ({
      program: trainingPrograms[(activeIndex + offset) % trainingPrograms.length],
      index: (activeIndex + offset) % trainingPrograms.length,
    }),
  );

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 sm:py-14" id="formation">
    
      {/* IFP AZ Corporation training catalogue */}
      <div className="mt-12 sm:mt-14">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#FFB800]/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#0B2545]">
            Institut de Formation Professionnelle AZ Corporation
          </span>
          <h3 className="font-syne text-2xl font-bold tracking-tight text-[#0B2545] sm:text-3xl">
            Nos formations professionnelles
          </h3>
          <p className="mt-3 text-xs leading-relaxed text-gray-600 sm:text-sm">
            Découvrez les 10 cursus présentés dans les affiches de l’institut. Les visuels indiquent généralement une durée de 12 mois et une rentrée annoncée le 12 octobre 2026 ; confirmez les modalités et le diplôme auprès de l’institut.
          </p>
        </div>

        <div
          aria-label="Carrousel des formations AZ Corporation"
          aria-roledescription="carrousel"
          className="relative"
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') navigatePrograms(1);
            if (event.key === 'ArrowRight') navigatePrograms(-1);
          }}
          role="region"
          tabIndex={0}
        >
          <div className="overflow-hidden px-1 py-2">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeIndex}
                aria-live="polite"
                className={`grid grid-cols-1 gap-7 ${visibleCount >= 2 ? 'md:grid-cols-2' : ''} ${visibleCount >= 3 ? 'xl:grid-cols-3' : ''}`}
                initial={{ opacity: 0, x: prefersReducedMotion ? 0 : direction * 48 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: prefersReducedMotion ? 0 : direction * -32 }}
                transition={{ duration: prefersReducedMotion ? 0.01 : 0.42, ease: [0.22, 0.61, 0.36, 1] }}
              >
                {visiblePrograms.map(({ program, index }) => (
                  <motion.article
                    key={program.title}
                    aria-label={`${program.title}, formation ${index + 1} sur ${trainingPrograms.length}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-xl"
                    whileHover={prefersReducedMotion ? undefined : { y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="grid h-64 grid-cols-2 gap-1.5 bg-slate-100 p-2 sm:h-72">
                      {program.images.map((image, imageIndex) => (
                        <a
                          key={image}
                          href={formationImageUrl(image)}
                          target="_blank"
                          rel="noreferrer"
                          className="overflow-hidden rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#1D63FF]"
                          aria-label={`Ouvrir l’affiche ${imageIndex === 0 ? 'missions et débouchés' : 'programme'} : ${program.title}`}
                        >
                          <img
                            src={formationImageUrl(image)}
                            alt={`${program.title} — affiche ${imageIndex === 0 ? 'missions et débouchés' : 'programme et modalités'}`}
                            loading="lazy"
                            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                          />
                        </a>
                      ))}
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#FFB800]/20 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#0B2545]">
                          {program.diploma}
                        </span>
                        <span className="rounded-full bg-[#1D63FF]/10 px-2.5 py-1 text-[10px] font-bold text-[#1D63FF]">
                          Durée affichée : 12 mois
                        </span>
                      </div>
                      <h4 className="font-syne text-lg font-bold leading-snug text-[#0B2545] transition-colors group-hover:text-[#1D63FF]">
                        {program.title}
                      </h4>
                      <p className="mt-2 text-xs leading-relaxed text-gray-600">{program.summary}</p>

                      <div className="mt-4">
                        <h5 className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">Compétences / programme</h5>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {program.skills.map((skill) => (
                            <span key={skill} className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-700">{skill}</span>
                          ))}
                        </div>
                      </div>

                      <p className="mt-4 border-t border-gray-100 pt-3 text-[11px] leading-relaxed text-gray-600">
                        <span className="font-bold text-[#0B2545]">Débouchés :</span> {program.careers}
                      </p>
                      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                        <span className="text-[10px] font-semibold text-gray-500">Biyem-Assi Kameni · Yaoundé</span>
                        <a
                          href="tel:+237697279770"
                          className="shrink-0 rounded-lg bg-[#0B2545] px-3 py-2 text-[11px] font-bold text-white transition hover:bg-[#1D63FF] focus:outline-none focus:ring-2 focus:ring-[#1D63FF] focus:ring-offset-2"
                        >
                          Se renseigner
                        </a>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-5 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs font-semibold tabular-nums text-gray-500" aria-live="polite">
              {String(activeIndex + 1).padStart(2, '0')} / {String(trainingPrograms.length).padStart(2, '0')}
              <span className="ml-2 font-normal">Formations</span>
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigatePrograms(-1)}
                aria-label="Afficher les formations précédentes"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-[#0B2545] shadow-sm transition hover:border-[#1D63FF] hover:bg-[#1D63FF] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#1D63FF] focus:ring-offset-2"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => navigatePrograms(1)}
                aria-label="Afficher les formations suivantes"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-[#0B2545] text-white shadow-sm transition hover:bg-[#1D63FF] focus:outline-none focus:ring-2 focus:ring-[#1D63FF] focus:ring-offset-2"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <p className="mx-auto mt-7 max-w-3xl text-center text-[10px] leading-relaxed text-gray-500">
          Les informations de diplôme et de durée sont retranscrites depuis les affiches fournies ; certains intitulés ou modalités peuvent varier selon le cursus. Contactez l’institut pour confirmer la session, les frais et le diplôme préparé.
        </p>
      </div>
      
      {/* See More Button */}
      <div className="mt-12 text-center">
        <a className="inline-flex items-center gap-2 bg-[#0B2545]/10 backdrop-blur-sm border border-[#0B2545]/20 hover:bg-[#0B2545]/20 text-[#0B2545] text-xs font-bold px-7 py-3.5 rounded-xl transition shadow-lg" href="#solutions">
          Explorer tout le catalogue de services <span>↗</span>
        </a>
      </div>
    </section>
  );
};

export default BestSelling;

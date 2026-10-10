import React from 'react';

const Testimonials = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12 sm:py-14" id="temoignages">
      {/* Header and Arrow Navigation */}
      <div className="flex items-center justify-between mb-8 sm:mb-10">
        <div>
          <span className="text-xs font-bold text-[#1D63FF] uppercase tracking-wider block mb-1">Localisation</span>
          <h2 className="font-syne text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0B2545]">
            RETROUVEZ NOUS!!!
          </h2>
        </div>
      </div>
      
      

      {/* AZ Corporation location — marker points to Carrefour Kameni, the public landmark for the address. */}
      <div className="mt-12 sm:mt-14 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-5">
          <div className="flex flex-col justify-center p-7 sm:p-9 lg:col-span-2">
            <span className="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-[#1D63FF]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#1D63FF]">
              <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-5.5 7-12a7 7 0 1 0-14 0c0 6.5 7 12 7 12Z" />
                <circle cx="12" cy="9" r="2.25" />
              </svg>
              Nous trouver
            </span>
            <h3 className="font-syne text-2xl font-bold tracking-tight text-[#0B2545] sm:text-3xl">
              AZ Corporation SARL
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              30 020, Biyem-Assi Kameni<br />
              Yaoundé, Cameroun
            </p>
            <p className="mt-4 text-xs leading-relaxed text-gray-500">
              Le repère indique le secteur du Carrefour Kameni, à proximité du siège ; l’emplacement exact du bâtiment n’est pas référencé séparément sur OpenStreetMap.
            </p>
            <a
              className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-[#0B2545] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1D63FF] focus:outline-none focus:ring-2 focus:ring-[#1D63FF] focus:ring-offset-2"
              href="https://www.openstreetmap.org/?mlat=3.83829&mlon=11.48535#map=17/3.83829/11.48535"
              target="_blank"
              rel="noreferrer"
            >
              Ouvrir dans OpenStreetMap
              <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 5h6v6m0-6-9 9" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
              </svg>
            </a>
          </div>
          <div className="relative min-h-[300px] bg-slate-100 lg:col-span-3 lg:min-h-[380px]">
            <iframe
              title="Carte OpenStreetMap du secteur Biyem-Assi Kameni à Yaoundé"
              className="absolute inset-0 h-full w-full border-0"
              src="https://www.openstreetmap.org/export/embed.html?bbox=11.4765%2C3.8315%2C11.4945%2C3.8455&layer=mapnik&marker=3.83829%2C11.48535"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

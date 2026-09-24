import React from 'react';

const Testimonials = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20" id="temoignages">
      {/* Header and Arrow Navigation */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <span className="text-xs font-bold text-[#1D63FF] uppercase tracking-wider block mb-1">Retours d'Expérience & Succès</span>
          <h2 className="font-syne text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0B2545]">
            Ils Pilotent Leur Croissance<br/>avec AZ Corporation
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-full border border-gray-300 text-[#0B2545] flex items-center justify-center hover:bg-gray-100 transition">
            ←
          </button>
          <button className="w-10 h-10 rounded-full border border-gray-300 text-[#0B2545] flex items-center justify-center hover:bg-gray-100 transition">
            →
          </button>
        </div>
      </div>
      
      {/* 2-Column Testimonial Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left: Big Image with Badge */}
        <div className="lg:col-span-6 relative">
          <div className="rounded-3xl overflow-hidden shadow-xl aspect-[4/3] border border-gray-200">
            <img alt="Équipes et Infrastructures AZ Corporation" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4Hz4-3R53Om6Can4d42jcO3putyAvOUir3M_x9aDp-fkaRH8vOWdUw7w2wK0vq8G3alx4CMhVrPP70vr2d8yJrMzrp_cZ_DPUx4Ep6YtEa53RD3Cgr6to4wVk8JCjMHv14FaT4r89j9c2BEfN-x97FGvAZbYU5dioDOdwLPjgnz11nj1QNFmnPOkdhoUzFf-Gph_0pas25NHQwTZhksdCX_bQHWvq-Fdc2xrhcJlJ0kdOYHslMpIT"/>
          </div>
          {/* Over All Floating Rating Card */}
          <div className="absolute -bottom-5 right-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-gray-100">
            <div className="text-[11px] font-bold text-[#0B2545] mb-1">Satisfaction Entreprises</div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-[#0B2545] text-white flex items-center justify-center text-[10px] font-bold border-2 border-white">AZ</div>
                <div className="w-7 h-7 rounded-full bg-[#1D63FF] text-white flex items-center justify-center text-[10px] font-bold border-2 border-white">IT</div>
                <div className="w-7 h-7 rounded-full bg-[#FFB800] text-[#0B2545] flex items-center justify-center text-[10px] font-bold border-2 border-white">★</div>
              </div>
              <span className="text-xs font-bold text-[#0B2545] flex items-center gap-1">★ 4.8 / 5 (+150 Entreprises)</span>
            </div>
          </div>
        </div>
        
        {/* Right: Quote Block */}
        <div className="lg:col-span-6 lg:pl-6 space-y-6">
          <div className="text-5xl font-serif text-[#1D63FF] leading-none">“</div>
          <blockquote className="text-base sm:text-lg text-gray-700 leading-relaxed font-normal">
            Grâce à AZ Pulse et à l'accompagnement technique de l'équipe AZ CORPORATION SARL, nous avons centralisé la gestion de nos 14 agences et formé l'ensemble de nos équipes en un temps record. La disponibilité du support et la réactivité de leurs ingénieurs réseaux font toute la différence sur le terrain. <span className="text-4xl font-serif text-[#1D63FF] leading-none">”</span>
          </blockquote>
          <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
            <div className="w-12 h-12 rounded-full bg-[#0B2545] text-[#FFB800] font-extrabold flex items-center justify-center shadow-md text-sm border-2 border-white">
              ME
            </div>
            <div>
              <h4 className="font-bold text-[#0B2545] text-sm">Dr. Marc E.</h4>
              <p className="text-xs text-gray-500 font-medium">Directeur des Systèmes d'Information — Groupe Panafricain</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

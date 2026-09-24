import React from 'react';

const Newsletter = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12" id="demo">
      <div className="bg-gradient-to-r from-[#0B2545] via-[#003366] to-[#0B2545] rounded-3xl py-16 px-6 sm:px-12 text-center text-white shadow-2xl border border-[#1D63FF]/30 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#1D63FF]/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FFB800]/15 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#FFB800] text-xs font-semibold mb-4 border border-white/20">
            Rejoignez les leaders numériques
          </div>
          <h2 className="font-syne text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Restez à la pointe de la transformation digitale
          </h2>
          <p className="text-xs sm:text-sm text-white/80 mt-3 max-w-xl mx-auto leading-relaxed font-light">
            Recevez nos guides exclusifs, analyses sectorielles et actualités sur nos prochaines sessions de formation certifiantes agréées MINEFOP.
          </p>
          
          {/* Subscription Input Bar */}
          <form 
            className="mt-8 max-w-lg mx-auto flex items-center bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-1.5 focus-within:border-[#FFB800] transition" 
            onSubmit={(e) => e.preventDefault()}
          >
            <input 
              className="w-full bg-transparent border-0 text-xs px-4 text-white placeholder-white/60 focus:ring-0 focus:outline-none" 
              placeholder="Entrez votre email professionnel..." 
              required 
              type="email"
            />
            <button 
              className="bg-[#FFB800]/20 backdrop-blur-md border border-[#FFB800]/40 hover:bg-[#FFB800]/30 text-[#FFB800] text-xs font-extrabold px-6 py-3 rounded-xl transition whitespace-nowrap shadow-md" 
              type="submit"
            >
              S'abonner
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;

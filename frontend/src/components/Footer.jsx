import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8 text-gray-600 text-xs">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* Brand & Contact Details */}
        <div className="md:col-span-5 space-y-4">
          <a className="flex items-center gap-3" href="#">
            <img alt="AZ PULSE by AZ CORPORATION" className="h-10 w-auto object-contain" src="/AZ PULSE_logo.png"/>
            <div>
              <span className="font-syne text-xl font-extrabold text-[#0B2545] block">AZ CORPORATION SARL</span>
              <span className="text-[11px] text-[#FFB800] font-bold">La technologie, tout simplement</span>
            </div>
          </a>
          <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
            Entreprise innovante spécialisée en solutions logicielles d'entreprise, infogérance réseau, audit de sécurité et formation professionnelle agréée par le MINEFOP.
          </p>
          <div className="space-y-2 text-xs text-gray-600 pt-2">
            <div className="grid grid-cols-12 gap-1">
              <span className="col-span-4 font-bold text-[#0B2545]">Adresse</span>
              <span className="col-span-8">: Biyem-Assi (Carrefour Kameni), Yaoundé, Cameroun</span>
            </div>
            <div className="grid grid-cols-12 gap-1">
              <span className="col-span-4 font-bold text-[#0B2545]">Téléphone</span>
              <span className="col-span-8">: +237 697 27 97 70 / +237 676 26 40 27</span>
            </div>
            <div className="grid grid-cols-12 gap-1">
              <span className="col-span-4 font-bold text-[#0B2545]">Email</span>
              <span className="col-span-8">: azcorporationsarl@gmail.com</span>
            </div>
            <div className="grid grid-cols-12 gap-1">
              <span className="col-span-4 font-bold text-[#0B2545]">Disponibilité</span>
              <span className="col-span-8">: Lun - Sam : 08h00 - 18h00 | Support IT 24/7</span>
            </div>
          </div>
        </div>
        
        {/* Quick Links */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="font-bold text-[#0B2545] text-xs tracking-wider uppercase">Solutions</h4>
          <ul className="space-y-2.5 text-gray-500 text-xs font-medium">
            <li><a className="hover:text-[#1D63FF] transition" href="#">AZ Pulse SaaS</a></li>
            <li><a className="hover:text-[#1D63FF] transition" href="#">CRM & Ventes 360°</a></li>
            <li><a className="hover:text-[#1D63FF] transition" href="#">IA Workspace</a></li>
            <li><a className="hover:text-[#1D63FF] transition" href="#">Business Intelligence</a></li>
            <li><a className="hover:text-[#1D63FF] transition" href="#">Supervision Réseaux</a></li>
          </ul>
        </div>
        
        {/* Institut & Services */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="font-bold text-[#0B2545] text-xs tracking-wider uppercase">Institut IFP & Services</h4>
          <ul className="space-y-2.5 text-gray-500 text-xs font-medium">
            <li><a className="hover:text-[#1D63FF] transition" href="#">Formations Agréées MINEFOP</a></li>
            <li><a className="hover:text-[#1D63FF] transition" href="#">Bureautique & Secrétariat Pro</a></li>
            <li><a className="hover:text-[#1D63FF] transition" href="#">Développement Web & Mobile</a></li>
            <li><a className="hover:text-[#1D63FF] transition" href="#">Maintenance & Vente Matériel</a></li>
            <li><a className="hover:text-[#1D63FF] transition" href="#">Audit & Cybersécurité</a></li>
          </ul>
        </div>
        
        {/* Follow Us & Legal */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="font-bold text-[#0B2545] text-xs tracking-wider uppercase">Suivez-nous</h4>
          <div className="flex items-center gap-2 text-gray-700">
            {/* Facebook */}
            <a aria-label="Facebook" className="w-8 h-8 rounded-full bg-gray-100 text-[#0B2545] flex items-center justify-center hover:bg-[#1D63FF] hover:text-white transition" href="#">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.595 0 9 1.582 9 4.615V8z"></path></svg>
            </a>
            {/* Twitter / X */}
            <a aria-label="Twitter" className="w-8 h-8 rounded-full bg-gray-100 text-[#0B2545] flex items-center justify-center hover:bg-[#1D63FF] hover:text-white transition" href="#">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
            </a>
            {/* LinkedIn */}
            <a aria-label="LinkedIn" className="w-8 h-8 rounded-full bg-gray-100 text-[#0B2545] flex items-center justify-center hover:bg-[#1D63FF] hover:text-white transition" href="#">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
            </a>
          </div>
          <div className="pt-3">
            <span className="inline-block px-2.5 py-1 rounded bg-gray-100 text-[10px] text-gray-600 font-semibold">
              azcorporation.net
            </span>
          </div>
        </div>
      </div>
      
      {/* Bottom Copyright & Policy */}
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-3">
        <div>
          © AZ CORPORATION SARL — La technologie, tout simplement. Tous droits réservés.
        </div>
        <div className="flex items-center gap-4">
          <a className="hover:text-[#0B2545] transition" href="#">Mentions Légales</a>
          <span>•</span>
          <a className="hover:text-[#0B2545] transition" href="#">Politique de Confidentialité</a>
          <span>•</span>
          <a className="hover:text-[#0B2545] transition" href="#">Agrément MINEFOP</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

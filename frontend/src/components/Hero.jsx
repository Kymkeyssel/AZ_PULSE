import React from 'react';
import { LayoutGrid, Server, GraduationCap, Bot, MessageSquareQuote, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section 
      className="relative w-full min-h-[120px] bg-cover bg-no-repeat overflow-hidden" 
      style={{
        backgroundImage: "url('/Background.jpeg')", 
        backgroundPosition: "20% center"
      }}
    >
      {/* Overlay Gradient for contrast matching corporate brand navy & lighting */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#001026] via-[#0B2545]/85 to-transparent z-0 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#001026]/20 via-transparent to-[#f4f7fb] z-0 pointer-events-none"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-6 pb-14 md:pb-24 flex flex-col">
        
        {/* Top Navigation Bar */}
        <nav aria-label="Main Navigation" className="flex items-center justify-between">
          {/* Logo */}
          <a className="flex items-center gap-3 group" href="#">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl px-3.5 py-1.5 shadow-lg border border-white/40 group-hover:scale-105 transition-all">
              <img 
                alt="AZ PULSE Logo" 
                className="h-9 w-auto object-contain" 
                src="/AZ PULSE_logo.png"
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-white font-extrabold text-sm tracking-wide leading-tight">PULSE</span>
              <span className="text-[#FFB800] text-[10px] font-medium tracking-wider uppercase">Le cœur de votre Structure</span>
            </div>
          </a>
          
          {/* Center Nav Pills */}
          <div className="hidden lg:flex items-center bg-white/20 backdrop-blur-lg rounded-xl mr-20 px-2 py-1.5 border border-white/20 shadow-2xl space-x-1">
            <a className="flex items-center gap-2 text-white hover:text-white bg-transparent hover:bg-white/15 px-3 py-2 rounded-lg transition-all group overflow-hidden" href="#solutions">
              <LayoutGrid className="w-4 h-4 flex-shrink-0" />
              <span className="max-w-0 opacity-0 group-hover:max-w-[150px] group-hover:opacity-100 transition-all duration-300 ease-in-out whitespace-nowrap text-[11px] font-semibold tracking-wide">Solutions & Modules</span>
            </a>
            <a className="flex items-center gap-2 text-white/80 hover:text-white bg-transparent hover:bg-white/15 px-3 py-2 rounded-lg transition-all group overflow-hidden" href="#services-it">
              <Server className="w-4 h-4 flex-shrink-0" />
              <span className="max-w-0 opacity-0 group-hover:max-w-[150px] group-hover:opacity-100 transition-all duration-300 ease-in-out whitespace-nowrap text-[11px] font-semibold tracking-wide">Services IT & Réseaux</span>
            </a>
            <a className="flex items-center gap-2 text-white/80 hover:text-white bg-transparent hover:bg-white/15 px-3 py-2 rounded-lg transition-all group overflow-hidden" href="#formation">
              <GraduationCap className="w-4 h-4 flex-shrink-0" />
              <span className="max-w-0 opacity-0 group-hover:max-w-[150px] group-hover:opacity-100 transition-all duration-300 ease-in-out whitespace-nowrap text-[11px] font-semibold tracking-wide">Institut de Formation</span>
            </a>
            <a className="flex items-center gap-2 text-white/80 hover:text-white bg-transparent hover:bg-white/15 px-3 py-2 rounded-lg transition-all group overflow-hidden" href="#ia-workspace">
              <Bot className="w-4 h-4 flex-shrink-0" />
              <span className="max-w-0 opacity-0 group-hover:max-w-[150px] group-hover:opacity-100 transition-all duration-300 ease-in-out whitespace-nowrap text-[11px] font-semibold tracking-wide">Plateforme IA</span>
            </a>
            <a className="flex items-center gap-2 text-white/80 hover:text-white bg-transparent hover:bg-white/15 px-3 py-2 rounded-lg transition-all group overflow-hidden" href="#temoignages">
              <MessageSquareQuote className="w-4 h-4 flex-shrink-0" />
              <span className="max-w-0 opacity-0 group-hover:max-w-[150px] group-hover:opacity-100 transition-all duration-300 ease-in-out whitespace-nowrap text-[11px] font-semibold tracking-wide">Témoignages</span>
            </a>
          </div>
          
          {/* CTA Button */}
          <div className="flex items-center gap-3">
            <Link className="bg-[#0B2545]/50 backdrop-blur-md border border-white/30 hover:bg-white/20 text-white font-bold text-xs md:text-sm px-6 py-2.5 rounded-xl flex items-center gap-2 transition duration-200 shadow-xl" to="/auth?mode=login">
              Connexion
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
              </svg>
            </Link>
          </div>
        </nav>
        {/* Hero Content & Bottom Right Elements */}
        <div className="mt-24 md:mt-20 flex flex-col lg:flex-row lg:items-end justify-between gap-10 lg:gap-4 w-full">
          <div className="max-w-3xl">
            {/* Editorial Tag Badge */}
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#0B2545]/80 backdrop-blur-md border border-[#FFB800]/40 text-[10px] font-semibold text-[#FFB800] tracking-wider uppercase mb-5 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-[#FFB800] animate-pulse"></span>
              Votre Solution Informatique & Pilotage d'Entreprise
            </div>
            
            {/* Main Headline */}
            <h1 className="font-syne text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.08] drop-shadow-xl hero-title-shadow">
              AZ PULSE : Le Système<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#8ec5fc] to-[#FFB800]">Tout-en-Un de Pilotage</span>
            </h1>
            
            {/* Subtitle */}
            <p className="mt-6 text-sm sm:text-base md:text-lg text-white/90 max-w-2xl leading-relaxed font-light">
              Intégrez en temps réel vos données clés : CRM & Ventes, Business Analytics, IA Workspace, Infrastructure Réseaux & IT, et le Hub de Formation Professionnelle agréé MINEFOP.
            </p>
            
            {/* Action CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link className="inline-flex items-center gap-3 text-amber-50 text-xs md:text-sm font-bold bg-[#FFB800]/60 backdrop-blur-md border border-[#FFB800]/30 hover:bg-[#FFB800]/50 rounded-xl px-7 py-3 shadow-xl hover:shadow-2xl transition-all" to="/auth?mode=register">
                <span>S'inscrire</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
                </svg>
              </Link>
              <a className="inline-flex items-center gap-3 text-xs md:text-sm text-white font-medium border border-white/20 rounded-xl px-6 py-3 bg-blue-950/90 backdrop-blur-md hover:bg-blue-950/60 transition-all shadow-md" href="#solutions">
                <svg className="w-4 h-4 text-[#8fc7fe]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
                Decouvrir les Services <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#8ec5fc] to-[#FFB800]"> AZ</span>
              </a>
            </div>
          </div>

          {/* Bottom Right Floating Element */}
          <div className="hidden lg:flex items-center gap-6 pb-2 lg:mb-20 relative z-20">
            {/* Members Pill */}
            <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-1.5 shadow-xl">
              <div className="flex items-center -space-x-3 mr-4 ml-1">
                <img className="w-10 h-10 rounded-full border-[3px] border-[#0B2545]/80 object-cover" src="https://i.pravatar.cc/100?img=1" alt="Member" />
                <img className="w-10 h-10 rounded-full border-[3px] border-[#0B2545]/80 object-cover" src="https://i.pravatar.cc/100?img=2" alt="Member" />
                <img className="w-10 h-10 rounded-full border-[3px] border-[#0B2545]/80 object-cover" src="https://i.pravatar.cc/100?img=3" alt="Member" />
              </div>
              <div className="w-[1px] h-6 bg-white/30 mr-4"></div>
              <span className="text-white text-sm font-semibold pr-6 tracking-wide">Connect For Membership</span>
            </div>
            
            {/* Action Button (Squircle/Diamond) */}
            <Link to="/auth?mode=login" className="flex items-center justify-center w-17 h-17 bg-[#0B2545] backdrop-blur-md border border-white/20 rounded-2xl transform rotate-45 hover:bg-white/20 transition-all shadow-xl group cursor-pointer">
              <div className="transform -rotate-45 flex items-center justify-center">
                 <ArrowUpRight className="w-7 h-7 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

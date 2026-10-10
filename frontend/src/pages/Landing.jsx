import React from 'react';
import Hero from '../components/Hero';
import DiscoverExcellence from '../components/DiscoverExcellence';
import ServicesIT from '../components/ServicesIT';
import ModulesCatalogue from '../components/ModulesCatalogue';
import Testimonials from '../components/Testimonials';
import BestSelling from '../components/BestSelling';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';

const Landing = () => {
  return (
    <div className="relative isolate min-h-screen w-full bg-[#f4f7fb]">
      <Hero />

      <main
        className="relative isolate"
        style={{
          backgroundImage: 'linear-gradient(rgba(247, 247, 247, 0.84)), rgba(127, 177, 241, 0.66)), url("/AZ%20facade.jpg")',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <DiscoverExcellence />
        <ModulesCatalogue />
        <Testimonials />
        <BestSelling />
        <Newsletter />
      </main>

      <Footer />
      <ChatBot />
    </div>
  );
};

export default Landing;

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
    <div className="w-full bg-[#f4f7fb]">
      <Hero />
      <DiscoverExcellence />
      <ServicesIT />
      <ModulesCatalogue />
      <Testimonials />
      <BestSelling />
      <Newsletter />
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Landing;

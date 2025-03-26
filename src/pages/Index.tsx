
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwMCIgaGVpZ2h0PSI5MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGZpbHRlciBpZD0iYSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9Ii4wNSIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjxmZUNvbG9yTWF0cml4IHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgLjEgMCIvPjwvZmlsdGVyPjwvZGVmcz48cGF0aCBmaWx0ZXI9InVybCgjYSkiIGQ9Ik0wIDBoMTYwMHY5MDBIMHoiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9zdmc+')] bg-fixed bg-cover pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background to-background pointer-events-none"></div>
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-neon-blue/10 to-transparent blur-[100px] opacity-30 pointer-events-none"></div>
      
      <Navbar />
      
      <main className="flex-grow relative z-10">
        <Hero />
        <Features />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;

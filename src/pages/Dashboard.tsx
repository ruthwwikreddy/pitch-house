
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DashboardComponent from '@/components/dashboard/Dashboard';
import { loadSampleVideosIfEmpty } from '@/lib/storage';
import { toast } from "sonner";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load sample videos if none exist (for demo purposes)
    try {
      loadSampleVideosIfEmpty();
    } catch (error) {
      console.error('Error loading sample videos:', error);
      toast.error('There was an error loading sample pitches');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwMCIgaGVpZ2h0PSI5MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGZpbHRlciBpZD0iYSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9Ii4wNSIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjxmZUNvbG9yTWF0cml4IHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgLjEgMCIvPjwvZmlsdGVyPjwvZGVmcz48cGF0aCBmaWx0ZXI9InVybCgjYSkiIGQ9Ik0wIDBoMTYwMHY5MDBIMHoiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9zdmc+')] bg-fixed bg-cover pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background to-background pointer-events-none"></div>
      
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 relative z-10">
        {loading ? (
          <div className="container flex items-center justify-center h-40">
            <div className="animate-pulse flex items-center space-x-2">
              <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
              <div className="h-3 w-3 bg-blue-500 rounded-full animation-delay-200"></div>
              <div className="h-3 w-3 bg-blue-500 rounded-full animation-delay-500"></div>
              <span className="text-sm text-muted-foreground ml-2">Loading pitches...</span>
            </div>
          </div>
        ) : (
          <DashboardComponent />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;

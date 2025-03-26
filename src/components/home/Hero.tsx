
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-28 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-background to-background"></div>
      
      <div className="container relative mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-3xl mx-auto lg:mx-0 text-center lg:text-left staggered-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Pitch Your Startup in 30 Seconds
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              Skip the slides. Capture attention and get funded with video-first pitches that investors actually watch.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <Button asChild className="bg-blue-500 hover:bg-blue-600 h-12 px-6 button-animated">
                <Link to="/upload">
                  Start Pitching
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-12 px-6 button-animated">
                <Link to="/dashboard">
                  Explore Pitches
                </Link>
              </Button>
            </div>
            
            <div className="mt-8 text-sm text-muted-foreground">
              Join 10,000+ founders already getting noticed
            </div>
          </div>
          
          <div className="relative">
            <div className="glass-card rounded-xl p-1 shadow-xl animate-fade-in">
              <div className="aspect-video rounded-lg overflow-hidden bg-muted relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-muted-foreground/50 animate-pulse"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-muted-foreground">Featured Pitch Preview</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 -z-10 h-72 w-72 rounded-full bg-blue-100 blur-3xl opacity-70"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

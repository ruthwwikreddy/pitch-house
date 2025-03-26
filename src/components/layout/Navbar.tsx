
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "py-3 glass-card" 
          : "py-5 bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-2xl font-bold text-primary tracking-tight hover-lift"
          >
            Pitch<span className="text-blue-500">House</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link to="/upload" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Create Pitch
            </Link>
            <Button asChild variant="outline" className="button-animated">
              <Link to="/dashboard">
                Sign In
              </Link>
            </Button>
            <Button asChild className="button-animated bg-blue-500 hover:bg-blue-600">
              <Link to="/upload">
                Get Started
              </Link>
            </Button>
          </nav>
          
          {/* Mobile Navigation Toggle */}
          <button 
            className="md:hidden text-primary" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2 animate-fade-in">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/dashboard" 
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/upload" 
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Create Pitch
              </Link>
              <div className="flex flex-col space-y-3 pt-2">
                <Button 
                  asChild 
                  variant="outline" 
                  className="w-full button-animated"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link to="/dashboard">
                    Sign In
                  </Link>
                </Button>
                <Button 
                  asChild 
                  className="w-full button-animated bg-blue-500 hover:bg-blue-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link to="/upload">
                    Get Started
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import schoolLogo from '@/assets/school-logo.png';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and School Name */}
          <Link to="/" className="flex items-center space-x-3 hover-lift">
            <img src={schoolLogo} alt="Darul Arqam Academy" className="h-12 w-12" />
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-primary">Darul Arqam Academy</h1>
              <p className="text-sm text-muted-foreground">Gombe State</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
              About
            </Link>
            <Link 
              to="/gallery" 
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
              Gallery
            </Link>
            <Link 
              to="/contact" 
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
              Contact
            </Link>
            <Button asChild variant="hero" size="lg">
              <Link to="/login">Login</Link>
            </Button>
          </nav>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            className="md:hidden"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-slide-up">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-foreground hover:text-primary transition-smooth font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="text-foreground hover:text-primary transition-smooth font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/gallery" 
                className="text-foreground hover:text-primary transition-smooth font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Gallery
              </Link>
              <Link 
                to="/contact" 
                className="text-foreground hover:text-primary transition-smooth font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Button asChild variant="hero" size="lg" className="mt-4">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
import { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, MessageSquare, Shield } from 'lucide-react';
import { usePortfolio } from '@/src/context/PortfolioContext';

interface NavbarProps {
  onStartProject: () => void;
  onOpenAdmin?: () => void;
}

export const Navbar = ({ onStartProject, onOpenAdmin }: NavbarProps) => {
  const { data } = usePortfolio();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['home', 'about', 'services', 'work', 'process', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Work', href: '#work' },
    { name: 'Process', href: '#process' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-zinc-950/85 backdrop-blur-md border-b border-zinc-800/60 py-3.5 shadow-xl shadow-black/40'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Zone 1: Wordmark Brand */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, '#home')}
          className="group flex items-center gap-2 text-white font-display text-lg sm:text-xl font-bold tracking-tight hover:opacity-90 transition-opacity"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 group-hover:scale-125 transition-transform" />
          <span>{data.brand.name}</span>
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`relative py-1 transition-colors duration-200 hover:text-white ${
                  isActive ? 'text-white' : 'text-zinc-400'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & Admin Button & Mobile Toggle */}
        <div className="flex items-center gap-2.5">
          {/* Admin Button */}
          {onOpenAdmin && (
            <button
              type="button"
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-amber-400 transition-all active:scale-95 shadow-sm cursor-pointer"
              title="Studio Admin Portal"
              aria-label="Admin Portal"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}

          {/* Let's Talk CTA */}
          <button
            onClick={onStartProject}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-zinc-950 bg-white rounded-lg hover:bg-zinc-200 transition-all hover:shadow-lg hover:shadow-white/10 active:scale-95 whitespace-nowrap cursor-pointer"
          >
            <span>Let's Talk</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-800 px-4 pt-4 pb-6 mt-3 space-y-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-3 py-2.5 rounded-lg text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-zinc-900 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onStartProject();
              }}
              className="w-full py-3 px-4 text-center text-sm font-semibold text-zinc-950 bg-amber-400 rounded-lg hover:bg-amber-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Start a Project</span>
            </button>

            {onOpenAdmin && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-2.5 px-4 text-center text-xs font-mono font-semibold text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Portal</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

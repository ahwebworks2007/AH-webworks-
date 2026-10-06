import { ArrowUp, Github, Instagram, MessageCircle, Mail } from 'lucide-react';
import { usePortfolio } from '@/src/context/PortfolioContext';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer = ({ onOpenAdmin }: FooterProps) => {
  const { data } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Work', href: '#work' },
    { name: 'Process', href: '#process' },
    { name: 'Contact', href: '#contact' },
  ];

  const whatsappUrl = `https://wa.me/${data.contact.whatsappNumber}?text=${encodeURIComponent(
    data.contact.whatsappDefaultMessage
  )}`;

  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 py-16 px-4 sm:px-6 lg:px-8 text-zinc-400">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-zinc-900">
          {/* Brand & Tagline */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="text-xl font-display font-bold text-white tracking-tight">
                {data.brand.name}
              </span>
            </div>
            <p className="text-base font-display text-zinc-300 font-semibold tracking-wide">
              {data.brand.tagline}
            </p>
            <p className="text-xs text-zinc-500 max-w-sm leading-relaxed">
              Bespoke digital experiences, web development, and e-commerce platforms engineered by Hamdan Saleemi & Abdul Ahad.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3">
            <div className="text-xs font-mono uppercase tracking-widest text-zinc-300 font-medium mb-4">
              Navigation
            </div>
            <ul className="space-y-2.5 text-xs">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials & Connectivity */}
          <div className="md:col-span-3">
            <div className="text-xs font-mono uppercase tracking-widest text-zinc-300 font-medium mb-4">
              Connect
            </div>
            <ul className="space-y-3 text-xs">
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-emerald-400 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp</span>
                </a>
              </li>
              <li>
                <a
                  href={data.contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-pink-400 transition-colors"
                >
                  <Instagram className="w-4 h-4 text-pink-400" />
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a
                  href={
                    data.contact.githubUrl
                      ? data.contact.githubUrl.startsWith('http')
                        ? data.contact.githubUrl
                        : `https://github.com/${data.contact.githubUrl.replace(/^@/, '')}`
                      : 'https://github.com/hamdansaleemi'
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-white transition-colors"
                  aria-label="Studio GitHub profile"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${data.contact.email}`}
                  className="inline-flex items-center gap-2 hover:text-amber-400 transition-colors"
                >
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span>{data.contact.email}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span>© 2026 {data.brand.name}. All rights reserved.</span>
            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="opacity-20 hover:opacity-80 transition-opacity text-[10px] text-zinc-600 hover:text-zinc-400 p-0.5 cursor-pointer"
                title="Portal"
                aria-label="Portal Access"
              >
                ·
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors py-1 px-3 rounded bg-zinc-900 border border-zinc-800"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>
      </div>
    </footer>
  );
};

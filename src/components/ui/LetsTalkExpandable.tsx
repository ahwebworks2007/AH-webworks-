import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpRight, ChevronDown, MessageCircle, Mail, Send, Check, Copy } from 'lucide-react';
import { usePortfolio } from '@/src/context/PortfolioContext';
import { InteractiveButton } from './InteractiveButton';

interface LetsTalkExpandableProps {
  onStartProject: () => void;
  className?: string;
}

export const LetsTalkExpandable: React.FC<LetsTalkExpandableProps> = ({
  onStartProject,
  className = '',
}) => {
  const { data } = usePortfolio();
  const [isOpen, setIsOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(data.contact.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const whatsappUrl = `https://wa.me/${data.contact.whatsappNumber}?text=${encodeURIComponent(
    data.contact.whatsappDefaultMessage
  )}`;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Primary Split / Expandable Button */}
      <div className="inline-flex items-center rounded-lg bg-white hover:bg-zinc-100 transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-white/10 group">
        {/* Main Action - Performs original onStartProject */}
        <InteractiveButton
          type="button"
          magnetic={true}
          magneticStrength={0.2}
          ripple={true}
          rippleVariant="dark"
          onClick={onStartProject}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-zinc-950 rounded-l-lg hover:bg-zinc-200/60 transition-colors cursor-pointer"
          title="Start a project with AH Productions"
        >
          <span>Let's Talk</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </InteractiveButton>

        {/* Expand Options Trigger */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen)}
          }
          className="p-2 border-l border-zinc-200/80 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/60 rounded-r-lg transition-colors cursor-pointer"
          aria-expanded={isOpen}
          aria-label="Expand contact channels"
          title="Direct contact options"
        >
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-amber-500' : ''
            }`}
          />
        </button>
      </div>

      {/* Smoothly Revealed Interactive Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-zinc-950/95 backdrop-blur-xl border border-zinc-800 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-400">
            CONNECT DIRECTLY
          </div>

          <div className="space-y-1">
            {/* 1. Project Form */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onStartProject();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-zinc-200 hover:text-white hover:bg-zinc-900 transition-colors text-left cursor-pointer group/item"
            >
              <div className="p-1 rounded bg-amber-400/10 text-amber-400 group-hover/item:scale-110 transition-transform">
                <Send className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-xs">Send Project Brief</div>
                <div className="text-[10px] text-zinc-400 font-mono">Fill out requirements</div>
              </div>
            </button>

            {/* 2. WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-zinc-200 hover:text-white hover:bg-zinc-900 transition-colors text-left cursor-pointer group/item"
            >
              <div className="p-1 rounded bg-emerald-500/10 text-emerald-400 group-hover/item:scale-110 transition-transform">
                <MessageCircle className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-xs">WhatsApp Instant</div>
                <div className="text-[10px] text-zinc-400 font-mono">{data.contact.whatsappFormatted}</div>
              </div>
            </a>

            {/* 3. Direct Email with copy feedback */}
            <button
              type="button"
              onClick={handleCopyEmail}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-zinc-200 hover:text-white hover:bg-zinc-900 transition-colors text-left cursor-pointer group/item"
            >
              <div className="p-1 rounded bg-zinc-800 text-amber-400 group-hover/item:scale-110 transition-transform">
                {copiedEmail ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-xs">
                  {copiedEmail ? 'Email Copied!' : 'Copy Official Email'}
                </div>
                <div className="text-[10px] text-zinc-400 font-mono truncate">
                  {data.contact.email}
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

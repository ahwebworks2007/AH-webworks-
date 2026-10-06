import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { usePortfolio } from '@/src/context/PortfolioContext';

interface HeroProps {
  onViewWork: () => void;
  onStartProject: () => void;
}

export const Hero = ({ onViewWork, onStartProject }: HeroProps) => {
  const { data } = usePortfolio();

  return (
    <section
      id="home"
      className="relative min-h-[90vh] sm:min-h-[92vh] flex flex-col justify-center items-center pt-24 sm:pt-28 pb-14 sm:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-zinc-950 w-full max-w-full"
    >
      {/* Background architectural grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      {/* Ambient subtle light glows - constrained to avoid horizontal overflow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-[550px] h-72 sm:h-[350px] bg-amber-500/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none max-w-full" />
      <div className="absolute bottom-10 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-blue-600/5 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none max-w-full" />
      <div className="absolute top-20 right-10 w-48 sm:w-80 h-48 sm:h-80 bg-zinc-600/10 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none max-w-full" />

      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center w-full min-w-0">
        {/* Brand studio moniker with responsive overflow protection */}
        <div className="inline-flex max-w-full items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-[11px] sm:text-xs uppercase tracking-wider sm:tracking-widest text-zinc-300 font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
          <span className="truncate">{data.brand.studioName}</span>
          <span className="text-zinc-600 hidden sm:inline">·</span>
          <span className="text-zinc-400 lowercase font-mono hidden sm:inline">web development studio</span>
        </div>

        {/* Massive headline with fluid responsive scaling */}
        <h1 className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-extrabold text-white tracking-tight leading-[1.1] sm:leading-[1.05] text-balance max-w-4xl break-words w-full">
          WE BUILD <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500">DIGITAL</span> EXPERIENCES.
        </h1>

        {/* Supporting description */}
        <p className="mt-5 sm:mt-6 text-sm sm:text-lg md:text-xl text-zinc-400 max-w-2xl font-normal leading-relaxed text-balance px-2 sm:px-0">
          {data.brand.subheadline}
        </p>

        {/* Action buttons fitting completely on small mobile screens */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full sm:w-auto max-w-xs sm:max-w-none">
          <button
            onClick={onViewWork}
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-semibold tracking-wide uppercase text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-lg shadow-amber-400/20 transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 group cursor-pointer whitespace-nowrap"
          >
            <span>VIEW OUR WORK</span>
            <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </button>

          <button
            onClick={onStartProject}
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-semibold tracking-wide uppercase text-white bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <span>START A PROJECT</span>
            <ArrowUpRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>

        {/* Editorial trust markers */}
        <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-zinc-900/80 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-left w-full max-w-3xl">
          <div className="min-w-0">
            <div className="text-[10px] sm:text-xs uppercase tracking-wider text-zinc-500 font-mono">FOUNDERS</div>
            <div className="text-xs sm:text-sm font-medium text-zinc-200 mt-0.5 truncate">Hamdan & Ahad</div>
          </div>
          <div className="min-w-0">
            <div className="text-[10px] sm:text-xs uppercase tracking-wider text-zinc-500 font-mono">FOCUS</div>
            <div className="text-xs sm:text-sm font-medium text-zinc-200 mt-0.5 truncate">Modern Web & E-Com</div>
          </div>
          <div className="min-w-0">
            <div className="text-[10px] sm:text-xs uppercase tracking-wider text-zinc-500 font-mono">DELIVERY</div>
            <div className="text-xs sm:text-sm font-medium text-zinc-200 mt-0.5 truncate">Custom & Responsive</div>
          </div>
          <div className="min-w-0">
            <div className="text-[10px] sm:text-xs uppercase tracking-wider text-zinc-500 font-mono">STATUS</div>
            <div className="text-xs sm:text-sm font-medium text-emerald-400 flex items-center gap-1.5 mt-0.5 min-w-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="truncate">{data.contact.availability || 'Available for Projects'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        className="mt-10 sm:mt-14 inline-flex flex-col items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors text-xs font-mono group"
        aria-label="Scroll to About section"
      >
        <span className="tracking-widest uppercase text-[10px]">Scroll Down</span>
        <div className="w-5 h-8 rounded-full border border-zinc-800 flex items-start justify-center p-1">
          <div className="w-1 h-1.5 bg-amber-400 rounded-full animate-bounce" />
        </div>
      </a>
    </section>
  );
};

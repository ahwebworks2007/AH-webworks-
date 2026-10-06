import { MessageCircle, ArrowUpRight } from 'lucide-react';
import { usePortfolio } from '@/src/context/PortfolioContext';

interface ClientCtaProps {
  onStartProject: () => void;
}

export const ClientCta = ({ onStartProject }: ClientCtaProps) => {
  const { data } = usePortfolio();

  const whatsappUrl = `https://wa.me/${data.contact.whatsappNumber}?text=${encodeURIComponent(
    data.contact.whatsappDefaultMessage
  )}`;

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-zinc-950 relative border-t border-zinc-900">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 p-6 sm:p-12 lg:p-16 text-center overflow-hidden shadow-2xl">
          {/* Ambient light glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[250px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none max-w-full" />

          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center w-full min-w-0">
            <div className="text-[11px] sm:text-xs uppercase tracking-wider sm:tracking-widest text-amber-400 font-mono font-medium mb-3">
              READY TO ELEVATE YOUR BUSINESS?
            </div>

            <h2 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-tight text-balance break-words">
              LET'S BUILD SOMETHING GREAT.
            </h2>

            <p className="mt-4 sm:mt-6 text-sm sm:text-xl text-zinc-300 leading-relaxed max-w-xl text-balance">
              Have an idea for a website? Let's turn it into a digital experience.
            </p>

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full sm:w-auto max-w-xs sm:max-w-none">
              <button
                type="button"
                onClick={onStartProject}
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-semibold uppercase tracking-wider text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-lg shadow-amber-400/20 transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <span>START A PROJECT</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WHATSAPP US</span>
              </a>
            </div>

            <div className="mt-8 text-xs font-mono text-zinc-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{data.contact.availability}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

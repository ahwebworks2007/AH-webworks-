import { Sparkles, Smartphone, Target, MessageSquare } from 'lucide-react';
import { PORTFOLIO_DATA } from '@/src/data/portfolioData';

const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-5 h-5 text-amber-400" />,
  Smartphone: <Smartphone className="w-5 h-5 text-amber-400" />,
  Target: <Target className="w-5 h-5 text-amber-400" />,
  MessageSquare: <MessageSquare className="w-5 h-5 text-amber-400" />,
};

export const WhyUs = () => {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-zinc-950/80 relative border-t border-zinc-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <div className="text-xs uppercase tracking-widest text-amber-400 font-mono font-medium mb-3">
            07 · VALUE PROPOSITION
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
            WHY AH PRODUCTIONS?
          </h2>
          <p className="mt-3 text-base sm:text-lg text-zinc-400">
            We focus on clean aesthetics, responsive execution, and direct co-founder communication to build websites that deliver tangible value.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PORTFOLIO_DATA.whyUs.map((item) => (
            <div
              key={item.title}
              className="p-6 sm:p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/80 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 rounded-xl bg-zinc-800 border border-zinc-700/60">
                    {iconMap[item.iconName] || <Sparkles className="w-5 h-5 text-amber-400" />}
                  </div>
                  <span className="text-xs font-mono text-zinc-500 font-semibold">
                    {item.number}
                  </span>
                </div>

                <h3 className="text-lg font-display font-bold text-white tracking-tight">
                  {item.title}
                </h3>

                <p className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-zinc-800/60 text-[11px] font-mono text-zinc-500">
                Studio Standard
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

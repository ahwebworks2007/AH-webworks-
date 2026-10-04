import { PORTFOLIO_DATA } from '@/src/data/portfolioData';

export const Technologies = () => {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-zinc-950/90 relative border-t border-zinc-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-2xl mb-14">
          <div className="text-xs uppercase tracking-widest text-amber-400 font-mono font-medium mb-3">
            05 · TECHNOLOGY STACK
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
            TOOLS WE WORK WITH
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-400">
            A focused, production-proven stack built for fast loading speeds, seamless mobile responsiveness, and rock-solid reliability.
          </p>
        </div>

        {/* Tech Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {PORTFOLIO_DATA.technologies.map((tech) => (
            <div
              key={tech.name}
              className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/90 hover:border-zinc-700 hover:bg-zinc-900 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-display font-bold text-white tracking-tight">
                    {tech.name}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500 uppercase">
                    {tech.category}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {tech.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[11px] font-mono">
                <span className="text-amber-400/90">{tech.badge}</span>
                <span className="text-zinc-500">Verified Stack</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

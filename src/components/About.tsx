import { Github, Linkedin, Mail } from 'lucide-react';
import { usePortfolio } from '@/src/context/PortfolioContext';

export const About = () => {
  const { data } = usePortfolio();

  const getInitialsSvg = (name: string) => {
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect fill="%2318181b" width="120" height="120"/><circle cx="60" cy="60" r="50" fill="%2327272a"/><text fill="%23fbbf24" font-family="system-ui,-apple-system,sans-serif" font-size="34" font-weight="700" x="50%" y="54%" text-anchor="middle" dominant-baseline="middle">${initials}</text></svg>`;
  };

  return (
    <section id="about" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-zinc-950 relative border-t border-zinc-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-widest text-amber-400 font-mono font-medium mb-3">
            01 · ABOUT THE STUDIO
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight text-balance">
            {data.brand.aboutHeadline}
          </h2>
          <p className="mt-6 text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl">
            {data.brand.aboutText}
          </p>
        </div>

        {/* Co-Founders Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {data.founders.map((founder, idx) => (
            <div
              key={founder.name}
              className="group relative rounded-2xl bg-zinc-900/60 border border-zinc-800/80 p-6 sm:p-8 hover:border-zinc-700 transition-all duration-300 hover:shadow-2xl hover:shadow-black/60 flex flex-col justify-between"
            >
              <div>
                {/* Profile Top: Avatar + Moniker */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-zinc-800/80">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-zinc-700/80 bg-zinc-800 shrink-0">
                    <img
                      src={founder.avatar || getInitialsSvg(founder.name)}
                      alt={founder.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-medium">
                      <span>CO-FOUNDER {idx + 1}</span>
                      <span className="text-zinc-600">/</span>
                      <span className="text-zinc-400">CORE DEVELOPER</span>
                    </div>

                    <h3 className="mt-1 text-xl sm:text-2xl font-display font-bold text-white tracking-tight truncate">
                      {founder.name}
                    </h3>
                    <p className="text-sm font-medium text-zinc-400 mt-0.5">
                      {founder.role}
                    </p>
                  </div>
                </div>

                {/* Bio description */}
                <p className="mt-6 text-sm sm:text-base text-zinc-300 leading-relaxed">
                  {founder.bio}
                </p>

                {/* Core Focus Areas - Unboxed Clean Typography */}
                <div className="mt-6 pt-6 border-t border-zinc-800/60">
                  <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-3">
                    CORE FOCUS & EXPERTISE
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-zinc-300">
                    {founder.focus.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Founder Footer Links */}
              <div className="mt-8 pt-6 border-t border-zinc-800/60 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-zinc-400">
                <div className="flex flex-wrap items-center gap-4">
                  {/* GitHub Link */}
                  {founder.github && (
                    <a
                      href={founder.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white flex items-center gap-1.5 transition-colors group/link"
                      aria-label={`${founder.name} GitHub`}
                    >
                      <Github className="w-3.5 h-3.5 group-hover/link:text-white" />
                      <span>GitHub</span>
                    </a>
                  )}

                  {/* LinkedIn Link */}
                  {founder.linkedin && (
                    <a
                      href={founder.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-400 flex items-center gap-1.5 transition-colors group/link"
                      aria-label={`${founder.name} LinkedIn`}
                    >
                      <Linkedin className="w-3.5 h-3.5 text-blue-400 group-hover/link:text-blue-300" />
                      <span>LinkedIn</span>
                    </a>
                  )}

                  {/* Direct Email Link */}
                  {founder.email && (
                    <a
                      href={`mailto:${founder.email}?subject=Project%20Inquiry%20for%20${encodeURIComponent(founder.name)}`}
                      className="hover:text-amber-400 flex items-center gap-1.5 transition-colors group/link"
                      aria-label={`Email ${founder.name}`}
                    >
                      <Mail className="w-3.5 h-3.5 text-amber-400 group-hover/link:text-amber-300" />
                      <span>Direct Email</span>
                    </a>
                  )}
                </div>

                <div className="text-zinc-500 text-[11px]">{data.brand.name}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Studio Philosophy Banner */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900/80 to-zinc-900 border border-zinc-800 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h4 className="text-lg font-display font-semibold text-white">
              Built for businesses that demand quality.
            </h4>
            <p className="mt-1 text-sm text-zinc-400 max-w-xl">
              We work directly with founders, managers, and restaurant owners without middleman layers, delivering clean code and modern aesthetics.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-zinc-300 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Direct Co-Founder Collaboration</span>
          </div>
        </div>
      </div>
    </section>
  );
};



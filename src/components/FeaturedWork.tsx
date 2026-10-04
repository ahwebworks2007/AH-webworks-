import { useState } from 'react';
import { ArrowUpRight, ExternalLink, Globe, Eye } from 'lucide-react';
import { usePortfolio } from '@/src/context/PortfolioContext';
import { Project } from '@/src/data/portfolioData';

interface FeaturedWorkProps {
  onOpenCaseStudy: (project: Project) => void;
}

export const FeaturedWork = ({ onOpenCaseStudy }: FeaturedWorkProps) => {
  const { data } = usePortfolio();
  const [filter, setFilter] = useState<string>('all');

  // Extract unique categories for filter
  const categories = Array.from(
    new Set(data.projects.map((p) => p.category.toLowerCase()))
  );

  const filteredProjects = data.projects.filter((project) => {
    if (filter === 'all') return true;
    return project.category.toLowerCase().includes(filter);
  });

  return (
    <section id="work" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-zinc-950 relative border-t border-zinc-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-amber-400 font-mono font-medium mb-3">
              03 · FEATURED PORTFOLIO
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
              SELECTED WORK
            </h2>
            <p className="mt-3 text-base sm:text-lg text-zinc-400">
              Real projects. Real builds. Production websites crafted for real businesses.
            </p>
          </div>

          {/* Interactive filter control */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-lg self-start md:self-auto">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
                filter === 'all'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All Projects ({data.projects.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all capitalize ${
                  filter === cat
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {cat.replace('website', '').trim()}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="space-y-16">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group rounded-2xl bg-zinc-900/40 border border-zinc-800/90 overflow-hidden hover:border-zinc-700 transition-all duration-300 hover:shadow-2xl hover:shadow-black/70 flex flex-col lg:flex-row items-stretch"
            >
              {/* Left/Top: Browser Mockup Showcase */}
              <div className="w-full lg:w-3/5 bg-zinc-950 p-4 sm:p-6 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-zinc-800">
                <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl transition-transform duration-500 group-hover:scale-[1.01]">
                  {/* Browser chrome header */}
                  <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-950 border-b border-zinc-800/80">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 bg-zinc-900 px-3 py-0.5 rounded border border-zinc-800 max-w-[200px] sm:max-w-xs truncate">
                      <Globe className="w-3 h-3 text-zinc-500 shrink-0" />
                      <span className="truncate">{project.liveUrl.replace('https://', '')}</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400">LIVE</span>
                  </div>

                  {/* Browser viewport image */}
                  <div className="relative aspect-video overflow-hidden bg-zinc-900 group">
                    <img
                      src={project.image}
                      alt={project.name}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <button
                        type="button"
                        onClick={() => onOpenCaseStudy(project)}
                        className="px-4 py-2 text-xs font-semibold text-zinc-950 bg-white rounded-lg shadow-lg hover:bg-zinc-200 transition-colors flex items-center gap-2"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Case Study</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right/Bottom: Project Details */}
              <div className="w-full lg:w-2/5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                <div>
                  {/* Category & Project Index */}
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-3">
                    <span className="text-amber-400 font-semibold uppercase tracking-wider">
                      {project.category}
                    </span>
                    <span>PROJECT {project.number}</span>
                  </div>

                  {/* Project Title */}
                  <h3 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight group-hover:text-amber-300 transition-colors">
                    {project.name}
                  </h3>

                  {/* Tagline / Subtitle */}
                  <p className="mt-1 text-sm font-medium text-zinc-300">
                    {project.tagline}
                  </p>

                  {/* Description */}
                  <p className="mt-4 text-sm text-zinc-400 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Deliverables Unboxed List */}
                  <div className="mt-6 pt-6 border-t border-zinc-800/80">
                    <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2.5">
                      KEY DELIVERABLES
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-zinc-300">
                      {project.deliverables.map((deliv) => (
                        <div key={deliv} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80" />
                          <span>{deliv}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tech stack */}
                  <div className="mt-6 pt-4 border-t border-zinc-800/60">
                    <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2">
                      TECH STACK
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-300 border border-zinc-700/50"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 pt-6 border-t border-zinc-800/80 flex flex-wrap items-center gap-3">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-md shadow-amber-400/10 active:scale-95"
                  >
                    <span>VIEW PROJECT</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => onOpenCaseStudy(project)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-zinc-200 bg-zinc-800/90 hover:bg-zinc-700 rounded-lg transition-colors border border-zinc-700/60 active:scale-95"
                  >
                    <span>CASE STUDY</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

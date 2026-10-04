import { useEffect } from 'react';
import { X, ExternalLink, Github, CheckCircle, ArrowRight, Layers, Smartphone, Laptop } from 'lucide-react';
import { Project } from '@/src/data/portfolioData';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar with Project Moniker & Close */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/80">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-amber-400 font-semibold">
              PROJECT {project.number}
            </span>
            <span className="text-zinc-600">·</span>
            <span className="text-xs text-zinc-400 uppercase tracking-wider">
              {project.category}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label="Close project modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="max-h-[80vh] overflow-y-auto p-6 sm:p-8 space-y-8">
          {/* Main Title & Tagline */}
          <div>
            <h3 id="case-study-title" className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
              {project.name}
            </h3>
            <p className="mt-2 text-base text-zinc-300">
              {project.tagline}
            </p>
          </div>

          {/* Browser Window Mockup Preview */}
          <div className="rounded-xl overflow-hidden border border-zinc-700 bg-zinc-950 shadow-xl">
            <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-zinc-800">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="text-[11px] font-mono text-zinc-400 bg-zinc-950 px-3 py-1 rounded border border-zinc-800 truncate max-w-xs sm:max-w-md">
                {project.liveUrl}
              </div>
              <div className="w-10" />
            </div>
            <div className="relative aspect-video bg-zinc-900 overflow-hidden">
              <img
                src={project.image}
                alt={project.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Quick Actions & Live URL */}
          <div className="flex flex-wrap items-center gap-4 pt-2 pb-4 border-b border-zinc-800">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-lg shadow-amber-400/20"
            >
              <span>VISIT LIVE WEBSITE</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-200 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors border border-zinc-700"
              >
                <Github className="w-4 h-4" />
                <span>VIEW REPOSITORY</span>
              </a>
            )}
          </div>

          {/* Case Study Sections: The Challenge, The Solution, The Result */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-zinc-950/60 border border-zinc-800">
              <div className="text-xs font-mono text-amber-400 font-semibold uppercase tracking-wider mb-2">
                01 · THE CHALLENGE
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {project.caseStudy.challenge}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-zinc-950/60 border border-zinc-800">
              <div className="text-xs font-mono text-blue-400 font-semibold uppercase tracking-wider mb-2">
                02 · THE SOLUTION
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {project.caseStudy.solution}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-zinc-950/60 border border-zinc-800">
              <div className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider mb-2">
                03 · THE RESULT
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {project.caseStudy.result}
              </p>
            </div>
          </div>

          {/* Technical Scope & Technologies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-zinc-800">
            <div>
              <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-3">
                KEY DELIVERABLES
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-zinc-300">
                {project.deliverables.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-3">
                TECHNOLOGIES UTILIZED
              </div>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded bg-zinc-800 text-xs font-mono text-zinc-300 border border-zinc-700/60"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between">
          <span className="text-xs text-zinc-500 font-mono">
            AH PRODUCTIONS CASE STUDY
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

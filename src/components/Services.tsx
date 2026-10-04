import React from 'react';
import {
  Briefcase,
  Utensils,
  ShoppingBag,
  Code2,
  Layout,
  Wrench,
  ArrowUpRight,
  Sparkles,
  Smartphone,
  Globe,
  Database,
  Shield,
  Zap,
  Cloud,
  Cpu,
  Layers,
  Bot,
  Palette,
  Search,
  Gauge,
  Terminal,
  Rocket,
  BarChart,
  FileText,
} from 'lucide-react';
import { usePortfolio } from '@/src/context/PortfolioContext';

interface ServicesProps {
  onSelectService: (serviceTitle: string) => void;
}

export const SERVICE_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Briefcase,
  Utensils,
  ShoppingBag,
  Code2,
  Layout,
  Wrench,
  Sparkles,
  Smartphone,
  Globe,
  Database,
  Shield,
  Zap,
  Cloud,
  Cpu,
  Layers,
  Bot,
  Palette,
  Search,
  Gauge,
  Terminal,
  Rocket,
  BarChart,
  FileText,
};

export const getServiceIcon = (iconName: string, className = "w-5 h-5 text-amber-400") => {
  const IconComponent = SERVICE_ICONS[iconName] || Code2;
  return <IconComponent className={className} />;
};

export const Services = ({ onSelectService }: ServicesProps) => {
  const { data } = usePortfolio();

  return (
    <section id="services" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-zinc-950/80 relative border-t border-zinc-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-widest text-amber-400 font-mono font-medium mb-3">
              02 · OUR CAPABILITIES
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
              WHAT WE DO
            </h2>
            <p className="mt-4 text-base sm:text-lg text-zinc-400">
              End-to-end web engineering tailored for businesses seeking distinctive visual quality and high-performance digital tools.
            </p>
          </div>
          <div className="text-xs font-mono text-zinc-500">
            {String(data.services.length).padStart(2, '0')} CORE SERVICES OFFERED
          </div>
        </div>

        {/* Services Grid */}
        {data.services.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800 text-zinc-500 font-mono text-sm">
            No services currently listed. Add capabilities in the Admin Dashboard.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.services.map((service) => (
              <div
                key={service.number + service.title}
                className="group relative rounded-2xl bg-zinc-900/50 border border-zinc-800/80 p-6 sm:p-8 hover:border-amber-400/40 hover:bg-zinc-900/80 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Header with Icon & Editorial Number */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 rounded-xl bg-zinc-800/80 border border-zinc-700/60 group-hover:scale-110 transition-transform duration-300">
                      {getServiceIcon(service.iconName)}
                    </div>
                    <span className="text-xs font-mono font-bold text-zinc-500 group-hover:text-amber-400 transition-colors">
                      {service.number}
                    </span>
                  </div>

                  {/* Service Title */}
                  <h3 className="text-xl font-display font-bold text-white tracking-tight group-hover:text-amber-300 transition-colors">
                    {service.title}
                  </h3>

                  {/* Service Description */}
                  <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Highlight Features */}
                  {service.highlights && service.highlights.length > 0 && (
                    <ul className="mt-6 space-y-2 pt-6 border-t border-zinc-800/60 text-xs text-zinc-300">
                      {service.highlights.map((highlight) => (
                        <li key={highlight} className="flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-zinc-600 group-hover:bg-amber-400 transition-colors" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Inquiry Action */}
                <div className="mt-8 pt-4">
                  <button
                    type="button"
                    onClick={() => onSelectService(service.title)}
                    className="w-full inline-flex items-center justify-between text-xs font-semibold text-zinc-400 group-hover:text-white transition-colors py-2 border-t border-zinc-800/40 cursor-pointer"
                  >
                    <span>Inquire for {service.title.toLowerCase()}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};


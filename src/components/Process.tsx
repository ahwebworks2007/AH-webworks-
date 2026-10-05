import { useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { usePortfolio } from '@/src/context/PortfolioContext';

export const Process = () => {
  const { data } = usePortfolio();
  const [activeStep, setActiveStep] = useState(0);
  const processList = data.process || [];

  return (
    <section id="process" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-zinc-950 relative border-t border-zinc-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <div className="text-xs uppercase tracking-widest text-amber-400 font-mono font-medium mb-3">
            06 · CLIENT WORKFLOW
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
            HOW WE WORK
          </h2>
          <p className="mt-3 text-base sm:text-lg text-zinc-400">
            A structured, transparent 5-step roadmap from initial concept to live production deployment.
          </p>
        </div>

        {/* Steps Horizontal/Grid Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 lg:gap-6">
          {processList.map((step, idx) => {
            const isSelected = activeStep === idx;
            return (
              <div
                key={step.step}
                onClick={() => setActiveStep(idx)}
                className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between border ${
                  isSelected
                    ? 'bg-zinc-900 border-amber-400/60 shadow-xl shadow-amber-400/5'
                    : 'bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/70'
                }`}
              >
                <div>
                  {/* Step Moniker */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                        isSelected
                          ? 'bg-amber-400 text-zinc-950'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      STEP {step.step}
                    </span>
                    {idx < processList.length - 1 && (
                      <ChevronRight className="hidden md:block w-4 h-4 text-zinc-600" />
                    )}
                  </div>

                  {/* Step Title */}
                  <h3 className="text-lg font-display font-bold text-white tracking-tight">
                    {step.title}
                  </h3>

                  {/* Step Description */}
                  <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Step Detailed Bullets */}
                <div className="mt-6 pt-4 border-t border-zinc-800/60 space-y-1.5">
                  {step.details.map((detail) => (
                    <div key={detail} className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                      <span className="w-1 h-1 rounded-full bg-amber-400/80" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Commitment Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="text-xs sm:text-sm text-zinc-300">
              Regular milestone updates and direct developer feedback throughout the entire build.
            </span>
          </div>
          <a
            href="#contact"
            className="text-xs font-mono font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 shrink-0"
          >
            <span>Start with Step 01</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};


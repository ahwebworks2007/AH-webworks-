import { useState, useEffect } from 'react';
import { Play, Pause, Monitor, Smartphone } from 'lucide-react';
import { usePortfolio } from '@/src/context/PortfolioContext';

export const Showreel = () => {
  const { data } = usePortfolio();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const showcases = data.showreel.interactiveShowcases;

  useEffect(() => {
    if (!isPlaying || showcases.length === 0) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % showcases.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPlaying, showcases.length]);

  const currentShowcase = showcases[activeSlide] || showcases[0];

  if (!currentShowcase) return null;

  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-zinc-950 relative border-t border-zinc-900 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-amber-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-amber-400 font-mono font-medium mb-3">
              04 · INTERACTIVE SHOWREEL
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
              {data.showreel.title}
            </h2>
            <p className="mt-3 text-base sm:text-lg text-zinc-400 max-w-2xl">
              {data.showreel.subtitle}
            </p>
          </div>

          {/* Interactive Player Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-400" />
                  <span>PAUSE REEL</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>PLAY SHOWREEL</span>
                </>
              )}
            </button>

            <div className="flex items-center p-1 bg-zinc-900 border border-zinc-800 rounded-lg">
              <button
                type="button"
                onClick={() => setDeviceMode('desktop')}
                className={`p-1.5 rounded transition-colors ${
                  deviceMode === 'desktop' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
                title="Desktop View"
                aria-label="Desktop preview mode"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setDeviceMode('mobile')}
                className={`p-1.5 rounded transition-colors ${
                  deviceMode === 'mobile' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
                title="Mobile View"
                aria-label="Mobile preview mode"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Cinema Showcase Container */}
        <div className="relative rounded-2xl bg-zinc-900/90 border border-zinc-800 p-4 sm:p-8 lg:p-10 shadow-2xl overflow-hidden">
          {/* Top Stage Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-zinc-800/80 mb-6">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-mono text-zinc-300 tracking-wider">
                STUDIO REEL · {currentShowcase.category.toUpperCase()}
              </span>
            </div>

            {/* Showcase Selector Tabs */}
            <div className="hidden sm:flex items-center gap-2">
              {showcases.map((sc, idx) => (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => {
                    setActiveSlide(idx);
                    setIsPlaying(false);
                  }}
                  className={`text-xs font-mono px-3 py-1 rounded transition-all ${
                    activeSlide === idx
                      ? 'bg-amber-400 text-zinc-950 font-bold'
                      : 'text-zinc-400 hover:text-zinc-200 bg-zinc-800/50'
                  }`}
                >
                  {sc.title}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Screen Viewport */}
          <div className="flex justify-center items-center py-4">
            {deviceMode === 'desktop' ? (
              /* Desktop Frame */
              <div className="w-full max-w-5xl rounded-xl overflow-hidden border border-zinc-700 bg-zinc-950 shadow-2xl transition-all duration-500">
                <div className="px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  </div>
                  <div className="text-[11px] font-mono text-zinc-400 bg-zinc-950 px-4 py-0.5 rounded border border-zinc-800 truncate max-w-xs">
                    ahproductions.dev/{currentShowcase.id}
                  </div>
                  <div className="text-[10px] font-mono text-zinc-500">60 FPS</div>
                </div>

                <div className="relative aspect-video sm:aspect-[16/9] bg-zinc-950 overflow-hidden group">
                  <img
                    src={currentShowcase.image}
                    alt={currentShowcase.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 sm:p-8">
                    <span className="text-xs font-mono text-amber-400 font-semibold mb-1">
                      {currentShowcase.category}
                    </span>
                    <h4 className="text-xl sm:text-2xl font-display font-bold text-white">
                      {currentShowcase.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-zinc-300 max-w-lg mt-1">
                      {currentShowcase.description}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Mobile Device Frame */
              <div className="w-full max-w-[270px] xs:max-w-[320px] sm:max-w-[360px] rounded-3xl overflow-hidden border-4 border-zinc-700 bg-zinc-950 shadow-2xl p-2 transition-all duration-500">
                <div className="w-16 xs:w-20 h-3.5 xs:h-4 bg-zinc-800 rounded-full mx-auto mb-2" />
                <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-zinc-900">
                  <img
                    src={currentShowcase.image}
                    alt={currentShowcase.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-5">
                    <span className="text-[10px] font-mono text-amber-400 uppercase">
                      Mobile Responsive
                    </span>
                    <h4 className="text-base font-display font-bold text-white mt-0.5">
                      {currentShowcase.title}
                    </h4>
                    <p className="text-[11px] text-zinc-300 mt-1">
                      {currentShowcase.description}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Reel timeline indicator */}
          <div className="mt-6 pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {showcases.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setActiveSlide(idx);
                    setIsPlaying(false);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeSlide === idx ? 'w-8 bg-amber-400' : 'w-2 bg-zinc-700'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="text-xs font-mono text-zinc-400 flex items-center gap-2">
              <span>Ready for client reviews and high-resolution screen demos</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

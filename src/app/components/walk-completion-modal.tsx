import { useEffect, useState } from 'react';
import { TreePine, Footprints, MapPin, X } from 'lucide-react';
import DissolveCircularProgress from '@/app/components/dissolve-circular-progress';
import { TextReveal } from '@/app/components/ui/text-reveal';

interface WalkCompletionModalProps {
  steps: number;
  goal: number;
  onClose: () => void;
  theme?: 'bw' | 'bo';
}

export default function WalkCompletionModal({ steps, goal, onClose, theme = 'bw' }: WalkCompletionModalProps) {
  const [showProgress, setShowProgress] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [currentStat, setCurrentStat] = useState(0);

  // Calculate stats
  const distanceKm = (steps * 0.762) / 1000; // Average step length
  const caloriesBurned = Math.round(steps * 0.04);
  const co2SavedKg = (distanceKm * 0.12).toFixed(2); // ~120g CO2/km if driving
  const treesSaved = Math.round(parseFloat(co2SavedKg) / 0.021); // One tree absorbs ~21kg CO2/year

  // Distance comparisons
  const getDistanceComparison = () => {
    const comparisons = [
      { name: 'Central Park', km: 9.5 },
      { name: 'the Eiffel Tower height', km: 0.324 },
      { name: 'Brooklyn Bridge', km: 1.8 },
      { name: 'Golden Gate Bridge', km: 2.7 },
      { name: 'Times Square to Empire State', km: 1.3 },
      { name: 'the Statue of Liberty height', km: 0.093 },
    ];

    const suitable = comparisons.filter(c => distanceKm >= c.km * 0.5);
    if (suitable.length === 0) return comparisons[comparisons.length - 1];
    
    const closest = suitable.reduce((prev, curr) => 
      Math.abs(curr.km - distanceKm) < Math.abs(prev.km - distanceKm) ? curr : prev
    );
    
    const ratio = (distanceKm / closest.km).toFixed(1);
    return { ...closest, ratio: parseFloat(ratio) };
  };

  const comparison = getDistanceComparison();

  const handleDissolveComplete = () => {
    setShowProgress(false);
    setShowStats(true);
  };

  // Sequential reveal of stats
  useEffect(() => {
    if (!showStats) return;
    
    const timers = [
      setTimeout(() => setCurrentStat(1), 100),
      setTimeout(() => setCurrentStat(2), 600),
      setTimeout(() => setCurrentStat(3), 1100),
    ];

    return () => timers.forEach(clearTimeout);
  }, [showStats]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Static darkened background */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Close button - top right */}
      <button
        onClick={onClose}
        className={`absolute top-8 right-8 z-20 ${theme === 'bo' ? 'text-[#ff4400]' : 'text-white'} hover:opacity-60 transition-opacity`}
      >
        <X className="size-8" strokeWidth={1.5} />
      </button>

      {/* Modal container without background */}
      <div className="relative z-10 max-w-[393px] w-full">
        {/* Content */}
        <div className="flex flex-col items-center gap-12 px-4 py-12">
          {/* Dissolving circular progress */}
          {showProgress && (
            <DissolveCircularProgress
              current={goal - steps}
              goal={goal}
              onComplete={handleDissolveComplete}
              theme={theme}
            />
          )}

          {/* Text reveals */}
          {showStats && (
            <div className="flex flex-col items-center gap-8 w-full">
              {/* Main number with subtle reveal */}
              {currentStat >= 1 && (
                <div>
                  <div className="text-reveal">
                    <h1 className="text-6xl text-white font-['Archivo'] font-light">
                      {steps.toLocaleString('de-DE')}
                    </h1>
                  </div>
                  <div className="text-reveal" style={{ animationDelay: '300ms', opacity: 0 }}>
                    <p className="text-xl text-white/60 font-['JetBrains_Mono'] font-light uppercase tracking-wider mt-2 text-center">
                      steps
                    </p>
                  </div>
                </div>
              )}

              {/* Distance comparison */}
              {currentStat >= 2 && (
                <div className="text-reveal-delayed-1 w-full">
                  <div className="flex items-start gap-3 px-4">
                    <span 
                      className="text-xl text-white/40 mt-0.5 flex-shrink-0"
                      style={{ 
                        animation: 'fade-in 600ms ease-out forwards',
                        opacity: 0 
                      }}
                    >
                      ☉
                    </span>
                    <TextReveal variant="blur" className="text-lg text-white/90 font-['DM_Mono'] font-light leading-relaxed" delay={300}>
                      {`Today you walked ${
                        comparison.ratio === 1 
                          ? `the length of ${comparison.name}`
                          : comparison.ratio > 1
                          ? `${comparison.ratio}x ${comparison.name}`
                          : `${(comparison.ratio * 100).toFixed(0)}% of ${comparison.name}`
                      }`}
                    </TextReveal>
                  </div>
                </div>
              )}

              {/* Environmental impact */}
              {currentStat >= 3 && (
                <div className="text-reveal-delayed-2 w-full">
                  <div className="flex items-start gap-3 px-4">
                    <TreePine 
                      className="size-5 text-green-400/60 mt-1 flex-shrink-0" 
                      strokeWidth={1.5}
                      style={{ 
                        animation: 'fade-in 600ms ease-out forwards',
                        opacity: 0 
                      }}
                    />
                    <div>
                      <TextReveal variant="blur" className="text-lg text-white/90 font-['DM_Mono'] font-light leading-relaxed" delay={300}>
                        You saved {co2SavedKg} kg CO₂
                      </TextReveal>
                      <TextReveal variant="blur" className="text-sm text-white/50 font-['DM_Mono'] font-light mt-1" delay={600}>
                        Equal to {treesSaved} tree{treesSaved !== 1 ? 's' : ''} working for a day
                      </TextReveal>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
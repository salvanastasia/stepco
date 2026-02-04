import { useState } from 'react';

interface CircularProgressProps {
  current: number;
  goal: number;
  radius?: number;
  dashCount?: number;
  isCountdown?: boolean;
  theme?: 'bw' | 'bo';
  hideCenter?: boolean;
}

export default function CircularProgress({
  current,
  goal,
  radius = 140,
  dashCount = 60,
  isCountdown = false,
  theme = 'bw',
  hideCenter = false
}: CircularProgressProps) {
  const [displayMode, setDisplayMode] = useState(0); // 0: remaining, 1: taken, 2: distance

  // When in countdown mode, invert the progress so lines fill from 0 to 100%
  // as the countdown number decreases
  const progress = isCountdown 
    ? Math.min((goal - current) / goal, 1)  // Fill up as countdown decreases
    : Math.min(current / goal, 1);          // Normal fill up
  const filledDashes = Math.floor(progress * dashCount);

  // Calculate different display values
  const stepsTaken = isCountdown ? goal - current : current;
  const distanceKm = (stepsTaken * 0.762) / 1000; // Average step length

  const handleTap = () => {
    setDisplayMode((prev) => (prev + 1) % 3); // Cycle through 0, 1, 2
  };

  const getDisplayValue = () => {
    switch (displayMode) {
      case 0: // Remaining steps
        return current.toLocaleString('de-DE');
      case 1: // Steps taken
        return stepsTaken.toLocaleString('de-DE');
      case 2: // Distance
        if (distanceKm >= 1) {
          return distanceKm.toFixed(2).replace('.', ',');
        } else {
          const meters = Math.round(distanceKm * 1000);
          return meters.toLocaleString('de-DE');
        }
      default:
        return current.toLocaleString('de-DE');
    }
  };

  const getDisplayLabel = () => {
    switch (displayMode) {
      case 0:
        return 'steps';
      case 1:
        return 'steps';
      case 2:
        return distanceKm >= 1 ? 'km' : 'm';
      default:
        return 'steps';
    }
  };

  // Create array of dashes positioned in a circle
  const dashes = Array.from({ length: dashCount }, (_, i) => {
    const angle = (i / dashCount) * 2 * Math.PI - Math.PI / 2; // Start from top
    const isFilled = i < filledDashes;
    
    // Position dash at the edge of the circle
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    // Rotate dash to be perpendicular to the circle (pointing outward)
    const rotation = angle + Math.PI / 2;

    return (
      <div
        key={i}
        className={`absolute ${isFilled ? (theme === 'bo' ? 'bg-[#ff4400]' : 'bg-white') : 'bg-[#333]'} h-[32px] w-[2px]`}
        style={{
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rotation}rad)`,
          transformOrigin: 'center'
        }}
      />
    );
  });

  return (
    <div className="relative" style={{ width: radius * 2 + 100, height: radius * 2 + 100 }}>
      {!hideCenter && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center cursor-pointer" onClick={handleTap}>
            <div className="text-6xl text-white font-extralight" style={{ fontFamily: 'Archivo, sans-serif' }}>
              {getDisplayValue()}
            </div>
            <div className="text-sm text-[#999] mt-2" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              {getDisplayLabel()}
            </div>
          </div>
        </div>
      )}
      {dashes}
    </div>
  );
}
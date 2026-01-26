import { useState } from 'react';

interface CircularProgressProps {
  current: number;
  goal: number;
  radius?: number;
  dashCount?: number;
}

export default function CircularProgress({
  current,
  goal,
  radius = 140,
  dashCount = 60
}: CircularProgressProps) {
  const progress = Math.min(current / goal, 1);
  const filledDashes = Math.floor(progress * dashCount);

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
        className={`absolute ${isFilled ? 'bg-white' : 'bg-[#333]'} h-[32px] w-[2px]`}
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
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl text-white" style={{ fontFamily: 'Archivo, sans-serif' }}>
            {current.toLocaleString('de-DE')}
          </div>
          <div className="text-sm text-[#999] mt-2" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            steps
          </div>
        </div>
      </div>
      {dashes}
    </div>
  );
}
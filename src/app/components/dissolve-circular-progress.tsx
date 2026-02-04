import { useState, useEffect } from 'react';

interface DissolveCircularProgressProps {
  current: number;
  goal: number;
  onComplete: () => void;
  theme?: 'bw' | 'bo';
}

interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  distance: number;
  size: number;
  delay: number;
  opacity: number;
}

export default function DissolveCircularProgress({ current, goal, onComplete, theme = 'bw' }: DissolveCircularProgressProps) {
  const [digitStates, setDigitStates] = useState<('visible' | 'dissolving' | 'deleted')[]>([]);
  const [stepsTextState, setStepsTextState] = useState<'visible' | 'dissolving' | 'deleted'>('visible');
  const [particles, setParticles] = useState<{ [key: number]: Particle[] }>({});
  const [stepsParticles, setStepsParticles] = useState<Particle[]>([]);
  
  const steps = goal - current;
  const stepsStr = steps.toLocaleString('en-US').replace(/,/g, '.');
  const digits = stepsStr.split('');
  
  const accentColor = theme === 'bo' ? '#ff4400' : '#ffffff';

  useEffect(() => {
    // Initialize all digits as visible
    setDigitStates(Array(digits.length).fill('visible'));
    
    // Generate particles for each digit
    const allParticles: { [key: number]: Particle[] } = {};
    
    digits.forEach((digit, digitIndex) => {
      const isDot = digit === '.';
      const numParticles = isDot ? 18 : 55; // Slightly more particles
      const digitParticles: Particle[] = [];
      
      // Approximate width and height of digit
      const digitWidth = isDot ? 10 : 35;
      const digitHeight = isDot ? 10 : 50;
      
      for (let i = 0; i < numParticles; i++) {
        // Distribute particles across the digit's area (like a grid with randomness)
        const gridX = (i % 7) / 6; // 7 columns
        const gridY = Math.floor(i / 7) / Math.ceil(numParticles / 7); // Multiple rows
        
        // Add randomness to grid position
        const randomOffsetX = (Math.random() - 0.5) * 0.2;
        const randomOffsetY = (Math.random() - 0.5) * 0.2;
        
        const startX = ((gridX + randomOffsetX) - 0.5) * digitWidth;
        const startY = ((gridY + randomOffsetY) - 0.5) * digitHeight;
        
        // Particles fly up and to the right (like wind blowing from left)
        const angle = -Math.PI / 4 + (Math.random() - 0.5) * 0.5; // Up-right with spread
        const distance = Math.random() * 90 + 60;
        
        digitParticles.push({
          id: i,
          x: startX,
          y: startY,
          angle,
          distance,
          size: Math.random() * 1.8 + 0.8,
          delay: Math.random() * 300, // Slower stagger for smoother effect
          opacity: Math.random() * 0.4 + 0.2,
        });
      }
      
      allParticles[digitIndex] = digitParticles;
    });
    
    setParticles(allParticles);
    
    // Generate particles for "steps" text
    const stepsNumParticles = 45; // Slightly more particles
    const stepsTextParticles: Particle[] = [];
    const stepsWidth = 60;
    const stepsHeight = 20;
    
    for (let i = 0; i < stepsNumParticles; i++) {
      const gridX = (i % 8) / 7;
      const gridY = Math.floor(i / 8) / Math.ceil(stepsNumParticles / 8);
      
      const randomOffsetX = (Math.random() - 0.5) * 0.2;
      const randomOffsetY = (Math.random() - 0.5) * 0.2;
      
      const startX = ((gridX + randomOffsetX) - 0.5) * stepsWidth;
      const startY = ((gridY + randomOffsetY) - 0.5) * stepsHeight;
      
      const angle = -Math.PI / 4 + (Math.random() - 0.5) * 0.5; // Up-right with spread
      const distance = Math.random() * 80 + 50;
      
      stepsTextParticles.push({
        id: i,
        x: startX,
        y: startY,
        angle,
        distance,
        size: Math.random() * 1.5 + 0.6,
        delay: Math.random() * 250, // Slower stagger
        opacity: Math.random() * 0.4 + 0.2,
      });
    }
    
    setStepsParticles(stepsTextParticles);
    
    // Wait 1 second before starting to crumble
    const initialDelay = 1000;
    
    // Sequentially dissolve each digit from left to right
    digits.forEach((_, digitIndex) => {
      const baseDelay = initialDelay + (digitIndex * 250); // Slower stagger: 250ms between digits
      
      setTimeout(() => {
        setDigitStates(prev => {
          const newStates = [...prev];
          newStates[digitIndex] = 'dissolving';
          return newStates;
        });
        
        // Mark as deleted after particle animation
        setTimeout(() => {
          setDigitStates(prev => {
            const newStates = [...prev];
            newStates[digitIndex] = 'deleted';
            return newStates;
          });
        }, 900);
      }, baseDelay);
    });
    
    // Dissolve "steps" text after all digits
    const stepsDelay = initialDelay + (digits.length * 250) + 200;
    setTimeout(() => {
      setStepsTextState('dissolving');
      
      setTimeout(() => {
        setStepsTextState('deleted');
      }, 900);
    }, stepsDelay);
    
    // Call onComplete after everything has dissolved
    const totalDuration = stepsDelay + 1000;
    setTimeout(() => {
      onComplete();
    }, totalDuration);
  }, []);

  return (
    <div className="relative w-full flex items-center justify-center h-[320px]">
      <div className="relative flex items-center justify-center gap-0">
        {/* Step count digits */}
        <div className="flex items-baseline" style={{ fontFamily: 'Archivo', fontWeight: 300 }}>
          {digits.map((digit, index) => {
            const isDot = digit === '.';
            const state = digitStates[index] || 'visible';
            
            return (
              <div key={index} className="relative inline-block">
                {/* Original digit */}
                <span
                  className={`transition-all ${
                    state === 'visible'
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-90'
                  }`}
                  style={{
                    fontSize: isDot ? '48px' : '60px',
                    color: accentColor,
                    transitionDuration: '200ms',
                    display: 'inline-block',
                    letterSpacing: isDot ? '0' : '-0.02em',
                  }}
                >
                  {digit}
                </span>
                
                {/* Particles for this digit */}
                {state === 'dissolving' && particles[index]?.map(particle => {
                  const endX = particle.x + Math.cos(particle.angle) * particle.distance;
                  const endY = particle.y + Math.sin(particle.angle) * particle.distance;
                  
                  return (
                    <div
                      key={particle.id}
                      className="absolute rounded-full pointer-events-none"
                      style={{
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        left: '50%',
                        top: '50%',
                        marginLeft: `${particle.x}px`,
                        marginTop: `${particle.y}px`,
                        opacity: particle.opacity,
                        background: accentColor,
                        animation: `particle-crumble 1000ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
                        animationDelay: `${particle.delay}ms`,
                        '--end-x': `${endX}px`,
                        '--end-y': `${endY}px`,
                      } as React.CSSProperties}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
        
        {/* "steps" text */}
        <div className="ml-3 relative inline-block">
          <span
            className={`transition-all ${
              stepsTextState === 'visible'
                ? 'opacity-60 scale-100'
                : 'opacity-0 scale-90'
            }`}
            style={{
              fontFamily: 'JetBrains Mono',
              fontWeight: 300,
              fontSize: '16px',
              color: accentColor,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              transitionDuration: '200ms',
              display: 'inline-block',
            }}
          >
            steps
          </span>
          
          {/* Particles for "steps" text */}
          {stepsTextState === 'dissolving' && stepsParticles.map(particle => {
            const endX = Math.cos(particle.angle) * particle.distance;
            const endY = Math.sin(particle.angle) * particle.distance;
            
            return (
              <div
                key={particle.id}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  left: '50%',
                  top: '50%',
                  marginLeft: `${particle.x}px`,
                  marginTop: `${particle.y}px`,
                  opacity: particle.opacity,
                  background: accentColor,
                  animation: `particle-crumble 900ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
                  animationDelay: `${particle.delay}ms`,
                  '--end-x': `${endX}px`,
                  '--end-y': `${endY}px`,
                } as React.CSSProperties}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
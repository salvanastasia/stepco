import { useState, useRef } from 'react';
import imgFrame73 from "figma:asset/5e57bdbeef9424b6821c727c30e788b8e31d6a71.png";
import svgPaths from "@/imports/svg-ph7wdybsdg";
import ThemeToggle from "@/imports/Frame68";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialGoal: number;
  onGoalChange: (goal: number) => void;
  theme: 'bw' | 'bo';
  onThemeChange: (theme: 'bw' | 'bo') => void;
}

export default function ProfileModal({ isOpen, onClose, initialGoal, onGoalChange, theme, onThemeChange }: ProfileModalProps) {
  const [goal, setGoal] = useState(initialGoal);
  const [isDragging, setIsDragging] = useState(false);
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 }); // Track glow position as percentage
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Create 23 bars for the goal visualization
  const totalBars = 23;
  const maxGoal = 10000;
  const minGoal = 0;
  const filledBars = Math.round((goal / maxGoal) * totalBars);

  const handleSliderInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    if (!sliderRef.current || !containerRef.current) return;

    const sliderRect = sliderRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const x = clientX - sliderRect.left;
    const percentage = Math.max(0, Math.min(1, x / sliderRect.width));
    const newGoal = Math.round(percentage * maxGoal);
    setGoal(newGoal);
    onGoalChange(newGoal);
    
    // Calculate position relative to container for the glow effect
    const glowX = ((clientX - containerRect.left) / containerRect.width) * 100;
    const glowY = ((clientY - containerRect.top) / containerRect.height) * 100;
    setGlowPosition({ x: glowX, y: glowY });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleSliderInteraction(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleSliderInteraction(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    handleSliderInteraction(e);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      handleSliderInteraction(e);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm px-[16px] pb-[24px]">
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />
      
      <div className="bg-[#111] relative rounded-[32px] w-full max-w-[393px] z-10">
        <div aria-hidden="true" className="absolute border border-[#1a1a1a] border-solid inset-0 pointer-events-none rounded-[32px]" />
        
        <div 
          ref={containerRef}
          className="content-stretch flex flex-col gap-[48px] items-center overflow-clip pb-[24px] pt-[12px] px-[24px] relative w-full rounded-[32px] transition-all duration-100"
          style={{
            boxShadow: isDragging 
              ? theme === 'bo'
                ? 'inset 0 0 40px rgba(255, 68, 0, 0.08)'
                : 'inset 0 0 40px rgba(255, 255, 255, 0.04)'
              : 'none',
            background: isDragging
              ? theme === 'bo'
                ? `radial-gradient(ellipse 600px 300px at ${glowPosition.x}% ${glowPosition.y}%, rgba(255, 68, 0, 0.1) 0%, rgba(255, 68, 0, 0.04) 25%, transparent 50%)`
                : `radial-gradient(ellipse 600px 300px at ${glowPosition.x}% ${glowPosition.y}%, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 25%, transparent 50%)`
              : 'transparent'
          }}
        >
          {/* Handle */}
          <div className="bg-white h-[5px] rounded-[100px] shrink-0 w-[70px]" data-name="Home Indicator" />
          
          {/* Profile Section */}
          <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0 w-full">
            {/* Profile Picture */}
            <div className="pointer-events-none relative rounded-[24px] shrink-0 size-[88px]">
              <div aria-hidden="true" className="absolute inset-0 rounded-[24px]">
                <div className="absolute bg-white inset-0 rounded-[24px]" />
                <img alt="" className="absolute max-w-none object-cover rounded-[24px] size-full" src={imgFrame73} />
              </div>
              <div aria-hidden="true" className="absolute border-4 border-[rgba(136,136,136,0.8)] border-solid inset-0 rounded-[24px]" />
            </div>
            
            {/* Name and walks */}
            <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
              <p className="font-['DM_Mono:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-center text-white w-full whitespace-pre-wrap">Steve McQueen</p>
              <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0 w-full">
                <p className="font-['DM_Mono:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(255,255,255,0.75)] text-center">7 walks</p>
                <div className="relative shrink-0 size-[24px]" data-name="done">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                    <g id="lucide/alarm-clock-check">
                      <path d={svgPaths.p104ef100} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Goal Setting Section */}
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
            <p className="font-['DM_Mono:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#bbb] text-[14px] w-full whitespace-pre-wrap">SET YOUR GOAL</p>
            
            <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
              {/* Steps counter */}
              <div className="content-stretch flex font-['DM_Mono:Regular',sans-serif] items-center justify-between leading-[normal] not-italic relative shrink-0 text-[#bbb] text-[14px] w-full">
                <p className="relative shrink-0">Steps</p>
                <p className="relative shrink-0">{goal}</p>
              </div>
              
              {/* Bar visualization */}
              <div 
                ref={sliderRef}
                className="content-stretch flex gap-[9px] items-center justify-center overflow-clip relative shrink-0 w-full cursor-pointer select-none"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {Array.from({ length: totalBars }).map((_, i) => (
                  <div 
                    key={i}
                    className={`shrink-0 h-[32px] w-[4px] transition-all duration-150 ${
                      i < filledBars ? 'bg-white' : 'bg-[#333]'
                    }`}
                    style={{
                      boxShadow: isDragging && i < filledBars && i >= filledBars - 3
                        ? '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.4)'
                        : 'none',
                      filter: isDragging && i < filledBars && i >= filledBars - 3
                        ? 'brightness(1.5)'
                        : 'none',
                    }}
                  />
                ))}
                {/* Bleeding glow effect at the edge */}
                {isDragging && filledBars > 0 && (
                  <div 
                    className="absolute h-[32px] w-[40px] pointer-events-none"
                    style={{
                      left: `${(filledBars * 13) - 20}px`,
                      background: 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.3) 40%, rgba(255,255,255,0) 70%)',
                      filter: 'blur(8px)',
                      zIndex: -1,
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          
          {/* Divider */}
          <div className="h-0 relative shrink-0 w-full">
            <div className="absolute inset-[-1px_0_0_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 313 1">
                <line id="Line 1" stroke="var(--stroke-0, #333333)" x2="313" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
          
          {/* Theme Toggle */}
          <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
            <p className="font-['DM_Mono:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#bbb] text-[14px]">App Theme</p>
            
            <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
          </div>
        </div>
      </div>
    </div>
  );
}
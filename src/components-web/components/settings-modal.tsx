import { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  dailyGoal: number;
  onGoalChange: (goal: number) => void;
  unit: 'steps' | 'km';
  onUnitChange: (unit: 'steps' | 'km') => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  dailyGoal,
  onGoalChange,
  unit,
  onUnitChange
}: SettingsModalProps) {
  const [localGoal, setLocalGoal] = useState(dailyGoal);

  if (!isOpen) return null;

  const handleSliderChange = (value: number) => {
    setLocalGoal(value);
    onGoalChange(value);
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-[rgba(0,0,0,0.8)] z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed left-1/2 -translate-x-1/2 bottom-20 w-[346px] bg-[#111] rounded-2xl p-7 z-50">
        <p className="text-[#bbb] text-sm mb-4" style={{ fontFamily: 'DM Mono, monospace' }}>
          SET YOUR GOAL
        </p>
        
        {/* Steps label with value display inline */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-[#bbb] text-sm" style={{ fontFamily: 'DM Mono, monospace' }}>
            Steps
          </p>
          <div className="bg-[#2a2a2a] rounded-lg px-2.5 py-2">
            <p className="text-white text-sm" style={{ fontFamily: 'DM Mono, monospace' }}>
              {localGoal}
            </p>
          </div>
        </div>
        
        {/* Interactive slider with tick marks */}
        <div 
          className="mb-4 relative cursor-pointer select-none"
          onMouseDown={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const updateGoal = (clientX: number) => {
              const x = clientX - rect.left;
              const percentage = Math.max(0, Math.min(1, x / rect.width));
              const newGoal = Math.round(percentage * 10000);
              handleSliderChange(newGoal);
            };
            
            updateGoal(e.clientX);
            
            const handleMouseMove = (e: MouseEvent) => updateGoal(e.clientX);
            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
          onTouchStart={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const updateGoal = (touch: React.Touch) => {
              const x = touch.clientX - rect.left;
              const percentage = Math.max(0, Math.min(1, x / rect.width));
              const newGoal = Math.round(percentage * 10000);
              handleSliderChange(newGoal);
            };
            
            updateGoal(e.touches[0]);
            
            const handleTouchMove = (e: TouchEvent) => {
              e.preventDefault();
              updateGoal(e.touches[0] as any);
            };
            const handleTouchEnd = () => {
              document.removeEventListener('touchmove', handleTouchMove);
              document.removeEventListener('touchend', handleTouchEnd);
            };
            
            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            document.addEventListener('touchend', handleTouchEnd);
          }}
        >
          {/* Tick marks container */}
          <div className="flex gap-2.5 items-center justify-center mb-4">
            {Array.from({ length: 22 }, (_, i) => {
              const value = (i / 21) * 10000;
              const isFilled = value <= localGoal;
              return (
                <div
                  key={i}
                  className={`h-8 w-1 shrink-0 ${isFilled ? 'bg-white' : 'bg-[#333]'}`}
                />
              );
            })}
          </div>
          
          {/* Labels */}
          <div className="flex justify-between items-center text-[#bbb] text-sm relative" style={{ fontFamily: 'DM Mono, monospace' }}>
            <span>0</span>
            <span className="absolute left-1/2 -translate-x-1/2">5000</span>
            <span>10.000</span>
          </div>
        </div>
        
        {/* Unit selector */}
        <div className="mt-4">
          <p className="text-[#bbb] text-sm mb-4" style={{ fontFamily: 'DM Mono, monospace' }}>
            Unit
          </p>
          
          <div className="bg-[#111] border border-[#333] rounded-[10px] p-0.5 flex gap-0.5">
            <button
              onClick={() => onUnitChange('km')}
              className={`flex-1 py-2.5 px-2.5 rounded-lg text-sm transition-colors ${
                unit === 'km' ? 'bg-[#2a2a2a] text-white' : 'text-white'
              }`}
              style={{ fontFamily: 'DM Mono, monospace' }}
            >
              KM
            </button>
            <button
              onClick={() => onUnitChange('steps')}
              className={`flex-1 py-2 px-2 rounded-lg text-sm transition-colors ${
                unit === 'steps' ? 'bg-[#2a2a2a] text-white' : 'text-white'
              }`}
              style={{ fontFamily: 'DM Mono, monospace' }}
            >
              STEPS
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
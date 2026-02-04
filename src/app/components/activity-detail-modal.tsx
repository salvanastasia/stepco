import { X } from 'lucide-react';
import { motion, PanInfo } from 'motion/react';
import { useState } from 'react';
import svgPaths from "@/imports/svg-4vhnuqk4iu";
import imgFrame90 from "figma:asset/a93e1af8b81207182506e0e93dab89bb9a844b76.png";
import imgFrame88 from "figma:asset/b3df9fbfaa860c517894d9a70f912d559d0e347d.png";

interface StepRecord {
  date: string;
  steps: number;
}

interface ActivityDetailModalProps {
  activity: StepRecord;
  goal: number;
  onClose: () => void;
  theme?: 'bw' | 'bo';
}

export default function ActivityDetailModal({ activity, goal, onClose, theme = 'bw' }: ActivityDetailModalProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date('2026-02-03');
    const yesterday = new Date('2026-02-02');
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatSteps = (steps: number) => {
    return steps.toLocaleString('en-US').replace(/,/g, '.');
  };

  const percentage = Math.round((activity.steps / goal) * 100);
  const isComplete = activity.steps >= goal;
  
  // Calculate distance (assuming average stride length of 0.762m)
  const distanceKm = (activity.steps * 0.762 / 1000).toFixed(2);
  
  // Calculate calories (rough estimate: 0.04 calories per step)
  const calories = Math.round(activity.steps * 0.04);
  
  // Calculate duration (assuming average pace of 100 steps per minute)
  const durationMinutes = Math.round(activity.steps / 100);
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;

  const handleDragEnd = (_: any, info: PanInfo) => {
    // If dragged up more than 100px, expand
    if (info.offset.y < -100 && !isExpanded) {
      setIsExpanded(true);
    }
    // If dragged down more than 100px and expanded, collapse
    else if (info.offset.y > 100 && isExpanded) {
      setIsExpanded(false);
    }
    // If dragged down significantly when collapsed, close
    else if (info.offset.y > 150 && !isExpanded) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center px-[16px] pb-[24px]">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <motion.div 
        className="relative w-full max-w-[414px] bg-[#2a2a2a] rounded-[24px] overflow-hidden"
        initial={{ y: "100%" }}
        animate={{ 
          y: 0,
          height: isExpanded ? "85vh" : "auto"
        }}
        transition={{ type: "spring", damping: 35, stiffness: 400, mass: 0.8 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.1, bottom: 0.3 }}
        onDragEnd={handleDragEnd}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-[12px] pb-[8px] cursor-grab active:cursor-grabbing">
          <div className="w-[40px] h-[4px] bg-white/20 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-[24px] pt-[8px] pb-[16px]">
          <h2 className="text-white text-[20px] font-['Inter'] font-medium leading-[28px]">
            Activity Details
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className={`${isExpanded ? 'overflow-y-auto' : ''} ${isExpanded ? 'h-[calc(85vh-100px)]' : ''}`}>
          <div className="px-[24px] pb-[32px]">
            {/* Date */}
            <div className="mb-[24px]">
              <p className="text-white text-[16px] font-['JetBrains_Mono'] font-normal leading-[24px]">
                {formatDate(activity.date)}
              </p>
            </div>

            {/* Map Section - Only visible when expanded */}
            {isExpanded && (
              <motion.div 
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.4,
                  ease: [0.34, 1.56, 0.64, 1]
                }}
                className="mb-[24px]"
              >
                <div className="bg-[#2a2a2a] relative rounded-[16px] overflow-hidden">
                  <div className="border-[#3a3a3a] border-[0.615px] border-solid absolute inset-0 pointer-events-none rounded-[16px]" />
                  <div className="p-[16px]">
                    <div className="h-[201px] overflow-clip relative rounded-[10px] w-full">
                      <img 
                        alt="Walk route map" 
                        className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[10px] size-full" 
                        src={imgFrame88} 
                      />
                      <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[181.5px] left-1/2 top-[calc(50%+0.25px)] w-[316px]">
                        <img 
                          alt="Walk path" 
                          className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" 
                          src={imgFrame90} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Main Stats Card */}
            <div className="bg-[#1a1a1a] rounded-[16px] p-[24px] mb-[16px]">
              {/* Steps */}
              <div className="text-center mb-[20px]">
                <p className="text-[#999] text-[12px] font-['JetBrains_Mono'] font-normal leading-[18px] mb-[8px]">
                  STEPS
                </p>
                <p className="text-white text-[48px] font-['Archivo'] font-light leading-[48px]">
                  {formatSteps(activity.steps)}
                </p>
                <p className="text-[#999] text-[14px] font-['JetBrains_Mono'] font-normal leading-[21px] mt-[8px]">
                  steps
                </p>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between items-center mb-[8px]">
                  <p className="text-[#999] text-[12px] font-['JetBrains_Mono'] font-normal leading-[18px]">
                    Goal Progress
                  </p>
                  <p className={`text-[14px] font-['JetBrains_Mono'] font-normal leading-[21px] ${isComplete ? 'text-[#4ade80]' : 'text-[#999]'}`}>
                    {percentage}%
                  </p>
                </div>
                <div className="bg-[#2a2a2a] h-[8px] rounded-[8px] overflow-hidden">
                  <div 
                    className={`h-full ${isComplete ? 'bg-[#4ade80]' : (theme === 'bo' ? 'bg-[#ff4400]' : 'bg-white')} transition-all duration-300`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Additional Stats Grid */}
            <div className="grid grid-cols-3 gap-[12px]">
              {/* Distance */}
              <div className="bg-[#1a1a1a] rounded-[12px] pt-[16px] px-[16px] pb-[16px] text-center">
                <p className="text-[#999] text-[10px] font-['JetBrains_Mono'] font-normal leading-[15px] mb-[8px]">
                  DISTANCE
                </p>
                <p className="text-white text-[20px] font-['Archivo'] font-light leading-[20px] mb-[4px]">
                  {distanceKm}
                </p>
                <p className="text-[#999] text-[10px] font-['JetBrains_Mono'] font-normal leading-[15px]">
                  km
                </p>
              </div>

              {/* Calories */}
              <div className="bg-[#1a1a1a] rounded-[12px] pt-[16px] px-[16px] pb-[16px] text-center">
                <p className="text-[#999] text-[10px] font-['JetBrains_Mono'] font-normal leading-[15px] mb-[8px]">
                  CALORIES
                </p>
                <p className="text-white text-[20px] font-['Archivo'] font-light leading-[20px] mb-[4px]">
                  {calories}
                </p>
                <p className="text-[#999] text-[10px] font-['JetBrains_Mono'] font-normal leading-[15px]">
                  kcal
                </p>
              </div>

              {/* Duration */}
              <div className="bg-[#1a1a1a] rounded-[12px] pt-[16px] px-[16px] pb-[16px] text-center">
                <p className="text-[#999] text-[10px] font-['JetBrains_Mono'] font-normal leading-[15px] mb-[8px]">
                  DURATION
                </p>
                <p className="text-white text-[20px] font-['Archivo'] font-light leading-[20px] mb-[4px]">
                  {hours > 0 ? `${hours}:${minutes.toString().padStart(2, '0')}` : minutes}
                </p>
                <p className="text-[#999] text-[10px] font-['JetBrains_Mono'] font-normal leading-[15px]">
                  {hours > 0 ? 'hours' : 'min'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
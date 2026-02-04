import { useState } from 'react';
import ProfileModal from '@/app/components/profile-modal';
import ActivityDetailModal from '@/app/components/activity-detail-modal';
import imgFrame73 from "figma:asset/5e57bdbeef9424b6821c727c30e788b8e31d6a71.png";

interface StepRecord {
  date: string;
  steps: number;
}

interface ProfileViewProps {
  walkHistory: StepRecord[];
  goal: number;
  onGoalChange: (goal: number) => void;
  theme: 'bw' | 'bo';
  onThemeChange: (theme: 'bw' | 'bo') => void;
}

export default function ProfileView({ walkHistory, goal, onGoalChange, theme, onThemeChange }: ProfileViewProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<StepRecord | null>(null);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date('2026-02-03');
    const yesterday = new Date('2026-02-02');
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).replace(',', '');
  };

  const formatSteps = (steps: number) => {
    return steps.toLocaleString('en-US').replace(/,/g, '.');
  };

  return (
    <div className="size-full flex flex-col bg-[#1a1a1a] relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-[24px] pt-[72px]">
        <h1 className="text-white text-[24px] font-['Inter'] font-medium leading-[32px]">Activity</h1>
        <button
          onClick={() => setShowModal(!showModal)}
          className="block cursor-pointer relative rounded-[12px] shrink-0 size-[44px]"
        >
          <div aria-hidden="true" className="absolute inset-0 rounded-[12px]">
            <div className="absolute bg-white inset-0 rounded-[12px]" />
            <img alt="Profile" className="absolute max-w-none object-cover rounded-[12px] size-full" src={imgFrame73} />
          </div>
          <div aria-hidden="true" className="absolute border-2 border-[rgba(136,136,136,0.8)] border-solid inset-0 rounded-[12px]" />
        </button>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-auto px-[24px] pt-[20px] pb-32">
        <div className="flex flex-col gap-[7.997px]">
          {walkHistory.map((record) => {
            const percentage = Math.round((record.steps / goal) * 100);
            const isComplete = record.steps >= goal;
            
            return (
              <div
                key={record.date}
                className="bg-[#2a2a2a] h-[73.207px] relative rounded-[10px] cursor-pointer transition-all hover:bg-[#323232]"
                onClick={() => setSelectedRecord(record)}
              >
                <div aria-hidden="true" className="absolute border-[#3a3a3a] border-[0.615px] border-solid inset-0 pointer-events-none rounded-[10px]" />
                <div className="flex flex-col items-start pb-[0.615px] pt-[16.61px] px-[16.61px] size-full">
                  <div className="flex h-[39.987px] items-center justify-between w-full">
                    {/* Left side - date and steps */}
                    <div className="flex flex-col gap-[3.999px]">
                      <p className="font-['JetBrains_Mono'] font-normal leading-[20px] text-[14px] text-white">
                        {formatDate(record.date)}
                      </p>
                      <p className="font-['JetBrains_Mono'] font-normal leading-[16px] text-[#999] text-[12px]">
                        {formatSteps(record.steps)} steps
                      </p>
                    </div>
                    
                    {/* Right side - percentage and progress bar */}
                    <div className="flex gap-[11.996px] items-center">
                      <p className={`font-['JetBrains_Mono'] font-normal leading-[20px] text-[14px] ${isComplete ? 'text-[#4ade80]' : 'text-[#999]'}`}>
                        {percentage}%
                      </p>
                      <div className="bg-[#1a1a1a] h-[7.997px] relative rounded-[8px] w-[95.998px]">
                        <div className="flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
                          <div 
                            className={`h-[7.997px] ${isComplete ? 'bg-[#4ade80]' : (theme === 'bo' ? 'bg-[#ff4400]' : 'bg-white')} ${percentage < 100 ? 'rounded-l-[8px]' : 'rounded-[8px]'}`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Profile Modal */}
      <ProfileModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        initialGoal={goal}
        onGoalChange={onGoalChange}
        theme={theme}
        onThemeChange={onThemeChange}
      />
      
      {/* Activity Detail Modal */}
      {selectedRecord && (
        <ActivityDetailModal
          activity={selectedRecord}
          goal={goal}
          onClose={() => setSelectedRecord(null)}
          theme={theme}
        />
      )}
    </div>
  );
}
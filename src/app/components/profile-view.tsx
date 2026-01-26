import { Settings } from 'lucide-react';
import { useState } from 'react';
import SettingsModal from '@/app/components/settings-modal';

interface StepRecord {
  date: string;
  steps: number;
}

export default function ProfileView() {
  const [showSettings, setShowSettings] = useState(false);
  const [dailyGoal, setDailyGoal] = useState(10000);
  const [unit, setUnit] = useState<'steps' | 'km'>('steps');

  const stepHistory: StepRecord[] = [
    { date: '2026-01-26', steps: 6847 },
    { date: '2026-01-25', steps: 12453 },
    { date: '2026-01-24', steps: 9876 },
    { date: '2026-01-23', steps: 8234 },
    { date: '2026-01-22', steps: 11290 },
    { date: '2026-01-21', steps: 7654 },
    { date: '2026-01-20', steps: 10234 },
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date('2026-01-26');
    const yesterday = new Date('2026-01-25');
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const convertToKm = (steps: number) => {
    return (steps * 0.000762).toFixed(2);
  };

  return (
    <div className="size-full flex flex-col bg-[#1a1a1a] relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-8 pt-8 pb-4">
        <h1 className="text-white text-2xl font-mono">Activity</h1>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors"
        >
          <Settings className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-auto px-8 pb-32">
        <div className="space-y-2">
          {stepHistory.map((record, index) => (
            <div
              key={record.date}
              className="bg-[#2a2a2a] rounded-lg p-4 border border-[#3a3a3a] hover:border-[#4a4a4a] transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-mono text-sm mb-1">
                    {formatDate(record.date)}
                  </div>
                  <div className="text-[#999] font-mono text-xs">
                    {unit === 'steps'
                      ? `${record.steps.toLocaleString()} steps`
                      : `${convertToKm(record.steps)} km`}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`text-sm font-mono ${
                      record.steps >= dailyGoal ? 'text-[#4ade80]' : 'text-[#999]'
                    }`}
                  >
                    {Math.round((record.steps / dailyGoal) * 100)}%
                  </div>
                  <div className="w-24 h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        record.steps >= dailyGoal ? 'bg-[#4ade80]' : 'bg-white'
                      }`}
                      style={{ width: `${Math.min((record.steps / dailyGoal) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        dailyGoal={dailyGoal}
        onGoalChange={setDailyGoal}
        unit={unit}
        onUnitChange={setUnit}
      />
    </div>
  );
}
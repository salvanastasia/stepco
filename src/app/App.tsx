import { useState, useRef, useEffect } from 'react';
import CircularProgress from '@/app/components/circular-progress';
import BottomNav from '@/app/components/bottom-nav';
import MapView from '@/app/components/map-view';
import SocialView from '@/app/components/social-view';
import ProfileView from '@/app/components/profile-view';
import WalkCompletionModal from '@/app/components/walk-completion-modal';
import FriendInviteModal from '@/app/components/friend-invite-modal';
import FriendFindingView from '@/app/components/friend-finding-view';
import imgFrame73 from "figma:asset/5e57bdbeef9424b6821c727c30e788b8e31d6a71.png";

export default function App() {
  const [steps, setSteps] = useState(0);
  const [goal, setGoal] = useState(10000);
  const [currentPage, setCurrentPage] = useState<'home' | 'map' | 'social' | 'profile'>('home');
  const [isWalking, setIsWalking] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(0);
  const [theme, setTheme] = useState<'bw' | 'bo'>('bw');
  const [showFriendInvite, setShowFriendInvite] = useState(false);
  const [showFriendFinding, setShowFriendFinding] = useState(false);
  const [walkHistory, setWalkHistory] = useState<Array<{ date: string; steps: number }>>([
    { date: '2026-02-03', steps: 6847 },
    { date: '2026-02-02', steps: 12453 },
    { date: '2026-01-24', steps: 9876 },
    { date: '2026-01-23', steps: 8234 },
    { date: '2026-01-22', steps: 11290 },
    { date: '2026-01-21', steps: 7654 },
    { date: '2026-01-20', steps: 10234 },
  ]);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const pages: ('home' | 'map' | 'social' | 'profile')[] = ['home', 'map', 'social', 'profile'];
  
  // Simulate finding a friend nearby on home page
  useEffect(() => {
    if (currentPage !== 'home') return;
    
    const timer = setTimeout(() => {
      setShowFriendInvite(true);
    }, 3000); // Show after 3 seconds on home page
    
    return () => clearTimeout(timer);
  }, [currentPage]);

  useEffect(() => {
    if (!isWalking) return;
    
    const interval = setInterval(() => {
      setSteps(prev => {
        if (prev >= goal) {
          return prev;
        }
        return prev + Math.floor(Math.random() * 3) + 1;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [isWalking, goal]);
  
  const handleSwipe = (direction: 'left' | 'right') => {
    const currentIndex = pages.indexOf(currentPage);
    
    if (direction === 'left' && currentIndex < pages.length - 1) {
      setCurrentPage(pages[currentIndex + 1]);
    } else if (direction === 'right' && currentIndex > 0) {
      setCurrentPage(pages[currentIndex - 1]);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const diffX = touchStartX.current - touchEndX;
    const diffY = touchStartY.current - touchEndY;
    
    // Only trigger swipe if horizontal movement is greater than vertical
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) {
        handleSwipe('left');
      } else {
        handleSwipe('right');
      }
    }
  };

  const startWalk = () => {
    setSteps(0);
    setIsWalking(true);
  };

  const stopWalk = () => {
    if (steps > 0) {
      // Save the walk to history
      const today = new Date().toISOString().split('T')[0];
      setWalkHistory(prev => {
        const existingIndex = prev.findIndex(record => record.date === today);
        if (existingIndex >= 0) {
          // Update today's steps
          const updated = [...prev];
          updated[existingIndex] = { date: today, steps: updated[existingIndex].steps + steps };
          return updated.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        } else {
          // Add new entry
          return [{ date: today, steps }, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
      });
      setCompletedSteps(steps);
      setShowCompletionModal(true);
    }
    setIsWalking(false);
    setSteps(0);
  };

  const handleGoalChange = (newGoal: number) => {
    setGoal(newGoal);
  };

  const handleAcceptWalk = () => {
    setShowFriendInvite(false);
    setShowFriendFinding(true);
  };

  const handleDeclineWalk = () => {
    setShowFriendInvite(false);
  };

  const handleCloseFriendFinding = () => {
    setShowFriendFinding(false);
    startWalk();
  };

  return (
    <div 
      className="size-full bg-[#1a1a1a]" 
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {currentPage === 'home' && (
        <div className="size-full flex flex-col items-center justify-center gap-8">
          <CircularProgress current={goal - steps} goal={goal} isCountdown theme={theme} />
          {!isWalking ? (
            <button 
              onClick={startWalk}
              className={`${theme === 'bo' ? 'bg-[#ff4400] text-white' : 'bg-white text-[#1a1a1a]'} px-8 py-3 rounded-full font-medium hover:brightness-90 transition-all uppercase`}
              style={{ fontFamily: 'DM Mono, monospace' }}
            >
              Start walk
            </button>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className={`${theme === 'bo' ? 'text-[#ff4400]' : 'text-white'} text-sm uppercase`} style={{ fontFamily: 'DM Mono, monospace' }}>
                Walking
              </div>
              <button 
                onClick={stopWalk}
                className={`${theme === 'bo' ? 'bg-[#ff4400] text-white' : 'bg-white text-[#1a1a1a]'} px-8 py-3 rounded-full font-medium hover:brightness-90 transition-all uppercase`}
                style={{ fontFamily: 'DM Mono, monospace' }}
              >
                Stop
              </button>
            </div>
          )}
        </div>
      )}
      
      {currentPage === 'map' && <MapView />}
      
      {currentPage === 'social' && <SocialView />}
      
      {currentPage === 'profile' && <ProfileView walkHistory={walkHistory} goal={goal} onGoalChange={handleGoalChange} theme={theme} onThemeChange={setTheme} />}
      
      <BottomNav currentPage={currentPage} onPageChange={setCurrentPage} theme={theme} />
      {showCompletionModal && <WalkCompletionModal steps={completedSteps} goal={goal} onClose={() => setShowCompletionModal(false)} theme={theme} />}
      {showFriendInvite && currentPage === 'home' && (
        <FriendInviteModal
          friendName="Marc Lille"
          friendAvatar={imgFrame73}
          onAccept={handleAcceptWalk}
          onDecline={handleDeclineWalk}
          theme={theme}
        />
      )}
      {showFriendFinding && (
        <FriendFindingView 
          friendName="Marc Lille"
          friendAvatar={imgFrame73}
          onClose={handleCloseFriendFinding} 
          theme={theme}
        />
      )}
    </div>
  );
}
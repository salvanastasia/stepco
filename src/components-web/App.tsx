import { useState, useRef, useEffect } from 'react';
import CircularProgress from '@/app/components/circular-progress';
import BottomNav from '@/app/components/bottom-nav';
import MapView from '@/app/components/map-view';
import ProfileView from '@/app/components/profile-view';

export default function App() {
  const [steps, setSteps] = useState(0);
  const goal = 10000;
  const [currentPage, setCurrentPage] = useState<'home' | 'map' | 'profile'>('home');
  const [isWalking, setIsWalking] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const pages: ('home' | 'map' | 'profile')[] = ['home', 'map', 'profile'];
  
  useEffect(() => {
    if (!isWalking) return;
    
    const interval = setInterval(() => {
      setSteps(prev => {
        if (prev >= goal) {
          setIsWalking(false);
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

  return (
    <div 
      className="size-full bg-[#1a1a1a]" 
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {currentPage === 'home' && (
        <div className="size-full flex flex-col items-center justify-center gap-8">
          <CircularProgress current={steps} goal={goal} />
          <button 
            onClick={startWalk}
            className="bg-white text-[#1a1a1a] px-8 py-3 rounded-full font-medium hover:bg-[#f0f0f0] transition-colors uppercase"
            style={{ fontFamily: 'DM Mono, monospace' }}
          >
            {isWalking ? 'Walking...' : 'Start walk'}
          </button>
        </div>
      )}
      
      {currentPage === 'map' && <MapView />}
      
      {currentPage === 'profile' && <ProfileView />}
      
      <BottomNav currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  );
}
interface BottomNavProps {
  currentPage: 'home' | 'map' | 'social' | 'profile';
  onPageChange: (page: 'home' | 'map' | 'social' | 'profile') => void;
  theme?: 'bw' | 'bo';
}

export default function BottomNav({ currentPage, onPageChange, theme = 'bw' }: BottomNavProps) {
  const pages: ('home' | 'map' | 'social' | 'profile')[] = ['home', 'map', 'social', 'profile'];
  
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
      <div className="flex items-center gap-3">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-2 h-2 transition-colors ${
              currentPage === page ? (theme === 'bo' ? 'bg-[#ff4400]' : 'bg-white') : 'bg-[#666]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
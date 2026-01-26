interface BottomNavProps {
  currentPage: 'home' | 'map' | 'profile';
  onPageChange: (page: 'home' | 'map' | 'profile') => void;
}

export default function BottomNav({ currentPage, onPageChange }: BottomNavProps) {
  const pages: ('home' | 'map' | 'profile')[] = ['home', 'map', 'profile'];
  
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
      <div className="flex items-center gap-3">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-2 h-2 transition-colors ${
              currentPage === page ? 'bg-white' : 'bg-[#666]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
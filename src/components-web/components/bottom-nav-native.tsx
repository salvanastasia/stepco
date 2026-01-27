import { View, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * BOTTOM NAVIGATION DOTS INDICATOR
 * 
 * Displays 3 squared dots representing the 3 screens:
 * - Dot 0: Home
 * - Dot 1: Map
 * - Dot 2: Stats
 * 
 * Active dot is highlighted in white, inactive dots are gray
 */

interface BottomNavProps {
  currentPage: 'home' | 'map' | 'stats';
  onPageChange: (page: 'home' | 'map' | 'stats') => void;
}

export default function BottomNav({ currentPage, onPageChange }: BottomNavProps) {
  // FIXED PAGES ARRAY - Must match App.tsx order
  // Index 0: Home, Index 1: Map, Index 2: Stats
  const pages: ('home' | 'map' | 'stats')[] = ['home', 'map', 'stats'];
  
  return (
    <View style={styles.container}>
      <View style={styles.navContainer}>
        {/* 
          MAP DOTS TO PAGES
          
          Each dot is clickable and updates currentPage
          Active state is determined by comparing page with currentPage
          
          DOTS UPDATE LOGIC:
          - When user swipes → currentPage changes → dots re-render with new active state
          - When user clicks dot → onPageChange() fires → triggers animation in App.tsx
        */}
        {pages.map((page) => (
          <TouchableOpacity
            key={page}
            onPress={() => onPageChange(page)}
            style={[
              styles.dot,
              currentPage === page ? styles.dotActive : styles.dotInactive
            ]}
            activeOpacity={0.7}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 48,
    left: 0,
    right: 0,
    alignItems: 'center',
    pointerEvents: 'box-none', // Allow touch to pass through container
  },
  navContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    pointerEvents: 'auto', // But capture touch on dots
  },
  // Squared dots (8x8px with slight rounding for modern look)
  dot: {
    width: 8,
    height: 8,
    borderRadius: 2, // Slight rounding to distinguish from perfect circle
  },
  dotActive: {
    backgroundColor: '#fff',
  },
  dotInactive: {
    backgroundColor: '#666',
  },
});

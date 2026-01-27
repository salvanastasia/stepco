import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { Home, Map, User } from 'lucide-react-native';

/**
 * BOTTOM NAVIGATION BAR (Figma Design)
 * 
 * Modern bottom navigation with 3 icon buttons:
 * - Home icon → Home screen
 * - Map icon → Map screen
 * - User icon → Stats/Profile screen
 * 
 * Active button has darker background (#333) with rounded corners
 * Inactive buttons are transparent with gray icons
 */

interface BottomNavProps {
  currentPage: 'home' | 'map' | 'stats';
  onPageChange: (page: 'home' | 'map' | 'stats') => void;
}

/**
 * ANIMATED BUTTON COMPONENT
 * 
 * Individual navigation button with:
 * - Icon (Home, Map, or User)
 * - Animated background when active
 * - Smooth opacity transition
 */
function AnimatedNavButton({ 
  page, 
  isActive, 
  onPress,
  icon: IconComponent
}: { 
  page: 'home' | 'map' | 'stats'; 
  isActive: boolean; 
  onPress: () => void;
  icon: typeof Home | typeof Map | typeof User;
}) {
  // Animation value for background opacity
  const backgroundOpacity = useRef(new Animated.Value(isActive ? 1 : 0)).current;
  
  /**
   * ACTIVE STATE ANIMATION
   * 
   * When button becomes active:
   * - Background opacity: 0 → 1 (fade in dark bg)
   * - Icon color: gray → white
   * 
   * Duration: 200ms smooth transition
   */
  useEffect(() => {
    Animated.timing(backgroundOpacity, {
      toValue: isActive ? 1 : 0,
      duration: 200,
      useNativeDriver: false, // backgroundColor doesn't support native driver
    }).start();
  }, [isActive]);
  
  // Interpolate background color based on active state
  const backgroundColor = backgroundOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(51, 51, 51, 0)', 'rgba(51, 51, 51, 1)'] // transparent → #333
  });
  
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.buttonTouchable}
    >
      <Animated.View
        style={[
          styles.button,
          { backgroundColor }
        ]}
      >
        <IconComponent 
          size={24} 
          color={isActive ? '#ffffff' : '#999999'} 
          strokeWidth={2}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function BottomNav({ currentPage, onPageChange }: BottomNavProps) {
  /**
   * PAGE TO ICON MAPPING
   * 
   * Maps each page to its corresponding Lucide icon:
   * - home → Home icon
   * - map → Map icon
   * - stats → User icon (profile/stats screen)
   */
  const navButtons: Array<{
    page: 'home' | 'map' | 'stats';
    icon: typeof Home | typeof Map | typeof User;
  }> = [
    { page: 'home', icon: Home },
    { page: 'map', icon: Map },
    { page: 'stats', icon: User },
  ];
  
  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        {/* 
          NAVIGATION BUTTONS
          
          Each button:
          - Shows an icon (Home, Map, User)
          - Has active state with dark background (#333)
          - Triggers page change on press
          
          ANIMATION:
          - Background fades in/out (200ms)
          - Icon color: gray (#999) → white (#fff)
        */}
        {navButtons.map(({ page, icon }) => (
          <AnimatedNavButton
            key={page}
            page={page}
            isActive={currentPage === page}
            onPress={() => onPageChange(page)}
            icon={icon}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Container: Absolute positioned at bottom
  container: {
    position: 'absolute',
    bottom: 48, // 48px from bottom (as per original design)
    left: 20,   // 20px horizontal margins
    right: 20,
    alignItems: 'center',
    pointerEvents: 'box-none', // Allow touch to pass through to gestures
  },
  
  // Navigation bar: Dark background with border (Figma design)
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2a2a2a', // Dark gray background
    borderWidth: 0.615,
    borderColor: '#3a3a3a',    // Subtle border
    borderRadius: 24,          // Rounded pill shape
    paddingVertical: 8,
    paddingHorizontal: 8,
    width: '100%',
    maxWidth: 300,             // Max width for larger screens
    pointerEvents: 'auto',     // Capture touches on nav bar
  },
  
  // Button touchable area (no extra styling)
  buttonTouchable: {
    flex: 1,
  },
  
  // Individual button: Active state has dark bg (#333)
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,  // 20px horizontal padding
    paddingVertical: 16.6,  // Vertical padding for height
    borderRadius: 18,       // Rounded corners for active bg
  },
});

import { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, PanResponder, Alert, Platform, Text, Animated, Dimensions, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Pedometer } from 'expo-sensors';
import { useFonts, Archivo_400Regular, Archivo_600SemiBold, Archivo_700Bold } from '@expo-google-fonts/archivo';
import { JetBrainsMono_400Regular, JetBrainsMono_500Medium, JetBrainsMono_600SemiBold } from '@expo-google-fonts/jetbrains-mono';
import CircularProgress from './src/components-web/components/circular-progress-native';
import BottomNav from './src/components-web/components/bottom-nav-native';
import MapView from './src/components-web/components/map-view-native';
import ProfileView from './src/components-web/components/profile-view-native';

// Page type definition - Fixed order: Home → Map → Stats
type PageType = 'home' | 'map' | 'stats';

export default function App() {
  const [fontsLoaded] = useFonts({
    Archivo_400Regular,
    Archivo_600SemiBold,
    Archivo_700Bold,
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
    JetBrainsMono_600SemiBold,
  });

  const { width: screenWidth } = useWindowDimensions();

  const [steps, setSteps] = useState(0);
  const goal = 10000;
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [isWalking, setIsWalking] = useState(false);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  
  const currentPageRef = useRef(currentPage);
  const walkStartTimeRef = useRef<Date | null>(null);
  
  // Animation controller for horizontal swipe transitions
  // translateX moves the entire carousel container horizontally
  const translateX = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  // FIXED PAGES ARRAY - Range: 0-2 (3 screens total)
  // Index 0: Home
  // Index 1: Map  
  // Index 2: Stats
  const pages: PageType[] = ['home', 'map', 'stats'];
  
  // Check if pedometer is available
  useEffect(() => {
    const checkPedometer = async () => {
      const available = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(available);
      
      if (!available) {
        Alert.alert(
          'Pedometer Not Available',
          'Step tracking is not available on this device. Using simulation mode.',
          [{ text: 'OK' }]
        );
      }
    };
    
    checkPedometer();
  }, []);
  
  /**
   * REAL STEP TRACKING - Cross-platform compatible
   * 
   * PLATFORM DIFFERENCES:
   * - iOS: Supports getStepCountAsync(start, end) for historical data
   * - Android: Only supports watchStepCount() for incremental updates
   * 
   * SOLUTION:
   * - Use watchStepCount() which works on both platforms
   * - Store initial step count when walk starts
   * - Calculate difference: currentSteps - initialSteps = stepsThisWalk
   */
  useEffect(() => {
    if (!isWalking) return;
    
    let subscription: { remove: () => void } | null = null;
    let initialStepCount = 0;
    let hasInitialValue = false;
    
    const startTracking = async () => {
      if (isPedometerAvailable) {
        try {
          // Subscribe to step count updates (works on both iOS and Android)
          subscription = Pedometer.watchStepCount(result => {
            if (!hasInitialValue) {
              // First callback: store initial step count as baseline
              initialStepCount = result.steps;
              hasInitialValue = true;
              setSteps(0); // Start from 0 for this walk
            } else {
              // Subsequent callbacks: calculate steps since walk started
              const stepsThisWalk = result.steps - initialStepCount;
              setSteps(stepsThisWalk);
              
              // Stop walking if goal is reached
              if (stepsThisWalk >= goal) {
                setIsWalking(false);
              }
            }
          });
        } catch (error) {
          console.error('Error watching step count:', error);
          // Fall back to simulation
          startSimulation();
        }
      } else {
        // Pedometer not available: use simulation
        startSimulation();
      }
    };
    
    /**
     * Simulation fallback for devices without pedometer
     * Increments steps randomly for testing purposes
     */
    const startSimulation = () => {
      const intervalId = setInterval(() => {
        setSteps(prev => {
          if (prev >= goal) {
            setIsWalking(false);
            return prev;
          }
          return prev + Math.floor(Math.random() * 3) + 1;
        });
      }, 100);
      
      // Return cleanup function in subscription format
      subscription = {
        remove: () => clearInterval(intervalId)
      };
    };
    
    startTracking();
    
    // Cleanup: unsubscribe when walking stops or component unmounts
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isWalking, goal, isPedometerAvailable]);
  
  /**
   * Handle swipe navigation with explicit boundary checks
   * 
   * BOUNDARY LOGIC:
   * - Home (index 0): Can only swipe LEFT to Map (no right swipe)
   * - Map (index 1): Can swipe BOTH directions (left to Stats, right to Home)
   * - Stats (index 2): Can only swipe RIGHT to Map (no left swipe)
   * 
   * @param direction - 'left' = swipe finger left (go to next), 'right' = swipe finger right (go to previous)
   */
  const handleSwipe = (direction: 'left' | 'right') => {
    const currentIndex = pages.indexOf(currentPage);
    
    // LIMIT CHECK: Prevent swipe beyond boundaries
    if (direction === 'left' && currentIndex < pages.length - 1) {
      // Can go forward (Home→Map, Map→Stats)
      const nextPage = pages[currentIndex + 1];
      animateToPage(nextPage, currentIndex + 1);
    } else if (direction === 'right' && currentIndex > 0) {
      // Can go backward (Stats→Map, Map→Home)
      const prevPage = pages[currentIndex - 1];
      animateToPage(prevPage, currentIndex - 1);
    }
    // If at boundaries (Home swiping right, or Stats swiping left), do nothing
  };

  /**
   * Animate transition to target page
   * 
   * ANIMATION LOGIC:
   * - Each page is positioned at: index * -screenWidth
   * - Home (0): translateX = 0
   * - Map (1): translateX = -screenWidth
   * - Stats (2): translateX = -screenWidth * 2
   * 
   * @param page - Target page to navigate to
   * @param index - Index of target page (0, 1, or 2)
   */
  const animateToPage = (page: PageType, index: number) => {
    setCurrentPage(page);
    
    // Animate horizontal slide with spring physics
    Animated.spring(translateX, {
      toValue: -index * screenWidth,
      useNativeDriver: true,
      speed: 14,
      bounciness: 4,
    }).start();
  };

  /**
   * PAGE CONTROLLER: Update dots indicator when page changes
   * This ensures dots stay in sync with current page
   */
  useEffect(() => {
    const index = pages.indexOf(currentPage);
    // Sync animation with page state
    Animated.spring(translateX, {
      toValue: -index * screenWidth,
      useNativeDriver: true,
      speed: 14,
      bounciness: 4,
    }).start();
  }, [currentPage, screenWidth]);

  /**
   * GESTURE DETECTOR: PanResponder for swipe detection
   * 
   * GESTURE FLOW:
   * 1. User touches screen → onStartShouldSetPanResponder
   * 2. User moves finger → onMoveShouldSetPanResponder/Capture (decides if this is a swipe)
   * 3. User releases → onPanResponderRelease (execute navigation if valid swipe)
   * 
   * BOUNDARY ENFORCEMENT:
   * - handleSwipe() already checks boundaries, so we just detect gesture here
   * - Invalid swipes (beyond limits) are ignored by handleSwipe()
   */
  const panResponder = useRef(
    PanResponder.create({
      // Allow this responder to become active
      onStartShouldSetPanResponder: () => true,
      
      // Don't capture on start (let children handle taps first)
      onStartShouldSetPanResponderCapture: () => false,
      
      /**
       * BUBBLE PHASE: Detect horizontal movement (5px threshold)
       * Returns true when user is clearly swiping horizontally
       */
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const isHorizontalSwipe = Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 5;
        return isHorizontalSwipe;
      },
      
      /**
       * CAPTURE PHASE: Aggressively capture horizontal swipes (10px threshold)
       * Prevents child components (ScrollView, Map) from stealing the gesture
       */
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        const isHorizontalSwipe = Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
        return isHorizontalSwipe;
      },
      
      /**
       * Gesture has been granted to this responder
       */
      onPanResponderGrant: () => {
        // Could add visual feedback here (e.g., slight scale effect)
      },
      
      /**
       * LIVE DRAG PREVIEW: Track continuous movement
       * 
       * Shows next/previous page preview as user drags
       * Applies boundary constraints to prevent over-scrolling
       */
      onPanResponderMove: (evt, gestureState) => {
        const currentIndex = pages.indexOf(currentPageRef.current);
        const dragOffset = gestureState.dx;
        
        // Calculate target position with drag offset
        let targetPosition = -currentIndex * screenWidth + dragOffset;
        
        // BOUNDARY CONSTRAINTS:
        // - Don't drag past first screen (Home)
        // - Don't drag past last screen (Stats)
        const minPosition = -(pages.length - 1) * screenWidth; // -2 * screenWidth for Stats
        const maxPosition = 0; // 0 for Home
        
        // Clamp position within bounds with rubber-band effect
        if (targetPosition > maxPosition) {
          // Trying to drag right from Home → apply resistance
          const overflow = targetPosition - maxPosition;
          targetPosition = maxPosition + overflow * 0.3; // 30% resistance
        } else if (targetPosition < minPosition) {
          // Trying to drag left from Stats → apply resistance
          const overflow = targetPosition - minPosition;
          targetPosition = minPosition + overflow * 0.3; // 30% resistance
        }
        
        // Update translateX for live preview
        translateX.setValue(targetPosition);
      },
      
      /**
       * USER RELEASED FINGER: Execute navigation if swipe is valid
       * 
       * SWIPE VALIDATION:
       * - Minimum distance: 50px (prevents accidental swipes)
       * - Must be more horizontal than vertical
       * - Direction: dx < 0 = left swipe, dx > 0 = right swipe
       */
      onPanResponderRelease: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        
        // Check if swipe distance exceeds threshold (50px) and is primarily horizontal
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
          if (dx < 0) {
            // Swiped left (finger moved left) → go to next page
            handleSwipe('left');
          } else {
            // Swiped right (finger moved right) → go to previous page
            handleSwipe('right');
          }
        } else {
          // Swipe too short or too vertical → snap back to current page
          const currentIndex = pages.indexOf(currentPage);
          Animated.spring(translateX, {
            toValue: -currentIndex * screenWidth,
            useNativeDriver: true,
            speed: 14,
            bounciness: 4,
          }).start();
        }
      },
      
      /**
       * Another component has taken control of the gesture
       * (e.g., ScrollView took over for vertical scroll)
       */
      onPanResponderTerminate: () => {
        // Snap back to current page
        const currentIndex = pages.indexOf(currentPage);
        Animated.spring(translateX, {
          toValue: -currentIndex * screenWidth,
          useNativeDriver: true,
          speed: 14,
          bounciness: 4,
        }).start();
      },
    })
  ).current;

  const startWalk = async () => {
    setSteps(0);
    walkStartTimeRef.current = new Date();
    
    if (isPedometerAvailable) {
      try {
        // Request permissions if needed (iOS)
        if (Platform.OS === 'ios') {
          const { status } = await Pedometer.requestPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert(
              'Permission Required',
              'Please enable step tracking permissions in Settings',
              [{ text: 'OK' }]
            );
            return;
          }
        }
        
        setIsWalking(true);
      } catch (error) {
        console.error('Error requesting permissions:', error);
        Alert.alert('Error', 'Could not start step tracking');
      }
    } else {
      // Use simulation mode
      setIsWalking(true);
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <StatusBar style="light" />
      
      {/* 
        HORIZONTAL CAROUSEL CONTAINER
        
        Structure:
        - Animated.View with translateX for horizontal sliding
        - Contains all 3 screens side-by-side
        - Each screen is full width of the device
        - translateX moves entire container left/right
        
        Position calculation:
        - Home (index 0): translateX = 0
        - Map (index 1): translateX = -screenWidth (moves left by 1 screen)
        - Stats (index 2): translateX = -screenWidth * 2 (moves left by 2 screens)
      */}
      <Animated.View
        style={[
          styles.carouselContainer,
          {
            width: screenWidth * pages.length, // Total width = 3 screens
            transform: [{ translateX }], // Horizontal slide animation
          },
        ]}
      >
        {/* 
          SCREEN 0: HOME
          pointerEvents="box-none" allows horizontal swipes to pass through
          but still allows taps on buttons/interactive elements
        */}
        <View style={[styles.screen, { width: screenWidth }]} pointerEvents="box-none">
          <CircularProgress 
            current={steps} 
            goal={goal} 
            isWalking={isWalking}
            onStartWalk={startWalk}
          />
        </View>

        {/* 
          SCREEN 1: MAP
          pointerEvents="box-none" ensures swipes work on map screen
          MapView itself has pointerEvents="none" to pass through all gestures
        */}
        <View style={[styles.screen, { width: screenWidth }]} pointerEvents="box-none">
          <MapView />
        </View>

        {/* 
          SCREEN 2: STATS (formerly Profile)
          pointerEvents="box-none" allows swipes while preserving scroll in ProfileView
        */}
        <View style={[styles.screen, { width: screenWidth }]} pointerEvents="box-none">
          <ProfileView />
        </View>
      </Animated.View>
      
      {/* 
        BOTTOM NAVIGATION DOTS
        
        Dots update logic:
        - Active dot has white background
        - Inactive dots have gray background
        - Clicking a dot calls onPageChange which triggers animateToPage()
        - Animation syncs with page state via useEffect
      */}
      <BottomNav currentPage={currentPage} onPageChange={(page) => {
        const index = pages.indexOf(page);
        animateToPage(page, index);
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    overflow: 'hidden', // Hide screens outside viewport
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'JetBrainsMono_400Regular',
  },
  // Carousel container holding all 3 screens horizontally
  carouselContainer: {
    flexDirection: 'row',
    height: '100%',
  },
  // Individual screen container (full width)
  screen: {
    flex: 1,
  },
});

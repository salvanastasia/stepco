import { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, PanResponder, Alert, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Pedometer } from 'expo-sensors';
import CircularProgress from './src/components-web/components/circular-progress-native';
import BottomNav from './src/components-web/components/bottom-nav-native';
import MapView from './src/components-web/components/map-view-native';
import ProfileView from './src/components-web/components/profile-view-native';

export default function App() {
  const [steps, setSteps] = useState(0);
  const goal = 10000;
  const [currentPage, setCurrentPage] = useState<'home' | 'map' | 'profile'>('home');
  const [isWalking, setIsWalking] = useState(false);
  const [mapInteractionEnabled, setMapInteractionEnabled] = useState(false);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  
  const currentPageRef = useRef(currentPage);
  const walkStartTimeRef = useRef<Date | null>(null);
  
  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  const pages: ('home' | 'map' | 'profile')[] = ['home', 'map', 'profile'];
  
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
  
  // Real step tracking when walking - CORRECTED VERSION
  useEffect(() => {
    if (!isWalking) return;
    
    let intervalId: NodeJS.Timeout | null = null;
    
    const startTracking = async () => {
      if (isPedometerAvailable && walkStartTimeRef.current) {
        // Poll step count every second
        intervalId = setInterval(async () => {
          try {
            const end = new Date();
            const start = walkStartTimeRef.current!;
            
            const result = await Pedometer.getStepCountAsync(start, end);
            const stepsThisWalk = result.steps;
            setSteps(stepsThisWalk);
            
            // Stop walking if goal is reached
            if (stepsThisWalk >= goal) {
              setIsWalking(false);
            }
          } catch (error) {
            console.error('Error reading step count:', error);
          }
        }, 1000); // Update every second
      } else {
        // Fallback: Simulate steps if pedometer not available
        intervalId = setInterval(() => {
          setSteps(prev => {
            if (prev >= goal) {
              setIsWalking(false);
              return prev;
            }
            return prev + Math.floor(Math.random() * 3) + 1;
          });
        }, 100);
      }
    };
    
    startTracking();
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isWalking, goal, isPedometerAvailable]);
  
  const handleSwipe = (direction: 'left' | 'right') => {
    const currentIndex = pages.indexOf(currentPage);
    
    if (direction === 'left' && currentIndex < pages.length - 1) {
      setCurrentPage(pages[currentIndex + 1]);
    } else if (direction === 'right' && currentIndex > 0) {
      setCurrentPage(pages[currentIndex - 1]);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt) => {
        const touchCount = evt.nativeEvent.touches.length;
        const page = currentPageRef.current;
        
        // If we're on map and 2+ fingers, enable map interaction
        if (page === 'map' && touchCount >= 2) {
          setMapInteractionEnabled(true);
          return false; // Don't capture, let map handle it
        }
        
        // Reset map interaction if less than 2 fingers
        if (page === 'map') {
          setMapInteractionEnabled(false);
        }
        
        // Only capture if it's a single touch (1 finger)
        return touchCount === 1;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const touchCount = evt.nativeEvent.touches.length;
        const page = currentPageRef.current;
        
        // If 2+ fingers on map, don't capture
        if (page === 'map' && touchCount >= 2) {
          setMapInteractionEnabled(true);
          return false;
        }
        
        // Capture if it's a single touch and horizontal movement
        const isSingleTouch = touchCount === 1;
        const isHorizontalSwipe = Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
        return isSingleTouch && isHorizontalSwipe;
      },
      onPanResponderRelease: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        const page = currentPageRef.current;
        
        // Reset map interaction
        if (page === 'map') {
          setTimeout(() => setMapInteractionEnabled(false), 50);
        }
        
        // Only trigger swipe if horizontal movement is greater than vertical and it's a single touch
        if (evt.nativeEvent.changedTouches.length === 1 && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
          if (dx < 0) {
            handleSwipe('left');
          } else {
            handleSwipe('right');
          }
        }
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

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <StatusBar style="light" />
      
      {currentPage === 'home' && (
        <CircularProgress 
          current={steps} 
          goal={goal} 
          isWalking={isWalking}
          onStartWalk={startWalk}
        />
      )}
      
      {currentPage === 'map' && <MapView mapInteractionEnabled={mapInteractionEnabled} />}
      
      {currentPage === 'profile' && <ProfileView />}
      
      <BottomNav currentPage={currentPage} onPageChange={setCurrentPage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
});

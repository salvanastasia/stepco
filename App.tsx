import { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, PanResponder, Alert, Platform, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Pedometer } from 'expo-sensors';
import { useFonts, Archivo_400Regular, Archivo_600SemiBold, Archivo_700Bold } from '@expo-google-fonts/archivo';
import { JetBrainsMono_400Regular, JetBrainsMono_500Medium, JetBrainsMono_600SemiBold } from '@expo-google-fonts/jetbrains-mono';
import CircularProgress from './src/components-web/components/circular-progress-native';
import BottomNav from './src/components-web/components/bottom-nav-native';
import MapView from './src/components-web/components/map-view-native';
import ProfileView from './src/components-web/components/profile-view-native';

export default function App() {
  const [fontsLoaded] = useFonts({
    Archivo_400Regular,
    Archivo_600SemiBold,
    Archivo_700Bold,
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
    JetBrainsMono_600SemiBold,
  });

  const [steps, setSteps] = useState(0);
  const goal = 10000;
  const [currentPage, setCurrentPage] = useState<'home' | 'map' | 'profile'>('home');
  const [isWalking, setIsWalking] = useState(false);
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
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Capture if horizontal movement is greater than vertical (with small threshold)
        const isHorizontalSwipe = Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 5;
        return isHorizontalSwipe;
      },
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        // Aggressively capture horizontal swipes from children
        const isHorizontalSwipe = Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
        return isHorizontalSwipe;
      },
      onPanResponderGrant: () => {
        // Gesture has started
      },
      onPanResponderMove: () => {
        // Track movement (no action needed, just tracking)
      },
      onPanResponderRelease: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        
        // Trigger swipe if horizontal movement is greater than vertical and exceeds threshold
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
          if (dx < 0) {
            handleSwipe('left');
          } else {
            handleSwipe('right');
          }
        }
      },
      onPanResponderTerminate: () => {
        // Another component has taken over the gesture
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
      
      {currentPage === 'home' && (
        <CircularProgress 
          current={steps} 
          goal={goal} 
          isWalking={isWalking}
          onStartWalk={startWalk}
        />
      )}
      
      {currentPage === 'map' && <MapView />}
      
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'JetBrainsMono_400Regular',
  },
});

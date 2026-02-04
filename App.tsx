import { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, PanResponder, Alert, Platform, Animated, Dimensions, TouchableOpacity, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Pedometer } from 'expo-sensors';
import { useFonts, Archivo_400Regular, Archivo_600SemiBold, Archivo_700Bold } from '@expo-google-fonts/archivo';
import { JetBrainsMono_400Regular, JetBrainsMono_500Medium, JetBrainsMono_600SemiBold } from '@expo-google-fonts/jetbrains-mono';
import CircularProgress from './src/components-native/circular-progress-native';
import BottomNav from './src/components-native/bottom-nav-native';
import MapView from './src/components-native/map-view-native';
import SocialView from './src/components-native/social-view-native';
import ProfileView from './src/components-native/profile-view-native';
import WalkCompletionModal from './src/components-native/walk-completion-modal-native';
import FriendInviteModal from './src/components-native/friend-invite-modal-native';
import FriendFindingView from './src/components-native/friend-finding-view-native';

// Page type definition - Fixed order: Home → Map → Social → Profile
type PageType = 'home' | 'map' | 'social' | 'profile';

export default function App() {
  const [fontsLoaded] = useFonts({
    Archivo_400Regular,
    Archivo_600SemiBold,
    Archivo_700Bold,
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
    JetBrainsMono_600SemiBold,
  });

  const { width: screenWidth } = Dimensions.get('window');

  // Step record interface
  interface StepRecord {
    date: string;
    steps: number;
  }

  const [steps, setSteps] = useState(0);
  const [goal, setGoal] = useState(10000);
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [isWalking, setIsWalking] = useState(false);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(0);
  const [theme, setTheme] = useState<'bw' | 'bo'>('bw');
  const [showFriendInvite, setShowFriendInvite] = useState(false);
  const [showFriendFinding, setShowFriendFinding] = useState(false);
  const [walkHistory, setWalkHistory] = useState<StepRecord[]>([
    { date: '2026-02-03', steps: 6847 },
    { date: '2026-02-02', steps: 12453 },
    { date: '2026-01-24', steps: 9876 },
    { date: '2026-01-23', steps: 8234 },
    { date: '2026-01-22', steps: 11290 },
    { date: '2026-01-21', steps: 7654 },
    { date: '2026-01-20', steps: 10234 },
  ]);
  
  const currentPageRef = useRef(currentPage);
  const walkStartTimeRef = useRef<Date | null>(null);
  
  // Animation controller for horizontal swipe transitions
  const translateX = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  // FIXED PAGES ARRAY - Range: 0-3 (4 screens total)
  const pages: PageType[] = ['home', 'map', 'social', 'profile'];
  
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
  
  // Simulate finding a friend nearby on home page
  useEffect(() => {
    if (currentPage !== 'home') return;
    
    const timer = setTimeout(() => {
      setShowFriendInvite(true);
    }, 5000); // Show after 5 seconds on home page
    
    return () => clearTimeout(timer);
  }, [currentPage]);

  // Real step tracking
  useEffect(() => {
    if (!isWalking) return;
    
    let subscription: { remove: () => void } | null = null;
    let initialStepCount = 0;
    let hasInitialValue = false;
    
    const startTracking = async () => {
      if (isPedometerAvailable) {
        try {
          subscription = Pedometer.watchStepCount(result => {
            if (!hasInitialValue) {
              initialStepCount = result.steps;
              hasInitialValue = true;
              setSteps(0);
            } else {
              const stepsThisWalk = result.steps - initialStepCount;
              setSteps(stepsThisWalk);
              
              if (stepsThisWalk >= goal) {
                setIsWalking(false);
              }
            }
          });
        } catch (error) {
          console.error('Error watching step count:', error);
          startSimulation();
        }
      } else {
        startSimulation();
      }
    };
    
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
      
      subscription = {
        remove: () => clearInterval(intervalId)
      };
    };
    
    startTracking();
    
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isWalking, goal, isPedometerAvailable]);
  
  const handleSwipe = (direction: 'left' | 'right') => {
    const currentIndex = pages.indexOf(currentPage);
    
    if (direction === 'left' && currentIndex < pages.length - 1) {
      const nextPage = pages[currentIndex + 1];
      animateToPage(nextPage, currentIndex + 1);
    } else if (direction === 'right' && currentIndex > 0) {
      const prevPage = pages[currentIndex - 1];
      animateToPage(prevPage, currentIndex - 1);
    }
  };

  const animateToPage = (page: PageType, index: number) => {
    setCurrentPage(page);
    
    Animated.timing(translateX, {
      toValue: -index * screenWidth,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    const index = pages.indexOf(currentPage);
    Animated.timing(translateX, {
      toValue: -index * screenWidth,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [currentPage, screenWidth]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const isHorizontalSwipe = Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 5;
        return isHorizontalSwipe;
      },
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        const isHorizontalSwipe = Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
        return isHorizontalSwipe;
      },
      onPanResponderGrant: () => {},
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: () => {},
      onPanResponderRelease: (evt, gestureState) => {
        const { dx, dy, vx } = gestureState;
        
        const isHorizontal = Math.abs(dx) > Math.abs(dy);
        const hasMinDistance = Math.abs(dx) > 40;
        const hasMinVelocity = Math.abs(vx) > 0.3;
        
        if (isHorizontal && (hasMinDistance || hasMinVelocity)) {
          if (dx < 0) {
            handleSwipe('left');
          } else {
            handleSwipe('right');
          }
        } else {
          const currentIndex = pages.indexOf(currentPage);
          Animated.timing(translateX, {
            toValue: -currentIndex * screenWidth,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        const currentIndex = pages.indexOf(currentPage);
        Animated.timing(translateX, {
          toValue: -currentIndex * screenWidth,
          duration: 200,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  const startWalk = async () => {
    setSteps(0);
    walkStartTimeRef.current = new Date();
    
    if (isPedometerAvailable) {
      try {
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
      setIsWalking(true);
    }
  };

  const stopWalk = () => {
    setIsWalking(false);
    
    if (steps > 0) {
      const today = new Date().toISOString().split('T')[0];
      
      const existingRecordIndex = walkHistory.findIndex(record => record.date === today);
      
      if (existingRecordIndex >= 0) {
        const updatedHistory = [...walkHistory];
        updatedHistory[existingRecordIndex] = {
          date: today,
          steps: updatedHistory[existingRecordIndex].steps + steps,
        };
        setWalkHistory(updatedHistory);
      } else {
        const newRecord: StepRecord = {
          date: today,
          steps: steps,
        };
        setWalkHistory([newRecord, ...walkHistory]);
      }
      
      setCompletedSteps(steps);
      setShowCompletionModal(true);
    }
    
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

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const accentColor = theme === 'bo' ? '#ff4400' : '#fff';

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <StatusBar style="light" />
      
      <Animated.View
        style={[
          styles.carouselContainer,
          {
            width: screenWidth * pages.length,
            transform: [{ translateX }],
          },
        ]}
      >
        {/* SCREEN 0: HOME */}
        <View style={[styles.screen, { width: screenWidth }]} pointerEvents="box-none">
          <View style={styles.homeContent}>
            <CircularProgress 
              current={goal - steps} 
              goal={goal} 
              isCountdown 
              theme={theme}
            />
            {!isWalking ? (
              <TouchableOpacity 
                onPress={startWalk}
                style={[styles.button, { backgroundColor: accentColor }]}
              >
                <Text style={[styles.buttonText, { color: theme === 'bo' ? '#fff' : '#1a1a1a' }]}>
                  START WALK
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.walkingContainer}>
                <Text style={[styles.walkingText, { color: accentColor }]}>WALKING</Text>
                <TouchableOpacity 
                  onPress={stopWalk}
                  style={[styles.button, { backgroundColor: accentColor }]}
                >
                  <Text style={[styles.buttonText, { color: theme === 'bo' ? '#fff' : '#1a1a1a' }]}>
                    STOP
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* SCREEN 1: MAP */}
        <View style={[styles.screen, { width: screenWidth }]} pointerEvents="box-none">
          <MapView theme={theme} />
        </View>

        {/* SCREEN 2: SOCIAL */}
        <View style={[styles.screen, { width: screenWidth }]} pointerEvents="box-none">
          <SocialView theme={theme} />
        </View>

        {/* SCREEN 3: PROFILE */}
        <View style={[styles.screen, { width: screenWidth }]} pointerEvents="box-none">
          <ProfileView 
            walkHistory={walkHistory} 
            goal={goal} 
            onGoalChange={handleGoalChange} 
            theme={theme}
            onThemeChange={setTheme}
          />
        </View>
      </Animated.View>
      
      <BottomNav 
        currentPage={currentPage} 
        onPageChange={(page) => {
          const index = pages.indexOf(page);
          animateToPage(page, index);
        }} 
        theme={theme}
      />

      {showCompletionModal && (
        <WalkCompletionModal 
          steps={completedSteps} 
          goal={goal} 
          onClose={() => setShowCompletionModal(false)} 
          theme={theme}
        />
      )}

      {showFriendInvite && currentPage === 'home' && (
        <FriendInviteModal
          friendName="Marc Lille"
          friendAvatar={require('./src/assets/5e57bdbeef9424b6821c727c30e788b8e31d6a71.png')}
          onAccept={handleAcceptWalk}
          onDecline={handleDeclineWalk}
          theme={theme}
        />
      )}

      {showFriendFinding && (
        <FriendFindingView 
          friendName="Marc Lille"
          friendAvatar={require('./src/assets/5e57bdbeef9424b6821c727c30e788b8e31d6a71.png')}
          onClose={handleCloseFriendFinding} 
          theme={theme}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    overflow: 'hidden',
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
  carouselContainer: {
    flexDirection: 'row',
    height: '100%',
  },
  screen: {
    flex: 1,
  },
  homeContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 100,
  },
  buttonText: {
    fontFamily: 'JetBrainsMono_600SemiBold',
    fontSize: 14,
    letterSpacing: 1,
  },
  walkingContainer: {
    alignItems: 'center',
    gap: 16,
  },
  walkingText: {
    fontSize: 14,
    fontFamily: 'JetBrainsMono_400Regular',
    letterSpacing: 2,
  },
});

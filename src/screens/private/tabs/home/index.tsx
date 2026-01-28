import { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Alert,
  Platform,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { Pedometer } from 'expo-sensors';
import CircularProgress from '../../../../components-web/components/circular-progress-native';
import MapView from 'react-native-maps';
import ProfileView from '../../../../components-web/components/profile-view-native';
import BottomNav from '../../../../components-web/components/bottom-nav-native';

type PageType = 'home' | 'map' | 'stats';

interface StepRecord {
  date: string;
  steps: number;
}

const goal = 10000;

export default function HomeScreen() {
  const { width: screenWidth } = useWindowDimensions();

  const [steps, setSteps] = useState(0);
  const [isWalking, setIsWalking] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  const [stepHistory, setStepHistory] = useState<StepRecord[]>([]);

  const currentPageRef = useRef(currentPage);
  const walkStartTimeRef = useRef<Date | null>(null);

  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  const pages: PageType[] = ['home', 'map', 'stats'];

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

  useEffect(() => {
    if (!isWalking) return;

    let subscription: { remove: () => void } | null = null;
    let initialStepCount = 0;
    let hasInitialValue = false;

    const startTracking = async () => {
      if (isPedometerAvailable) {
        try {
          subscription = Pedometer.watchStepCount((result) => {
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
        setSteps((prev) => {
          if (prev >= goal) {
            setIsWalking(false);
            return prev;
          }
          return prev + Math.floor(Math.random() * 3) + 1;
        });
      }, 100);

      subscription = {
        remove: () => clearInterval(intervalId),
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
        const isHorizontalSwipe =
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 5;
        return isHorizontalSwipe;
      },
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        const isHorizontalSwipe =
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
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

      const existingRecordIndex = stepHistory.findIndex((record) => record.date === today);

      if (existingRecordIndex >= 0) {
        const updatedHistory = [...stepHistory];
        updatedHistory[existingRecordIndex] = {
          date: today,
          steps: updatedHistory[existingRecordIndex].steps + steps,
        };
        setStepHistory(updatedHistory);
      } else {
        const newRecord: StepRecord = {
          date: today,
          steps: steps,
        };
        setStepHistory([newRecord, ...stepHistory]);
      }

      Alert.alert(
        'Walk Saved!',
        `${steps.toLocaleString()} steps have been saved to your activity history.`,
        [{ text: 'OK' }]
      );
    }

    setSteps(0);
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Animated.View
        style={[
          styles.carouselContainer,
          {
            width: screenWidth * pages.length,
            transform: [{ translateX }],
          },
        ]}
      >
        <View style={[styles.screen, { width: screenWidth }]} pointerEvents="box-none">
          <CircularProgress
            current={steps}
            goal={goal}
            isWalking={isWalking}
            onStartWalk={startWalk}
            onStopWalk={stopWalk}
          />
        </View>

        <View style={[styles.screen, { width: screenWidth }]} pointerEvents="box-none">
          <MapView />
        </View>

        <View style={[styles.screen, { width: screenWidth }]} pointerEvents="box-none">
          <ProfileView stepHistory={stepHistory} dailyGoal={goal} />
        </View>
      </Animated.View>

      <BottomNav
        currentPage={currentPage}
        onPageChange={(page) => {
          const index = pages.indexOf(page);
          animateToPage(page, index);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    overflow: 'hidden',
  },
  carouselContainer: {
    flexDirection: 'row',
    height: '100%',
  },
  screen: {
    flex: 1,
  },
});

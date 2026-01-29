import { Pedometer } from 'expo-sensors';
import { Alert, Platform } from 'react-native';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useStepHistoryStore } from '../../../stores/step-history';

export const usePedometer = () => {
  // #region members
  const baselineRef = useRef<number | null>(null);
  const lastStepsRef = useRef(0);
  // #endregion
  // #region states
  const [isAvailable, setIsAvailable] = useState(false);
  const steps = useStepHistoryStore((s) => s.currentSteps);
  const goal = useStepHistoryStore((s) => s.goal);
  const isWalking = useStepHistoryStore((s) => s.isWalking);
  // #endregion
  // #region hooks
  const storeStart = useStepHistoryStore((s) => s.start);
  const storeStop = useStepHistoryStore((s) => s.stop);
  const incrementSteps = useStepHistoryStore((s) => s.incrementSteps);
  // #endregion
  // #region callbacks
  const start = useCallback(async () => {
    if (Platform.OS === 'ios') {
      const { status } = await Pedometer.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Enable step tracking in Settings');
        return;
      }
    }
    storeStart();
  }, [storeStart]);

  const stop = useCallback(() => {
    storeStop();
  }, [storeStop]);
  // #endregion
  // #region effects
  useEffect(() => {
    Pedometer.isAvailableAsync().then((available) => {
      setIsAvailable(available);
    });
  }, []);

  useEffect(() => {
    if (!isWalking) return;

    baselineRef.current = null;
    lastStepsRef.current = 0;

    // Simulation when pedometer not available
    if (!isAvailable) {
      const id = setInterval(() => {
        const currentSteps = useStepHistoryStore.getState().currentSteps;
        if (currentSteps < goal) {
          incrementSteps(1);
        }
      }, 1000);
      return () => clearInterval(id);
    }

    // Real pedometer
    const sub = Pedometer.watchStepCount(({ steps: total }) => {
      if (baselineRef.current === null) {
        baselineRef.current = total;
        lastStepsRef.current = 0;
        return;
      }
      const walked = total - baselineRef.current;
      const delta = walked - lastStepsRef.current;
      if (delta > 0) {
        const currentSteps = useStepHistoryStore.getState().currentSteps;
        const toAdd = Math.min(delta, goal - currentSteps);
        if (toAdd > 0) {
          incrementSteps(toAdd);
          lastStepsRef.current = walked;
        }
      }
    });

    return () => {
      sub.remove();
    };
  }, [isWalking, isAvailable, incrementSteps, goal]);
  // #endregion

  return { steps, goal, isWalking, isAvailable, start, stop };
};

import { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { TreePine, X } from 'lucide-react-native';
import DissolveCircularProgress from './dissolve-circular-progress-native';
import { TextReveal } from './text-reveal-native';

interface WalkCompletionModalProps {
  steps: number;
  goal: number;
  onClose: () => void;
  theme?: 'bw' | 'bo';
}

export default function WalkCompletionModal({ steps, goal, onClose, theme = 'bw' }: WalkCompletionModalProps) {
  const [showProgress, setShowProgress] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [currentStat, setCurrentStat] = useState(0);
  
  const stat1Opacity = useRef(new Animated.Value(0)).current;
  const stat2Opacity = useRef(new Animated.Value(0)).current;
  const stat3Opacity = useRef(new Animated.Value(0)).current;

  // Calculate stats
  const distanceKm = (steps * 0.762) / 1000;
  const co2SavedKg = (distanceKm * 0.12).toFixed(2);
  const treesSaved = Math.round(parseFloat(co2SavedKg) / 0.021);

  // Distance comparisons
  const getDistanceComparison = () => {
    const comparisons = [
      { name: 'Central Park', km: 9.5 },
      { name: 'the Eiffel Tower height', km: 0.324 },
      { name: 'Brooklyn Bridge', km: 1.8 },
      { name: 'Golden Gate Bridge', km: 2.7 },
      { name: 'Times Square to Empire State', km: 1.3 },
      { name: 'the Statue of Liberty height', km: 0.093 },
    ];

    const suitable = comparisons.filter(c => distanceKm >= c.km * 0.5);
    if (suitable.length === 0) return comparisons[comparisons.length - 1];
    
    const closest = suitable.reduce((prev, curr) => 
      Math.abs(curr.km - distanceKm) < Math.abs(prev.km - distanceKm) ? curr : prev
    );
    
    const ratio = (distanceKm / closest.km).toFixed(1);
    return { ...closest, ratio: parseFloat(ratio) };
  };

  const comparison = getDistanceComparison();

  const handleDissolveComplete = () => {
    setShowProgress(false);
    setShowStats(true);
  };

  // Sequential reveal of stats
  useEffect(() => {
    if (!showStats) return;
    
    const timers = [
      setTimeout(() => {
        setCurrentStat(1);
        Animated.timing(stat1Opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }, 100),
      setTimeout(() => {
        setCurrentStat(2);
        Animated.timing(stat2Opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }, 600),
      setTimeout(() => {
        setCurrentStat(3);
        Animated.timing(stat3Opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }, 1100),
    ];

    return () => timers.forEach(clearTimeout);
  }, [showStats]);

  const accentColor = theme === 'bo' ? '#ff4400' : '#ffffff';

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <BlurView intensity={48} style={styles.overlay} tint="dark">
        <View style={styles.overlayBackground}>
          {/* Close button */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={32} color={accentColor} strokeWidth={1.5} />
          </TouchableOpacity>

          {/* Content */}
          <View style={styles.content}>
          {/* Dissolving circular progress */}
          {showProgress && (
            <DissolveCircularProgress
              current={goal - steps}
              goal={goal}
              onComplete={handleDissolveComplete}
              theme={theme}
            />
          )}

          {/* Text reveals */}
          {showStats && (
            <View style={styles.statsContainer}>
              {/* Main number */}
              {currentStat >= 1 && (
                <Animated.View style={[styles.mainStat, { opacity: stat1Opacity }]}>
                  <Text style={styles.mainNumber}>
                    {steps.toLocaleString('en-US').replace(/,/g, '.')}
                  </Text>
                  <Text style={styles.mainLabel}>STEPS</Text>
                </Animated.View>
              )}

              {/* Distance comparison */}
              {currentStat >= 2 && (
                <Animated.View style={[styles.statRow, { opacity: stat2Opacity }]}>
                  <Text style={styles.statEmoji}>☉</Text>
                  <Text style={[styles.statText, { color: 'rgba(255, 255, 255, 0.9)' }]}>
                    {`Today you walked ${
                      comparison.ratio === 1 
                        ? `the length of ${comparison.name}`
                        : comparison.ratio > 1
                        ? `${comparison.ratio}x ${comparison.name}`
                        : `${(comparison.ratio * 100).toFixed(0)}% of ${comparison.name}`
                    }`}
                  </Text>
                </Animated.View>
              )}

              {/* Environmental impact */}
              {currentStat >= 3 && (
                <Animated.View style={[styles.statRow, { opacity: stat3Opacity }]}>
                  <View style={styles.iconContainer}>
                    <TreePine size={20} color="#4ade80" strokeWidth={1.5} />
                  </View>
                  <View style={styles.statTextContainer}>
                    <Text style={[styles.statText, { color: 'rgba(255, 255, 255, 0.9)' }]}>
                      You saved {co2SavedKg} kg CO₂
                    </Text>
                    <Text style={[styles.statText, { color: 'rgba(255, 255, 255, 0.5)', fontSize: 14, marginTop: 4 }]}>
                      Equal to {treesSaved} tree{treesSaved !== 1 ? 's' : ''} working for a day
                    </Text>
                  </View>
                </Animated.View>
              )}
            </View>
          )}
        </View>
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  overlayBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 32,
    right: 32,
    zIndex: 20,
  },
  content: {
    width: '100%',
    maxWidth: 393,
    alignItems: 'center',
    padding: 48,
  },
  statsContainer: {
    width: '100%',
    gap: 32,
  },
  mainStat: {
    alignItems: 'center',
  },
  mainNumber: {
    fontSize: 60,
    color: '#ffffff',
    fontFamily: 'Archivo_400Regular',
    fontWeight: '200',
    includeFontPadding: false,
  },
  mainLabel: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: 'JetBrainsMono_400Regular',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 8,
    includeFontPadding: false,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 16,
  },
  statEmoji: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: 2,
    width: 24,
  },
  iconContainer: {
    width: 24,
    alignItems: 'center',
    marginTop: 2,
  },
  statText: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'DMMono_400Regular',
    lineHeight: 26,
    includeFontPadding: false,
    flexWrap: 'wrap',
  },
  statTextContainer: {
    flex: 1,
  },
});

import { useState, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, PanResponder, Animated } from 'react-native';
import { X } from 'lucide-react-native';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialGoal: number;
  onGoalChange: (goal: number) => void;
  theme: 'bw' | 'bo';
  onThemeChange: (theme: 'bw' | 'bo') => void;
}

export default function ProfileModal({
  isOpen,
  onClose,
  initialGoal,
  onGoalChange,
  theme,
  onThemeChange
}: ProfileModalProps) {
  const [goal, setGoal] = useState(initialGoal);
  const [isDragging, setIsDragging] = useState(false);
  const glowOpacity = useRef(new Animated.Value(0)).current;

  if (!isOpen) return null;

  const totalBars = 23;
  const maxGoal = 10000;
  const filledBars = Math.round((goal / maxGoal) * totalBars);

  const accentColor = theme === 'bo' ? '#ff4400' : '#ffffff';

  // Pan responder for slider
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDragging(true);
        Animated.timing(glowOpacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: false,
        }).start();
      },
      onPanResponderMove: (evt, gestureState) => {
        const { locationX } = evt.nativeEvent;
        const sliderWidth = 345; // Approximate width
        const percentage = Math.max(0, Math.min(1, locationX / sliderWidth));
        const newGoal = Math.round(percentage * maxGoal);
        setGoal(newGoal);
        onGoalChange(newGoal);
      },
      onPanResponderRelease: () => {
        setIsDragging(false);
        Animated.timing(glowOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <Animated.View
            style={[
              styles.modal,
            ]}
          >
          <View style={styles.modalBorder} />
          
          {/* Glow container with radial gradient */}
          {isDragging && (
            <Animated.View
              style={[
                styles.glowContainer,
                {
                  opacity: glowOpacity,
                },
              ]}
              pointerEvents="none"
            >
              <View
                style={[
                  styles.radialGlow,
                  {
                    backgroundColor: theme === 'bo' ? 'rgba(255, 68, 0, 0.1)' : 'rgba(255, 255, 255, 0.06)',
                  },
                ]}
              />
            </Animated.View>
          )}

          {/* Handle */}
          <View style={styles.handle} />

          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.profilePicture}>
              <Image
                source={require('../assets/5e57bdbeef9424b6821c727c30e788b8e31d6a71.png')}
                style={styles.profileImage}
              />
              <View style={styles.profileBorder} />
            </View>

            <Text style={styles.name}>Steve McQueen</Text>
            <View style={styles.walksRow}>
              <Text style={styles.walksText}>7 walks</Text>
              <Text style={styles.walksIcon}>⏰</Text>
            </View>
          </View>

          {/* Goal Setting Section */}
          <View style={styles.goalSection}>
            <Text style={styles.sectionTitle}>SET YOUR GOAL</Text>

            <View style={styles.goalContent}>
              <View style={styles.stepsRow}>
                <Text style={styles.stepsLabel}>Steps</Text>
                <Text style={styles.stepsValue}>{goal}</Text>
              </View>

              {/* Bar visualization with glow */}
              <View
                style={styles.sliderContainer}
                {...panResponder.panHandlers}
              >
                {isDragging && (
                  <Animated.View
                    style={[
                      styles.sliderGlow,
                      {
                        left: (filledBars * 13) - 20,
                        opacity: glowOpacity,
                      },
                    ]}
                  />
                )}
                {Array.from({ length: totalBars }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.bar,
                      {
                        backgroundColor: i < filledBars ? accentColor : '#333333',
                      },
                      isDragging &&
                        i < filledBars &&
                        i >= filledBars - 3 && {
                          shadowColor: accentColor,
                          shadowOffset: { width: 0, height: 0 },
                          shadowOpacity: 0.8,
                          shadowRadius: 10,
                          elevation: 10,
                        },
                    ]}
                  />
                ))}
              </View>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Theme Toggle */}
          <View style={styles.themeSection}>
            <Text style={styles.themeLabel}>App Theme</Text>

            <View style={styles.themeToggle}>
              <TouchableOpacity
                style={[
                  styles.themeOption,
                  theme === 'bw' && styles.themeOptionActive,
                ]}
                onPress={() => onThemeChange('bw')}
              >
                <View style={styles.themePreview}>
                  <View style={[styles.themeCircle, { backgroundColor: '#ffffff' }]} />
                  <View style={[styles.themeCircle, { backgroundColor: '#1a1a1a' }]} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.themeOption,
                  theme === 'bo' && styles.themeOptionActive,
                ]}
                onPress={() => onThemeChange('bo')}
              >
                <View style={styles.themePreview}>
                  <View style={[styles.themeCircle, { backgroundColor: '#ff4400' }]} />
                  <View style={[styles.themeCircle, { backgroundColor: '#1a1a1a' }]} />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Close Button */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={accentColor} strokeWidth={1.5} />
          </TouchableOpacity>
        </Animated.View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  modal: {
    backgroundColor: '#111111',
    borderRadius: 32,
    paddingTop: 12,
    paddingBottom: 24,
    paddingHorizontal: 24,
    maxWidth: 393,
    width: '100%',
    alignSelf: 'center',
    position: 'relative',
  },
  modalBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#1a1a1a',
    pointerEvents: 'none',
  },
  handle: {
    width: 70,
    height: 5,
    backgroundColor: '#ffffff',
    borderRadius: 100,
    alignSelf: 'center',
    marginBottom: 48,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  profilePicture: {
    width: 88,
    height: 88,
    borderRadius: 24,
    marginBottom: 16,
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  profileBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: 'rgba(136, 136, 136, 0.8)',
  },
  name: {
    fontSize: 14,
    color: '#ffffff',
    fontFamily: 'DMMono_400Regular',
    marginBottom: 4,
    includeFontPadding: false,
  },
  walksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  walksText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.75)',
    fontFamily: 'DMMono_400Regular',
    includeFontPadding: false,
  },
  walksIcon: {
    fontSize: 16,
  },
  goalSection: {
    marginBottom: 48,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#bbbbbb',
    fontFamily: 'DMMono_400Regular',
    marginBottom: 16,
    includeFontPadding: false,
  },
  goalContent: {
    gap: 16,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepsLabel: {
    fontSize: 14,
    color: '#bbbbbb',
    fontFamily: 'DMMono_400Regular',
    includeFontPadding: false,
  },
  stepsValue: {
    fontSize: 14,
    color: '#bbbbbb',
    fontFamily: 'DMMono_400Regular',
    includeFontPadding: false,
  },
  sliderContainer: {
    flexDirection: 'row',
    gap: 9,
    justifyContent: 'center',
    alignItems: 'center',
    height: 32,
    position: 'relative',
  },
  sliderGlow: {
    position: 'absolute',
    width: 40,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    zIndex: -1,
  },
  bar: {
    width: 4,
    height: 32,
    borderRadius: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#333333',
    marginBottom: 48,
  },
  themeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  themeLabel: {
    fontSize: 14,
    color: '#bbbbbb',
    fontFamily: 'DMMono_400Regular',
    includeFontPadding: false,
  },
  themeToggle: {
    flexDirection: 'row',
    gap: 8,
  },
  themeOption: {
    padding: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  themeOptionActive: {
    borderColor: '#ffffff',
  },
  themePreview: {
    flexDirection: 'row',
    gap: 4,
  },
  themeCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 24,
    right: 24,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 32,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  radialGlow: {
    position: 'absolute',
    width: 600,
    height: 300,
    borderRadius: 300,
    top: '50%',
    left: '50%',
    transform: [{ translateX: -300 }, { translateY: -150 }],
    shadowColor: theme === 'bo' ? 'rgba(255, 68, 0, 0.08)' : 'rgba(255, 255, 255, 0.04)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 40,
  },
});

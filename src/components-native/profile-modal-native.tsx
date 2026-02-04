import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, PanResponder, Animated, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, CheckCircle2 } from 'lucide-react-native';

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
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const modalTranslateY = useRef(new Animated.Value(300)).current;
  const containerRef = useRef<View>(null);

  // Sequential entry animation
  useEffect(() => {
    if (isOpen) {
      Animated.sequence([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(modalTranslateY, {
          toValue: 0,
          tension: 80,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset when closed
      overlayOpacity.setValue(0);
      modalTranslateY.setValue(300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalBars = 25;
  const maxGoal = 10000;
  const filledBars = Math.round((goal / maxGoal) * totalBars);

  const accentColor = theme === 'bo' ? '#ff4400' : '#ffffff';

  // Pan responder for slider
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        setIsDragging(true);
        updateGoalAndGlow(evt);
        Animated.timing(glowOpacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: false,
        }).start();
      },
      onPanResponderMove: (evt) => {
        updateGoalAndGlow(evt);
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

  const updateGoalAndGlow = (evt: any) => {
    const { locationX, pageX, pageY } = evt.nativeEvent;
    const sliderWidth = 345; // Approximate width
    const percentage = Math.max(0, Math.min(1, locationX / sliderWidth));
    const newGoal = Math.round(percentage * maxGoal);
    setGoal(newGoal);
    onGoalChange(newGoal);

    // Update glow position (percentage-based for container)
    containerRef.current?.measure((x, y, width, height, pageXContainer, pageYContainer) => {
      const glowX = ((pageX - pageXContainer) / width) * 100;
      const glowY = ((pageY - pageYContainer) / height) * 100;
      setGlowPosition({ x: glowX, y: glowY });
    });
  };

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              opacity: overlayOpacity,
            },
          ]}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={onClose}
          />
        </Animated.View>
        
        <Animated.View
          style={[
            styles.modal,
            {
              transform: [{ translateY: modalTranslateY }],
            },
          ]}
        >
          <View style={styles.modalBorder} />

          {/* Handle */}
          <View
            ref={containerRef}
            style={[
              styles.contentContainer,
              isDragging && styles.contentGlow,
            ]}
          >
            {/* Animated radial glow effect - simulated with concentric circles */}
            {isDragging && (
              <Animated.View
                style={[
                  styles.glowOverlay,
                  {
                    opacity: glowOpacity,
                  },
                ]}
                pointerEvents="none"
              >
                {/* Outer glow (transparent at 50%) */}
                <View
                  style={[
                    styles.glowEllipse,
                    {
                      left: `${glowPosition.x}%`,
                      top: `${glowPosition.y}%`,
                      width: 600,
                      height: 300,
                      backgroundColor: 'transparent',
                    },
                  ]}
                >
                  {/* Middle glow (4% opacity at 25%) */}
                  <View
                    style={[
                      styles.glowEllipseInner,
                      {
                        width: 300,
                        height: 150,
                        backgroundColor: theme === 'bo' ? 'rgba(255, 68, 0, 0.04)' : 'rgba(255, 255, 255, 0.02)',
                      },
                    ]}
                  >
                    {/* Inner glow (10% opacity at 0%) */}
                    <View
                      style={[
                        styles.glowEllipseCenter,
                        {
                          width: 150,
                          height: 75,
                          backgroundColor: theme === 'bo' ? 'rgba(255, 68, 0, 0.1)' : 'rgba(255, 255, 255, 0.06)',
                        },
                      ]}
                    />
                  </View>
                </View>
              </Animated.View>
            )}

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

            <View style={styles.nameWalksSection}>
              <Text style={styles.name}>Steve McQueen</Text>
              <View style={styles.walksRow}>
                <Text style={styles.walksText}>7 walks</Text>
                <CheckCircle2 size={22} color="#ffffff" strokeWidth={1.5} />
              </View>
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
                  styles.themeButton,
                  theme === 'bw' && styles.themeButtonActive,
                ]}
                onPress={() => onThemeChange('bw')}
              >
                <View style={styles.themeButtonInner}>
                  <View style={[styles.themeDot, { backgroundColor: '#ffffff' }]} />
                  <Text style={[styles.themeButtonText, theme === 'bw' && styles.themeButtonTextActive]}>
                    B&W
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.themeButton,
                  theme === 'bo' && styles.themeButtonActive,
                ]}
                onPress={() => onThemeChange('bo')}
              >
                <View style={styles.themeButtonInner}>
                  <View style={[styles.themeDot, { backgroundColor: '#ff4400' }]} />
                  <Text style={[styles.themeButtonText, theme === 'bo' && styles.themeButtonTextActive]}>
                    B&O
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Close Button */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={accentColor} strokeWidth={1.5} />
          </TouchableOpacity>
        </View>
      </Animated.View>
      </View>
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
    gap: 16,
    marginBottom: 48,
  },
  profilePicture: {
    width: 88,
    height: 88,
    borderRadius: 24,
    position: 'relative',
  },
  nameWalksSection: {
    gap: 4,
    alignItems: 'center',
    width: '100%',
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
    textAlign: 'center',
    width: '100%',
    includeFontPadding: false,
  },
  walksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
  },
  walksText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.75)',
    fontFamily: 'DMMono_400Regular',
    textAlign: 'center',
    includeFontPadding: false,
  },
  goalSection: {
    marginBottom: 48,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#bbbbbb',
    fontFamily: 'DMMono_400Regular',
    includeFontPadding: false,
  },
  goalContent: {
    gap: 16,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
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
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 32,
    width: '100%',
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
    gap: 2,
    backgroundColor: '#111111',
    borderRadius: 10,
    padding: 2,
    borderWidth: 1,
    borderColor: '#333333',
  },
  themeButton: {
    width: 80,
    height: 32,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeButtonActive: {
    backgroundColor: '#2a2a2a',
  },
  themeButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  themeDot: {
    width: 16,
    height: 10,
    borderRadius: 5,
  },
  themeButtonText: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'DMMono_400Regular',
    includeFontPadding: false,
  },
  themeButtonTextActive: {
    color: '#ffffff',
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
  contentContainer: {
  },
  contentGlow: {
    shadowColor: 'rgba(255, 255, 255, 0.04)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 40,
  },
  glowOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 32,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  glowEllipse: {
    position: 'absolute',
    borderRadius: 300,
    transform: [{ translateX: -300 }, { translateY: -150 }],
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowEllipseInner: {
    borderRadius: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowEllipseCenter: {
    borderRadius: 75,
  },
});

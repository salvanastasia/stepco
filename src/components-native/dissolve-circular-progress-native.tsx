import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface DissolveCircularProgressProps {
  current: number;
  goal: number;
  onComplete: () => void;
  theme?: 'bw' | 'bo';
}

interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  distance: number;
  size: number;
  delay: number;
  opacity: number;
  animValue: Animated.Value;
}

export default function DissolveCircularProgress({ current, goal, onComplete, theme = 'bw' }: DissolveCircularProgressProps) {
  const [digitStates, setDigitStates] = useState<('visible' | 'dissolving' | 'deleted')[]>([]);
  const [stepsTextState, setStepsTextState] = useState<'visible' | 'dissolving' | 'deleted'>('visible');
  const [particles, setParticles] = useState<{ [key: number]: Particle[] }>({});
  const [stepsParticles, setStepsParticles] = useState<Particle[]>([]);
  
  const digitOpacities = useRef<Animated.Value[]>([]).current;
  const stepsOpacity = useRef(new Animated.Value(1)).current;
  
  const steps = goal - current;
  const stepsStr = steps.toLocaleString('en-US').replace(/,/g, '.');
  const digits = stepsStr.split('');
  
  const accentColor = theme === 'bo' ? '#ff4400' : '#ffffff';

  useEffect(() => {
    // Initialize digit opacities
    digitOpacities.length = 0;
    digits.forEach(() => digitOpacities.push(new Animated.Value(1)));
    
    // Initialize all digits as visible
    setDigitStates(Array(digits.length).fill('visible'));
    
    // Generate particles for each digit
    const allParticles: { [key: number]: Particle[] } = {};
    
    digits.forEach((digit, digitIndex) => {
      const isDot = digit === '.';
      const numParticles = isDot ? 18 : 55;
      const digitParticles: Particle[] = [];
      
      const digitWidth = isDot ? 10 : 35;
      const digitHeight = isDot ? 10 : 50;
      
      for (let i = 0; i < numParticles; i++) {
        const gridX = (i % 7) / 6;
        const gridY = Math.floor(i / 7) / Math.ceil(numParticles / 7);
        
        const randomOffsetX = (Math.random() - 0.5) * 0.2;
        const randomOffsetY = (Math.random() - 0.5) * 0.2;
        
        const startX = ((gridX + randomOffsetX) - 0.5) * digitWidth;
        const startY = ((gridY + randomOffsetY) - 0.5) * digitHeight;
        
        const angle = -Math.PI / 4 + (Math.random() - 0.5) * 0.5;
        const distance = Math.random() * 90 + 60;
        
        digitParticles.push({
          id: i,
          x: startX,
          y: startY,
          angle,
          distance,
          size: Math.random() * 1.8 + 0.8,
          delay: Math.random() * 300,
          opacity: Math.random() * 0.4 + 0.2,
          animValue: new Animated.Value(0),
        });
      }
      
      allParticles[digitIndex] = digitParticles;
    });
    
    setParticles(allParticles);
    
    // Generate particles for "steps" text
    const stepsNumParticles = 45;
    const stepsTextParticles: Particle[] = [];
    const stepsWidth = 60;
    const stepsHeight = 20;
    
    for (let i = 0; i < stepsNumParticles; i++) {
      const gridX = (i % 8) / 7;
      const gridY = Math.floor(i / 8) / Math.ceil(stepsNumParticles / 8);
      
      const randomOffsetX = (Math.random() - 0.5) * 0.2;
      const randomOffsetY = (Math.random() - 0.5) * 0.2;
      
      const startX = ((gridX + randomOffsetX) - 0.5) * stepsWidth;
      const startY = ((gridY + randomOffsetY) - 0.5) * stepsHeight;
      
      const angle = -Math.PI / 4 + (Math.random() - 0.5) * 0.5;
      const distance = Math.random() * 80 + 50;
      
      stepsTextParticles.push({
        id: i,
        x: startX,
        y: startY,
        angle,
        distance,
        size: Math.random() * 1.5 + 0.6,
        delay: Math.random() * 250,
        opacity: Math.random() * 0.4 + 0.2,
        animValue: new Animated.Value(0),
      });
    }
    
    setStepsParticles(stepsTextParticles);
    
    // Wait 1 second before starting to crumble
    const initialDelay = 1000;
    
    // Sequentially dissolve each digit from left to right
    digits.forEach((_, digitIndex) => {
      const baseDelay = initialDelay + (digitIndex * 250);
      
      setTimeout(() => {
        setDigitStates(prev => {
          const newStates = [...prev];
          newStates[digitIndex] = 'dissolving';
          return newStates;
        });
        
        // Fade out digit
        Animated.timing(digitOpacities[digitIndex], {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
        
        // Animate particles
        allParticles[digitIndex]?.forEach(particle => {
          Animated.timing(particle.animValue, {
            toValue: 1,
            duration: 1000,
            delay: particle.delay,
            useNativeDriver: true,
          }).start();
        });
        
        setTimeout(() => {
          setDigitStates(prev => {
            const newStates = [...prev];
            newStates[digitIndex] = 'deleted';
            return newStates;
          });
        }, 900);
      }, baseDelay);
    });
    
    // Dissolve "steps" text after all digits
    const stepsDelay = initialDelay + (digits.length * 250) + 200;
    setTimeout(() => {
      setStepsTextState('dissolving');
      
      Animated.timing(stepsOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      
      stepsTextParticles.forEach(particle => {
        Animated.timing(particle.animValue, {
          toValue: 1,
          duration: 900,
          delay: particle.delay,
          useNativeDriver: true,
        }).start();
      });
      
      setTimeout(() => {
        setStepsTextState('deleted');
      }, 900);
    }, stepsDelay);
    
    // Call onComplete after everything has dissolved
    const totalDuration = stepsDelay + 1000;
    setTimeout(() => {
      onComplete();
    }, totalDuration);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Step count digits */}
        <View style={styles.digitsContainer}>
          {digits.map((digit, index) => {
            const isDot = digit === '.';
            const state = digitStates[index] || 'visible';
            
            return (
              <View key={index} style={styles.digitWrapper}>
                {/* Original digit */}
                <Animated.Text
                  style={[
                    styles.digit,
                    isDot && styles.dot,
                    {
                      color: accentColor,
                      opacity: digitOpacities[index],
                      transform: [
                        {
                          scale: digitOpacities[index]?.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.9, 1],
                          }) || 1,
                        },
                      ],
                    },
                  ]}
                >
                  {digit}
                </Animated.Text>
                
                {/* Particles for this digit */}
                {state === 'dissolving' && particles[index]?.map(particle => {
                  const endX = particle.x + Math.cos(particle.angle) * particle.distance;
                  const endY = particle.y + Math.sin(particle.angle) * particle.distance;
                  
                  return (
                    <Animated.View
                      key={particle.id}
                      style={[
                        styles.particle,
                        {
                          width: particle.size,
                          height: particle.size,
                          backgroundColor: accentColor,
                          left: '50%',
                          top: '50%',
                          marginLeft: particle.x,
                          marginTop: particle.y,
                          opacity: particle.animValue.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: [particle.opacity, particle.opacity * 0.7, 0],
                          }),
                          transform: [
                            {
                              translateX: particle.animValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, endX],
                              }),
                            },
                            {
                              translateY: particle.animValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, endY],
                              }),
                            },
                            {
                              scale: particle.animValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 0.2],
                              }),
                            },
                          ],
                        },
                      ]}
                    />
                  );
                })}
              </View>
            );
          })}
        </View>
        
        {/* "steps" text */}
        <View style={styles.stepsWrapper}>
          <Animated.Text
            style={[
              styles.stepsText,
              {
                color: accentColor,
                opacity: stepsOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.6],
                }),
                transform: [
                  {
                    scale: stepsOpacity.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            steps
          </Animated.Text>
          
          {/* Particles for "steps" text */}
          {stepsTextState === 'dissolving' && stepsParticles.map(particle => {
            const endX = Math.cos(particle.angle) * particle.distance;
            const endY = Math.sin(particle.angle) * particle.distance;
            
            return (
              <Animated.View
                key={particle.id}
                style={[
                  styles.particle,
                  {
                    width: particle.size,
                    height: particle.size,
                    backgroundColor: accentColor,
                    left: '50%',
                    top: '50%',
                    marginLeft: particle.x,
                    marginTop: particle.y,
                    opacity: particle.animValue.interpolate({
                      inputRange: [0, 0.3, 1],
                      outputRange: [particle.opacity, particle.opacity * 0.8, 0],
                    }),
                    transform: [
                      {
                        translateX: particle.animValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, endX],
                        }),
                      },
                      {
                        translateY: particle.animValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, endY],
                        }),
                      },
                      {
                        scale: particle.animValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 0.2],
                        }),
                      },
                    ],
                  },
                ]}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 320,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  digitsContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  digitWrapper: {
    position: 'relative',
  },
  digit: {
    fontSize: 60,
    fontFamily: 'Archivo_400Regular',
    fontWeight: '300',
    letterSpacing: -1.2,
    includeFontPadding: false,
  },
  dot: {
    fontSize: 48,
  },
  stepsWrapper: {
    position: 'relative',
    marginLeft: 12,
  },
  stepsText: {
    fontFamily: 'JetBrainsMono_400Regular',
    fontWeight: '300',
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 1.6,
    includeFontPadding: false,
  },
  particle: {
    position: 'absolute',
    borderRadius: 100,
  },
});

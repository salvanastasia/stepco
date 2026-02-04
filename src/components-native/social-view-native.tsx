import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import UserProfileModal from './user-profile-modal-native';

interface User {
  id: number;
  name: string;
  avatar: any;
  goal: number;
  distance: number;
  position: { x: number; y: number };
  walks: number;
  isFriend: boolean;
}

interface SocialViewProps {
  theme?: 'bw' | 'bo';
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function SocialView({ theme = 'bw' }: SocialViewProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: 'Marc Lille',
      avatar: require('../assets/5e57bdbeef9424b6821c727c30e788b8e31d6a71.png'),
      goal: 10000,
      distance: 50,
      position: { x: 76, y: 400 },
      walks: 23,
      isFriend: false,
    },
    {
      id: 2,
      name: 'Sarah Chen',
      avatar: require('../assets/fc73edf2dd6ce93f3e7f332bccdb20d6aaecc66f.png'),
      goal: 8000,
      distance: 120,
      position: { x: 61, y: 150 },
      walks: 45,
      isFriend: false,
    },
    {
      id: 3,
      name: 'Alex Rivera',
      avatar: require('../assets/2d62b2f92672bf7733e7c445649e7aa3c6fbf9cd.png'),
      goal: 12000,
      distance: 200,
      position: { x: 250, y: 300 },
      walks: 67,
      isFriend: true,
    },
  ]);

  // Radar pulse animations
  const pulse1Scale = useRef(new Animated.Value(1)).current;
  const pulse2Scale = useRef(new Animated.Value(1)).current;
  const pulse3Scale = useRef(new Animated.Value(1)).current;
  
  const pulse1Opacity = useRef(new Animated.Value(0.7)).current;
  const pulse2Opacity = useRef(new Animated.Value(0.7)).current;
  const pulse3Opacity = useRef(new Animated.Value(0.7)).current;
  
  const centerPulse = useRef(new Animated.Value(1)).current;

  // Circle light-up animations (0 = original, 1 = lit up)
  const circle1Light = useRef(new Animated.Value(0)).current;
  const circle2Light = useRef(new Animated.Value(0)).current;
  const circle3Light = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create continuous radar pulse animations with staggered timing
    const createPulseAnimation = (
      scaleAnim: Animated.Value,
      opacityAnim: Animated.Value,
      delay: number
    ) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.sequence([
              Animated.timing(scaleAnim, {
                toValue: 1.15,
                duration: 2000,
                useNativeDriver: true,
              }),
              Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
              }),
            ]),
            Animated.sequence([
              Animated.timing(opacityAnim, {
                toValue: 0.4,
                duration: 2000,
                useNativeDriver: true,
              }),
              Animated.timing(opacityAnim, {
                toValue: 0.7,
                duration: 2000,
                useNativeDriver: true,
              }),
            ]),
          ]),
        ])
      );
    };

    // Start pulse animations with delays
    createPulseAnimation(pulse1Scale, pulse1Opacity, 0).start();
    createPulseAnimation(pulse2Scale, pulse2Opacity, 666).start();
    createPulseAnimation(pulse3Scale, pulse3Opacity, 1333).start();

    // Center dot pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(centerPulse, {
          toValue: 1.2,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(centerPulse, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Sequential circle light-up animation
    const lightUpDuration = 400;
    const lightDownDuration = 400;
    const pauseBetween = 200;

    Animated.loop(
      Animated.sequence([
        // Light up circle 1 (inner)
        Animated.timing(circle1Light, {
          toValue: 1,
          duration: lightUpDuration,
          useNativeDriver: false,
        }),
        Animated.timing(circle1Light, {
          toValue: 0,
          duration: lightDownDuration,
          useNativeDriver: false,
        }),
        Animated.delay(pauseBetween),
        
        // Light up circle 2 (middle)
        Animated.timing(circle2Light, {
          toValue: 1,
          duration: lightUpDuration,
          useNativeDriver: false,
        }),
        Animated.timing(circle2Light, {
          toValue: 0,
          duration: lightDownDuration,
          useNativeDriver: false,
        }),
        Animated.delay(pauseBetween),
        
        // Light up circle 3 (outer)
        Animated.timing(circle3Light, {
          toValue: 1,
          duration: lightUpDuration,
          useNativeDriver: false,
        }),
        Animated.timing(circle3Light, {
          toValue: 0,
          duration: lightDownDuration,
          useNativeDriver: false,
        }),
        Animated.delay(1000), // Longer pause before loop restarts
      ])
    ).start();
  }, []);

  const handleFriendRequest = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, isFriend: !user.isFriend } : user
    ));
  };

  const accentColor = theme === 'bo' ? '#ff4400' : '#ffffff';

  // Interpolate fill colors for light-up effect
  const circle1Fill = circle1Light.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(26, 26, 26, 0.7)', 'rgba(51, 51, 51, 0.3)'],
  });

  const circle2Fill = circle2Light.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(26, 26, 26, 0.7)', 'rgba(51, 51, 51, 0.3)'],
  });

  const circle3Fill = circle3Light.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(26, 26, 26, 0.7)', 'rgba(51, 51, 51, 0.3)'],
  });

  return (
    <View style={styles.container}>
      {/* Animated radar circles - Outermost */}
      <Animated.View
        style={[
          styles.circleContainer,
          {
            transform: [{ scale: pulse3Scale }],
            opacity: pulse3Opacity,
          },
        ]}
      >
        <Svg width={932} height={932} style={styles.svg}>
          <AnimatedCircle
            cx={466}
            cy={466}
            r={465}
            stroke="#333333"
            strokeWidth={1}
            fill={circle3Fill}
          />
        </Svg>
      </Animated.View>

      {/* Middle circle */}
      <Animated.View
        style={[
          styles.circleContainer,
          {
            transform: [{ scale: pulse2Scale }],
            opacity: pulse2Opacity,
          },
        ]}
      >
        <Svg width={621} height={621} style={styles.svg}>
          <AnimatedCircle
            cx={310.5}
            cy={310.5}
            r={310}
            stroke="#333333"
            strokeWidth={1}
            fill={circle2Fill}
          />
        </Svg>
      </Animated.View>

      {/* Inner circle */}
      <Animated.View
        style={[
          styles.circleContainer,
          {
            transform: [{ scale: pulse1Scale }],
            opacity: pulse1Opacity,
          },
        ]}
      >
        <Svg width={414} height={414} style={styles.svg}>
          <AnimatedCircle
            cx={207}
            cy={207}
            r={206.5}
            stroke="#333333"
            strokeWidth={1}
            fill={circle1Fill}
          />
        </Svg>
      </Animated.View>
      
      {/* Center indicator (you) */}
      <Animated.View
        style={[
          styles.centerDot,
          {
            backgroundColor: accentColor,
            transform: [{ scale: centerPulse }],
          },
        ]}
      />
      
      {/* Glow around center */}
      <Animated.View
        style={[
          styles.centerGlow,
          {
            backgroundColor: theme === 'bo' ? 'rgba(255, 68, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)',
            transform: [{ scale: centerPulse }],
          },
        ]}
      />
      
      {/* User avatars */}
      {users.map((user, index) => (
        <TouchableOpacity
          key={user.id}
          style={[styles.userAvatar, { left: user.position.x, top: user.position.y }]}
          onPress={() => setSelectedUser(user)}
          activeOpacity={0.7}
        >
          <Image source={user.avatar} style={styles.avatarImage} />
          {user.isFriend && <View style={styles.friendBadge} />}
        </TouchableOpacity>
      ))}
      
      {/* Header text */}
      <Text style={styles.headerText}>Close to you</Text>
      
      {/* User Profile Modal */}
      {selectedUser && (
        <UserProfileModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onFriendRequest={handleFriendRequest}
          onWalkTogether={(userId) => {
            const user = users.find(u => u.id === userId);
            if (user) {
              alert(`Starting a walk with ${user.name}!`);
              setSelectedUser(null);
            }
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  circleContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
  },
  centerDot: {
    width: 19.994,
    height: 19.994,
    borderRadius: 9.997,
    borderWidth: 2.461,
    borderColor: '#ffffff',
    position: 'absolute',
    shadowColor: 'rgba(66, 133, 244, 0.5)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  centerGlow: {
    width: 24,
    height: 24,
    borderRadius: 2000,
    position: 'absolute',
    shadowColor: 'rgba(255, 68, 0, 0.6)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 5,
  },
  userAvatar: {
    position: 'absolute',
    width: 58,
    height: 58,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  friendBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4ade80',
    borderWidth: 2,
    borderColor: '#1a1a1a',
  },
  headerText: {
    position: 'absolute',
    top: 72,
    left: '50%',
    transform: [{ translateX: -50 }],
    fontSize: 14,
    color: '#bbbbbb',
    fontFamily: 'DMMono_400Regular',
    textAlign: 'center',
    includeFontPadding: false,
  },
});

import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image, Modal } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface User {
  id: number;
  name: string;
  avatar: any;
  goal: number;
  distance: number; // in meters
  position: { x: number; y: number };
  walks: number;
  isFriend: boolean;
}

interface SocialViewProps {
  theme?: 'bw' | 'bo';
}

export default function SocialView({ theme = 'bw' }: SocialViewProps) {
  const [hoveredUser, setHoveredUser] = useState<User | null>(null);
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

  const pulse1 = useRef(new Animated.Value(1)).current;
  const pulse2 = useRef(new Animated.Value(1)).current;
  const pulse3 = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const createPulse = (anim: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1.2,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    createPulse(pulse1, 0);
    createPulse(pulse2, 666);
    createPulse(pulse3, 1333);
  }, []);

  const handleFriendRequest = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, isFriend: !user.isFriend } : user
    ));
  };

  const accentColor = theme === 'bo' ? '#ff4400' : '#fff';

  return (
    <View style={styles.container}>
      {/* Animated radar circles */}
      <View style={styles.circleContainer}>
        <Animated.View style={[styles.circle, { transform: [{ scale: pulse3 }] }]}>
          <Svg width={932} height={932}>
            <Circle
              cx={466}
              cy={466}
              r={465}
              stroke="#333"
              strokeWidth={1}
              fill="rgba(26, 26, 26, 0.7)"
            />
          </Svg>
        </Animated.View>
      </View>

      <View style={styles.circleContainer}>
        <Animated.View style={[styles.circle, { transform: [{ scale: pulse2 }] }]}>
          <Svg width={621} height={621}>
            <Circle
              cx={310.5}
              cy={310.5}
              r={310}
              stroke="#333"
              strokeWidth={1}
              fill="rgba(26, 26, 26, 0.7)"
            />
          </Svg>
        </Animated.View>
      </View>

      <View style={styles.circleContainer}>
        <Animated.View style={[styles.circle, { transform: [{ scale: pulse1 }] }]}>
          <Svg width={414} height={414}>
            <Circle
              cx={207}
              cy={207}
              r={206.5}
              stroke="#333"
              strokeWidth={1}
              fill="rgba(26, 26, 26, 0.7)"
            />
          </Svg>
        </Animated.View>
      </View>
      
      {/* Center indicator (you) */}
      <View style={[styles.centerDot, { backgroundColor: accentColor }]} />
      <View style={[styles.centerGlow, { backgroundColor: `${accentColor}4D` }]} />
      
      {/* User avatars */}
      {users.map((user) => (
        <TouchableOpacity
          key={user.id}
          style={[styles.userAvatar, { left: user.position.x, top: user.position.y }]}
          onPress={() => setSelectedUser(user)}
        >
          <Image source={user.avatar} style={styles.avatarImage} />
          {user.isFriend && <View style={styles.friendBadge} />}
        </TouchableOpacity>
      ))}
      
      {/* Header text */}
      <Text style={styles.headerText}>Close to you</Text>
      
      {/* Simple User Info Modal */}
      {selectedUser && (
        <Modal
          visible={true}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setSelectedUser(null)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setSelectedUser(null)}
          >
            <View style={styles.modalContent}>
              <Image source={selectedUser.avatar} style={styles.modalAvatar} />
              <Text style={styles.modalName}>{selectedUser.name}</Text>
              <Text style={styles.modalInfo}>Goal: {selectedUser.goal.toLocaleString('de-DE')} steps</Text>
              <Text style={styles.modalInfo}>{selectedUser.walks} walks completed</Text>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: selectedUser.isFriend ? '#666' : accentColor }]}
                onPress={() => {
                  handleFriendRequest(selectedUser.id);
                  setSelectedUser(null);
                }}
              >
                <Text style={[styles.modalButtonText, { color: selectedUser.isFriend ? '#fff' : '#1a1a1a' }]}>
                  {selectedUser.isFriend ? 'Remove Friend' : 'Add Friend'}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
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
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    opacity: 0.7,
  },
  centerDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2.5,
    borderColor: '#fff',
    position: 'absolute',
  },
  centerGlow: {
    width: 24,
    height: 24,
    borderRadius: 12,
    position: 'absolute',
  },
  userAvatar: {
    position: 'absolute',
    width: 58,
    height: 58,
    borderRadius: 15,
    overflow: 'hidden',
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
    fontSize: 14,
    color: '#bbb',
    fontFamily: 'JetBrainsMono_400Regular',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#2a2a2a',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    gap: 12,
    maxWidth: 300,
  },
  modalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginBottom: 8,
  },
  modalName: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'JetBrainsMono_600SemiBold',
  },
  modalInfo: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'JetBrainsMono_400Regular',
  },
  modalButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  modalButtonText: {
    fontSize: 14,
    fontFamily: 'JetBrainsMono_600SemiBold',
    textTransform: 'uppercase',
  },
});

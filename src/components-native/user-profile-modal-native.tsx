import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, Animated } from 'react-native';
import { Users, UserPlus, UserCheck, X } from 'lucide-react-native';

interface User {
  id: number;
  name: string;
  avatar: any;
  goal: number;
  distance: number;
  walks: number;
  isFriend: boolean;
}

interface UserProfileModalProps {
  user: User;
  onClose: () => void;
  onFriendRequest: (userId: number) => void;
  onWalkTogether: (userId: number) => void;
}

export default function UserProfileModal({ user, onClose, onFriendRequest, onWalkTogether }: UserProfileModalProps) {
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const modalTranslateY = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    // Sequential animations: first overlay fade in, then modal slide up
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
  }, []);

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Animated.View
          style={[
            styles.backdropTouchable,
            { opacity: overlayOpacity },
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

            <View style={styles.content}>
              {/* Handle */}
              <View style={styles.handle} />

              {/* Profile Section */}
              <View style={styles.profileSection}>
                {/* Profile Picture */}
                <View style={styles.profilePicture}>
                  <Image
                    source={user.avatar}
                    style={styles.profileImage}
                  />
                  <View style={styles.profileBorder} />

                  {/* Friend badge */}
                  {user.isFriend && (
                    <View style={styles.friendBadge}>
                      <UserCheck size={16} color="#ffffff" strokeWidth={2.5} />
                    </View>
                  )}
                </View>

                {/* Name and info */}
                <View style={styles.nameSection}>
                  <Text style={styles.name}>{user.name}</Text>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoText}>{user.walks} walks</Text>
                    <View style={styles.dot} />
                    <Text style={styles.infoText}>{user.distance}m away</Text>
                  </View>
                </View>
              </View>

              {/* Stats Section */}
              <View style={styles.statsSection}>
                <Text style={styles.sectionTitle}>STATS</Text>

                <View style={styles.statsRows}>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Daily Goal</Text>
                    <Text style={styles.statValue}>{user.goal.toLocaleString('de-DE')} steps</Text>
                  </View>

                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Total Walks</Text>
                    <Text style={styles.statValue}>{user.walks}</Text>
                  </View>

                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Distance</Text>
                    <Text style={styles.statValue}>
                      {user.distance < 1000 ? `${user.distance}m` : `${(user.distance / 1000).toFixed(1)}km`}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Action Buttons */}
              <View style={styles.actionsSection}>
                <TouchableOpacity
                  onPress={() => onFriendRequest(user.id)}
                  style={[
                    styles.button,
                    user.isFriend ? styles.buttonSecondary : styles.buttonPrimary,
                  ]}
                >
                  {user.isFriend ? (
                    <>
                      <UserCheck size={20} color="#ffffff" strokeWidth={2} />
                      <Text style={[styles.buttonText, { color: '#ffffff' }]}>FRIENDS</Text>
                    </>
                  ) : (
                    <>
                      <UserPlus size={20} color="#1a1a1a" strokeWidth={2} />
                      <Text style={[styles.buttonText, { color: '#1a1a1a' }]}>ADD FRIEND</Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => user.isFriend && onWalkTogether(user.id)}
                  disabled={!user.isFriend}
                  style={[
                    styles.button,
                    user.isFriend ? styles.buttonWalk : styles.buttonDisabled,
                  ]}
                >
                  <Users size={20} color="#ffffff" strokeWidth={2} />
                  <Text style={[styles.buttonText, { color: '#ffffff' }]}>WALK TOGETHER</Text>
                </TouchableOpacity>

                {!user.isFriend && (
                  <Text style={styles.helpText}>Add as friend to walk together</Text>
                )}
              </View>
            </View>
          </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  backdropTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    backgroundColor: '#111111',
    borderRadius: 32,
    width: '100%',
    maxWidth: 393,
    position: 'relative',
    zIndex: 10,
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
  content: {
    paddingTop: 12,
    paddingBottom: 32,
    paddingHorizontal: 24,
    gap: 32,
  },
  handle: {
    width: 70,
    height: 5,
    backgroundColor: '#ffffff',
    borderRadius: 100,
    alignSelf: 'center',
  },
  profileSection: {
    alignItems: 'center',
    gap: 16,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 24,
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
  friendBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#22c55e',
    borderWidth: 4,
    borderColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameSection: {
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 20,
    color: '#ffffff',
    fontFamily: 'DMMono_400Regular',
    includeFontPadding: false,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  infoText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.75)',
    fontFamily: 'DMMono_400Regular',
    includeFontPadding: false,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#333333',
  },
  statsSection: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#bbbbbb',
    fontFamily: 'DMMono_400Regular',
    includeFontPadding: false,
  },
  statsRows: {
    gap: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#ffffff',
    fontFamily: 'DMMono_400Regular',
    includeFontPadding: false,
  },
  statValue: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.75)',
    fontFamily: 'DMMono_400Regular',
    includeFontPadding: false,
  },
  divider: {
    height: 1,
    backgroundColor: '#333333',
  },
  actionsSection: {
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonPrimary: {
    backgroundColor: '#ffffff',
  },
  buttonSecondary: {
    backgroundColor: '#2a2a2a',
  },
  buttonWalk: {
    backgroundColor: '#ff4400',
    shadowColor: 'rgba(255, 68, 0, 0.3)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
  },
  buttonDisabled: {
    backgroundColor: '#2a2a2a',
  },
  buttonText: {
    fontSize: 14,
    fontFamily: 'DMMono_400Regular',
    textTransform: 'uppercase',
    includeFontPadding: false,
  },
  helpText: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'DMMono_400Regular',
    textAlign: 'center',
    includeFontPadding: false,
  },
});

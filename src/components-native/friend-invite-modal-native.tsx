import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, Animated } from 'react-native';
import { X } from 'lucide-react-native';

interface FriendInviteModalProps {
  friendName: string;
  friendAvatar: any;
  onAccept: () => void;
  onDecline: () => void;
  theme?: 'bw' | 'bo';
}

export default function FriendInviteModal({
  friendName,
  friendAvatar,
  onAccept,
  onDecline,
  theme = 'bw'
}: FriendInviteModalProps) {
  const accentColor = theme === 'bo' ? '#ff4400' : '#ffffff';
  const borderColor = theme === 'bo' ? 'rgba(255, 68, 0, 0.8)' : 'rgba(136, 136, 136, 0.8)';
  
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
      onRequestClose={onDecline}
    >
      <Animated.View
        style={[styles.overlay, { opacity: overlayOpacity }]}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onDecline}
        />
        <Animated.View
          style={[
            styles.modalContent,
            {
              shadowColor: theme === 'bo' ? 'rgba(255, 68, 0, 0.3)' : 'rgba(255, 255, 255, 0.1)',
              transform: [{ translateY: modalTranslateY }],
            },
          ]}
        >
          {/* Close button */}
          <TouchableOpacity
            onPress={onDecline}
            style={styles.closeButton}
          >
            <X size={24} color="rgba(255, 255, 255, 0.6)" strokeWidth={1.5} />
          </TouchableOpacity>

          {/* Handle */}
          <View style={styles.handle} />
          
          {/* Friend Profile Section */}
          <View style={styles.profileSection}>
            {/* Profile Picture */}
            <View style={[styles.avatarContainer, { borderColor: borderColor }]}>
              <Image source={friendAvatar} style={styles.avatar} />
            </View>
            
            {/* Name and message */}
            <View style={styles.textContainer}>
              <Text style={styles.name}>{friendName}</Text>
              <Text style={styles.message}>is nearby and wants to walk together</Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Action buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={onDecline}
              style={[styles.button, styles.declineButton]}
            >
              <Text style={styles.declineText}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onAccept}
              style={[styles.button, styles.acceptButton, { backgroundColor: accentColor }]}
            >
              <Text style={[styles.acceptText, { color: theme === 'bo' ? '#fff' : '#1a1a1a' }]}>Accept</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
    padding: 16,
    paddingBottom: 24,
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 32,
    paddingTop: 12,
    paddingBottom: 24,
    paddingHorizontal: 24,
    gap: 48,
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.5,
    shadowRadius: 60,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 24,
    right: 24,
    zIndex: 20,
  },
  handle: {
    width: 70,
    height: 5,
    backgroundColor: '#fff',
    borderRadius: 100,
    alignSelf: 'center',
  },
  profileSection: {
    gap: 16,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 88,
    height: 88,
    borderRadius: 24,
    borderWidth: 4,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  textContainer: {
    gap: 4,
    alignItems: 'center',
  },
  name: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'JetBrainsMono_400Regular',
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: 'JetBrainsMono_400Regular',
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 100,
    alignItems: 'center',
  },
  declineButton: {
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#333',
  },
  acceptButton: {
    // backgroundColor set dynamically
  },
  declineText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  acceptText: {
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Home, Map, Users, User } from 'lucide-react-native';

type PageType = 'home' | 'map' | 'social' | 'profile';

interface BottomNavProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  theme?: 'bw' | 'bo';
  onProfilePress?: () => void;
  profileImage?: string | null;
}

const getIcon = (page: PageType) => {
  switch (page) {
    case 'home':
      return Home;
    case 'map':
      return Map;
    case 'social':
      return Users;
    case 'profile':
      return User;
  }
};

export default function BottomNav({ currentPage, onPageChange, theme = 'bw', onProfilePress, profileImage }: BottomNavProps) {
  const pages: PageType[] = ['home', 'map', 'social', 'profile'];
  const accentColor = theme === 'bo' ? '#ff4400' : '#ffffff';
  
  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={['rgba(17, 17, 17, 0)', '#111111']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      <View style={styles.container}>
        {pages.map((page) => {
          const Icon = getIcon(page);
          const isActive = currentPage === page;
          
          // Special handling for profile tab - show profile picture
          if (page === 'profile') {
            return (
              <TouchableOpacity
                key={page}
                onPress={() => {
                  onPageChange(page);
                  if (onProfilePress) onProfilePress();
                }}
                style={styles.iconButton}
              >
                <View style={[
                  styles.profileImageContainer,
                  isActive && { borderColor: accentColor, borderWidth: 2 }
                ]}>
                  <Image
                    source={profileImage ? { uri: profileImage } : require('../assets/5e57bdbeef9424b6821c727c30e788b8e31d6a71.png')}
                    style={styles.profileImage}
                  />
                </View>
              </TouchableOpacity>
            );
          }
          
          return (
            <TouchableOpacity
              key={page}
              onPress={() => onPageChange(page)}
              style={styles.iconButton}
            >
              <Icon
                size={24}
                color={isActive ? accentColor : '#666666'}
                strokeWidth={isActive ? 2 : 1.5}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 32,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    paddingTop: 32,
  },
  iconButton: {
    padding: 8,
  },
  profileImageContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#666666',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
});

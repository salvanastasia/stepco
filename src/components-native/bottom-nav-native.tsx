import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, Map, Users, User } from 'lucide-react-native';

type PageType = 'home' | 'map' | 'social' | 'profile';

interface BottomNavProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  theme?: 'bw' | 'bo';
}

export default function BottomNav({ currentPage, onPageChange, theme = 'bw' }: BottomNavProps) {
  const activeColor = theme === 'bo' ? '#ff4400' : '#fff';
  const inactiveColor = '#666';
  
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onPageChange('home')}
      >
        <Home
          size={24}
          color={currentPage === 'home' ? activeColor : inactiveColor}
          strokeWidth={1.5}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onPageChange('map')}
      >
        <Map
          size={24}
          color={currentPage === 'map' ? activeColor : inactiveColor}
          strokeWidth={1.5}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onPageChange('social')}
      >
        <Users
          size={24}
          color={currentPage === 'social' ? activeColor : inactiveColor}
          strokeWidth={1.5}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onPageChange('profile')}
      >
        <User
          size={24}
          color={currentPage === 'profile' ? activeColor : inactiveColor}
          strokeWidth={1.5}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 48,
    paddingHorizontal: 24,
  },
  navItem: {
    padding: 12,
  },
});

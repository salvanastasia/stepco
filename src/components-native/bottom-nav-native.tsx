import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, Map, Users, User } from 'lucide-react-native';

type PageType = 'home' | 'map' | 'social' | 'profile';

interface BottomNavProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  theme?: 'bw' | 'bo';
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

export default function BottomNav({ currentPage, onPageChange, theme = 'bw' }: BottomNavProps) {
  const pages: PageType[] = ['home', 'map', 'social', 'profile'];
  const accentColor = theme === 'bo' ? '#ff4400' : '#ffffff';
  
  return (
    <View style={styles.container}>
      {pages.map((page) => {
        const Icon = getIcon(page);
        const isActive = currentPage === page;
        
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
    gap: 24,
  },
  iconButton: {
    padding: 8,
  },
});

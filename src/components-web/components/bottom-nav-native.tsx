import { View, TouchableOpacity, StyleSheet } from 'react-native';

interface BottomNavProps {
  currentPage: 'home' | 'map' | 'profile';
  onPageChange: (page: 'home' | 'map' | 'profile') => void;
}

export default function BottomNav({ currentPage, onPageChange }: BottomNavProps) {
  const pages: ('home' | 'map' | 'profile')[] = ['home', 'map', 'profile'];
  
  return (
    <View style={styles.container}>
      <View style={styles.navContainer}>
        {pages.map((page) => (
          <TouchableOpacity
            key={page}
            onPress={() => onPageChange(page)}
            style={[
              styles.dot,
              currentPage === page ? styles.dotActive : styles.dotInactive
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 48,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  navContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dot: {
    width: 8,
    height: 8,
  },
  dotActive: {
    backgroundColor: '#fff',
  },
  dotInactive: {
    backgroundColor: '#666',
  },
});

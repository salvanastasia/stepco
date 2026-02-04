import { View, TouchableOpacity, StyleSheet } from 'react-native';

type PageType = 'home' | 'map' | 'social' | 'profile';

interface BottomNavProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  theme?: 'bw' | 'bo';
}

export default function BottomNav({ currentPage, onPageChange, theme = 'bw' }: BottomNavProps) {
  const pages: PageType[] = ['home', 'map', 'social', 'profile'];
  const accentColor = theme === 'bo' ? '#ff4400' : '#ffffff';
  
  return (
    <View style={styles.container}>
      {pages.map((page) => (
        <TouchableOpacity
          key={page}
          onPress={() => onPageChange(page)}
          style={[
            styles.dot,
            {
              backgroundColor: currentPage === page ? accentColor : '#666666',
            },
          ]}
        />
      ))}
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
    gap: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 0, // Square dots like in original
  },
});

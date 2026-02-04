import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Calendar, TrendingUp, Settings } from 'lucide-react-native';

interface WalkRecord {
  date: string;
  steps: number;
}

interface ProfileViewProps {
  walkHistory: WalkRecord[];
  goal: number;
  onGoalChange: (newGoal: number) => void;
  theme?: 'bw' | 'bo';
  onThemeChange?: (theme: 'bw' | 'bo') => void;
}

export default function ProfileView({ 
  walkHistory, 
  goal, 
  onGoalChange, 
  theme = 'bw',
  onThemeChange 
}: ProfileViewProps) {
  const accentColor = theme === 'bo' ? '#ff4400' : '#fff';
  
  // Calculate stats
  const totalSteps = walkHistory.reduce((sum, record) => sum + record.steps, 0);
  const avgSteps = walkHistory.length > 0 ? Math.round(totalSteps / walkHistory.length) : 0;
  const totalDistanceKm = (totalSteps * 0.762) / 1000;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={[styles.avatarPlaceholder, { borderColor: accentColor }]}>
          <Text style={[styles.avatarText, { color: accentColor }]}>You</Text>
        </View>
        <Text style={styles.username}>Walker</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { borderColor: theme === 'bo' ? 'rgba(255, 68, 0, 0.3)' : 'rgba(255, 255, 255, 0.1)' }]}>
          <TrendingUp size={20} color={accentColor} strokeWidth={1.5} />
          <Text style={styles.statValue}>{totalSteps.toLocaleString('de-DE')}</Text>
          <Text style={styles.statLabel}>Total Steps</Text>
        </View>

        <View style={[styles.statCard, { borderColor: theme === 'bo' ? 'rgba(255, 68, 0, 0.3)' : 'rgba(255, 255, 255, 0.1)' }]}>
          <Calendar size={20} color={accentColor} strokeWidth={1.5} />
          <Text style={styles.statValue}>{walkHistory.length}</Text>
          <Text style={styles.statLabel}>Walks</Text>
        </View>

        <View style={[styles.statCard, { borderColor: theme === 'bo' ? 'rgba(255, 68, 0, 0.3)' : 'rgba(255, 255, 255, 0.1)' }]}>
          <Text style={styles.statValue}>{totalDistanceKm.toFixed(1)}</Text>
          <Text style={styles.statLabel}>Total km</Text>
        </View>
      </View>

      {/* Daily Goal Setting */}
      <View style={[styles.section, { borderColor: theme === 'bo' ? 'rgba(255, 68, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)' }]}>
        <Text style={styles.sectionTitle}>Daily Goal</Text>
        <Text style={[styles.goalValue, { color: accentColor }]}>{goal.toLocaleString('de-DE')} steps</Text>
        <View style={styles.goalButtons}>
          <TouchableOpacity
            style={[styles.goalButton, { borderColor: '#666' }]}
            onPress={() => onGoalChange(Math.max(1000, goal - 1000))}
          >
            <Text style={styles.goalButtonText}>-1000</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.goalButton, { backgroundColor: accentColor }]}
            onPress={() => onGoalChange(goal + 1000)}
          >
            <Text style={[styles.goalButtonText, { color: theme === 'bo' ? '#fff' : '#1a1a1a' }]}>+1000</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Theme Toggle */}
      <View style={[styles.section, { borderColor: theme === 'bo' ? 'rgba(255, 68, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)' }]}>
        <Text style={styles.sectionTitle}>Theme</Text>
        <View style={styles.themeButtons}>
          <TouchableOpacity
            style={[styles.themeButton, theme === 'bw' && { backgroundColor: '#fff' }]}
            onPress={() => onThemeChange?.('bw')}
          >
            <Text style={[styles.themeButtonText, theme === 'bw' && { color: '#1a1a1a' }]}>B&W</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.themeButton, theme === 'bo' && { backgroundColor: '#ff4400' }]}
            onPress={() => onThemeChange?.('bo')}
          >
            <Text style={[styles.themeButtonText, theme === 'bo' && { color: '#fff' }]}>B&O</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent History */}
      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {walkHistory.slice(0, 7).map((record, index) => (
          <View
            key={index}
            style={[styles.historyItem, { borderColor: theme === 'bo' ? 'rgba(255, 68, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)' }]}
          >
            <Text style={styles.historyDate}>{record.date}</Text>
            <Text style={[styles.historySteps, { color: accentColor }]}>
              {record.steps.toLocaleString('de-DE')} steps
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  contentContainer: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 16,
    fontFamily: 'JetBrainsMono_600SemiBold',
  },
  username: {
    fontSize: 24,
    color: '#fff',
    fontFamily: 'Archivo_600SemiBold',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(42, 42, 42, 0.5)',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'Archivo_600SemiBold',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'JetBrainsMono_400Regular',
  },
  section: {
    backgroundColor: 'rgba(42, 42, 42, 0.5)',
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'JetBrainsMono_600SemiBold',
    marginBottom: 12,
  },
  goalValue: {
    fontSize: 28,
    fontFamily: 'Archivo_600SemiBold',
    marginBottom: 16,
  },
  goalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  goalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  goalButtonText: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'JetBrainsMono_600SemiBold',
  },
  themeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  themeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#666',
  },
  themeButtonText: {
    fontSize: 14,
    color: '#999',
    fontFamily: 'JetBrainsMono_600SemiBold',
  },
  historySection: {
    marginTop: 8,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  historyDate: {
    fontSize: 14,
    color: '#999',
    fontFamily: 'JetBrainsMono_400Regular',
  },
  historySteps: {
    fontSize: 14,
    fontFamily: 'JetBrainsMono_600SemiBold',
  },
});

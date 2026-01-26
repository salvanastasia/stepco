import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, PanResponder } from 'react-native';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  dailyGoal: number;
  onGoalChange: (goal: number) => void;
  unit: 'steps' | 'km';
  onUnitChange: (unit: 'steps' | 'km') => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  dailyGoal,
  onGoalChange,
  unit,
  onUnitChange
}: SettingsModalProps) {
  const [localGoal, setLocalGoal] = useState(dailyGoal);
  const [sliderWidth, setSliderWidth] = useState(0);

  const handleSliderChange = (value: number) => {
    setLocalGoal(value);
    onGoalChange(value);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      if (sliderWidth > 0) {
        const x = evt.nativeEvent.locationX;
        const percentage = Math.max(0, Math.min(1, x / sliderWidth));
        const newGoal = Math.round(percentage * 10000);
        handleSliderChange(newGoal);
      }
    },
    onPanResponderMove: (evt) => {
      if (sliderWidth > 0) {
        const x = evt.nativeEvent.locationX;
        const percentage = Math.max(0, Math.min(1, x / sliderWidth));
        const newGoal = Math.round(percentage * 10000);
        handleSliderChange(newGoal);
      }
    },
  });

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={StyleSheet.absoluteFill} 
          onPress={onClose}
          activeOpacity={1}
        />
        
        <View style={styles.modal}>
          <Text style={styles.sectionTitle}>SET YOUR GOAL</Text>
          
          {/* Steps label with value display */}
          <View style={styles.stepsRow}>
            <Text style={styles.label}>Steps</Text>
            <View style={styles.valueBox}>
              <Text style={styles.valueText}>{localGoal}</Text>
            </View>
          </View>
          
          {/* Interactive slider with tick marks */}
          <View 
            style={styles.sliderContainer}
            onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
            {...panResponder.panHandlers}
          >
            {/* Tick marks */}
            <View style={styles.ticksContainer}>
              {Array.from({ length: 22 }, (_, i) => {
                const value = (i / 21) * 10000;
                const isFilled = value <= localGoal;
                return (
                  <View
                    key={i}
                    style={[
                      styles.tick,
                      { backgroundColor: isFilled ? '#fff' : '#333' }
                    ]}
                  />
                );
              })}
            </View>
            
            {/* Labels */}
            <View style={styles.labelsContainer}>
              <Text style={styles.labelText}>0</Text>
              <Text style={styles.labelText}>5000</Text>
              <Text style={styles.labelText}>10.000</Text>
            </View>
          </View>
          
          {/* Unit selector */}
          <View style={styles.unitSection}>
            <Text style={styles.sectionTitle}>Unit</Text>
            
            <View style={styles.unitSelector}>
              <TouchableOpacity
                onPress={() => onUnitChange('km')}
                style={[
                  styles.unitButton,
                  unit === 'km' && styles.unitButtonActive
                ]}
              >
                <Text style={styles.unitButtonText}>KM</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onUnitChange('steps')}
                style={[
                  styles.unitButton,
                  unit === 'steps' && styles.unitButtonActive
                ]}
              >
                <Text style={styles.unitButtonText}>STEPS</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 80,
  },
  modal: {
    width: 346,
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 28,
  },
  sectionTitle: {
    color: '#bbb',
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 16,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    color: '#bbb',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  valueBox: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  valueText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  sliderContainer: {
    marginBottom: 16,
  },
  ticksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  tick: {
    height: 32,
    width: 4,
    flex: 1,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelText: {
    color: '#bbb',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  unitSection: {
    marginTop: 16,
  },
  unitSelector: {
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 10,
    padding: 2,
    flexDirection: 'row',
    gap: 2,
  },
  unitButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  unitButtonActive: {
    backgroundColor: '#2a2a2a',
  },
  unitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'monospace',
  },
});

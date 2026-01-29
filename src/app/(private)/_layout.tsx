import React from 'react';
import { Stack } from 'expo-router';
import { Dimensions } from 'react-native';

const { height } = Dimensions.get('window');
const PrivateLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="settings"
        options={{
          presentation: 'formSheet',
          sheetAllowedDetents: [0.5],
          contentStyle: { backgroundColor: '#111', height: height * 0.5 },
        }}
      />
    </Stack>
  );
};

export default PrivateLayout;

# Fix Blur and Clipped Text

## Changes needed:

### 1. Add expo-blur to all modal overlays (48px intensity)
✅ expo-blur is already installed

### Files to update with BlurView:

1. `src/components-native/profile-modal-native.tsx`
2. `src/components-native/activity-detail-modal-native.tsx`
3. `src/components-native/user-profile-modal-native.tsx`

### Pattern to replace:

**Before:**
```tsx
<Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.5)', opacity: overlayOpacity }]}>
  <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
</Animated.View>
```

**After:**
```tsx
<Animated.View style={[StyleSheet.absoluteFill, { opacity: overlayOpacity }]}>
  <BlurView intensity={48} style={StyleSheet.absoluteFill} tint="dark">
    <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.4)' }]}>
      <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
    </View>
  </BlurView>
</Animated.View>
```

### 2. Fix clipped text issue

The text below "Today you walked 80% of the Statue of Liberty height" appears clipped.
This needs investigation in the component that renders that text (likely circular-progress-native.tsx).

Check for:
- Missing `numberOfLines={0}` or `numberOfLines={2}` 
- Text container with fixed height
- Overflow: 'hidden' on parent container

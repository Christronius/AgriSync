import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withDelay, withTiming, runOnJS } from 'react-native-reanimated';
import { LucideIcon, CheckCircle2 } from 'lucide-react-native';
import { colors } from '../theme/theme';

export interface ToastMessage {
  key: string;
  text: string;
  icon?: LucideIcon;
  color?: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onHide: () => void;
}

export function Toast({ toast, onHide }: ToastProps) {
  const translateY = useSharedValue(20);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (toast) {
      // Animate In
      translateY.value = withSpring(0, { damping: 15, stiffness: 200 });
      opacity.value = withTiming(1, { duration: 200 });

      // Animate Out after 3s
      translateY.value = withDelay(
        3000,
        withTiming(10, { duration: 200 }, () => {
          runOnJS(onHide)();
        })
      );
      opacity.value = withDelay(
        3000,
        withTiming(0, { duration: 200 })
      );
    }
  }, [toast]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { translateX: '-50%' }],
    opacity: opacity.value,
  }));

  if (!toast) return null;

  const IconComponent = toast.icon || CheckCircle2;
  const iconColor = toast.color || colors.primary;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <IconComponent size={14} color={iconColor} />
      <Text style={styles.text} numberOfLines={1}>
        {toast.text}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: '50%',
    bottom: 96,
    zIndex: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(24,27,18,0.96)',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
    maxWidth: '84%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 8,
  },
  text: {
    fontFamily: 'IBMPlexSans',
    fontSize: 12,
    color: '#fff',
    flexShrink: 1,
  },
});

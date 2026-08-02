import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, StyleProp, ViewStyle } from 'react-native';
import { colors } from '../theme/theme';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { LucideIcon } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text style={styles.sectionLabel}>{children}</Text>
  );
}

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  accent?: string;
}

export function Card({ children, onPress, style, accent }: CardProps) {
  const content = (
    <LinearGradient
      colors={[colors.card, '#11140D']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[
        styles.card,
        accent ? { borderLeftWidth: 4, borderLeftColor: accent, borderWidth: 0 } : undefined,
        style
      ]}
    >
      {children}
    </LinearGradient>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}>
        {content}
      </Pressable>
    );
  }

  return content;
}

interface StatusPillProps {
  status: string;
}

export function StatusPill({ status }: StatusPillProps) {
  const map: Record<string, { bg: string; fg: string }> = {
    "Scheduled": { bg: colors.goldSoft, fg: colors.gold },
    "Overdue": { bg: colors.badSoft, fg: colors.bad },
    "Completed": { bg: colors.primarySoft, fg: colors.primary },
    "Recommended": { bg: "rgba(232,138,60,0.18)", fg: "#E08A3C" },
    "On track": { bg: colors.primarySoft, fg: colors.primary },
    "Docs pending": { bg: colors.goldSoft, fg: colors.gold },
    "Action needed": { bg: colors.badSoft, fg: colors.bad },
    "Normal": { bg: colors.primarySoft, fg: colors.primary },
    "Elevated": { bg: colors.goldSoft, fg: colors.gold },
    "Critical": { bg: colors.badSoft, fg: colors.bad },
  };

  const s = map[status] || { bg: colors.line, fg: colors.inkSoft };

  return (
    <View style={[styles.pillContainer, { backgroundColor: s.bg }]}>
      <Text style={[styles.pillText, { color: s.fg }]}>{status}</Text>
    </View>
  );
}

interface IconBadgeProps {
  Icon: LucideIcon;
  fg: string;
  bg: string;
  size?: number;
}

export function IconBadge({ Icon, fg, bg, size = 38 }: IconBadgeProps) {
  return (
    <View style={[
      styles.iconBadge,
      { width: size, height: size, borderRadius: size * 0.32, backgroundColor: bg }
    ]}>
      <Icon size={size * 0.52} color={fg} strokeWidth={2.2} />
    </View>
  );
}

interface ProgressBarProps {
  value: number; // 0 to 100
  color: string;
}

export function ProgressBar({ value, color }: ProgressBarProps) {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(value, {
      duration: 800,
      easing: Easing.bezier(0.2, 0.8, 0.2, 1),
    });
  }, [value]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${width.value}%`,
    };
  });

  return (
    <View style={styles.progressContainer}>
      <Animated.View style={[styles.progressFill, { backgroundColor: color }, animatedStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    fontFamily: 'IBMPlexMono',
    fontSize: 10.5,
    letterSpacing: 1,
    color: colors.inkSoft,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  card: {
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.line,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    borderLeftColor: 'rgba(255, 255, 255, 0.03)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 8,
  },
  pillContainer: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 999,
  },
  pillText: {
    fontFamily: 'IBMPlexMono',
    fontSize: 10.5,
    fontWeight: '600',
  },
  iconBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  progressContainer: {
    height: 7,
    borderRadius: 999,
    backgroundColor: colors.line,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
});

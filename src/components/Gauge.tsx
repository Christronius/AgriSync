import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withTiming, Easing } from 'react-native-reanimated';
import { colors } from '../theme/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface GaugeProps {
  value: number;
  label: string;
  color: string;
  size?: number;
}

export function Gauge({ value, label, color, size = 76 }: GaugeProps) {
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withTiming(value, {
      duration: 900,
      easing: Easing.bezier(0.2, 0.8, 0.2, 1),
    });
  }, [value]);

  const animatedProps = useAnimatedProps(() => {
    const offset = circumference - (animatedValue.value / 100) * circumference;
    return {
      strokeDashoffset: offset,
    };
  });

  return (
    <View style={styles.container}>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors.line}
            strokeWidth={strokeWidth}
          />
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            animatedProps={animatedProps}
            strokeLinecap="round"
          />
        </Svg>
        <View style={[StyleSheet.absoluteFill, styles.valueContainer]}>
          <Text style={styles.valueText}>{value}</Text>
        </View>
      </View>
      <Text style={styles.labelText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  valueContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    fontFamily: 'IBMPlexMono-SemiBold',
    fontSize: 17,
    color: colors.ink,
  },
  labelText: {
    fontFamily: 'IBMPlexSans',
    fontSize: 11.5,
    color: colors.inkSoft,
    textAlign: 'center',
  },
});

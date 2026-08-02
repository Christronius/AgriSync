import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  ZoomIn, 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming,
  withDelay,
  Easing
} from 'react-native-reanimated';
import { Wheat } from 'lucide-react-native';
import { colors } from '../theme/theme';

export function SplashScreen({ onFinish }: { onFinish?: () => void }) {
  const pulse = useSharedValue(1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    // Start continuous pulsing after initial entrance
    pulse.value = withDelay(1000, withRepeat(
      withSequence(
        withTiming(1.08, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    ));
    
    // Add a gentle swing to the wheat icon
    rotation.value = withDelay(1000, withRepeat(
      withSequence(
        withTiming(-5, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(5, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    ));

    const timer = setTimeout(() => {
      if (onFinish) {
        onFinish();
      }
    }, 3200); // Slightly longer to appreciate the animation
    return () => clearTimeout(timer);
  }, [onFinish]);

  const animatedLogoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <LinearGradient colors={[colors.primaryDark, colors.primary]} style={styles.container}>
      <Animated.View entering={ZoomIn.duration(1200).springify().mass(1.2).damping(14).stiffness(90)}>
        <Animated.View style={[styles.logoContainer, animatedLogoStyle]}>
          <Animated.View style={animatedIconStyle}>
            <Wheat size={100} color="#fff" strokeWidth={1.5} />
          </Animated.View>
        </Animated.View>
      </Animated.View>
      
      <Animated.View entering={FadeInDown.delay(700).duration(800).springify().damping(16)}>
        <Text style={styles.title}>AgriSync<Text style={{fontSize: 14, fontWeight: '700', transform: [{ translateY: -22 }]}}>®</Text></Text>
      </Animated.View>
      
      <Animated.View entering={FadeIn.delay(1200).duration(800)}>
         <Text style={styles.subtitle}>Farm Management</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: 'SpaceGrotesk',
    fontWeight: '800',
    fontSize: 42,
    color: '#fff',
    letterSpacing: -1,
  },
  subtitle: {
    fontFamily: 'IBMPlexMono',
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});

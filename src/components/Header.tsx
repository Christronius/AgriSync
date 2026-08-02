import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, User, Bell } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/theme';

interface ProfileButtonProps {
  onPress: () => void;
  dark?: boolean;
}

export function ProfileButton({ onPress, dark }: ProfileButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.profileButton,
        {
          backgroundColor: dark ? "rgba(255,255,255,0.16)" : colors.primarySoft,
          opacity: pressed ? 0.8 : 1,
        }
      ]}
    >
      <User size={20} color={dark ? "#fff" : colors.primary} />
    </Pressable>
  );
}

interface HeroHeaderProps {
  title: React.ReactNode;
  subtitle?: string;
  gradientColors: readonly [string, string, ...string[]];
  WatermarkIcon?: React.ElementType;
  onBell?: () => void;
  onUser?: () => void;
  notificationCount?: number;
  onBack?: () => void;
}

export function HeroHeader({
  title,
  subtitle,
  gradientColors,
  WatermarkIcon,
  onBell,
  onUser,
  notificationCount = 0,
  onBack
}: HeroHeaderProps) {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.heroContainer, { paddingTop: Math.max(insets.top + 8, 20) }]}
    >
      {WatermarkIcon && (
        <View style={styles.watermarkContainer}>
          <WatermarkIcon size={74} color="#fff" strokeWidth={1.2} />
        </View>
      )}

      <View style={styles.heroContent}>
        {onBack && (
          <Pressable onPress={onBack} style={({ pressed }) => [styles.heroBackButton, { opacity: pressed ? 0.8 : 1 }]}>
            <ChevronLeft size={24} color="#fff" />
          </Pressable>
        )}
        <View style={styles.titleArea}>
          <Text style={styles.heroTitle}>{title}</Text>
          {subtitle && <Text style={styles.heroSubtitle}>{subtitle}</Text>}
        </View>

        <View style={styles.actionArea}>
          {onUser && <ProfileButton onPress={onUser} dark />}
          {onBell && (
            <Pressable onPress={onBell} style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}>
              <View style={styles.bellButton}>
                <Bell size={20} color="#fff" />
              </View>
              {notificationCount > 0 && (
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>{notificationCount}</Text>
                </View>
              )}
            </Pressable>
          )}
        </View>
      </View>
    </LinearGradient>
  );
}

interface DetailHeaderProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  onUser?: () => void;
}

export function DetailHeader({ title, subtitle, onBack, onUser }: DetailHeaderProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.detailContainer, { paddingTop: Math.max(insets.top + 8, 20) }]}>
      <View style={styles.detailLeft}>
        <Pressable onPress={onBack} style={({ pressed }) => [styles.backButton, { opacity: pressed ? 0.8 : 1 }]}>
          <ChevronLeft size={18} color={colors.ink} />
        </Pressable>
        <View style={styles.detailTitleArea}>
          <Text style={styles.detailTitle} numberOfLines={1}>{title}</Text>
          {subtitle && <Text style={styles.detailSubtitle} numberOfLines={1}>{subtitle}</Text>}
        </View>
      </View>
      {onUser && <ProfileButton onPress={onUser} />}
    </View>
  );
}

const styles = StyleSheet.create({
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroContainer: {
    paddingHorizontal: 16,
    paddingTop: 20, 
    paddingBottom: 12,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  watermarkContainer: {
    position: 'absolute',
    top: 4,
    right: 4,
    opacity: 0.14,
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 0,
    height: 52,
  },
  heroBackButton: {
    marginRight: 10,
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleArea: {
    flex: 1,
    paddingTop: 0,
  },
  heroTitle: {
    fontFamily: 'SpaceGrotesk',
    fontWeight: '800',
    fontSize: 24,
    color: '#fff',
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    fontFamily: 'IBMPlexSans',
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 1,
  },
  actionArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bellButton: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeContainer: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: colors.bad,
    width: 15,
    height: 15,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  badgeText: {
    fontFamily: 'IBMPlexMono',
    fontSize: 8.5,
    fontWeight: '600',
    color: '#fff',
  },
  detailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 5,
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  backButton: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 11,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
  },
  detailTitleArea: {
    flex: 1,
  },
  detailTitle: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 18,
    color: colors.ink,
  },
  detailSubtitle: {
    fontFamily: 'IBMPlexSans',
    fontSize: 12.5,
    color: colors.inkSoft,
    marginTop: 1,
  },
});

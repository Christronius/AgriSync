import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { colors } from '../theme/theme';
import { useAuth } from '../context/AuthContext';
import { HeroHeader } from '../components/Header';
import { ShieldAlert, LogOut, RotateCcw, AlertTriangle } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export function AdminPanelScreen({ navigation }: any) {
  const { user, logout, resetSetup } = useAuth();

  const handleReset = () => {
    resetSetup();
    // After resetting setup, App.tsx will automatically drop the user into the OnboardingStack
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <View style={styles.container}>
      <HeroHeader
        title="Admin Settings"
        subtitle="Developer testing panel"
        gradientColors={[colors.badDark, colors.bad, colors.badSoft]}
        WatermarkIcon={ShieldAlert}
        onBack={() => navigation.goBack()}
      />
      
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown.delay(0).springify().damping(18)}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Current Session</Text>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>User ID: <Text style={styles.infoValue}>{user?.id}</Text></Text>
              <Text style={styles.infoLabel}>Name: <Text style={styles.infoValue}>{user?.name}</Text></Text>
              <Text style={styles.infoLabel}>Email: <Text style={styles.infoValue}>{user?.email}</Text></Text>
              <Text style={styles.infoLabel}>Setup Completed: <Text style={[styles.infoValue, { color: user?.setupCompleted ? colors.good : colors.bad }]}>{user?.setupCompleted ? 'TRUE' : 'FALSE'}</Text></Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Developer Actions</Text>
            
            <Pressable style={styles.actionBtn} onPress={handleReset}>
              <RotateCcw size={20} color={colors.gold} />
              <View style={styles.actionTextWrapper}>
                <Text style={styles.actionTitle}>Force Re-Onboarding</Text>
                <Text style={styles.actionSub}>Sets setupCompleted to false and restarts the wizard.</Text>
              </View>
            </Pressable>

            <Pressable style={styles.actionBtn} onPress={handleLogout}>
              <LogOut size={20} color={colors.bad} />
              <View style={styles.actionTextWrapper}>
                <Text style={styles.actionTitle}>Log Out</Text>
                <Text style={styles.actionSub}>Clear current session and return to Login.</Text>
              </View>
            </Pressable>
          </View>

          <View style={styles.warningBox}>
            <AlertTriangle size={24} color={colors.bad} style={{ marginBottom: 8 }} />
            <Text style={styles.warningText}>This panel is for development only and will be removed in production builds. Do not use for real farm data.</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'IBMPlexMono-SemiBold',
    fontSize: 12,
    color: colors.inkSoft,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  infoLabel: {
    fontFamily: 'IBMPlexMono',
    fontSize: 12,
    color: colors.inkSoft,
  },
  infoValue: {
    fontFamily: 'IBMPlexMono-SemiBold',
    color: colors.ink,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  actionTextWrapper: {
    marginLeft: 16,
    flex: 1,
  },
  actionTitle: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 16,
    color: colors.ink,
  },
  actionSub: {
    fontFamily: 'IBMPlexSans',
    fontSize: 13,
    color: colors.inkSoft,
    marginTop: 2,
  },
  warningBox: {
    backgroundColor: 'rgba(229,103,92,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(229,103,92,0.3)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  warningText: {
    fontFamily: 'IBMPlexSans',
    fontSize: 12,
    color: colors.bad,
    textAlign: 'center',
    lineHeight: 18,
  },
});

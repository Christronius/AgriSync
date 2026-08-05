import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '../../theme/theme';
import { CircleCheck, ShieldCheck, Database, Rocket } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { useOnboarding } from '../../context/OnboardingContext';

export function SetupStep8_Review({ navigation }: any) {
  const { completeSetup } = useAuth();
  const { data } = useOnboarding();
  const [isInitializing, setIsInitializing] = useState(false);

  const handleComplete = async () => {
    setIsInitializing(true);
    // Submit all dynamically collected data to Supabase
    await completeSetup(data);
    // App.tsx will automatically route to MainTabs once setupCompleted becomes true
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepIndicator}>Step 8</Text>
        <Text style={styles.title}>Ready to Deploy</Text>
        <Text style={styles.subtitle}>Your farm's profile is complete. The digital twin environment has been provisioned.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(100).springify().damping(20)}>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.iconBox}>
                <Database size={20} color={colors.primary} />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>Offline-First Storage Ready</Text>
                <Text style={styles.rowSub}>Local queue configured for {data.name}.</Text>
              </View>
              <CircleCheck size={20} color={colors.primary} />
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <View style={styles.iconBox}>
                <ShieldCheck size={20} color={colors.primary} />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>Data Isolation Active</Text>
                <Text style={styles.rowSub}>RLS policies applied for {data.complianceRegion || 'your region'}.</Text>
              </View>
              <CircleCheck size={20} color={colors.primary} />
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <View style={styles.iconBox}>
                <Rocket size={20} color={colors.primary} />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>AI Agent Context Loaded</Text>
                <Text style={styles.rowSub}>Vector database initialized for your specific operations.</Text>
              </View>
              <CircleCheck size={20} color={colors.primary} />
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable 
          style={styles.backButton} 
          disabled={isInitializing}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
        <Pressable 
          style={[styles.nextButton, isInitializing && styles.nextButtonDisabled]} 
          disabled={isInitializing}
          onPress={handleComplete}
        >
          {isInitializing ? (
            <ActivityIndicator color={colors.bg} />
          ) : (
            <Text style={styles.nextButtonText}>Initialize Dashboard</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { padding: 24, paddingTop: 40 },
  stepIndicator: { fontFamily: 'IBMPlexMono', fontSize: 12, color: colors.primary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  title: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 28, color: colors.ink, marginBottom: 8 },
  subtitle: { fontFamily: 'IBMPlexSans', fontSize: 15, color: colors.inkSoft, lineHeight: 22 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 24 },
  card: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 16, padding: 16 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  iconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(95,182,91,0.16)', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  rowText: { flex: 1, paddingRight: 12 },
  rowTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 14, color: colors.ink, marginBottom: 4 },
  rowSub: { fontFamily: 'IBMPlexSans', fontSize: 12, color: colors.inkSoft, lineHeight: 18 },
  divider: { height: 1, backgroundColor: colors.line },
  footer: { flexDirection: 'row', padding: 24, paddingBottom: Platform.OS === 'ios' ? 0 : 24, gap: 16 },
  backButton: { flex: 1, height: 56, borderRadius: 28, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  backButtonText: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, color: colors.inkSoft },
  nextButton: { flex: 2, backgroundColor: colors.primary, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  nextButtonDisabled: { backgroundColor: colors.primarySoft },
  nextButtonText: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, color: colors.bg },
});

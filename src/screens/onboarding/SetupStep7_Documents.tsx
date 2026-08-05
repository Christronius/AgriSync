import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '../../theme/theme';
import { FileUp, Sparkles } from 'lucide-react-native';

export function SetupStep7_Documents({ navigation }: any) {
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepIndicator}>Step 7</Text>
        <Text style={styles.title}>Agent Context</Text>
        <Text style={styles.subtitle}>Upload initial documents (e.g. land deeds, SAPS declarations, soil tests). The AI Agent uses these to give personalized advice.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(100).springify().damping(20)} style={styles.uploadArea}>
          <View style={styles.iconCircle}>
            <FileUp size={32} color={colors.primary} />
          </View>
          <Text style={styles.uploadTitle}>Tap to select documents</Text>
          <Text style={styles.uploadSub}>PDF, DOCX, or Images (Max 10MB)</Text>
          
          <View style={styles.aiBadge}>
            <Sparkles size={12} color={colors.bg} style={{ marginRight: 4 }} />
            <Text style={styles.aiBadgeText}>Powers the Farm Assistant</Text>
          </View>
        </Animated.View>

        <Text style={styles.optionalText}>
          Don't have these handy? You can always upload them later from the settings.
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
        <Pressable 
          style={styles.nextButton} 
          onPress={() => navigation.navigate('SetupStep8')}
        >
          <Text style={styles.nextButtonText}>Skip for now</Text>
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
  uploadArea: { backgroundColor: 'rgba(95,182,91,0.05)', borderWidth: 1, borderColor: 'rgba(95,182,91,0.3)', borderStyle: 'dashed', borderRadius: 16, padding: 32, alignItems: 'center', marginBottom: 24 },
  iconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(95,182,91,0.16)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  uploadTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, color: colors.ink, marginBottom: 4 },
  uploadSub: { fontFamily: 'IBMPlexSans', fontSize: 13, color: colors.inkSoft, marginBottom: 16 },
  aiBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#9481E8', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  aiBadgeText: { fontFamily: 'IBMPlexMono', fontSize: 10, color: colors.bg, fontWeight: '600', textTransform: 'uppercase' },
  optionalText: { fontFamily: 'IBMPlexSans', fontSize: 13, color: colors.inkSoft, textAlign: 'center', lineHeight: 20, paddingHorizontal: 16 },
  footer: { flexDirection: 'row', padding: 24, paddingBottom: Platform.OS === 'ios' ? 0 : 24, gap: 16 },
  backButton: { flex: 1, height: 56, borderRadius: 28, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  backButtonText: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, color: colors.inkSoft },
  nextButton: { flex: 2, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  nextButtonText: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, color: colors.ink },
});

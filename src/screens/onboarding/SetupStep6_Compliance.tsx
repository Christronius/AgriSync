import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '../../theme/theme';
import { useOnboarding } from '../../context/OnboardingContext';
import { Globe2, Award } from 'lucide-react-native';

const REGIONS = [
  { id: 'eu_cap', label: 'European Union (CAP / SAPS)', desc: 'Common Agricultural Policy compliance and subsidy tracking.' },
  { id: 'us_usda', label: 'United States (USDA)', desc: 'USDA compliance, crop insurance, and conservation programs.' },
  { id: 'uk_defra', label: 'United Kingdom (DEFRA)', desc: 'ELMs, SFI, and general DEFRA agricultural compliance.' },
  { id: 'au_daff', label: 'Australia (DAFF)', desc: 'Biosecurity, export tracking, and land management.' },
  { id: 'none', label: 'None / Other', desc: 'No specific regulatory framework required.' },
];

const CERTIFICATIONS = [
  { id: 'organic', label: 'Certified Organic' },
  { id: 'globalgap', label: 'GlobalG.A.P' },
  { id: 'fairtrade', label: 'Fair Trade' },
  { id: 'regen_ag', label: 'Regenerative Ag Certified' },
  { id: 'b_corp', label: 'B-Corp' }
];

export function SetupStep6_Compliance({ navigation }: any) {
  const { data, updateData } = useOnboarding();

  const toggleCert = (id: string) => {
    let next = [...data.certifications];
    if (next.includes(id)) next = next.filter(c => c !== id);
    else next.push(id);
    updateData({ certifications: next });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepIndicator}>Step 6</Text>
        <Text style={styles.title}>Compliance & Certs</Text>
        <Text style={styles.subtitle}>Select your primary regulatory framework and active certifications.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(100).springify().damping(20)}>
          
          <Text style={styles.sectionTitle}>Primary Compliance Region</Text>
          {REGIONS.map(reg => {
            const active = data.complianceRegion === reg.id;
            return (
              <Pressable
                key={reg.id}
                style={[styles.card, active && styles.cardActive]}
                onPress={() => updateData({ complianceRegion: reg.id })}
              >
                <View style={styles.row}>
                  <Globe2 size={24} color={active ? colors.euBlue : colors.inkSoft} style={{ marginRight: 16 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.cardTitle, active && styles.cardTitleActive]}>{reg.label}</Text>
                    <Text style={styles.cardDesc}>{reg.desc}</Text>
                  </View>
                </View>
              </Pressable>
            );
          })}

          <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Certifications & Standards</Text>
          <View style={styles.chipsWrapper}>
            {CERTIFICATIONS.map(cert => {
              const active = data.certifications.includes(cert.id);
              return (
                <Pressable
                  key={cert.id}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => toggleCert(cert.id)}
                >
                  <Award size={16} color={active ? colors.primary : colors.inkSoft} style={{ marginRight: 8 }} />
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{cert.label}</Text>
                </Pressable>
              );
            })}
          </View>

        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
        <Pressable 
          style={[styles.nextButton, !data.complianceRegion && styles.nextButtonDisabled]} 
          disabled={!data.complianceRegion}
          onPress={() => navigation.navigate('SetupStep7')}
        >
          <Text style={styles.nextButtonText}>Next</Text>
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
  sectionTitle: { fontFamily: 'SpaceGrotesk-Medium', fontSize: 16, color: colors.ink, marginBottom: 16 },
  card: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 16, padding: 16, marginBottom: 12 },
  cardActive: { borderColor: colors.euBlue, backgroundColor: 'rgba(92,153,242,0.1)' },
  row: { flexDirection: 'row', alignItems: 'center' },
  cardTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, color: colors.ink, marginBottom: 4 },
  cardTitleActive: { color: colors.euBlue },
  cardDesc: { fontFamily: 'IBMPlexSans', fontSize: 13, color: colors.inkSoft, lineHeight: 18 },
  chipsWrapper: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card },
  chipActive: { borderColor: colors.primary, backgroundColor: 'rgba(107,224,103,0.1)' },
  chipText: { fontFamily: 'IBMPlexSans', fontSize: 14, color: colors.inkSoft },
  chipTextActive: { color: colors.primary },
  footer: { flexDirection: 'row', padding: 24, paddingBottom: Platform.OS === 'ios' ? 0 : 24, gap: 16 },
  backButton: { flex: 1, height: 56, borderRadius: 28, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  backButtonText: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, color: colors.inkSoft },
  nextButton: { flex: 2, backgroundColor: colors.primary, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  nextButtonDisabled: { backgroundColor: colors.line },
  nextButtonText: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, color: colors.bg },
});

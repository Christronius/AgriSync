import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '../../theme/theme';
import { Wifi, Droplet, Sun, Tag, Database, Cpu } from 'lucide-react-native';
import { useOnboarding } from '../../context/OnboardingContext';

const TECH_TYPES = [
  { id: 'soil', label: 'Soil Moisture Probes', icon: Droplet },
  { id: 'weather', label: 'Local Weather Station', icon: Sun },
  { id: 'eartags', label: 'Smart Ear Tags (Livestock)', icon: Tag },
  { id: 'storage', label: 'Storage Bin Monitors', icon: Database },
  { id: 'drones', label: 'Autonomous Drones', icon: Cpu },
  { id: 'gateway', label: 'LoRaWAN / WiFi Gateway', icon: Wifi },
];

const MACHINERY_BRANDS = [
  'John Deere', 'Case IH', 'New Holland', 'Fendt', 'Claas', 'Massey Ferguson',
  'Kubota', 'Mahindra', 'BCS / Two-Wheel', 'Trimble (GPS)', 'Custom / Other'
];

export function SetupStep5_Technology({ navigation }: any) {
  const { data, updateData } = useOnboarding();

  const toggleTech = (id: string) => {
    let next = [...data.tech];
    if (next.includes(id)) next = next.filter(t => t !== id);
    else next.push(id);
    updateData({ tech: next });
  };

  const toggleBrand = (brand: string) => {
    let next = [...data.machinery];
    if (next.includes(brand)) next = next.filter(b => b !== brand);
    else next.push(brand);
    updateData({ machinery: next });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepIndicator}>Step 5</Text>
        <Text style={styles.title}>IoT & Machinery</Text>
        <Text style={styles.subtitle}>Select the sensors and fleet brands currently active on your farm.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(100).springify().damping(20)}>
          
          <Text style={styles.sectionTitle}>Machinery & API Integrations</Text>
          <View style={styles.chipsWrapper}>
            {MACHINERY_BRANDS.map(brand => {
              const active = data.machinery.includes(brand);
              return (
                <Pressable
                  key={brand}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => toggleBrand(brand)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{brand}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Sensors & Hardware</Text>
          <View style={styles.list}>
            {TECH_TYPES.map((tech) => {
              const isSelected = data.tech.includes(tech.id);
              const IconComponent = tech.icon;
              
              return (
                <Pressable
                  key={tech.id}
                  style={[styles.row, isSelected && styles.rowActive]}
                  onPress={() => toggleTech(tech.id)}
                >
                  <View style={[styles.iconBox, isSelected && styles.iconBoxActive]}>
                    <IconComponent size={20} color={isSelected ? colors.gold : colors.inkSoft} />
                  </View>
                  <Text style={[styles.rowLabel, isSelected && styles.rowLabelActive]}>
                    {tech.label}
                  </Text>
                  <View style={[styles.checkbox, isSelected && styles.checkboxActive]} />
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
        <Pressable style={styles.nextButton} onPress={() => navigation.navigate('SetupStep6')}>
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
  chipsWrapper: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card },
  chipActive: { borderColor: colors.gold, backgroundColor: 'rgba(255,194,71,0.1)' },
  chipText: { fontFamily: 'IBMPlexSans', fontSize: 14, color: colors.inkSoft },
  chipTextActive: { color: colors.gold },
  list: { gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 16, padding: 16 },
  rowActive: { borderColor: colors.gold, backgroundColor: 'rgba(232,179,74,0.05)' },
  iconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.03)', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  iconBoxActive: { backgroundColor: 'rgba(232,179,74,0.16)' },
  rowLabel: { flex: 1, fontFamily: 'SpaceGrotesk-Medium', fontSize: 14, color: colors.ink },
  rowLabelActive: { color: colors.gold },
  checkbox: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.line },
  checkboxActive: { borderColor: colors.gold, backgroundColor: colors.gold },
  footer: { flexDirection: 'row', padding: 24, paddingBottom: Platform.OS === 'ios' ? 0 : 24, gap: 16 },
  backButton: { flex: 1, height: 56, borderRadius: 28, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  backButtonText: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, color: colors.inkSoft },
  nextButton: { flex: 2, backgroundColor: colors.primary, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  nextButtonText: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, color: colors.bg },
});

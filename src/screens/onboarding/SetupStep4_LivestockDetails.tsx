import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '../../theme/theme';
import { useOnboarding } from '../../context/OnboardingContext';
import { PawPrint } from 'lucide-react-native';

const LIVESTOCK_TYPES = [
  { id: 'dairy', label: 'Dairy Cattle' },
  { id: 'beef', label: 'Beef Cattle' },
  { id: 'sheep_goats', label: 'Sheep / Goats' },
  { id: 'poultry', label: 'Poultry' },
  { id: 'aquaculture', label: 'Aquaculture' }
];

const HOUSING_OPTIONS = ['Pasture-Raised', 'Free Stall Barn', 'Feedlot / Drylot', 'Confinement / Cage', 'Mixed'];
const PASTURE_MANAGEMENT = ['Set Stocking / Continuous', 'Rotational Grazing', 'Intensive Cell Grazing', 'None'];

export function SetupStep4_LivestockDetails({ navigation }: any) {
  const { data, updateData } = useOnboarding();

  // Only show details for livestock types the user actually selected in Step 2
  const activeLivestock = LIVESTOCK_TYPES.filter(lt => data.operations.includes(lt.id));

  const updateDetail = (id: string, field: 'size' | 'housing' | 'pasture', value: string | number) => {
    updateData({
      livestockDetails: {
        ...data.livestockDetails,
        [id]: {
          ...(data.livestockDetails[id] || { size: 0, housing: '', pasture: '' }),
          [field]: value
        }
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepIndicator}>Step 4</Text>
        <Text style={styles.title}>Livestock Details</Text>
        <Text style={styles.subtitle}>Let's specify the scale and housing for your animals.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(100).springify().damping(20)}>
          {activeLivestock.map(lt => (
            <View key={lt.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <PawPrint size={20} color={colors.primary} />
                <Text style={styles.cardTitle}>{lt.label}</Text>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Approximate Head Count</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 250"
                  placeholderTextColor={colors.line}
                  keyboardType="numeric"
                  value={data.livestockDetails[lt.id]?.size?.toString() || ''}
                  onChangeText={(val) => updateDetail(lt.id, 'size', parseInt(val) || 0)}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Primary Housing Style</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                  {HOUSING_OPTIONS.map(opt => {
                    const isActive = data.livestockDetails[lt.id]?.housing === opt;
                    return (
                      <Pressable 
                        key={opt}
                        style={[styles.chip, isActive && styles.chipActive]}
                        onPress={() => updateDetail(lt.id, 'housing', opt)}
                      >
                        <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{opt}</Text>
                      </Pressable>
                    )
                  })}
                </ScrollView>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Pasture Management</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                  {PASTURE_MANAGEMENT.map(opt => {
                    const isActive = data.livestockDetails[lt.id]?.pasture === opt;
                    return (
                      <Pressable 
                        key={opt}
                        style={[styles.chip, isActive && styles.chipActive]}
                        onPress={() => updateDetail(lt.id, 'pasture', opt)}
                      >
                        <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{opt}</Text>
                      </Pressable>
                    )
                  })}
                </ScrollView>
              </View>
            </View>
          ))}
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
        <Pressable 
          style={styles.nextButton} 
          onPress={() => navigation.navigate('SetupStep5')}
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
  card: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 16, padding: 20, marginBottom: 24 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  cardTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, color: colors.ink },
  inputGroup: { marginBottom: 20 },
  label: { fontFamily: 'IBMPlexMono', fontSize: 12, color: colors.inkSoft, marginBottom: 12, textTransform: 'uppercase' },
  input: { backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: colors.line, borderRadius: 12, paddingHorizontal: 16, height: 48, fontFamily: 'IBMPlexSans', fontSize: 15, color: colors.ink },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.bg },
  chipActive: { borderColor: colors.primary, backgroundColor: 'rgba(107,224,103,0.1)' },
  chipText: { fontFamily: 'IBMPlexSans', fontSize: 13, color: colors.inkSoft },
  chipTextActive: { color: colors.primary },
  footer: { flexDirection: 'row', padding: 24, paddingBottom: Platform.OS === 'ios' ? 0 : 24, gap: 16 },
  backButton: { flex: 1, height: 56, borderRadius: 28, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  backButtonText: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, color: colors.inkSoft },
  nextButton: { flex: 2, backgroundColor: colors.primary, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  nextButtonText: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, color: colors.bg },
});

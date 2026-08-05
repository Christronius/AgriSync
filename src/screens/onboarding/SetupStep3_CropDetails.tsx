import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '../../theme/theme';
import { useOnboarding } from '../../context/OnboardingContext';
import { Check } from 'lucide-react-native';

const CROP_CATEGORIES = [
  {
    title: 'Grains & Oilseeds',
    items: ['Wheat', 'Corn', 'Soybeans', 'Barley', 'Canola', 'Sunflowers', 'Oats', 'Sorghum']
  },
  {
    title: 'Vegetables & Root Crops',
    items: ['Potatoes', 'Sugar Beets', 'Tomatoes', 'Onions', 'Carrots', 'Leafy Greens', 'Peppers']
  },
  {
    title: 'Orchard & Vineyard',
    items: ['Apples', 'Grapes (Wine)', 'Grapes (Table)', 'Stone Fruit', 'Citrus', 'Nuts']
  },
  {
    title: 'Other',
    items: ['Alfalfa', 'Cotton', 'Hemp', 'Tobacco', 'Other']
  }
];

const IRRIGATION = ['Rainfed (None)', 'Center Pivot', 'Drip / Micro', 'Flood / Furrow', 'Greenhouse Controlled'];
const STORAGE = ['On-Farm Grain Silos', 'Cold Storage Rooms', 'Basic Barn / Shed', 'Off-Farm / Co-op', 'None'];

export function SetupStep3_CropDetails({ navigation }: any) {
  const { data, updateData } = useOnboarding();

  const toggleCrop = (crop: string) => {
    let next = [...data.crops];
    if (next.includes(crop)) next = next.filter(c => c !== crop);
    else next.push(crop);
    updateData({ crops: next });
  };

  const handleNext = () => {
    const hasLivestock = ['dairy', 'beef', 'sheep_goats', 'poultry', 'aquaculture'].some(op => data.operations.includes(op));
    if (hasLivestock) {
      navigation.navigate('SetupStep4_LivestockDetails');
    } else {
      navigation.navigate('SetupStep5');
    }
  };

  const isValid = data.crops.length > 0 && data.irrigation !== '' && data.storage !== '';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepIndicator}>Step 3</Text>
        <Text style={styles.title}>Crop Details</Text>
        <Text style={styles.subtitle}>Since you manage crops, let's specify what you grow, how you water them, and storage capacity.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(100).springify().damping(20)}>
          
          <Text style={styles.sectionTitle}>Primary Crops Grown</Text>
          {CROP_CATEGORIES.map(category => (
            <View key={category.title} style={{ marginBottom: 16 }}>
              <Text style={styles.subCategoryTitle}>{category.title}</Text>
              <View style={styles.chipsWrapper}>
                {category.items.map(crop => {
                  const active = data.crops.includes(crop);
                  return (
                    <Pressable
                      key={crop}
                      style={[styles.chip, active && styles.chipActive]}
                      onPress={() => toggleCrop(crop)}
                    >
                      <Text style={[styles.chipText, active && styles.chipTextActive]}>{crop}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}

          <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Primary Irrigation Method</Text>
          <View style={styles.radioWrapper}>
            {IRRIGATION.map(method => {
              const active = data.irrigation === method;
              return (
                <Pressable
                  key={method}
                  style={[styles.radioRow, active && styles.radioRowActive]}
                  onPress={() => updateData({ irrigation: method })}
                >
                  <View style={[styles.radioCircle, active && styles.radioCircleActive]}>
                    {active && <Check size={14} color={colors.primary} />}
                  </View>
                  <Text style={[styles.radioText, active && styles.radioTextActive]}>{method}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Storage Infrastructure</Text>
          <View style={styles.radioWrapper}>
            {STORAGE.map(store => {
              const active = data.storage === store;
              return (
                <Pressable
                  key={store}
                  style={[styles.radioRow, active && styles.radioRowActive]}
                  onPress={() => updateData({ storage: store })}
                >
                  <View style={[styles.radioCircle, active && styles.radioCircleActive]}>
                    {active && <Check size={14} color={colors.primary} />}
                  </View>
                  <Text style={[styles.radioText, active && styles.radioTextActive]}>{store}</Text>
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
          style={[styles.nextButton, !isValid && styles.nextButtonDisabled]} 
          disabled={!isValid}
          onPress={handleNext}
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
  subCategoryTitle: { fontFamily: 'IBMPlexSans-SemiBold', fontSize: 13, color: colors.inkSoft, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  chipsWrapper: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card },
  chipActive: { borderColor: colors.primary, backgroundColor: 'rgba(107,224,103,0.1)' },
  chipText: { fontFamily: 'IBMPlexSans', fontSize: 14, color: colors.inkSoft },
  chipTextActive: { color: colors.primary },
  radioWrapper: { gap: 12 },
  radioRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card },
  radioRowActive: { borderColor: colors.primary },
  radioCircle: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.line, marginRight: 16, alignItems: 'center', justifyContent: 'center' },
  radioCircleActive: { borderColor: colors.primary, backgroundColor: 'rgba(107,224,103,0.1)' },
  radioText: { fontFamily: 'IBMPlexSans', fontSize: 15, color: colors.inkSoft },
  radioTextActive: { color: colors.ink },
  footer: { flexDirection: 'row', padding: 24, paddingBottom: Platform.OS === 'ios' ? 0 : 24, gap: 16 },
  backButton: { flex: 1, height: 56, borderRadius: 28, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  backButtonText: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, color: colors.inkSoft },
  nextButton: { flex: 2, backgroundColor: colors.primary, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  nextButtonDisabled: { backgroundColor: colors.line },
  nextButtonText: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, color: colors.bg },
});

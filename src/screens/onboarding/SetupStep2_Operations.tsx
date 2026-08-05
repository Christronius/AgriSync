import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '../../theme/theme';
import { Wheat, Sprout, Flower2, Milk, PawPrint, Bird, TreePine, Grape, Tent, Droplet } from 'lucide-react-native';
import { useOnboarding } from '../../context/OnboardingContext';

const OP_GROUPS = [
  {
    title: 'Field Crops',
    options: [
      { id: 'grains', label: 'Grains & Cereals', icon: Wheat, category: 'crop' },
      { id: 'oilseeds', label: 'Oilseeds', icon: Flower2, category: 'crop' },
    ]
  },
  {
    title: 'Specialty Crops',
    options: [
      { id: 'vegetables', label: 'Vegetables', icon: Sprout, category: 'crop' },
      { id: 'orchards', label: 'Orchards / Vineyards', icon: Grape, category: 'crop' },
      { id: 'greenhouse', label: 'Greenhouse', icon: Tent, category: 'crop' },
    ]
  },
  {
    title: 'Livestock',
    options: [
      { id: 'dairy', label: 'Dairy Cattle', icon: Milk, category: 'livestock' },
      { id: 'beef', label: 'Beef Cattle', icon: PawPrint, category: 'livestock' },
      { id: 'sheep_goats', label: 'Sheep / Goats', icon: Flower2, category: 'livestock' }, 
      { id: 'poultry', label: 'Poultry', icon: Bird, category: 'livestock' },
      { id: 'aquaculture', label: 'Aquaculture', icon: Droplet, category: 'livestock' },
    ]
  },
  {
    title: 'Other',
    options: [
      { id: 'forestry', label: 'Agroforestry', icon: TreePine, category: 'other' },
    ]
  }
];

export function SetupStep2_Operations({ navigation }: any) {
  const { data, updateData } = useOnboarding();

  const toggleOp = (id: string) => {
    let newOps = [...data.operations];
    if (newOps.includes(id)) {
      newOps = newOps.filter(o => o !== id);
    } else {
      newOps.push(id);
    }
    updateData({ operations: newOps });
  };

  const isValid = data.operations.length > 0;

  const handleNext = () => {
    const allOptions = OP_GROUPS.flatMap(g => g.options);
    const hasCrops = allOptions.some(op => op.category === 'crop' && data.operations.includes(op.id));
    const hasLivestock = allOptions.some(op => op.category === 'livestock' && data.operations.includes(op.id));

    if (hasCrops) {
      navigation.navigate('SetupStep3_CropDetails');
    } else if (hasLivestock) {
      navigation.navigate('SetupStep4_LivestockDetails');
    } else {
      navigation.navigate('SetupStep5');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepIndicator}>Step 2</Text>
        <Text style={styles.title}>Operations</Text>
        <Text style={styles.subtitle}>What does your farm produce? Select all that apply.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(100).springify().damping(20)}>
          {OP_GROUPS.map((group, gIdx) => (
            <View key={gIdx} style={styles.groupContainer}>
              <Text style={styles.groupTitle}>{group.title}</Text>
              <View style={styles.grid}>
                {group.options.map((op) => {
                  const isSelected = data.operations.includes(op.id);
                  const IconComponent = op.icon;
                  
                  return (
                    <Pressable
                      key={op.id}
                      style={[styles.card, isSelected && styles.cardActive]}
                      onPress={() => toggleOp(op.id)}
                    >
                      <View style={[styles.iconBox, isSelected && styles.iconBoxActive]}>
                        <IconComponent size={24} color={isSelected ? colors.primary : colors.inkSoft} />
                      </View>
                      <Text style={[styles.cardLabel, isSelected && styles.cardLabelActive]}>
                        {op.label}
                      </Text>
                    </Pressable>
                  );
                })}
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
  groupContainer: { marginBottom: 24 },
  groupTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, color: colors.ink, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '48%', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 16, padding: 16, alignItems: 'center', gap: 12 },
  cardActive: { borderColor: colors.primary, backgroundColor: 'rgba(95,182,91,0.05)' },
  iconBox: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.03)', alignItems: 'center', justifyContent: 'center' },
  iconBoxActive: { backgroundColor: 'rgba(95,182,91,0.16)' },
  cardLabel: { fontFamily: 'SpaceGrotesk-Medium', fontSize: 13, color: colors.ink, textAlign: 'center' },
  cardLabelActive: { color: colors.primary },
  footer: { flexDirection: 'row', padding: 24, paddingBottom: Platform.OS === 'ios' ? 0 : 24, gap: 16 },
  backButton: { flex: 1, height: 56, borderRadius: 28, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  backButtonText: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, color: colors.inkSoft },
  nextButton: { flex: 2, backgroundColor: colors.primary, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  nextButtonDisabled: { backgroundColor: colors.line },
  nextButtonText: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, color: colors.bg },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '../../theme/theme';
import { MapPin, Tractor, Scaling, UserRound } from 'lucide-react-native';
import { useOnboarding } from '../../context/OnboardingContext';

const ROLES = [
  { id: 'owner', label: 'Owner / Operator' },
  { id: 'manager', label: 'Farm Manager' },
  { id: 'agronomist', label: 'Agronomist' },
  { id: 'worker', label: 'Field Worker' },
];

const SCALES = [
  { id: 'homestead', label: 'Homestead (< 5 ha)' },
  { id: 'small_commercial', label: 'Small Commercial (5 - 50 ha)' },
  { id: 'medium_enterprise', label: 'Medium Enterprise (50 - 500 ha)' },
  { id: 'large_commercial', label: 'Large Commercial (> 500 ha)' },
];

const FOCUSES = [
  { id: 'self_sustaining', label: 'Self-Sustaining / Local' },
  { id: 'wholesale', label: 'Wholesale Commodity' },
  { id: 'direct_to_consumer', label: 'Direct-to-Consumer' },
  { id: 'seed_production', label: 'Seed Production' },
];

export function SetupStep1_Identity({ navigation }: any) {
  const { data, updateData } = useOnboarding();

  const isValid = 
    data.name.trim().length > 0 && 
    data.location.trim().length > 0 && 
    data.size.trim().length > 0 && 
    data.role !== '' &&
    data.scale !== '' &&
    data.primaryFocus !== '';

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.stepIndicator}>Step 1</Text>
          <Text style={styles.title}>Farm Identity</Text>
          <Text style={styles.subtitle}>Let's set up the digital twin of your farm. We'll start with the basics.</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.delay(100).springify().damping(20)} style={styles.form}>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Your Role</Text>
              <View style={styles.roleGrid}>
                {ROLES.map((r) => (
                  <Pressable
                    key={r.id}
                    style={[styles.roleChip, data.role === r.id && styles.roleChipActive]}
                    onPress={() => updateData({ role: r.id })}
                  >
                    <UserRound size={16} color={data.role === r.id ? colors.primary : colors.inkSoft} style={{marginRight: 6}} />
                    <Text style={[styles.roleText, data.role === r.id && styles.roleTextActive]}>{r.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Scale of Operations</Text>
              <View style={styles.roleGrid}>
                {SCALES.map((s) => (
                  <Pressable
                    key={s.id}
                    style={[styles.roleChip, data.scale === s.id && styles.roleChipActive]}
                    onPress={() => updateData({ scale: s.id })}
                  >
                    <Text style={[styles.roleText, data.scale === s.id && styles.roleTextActive]}>{s.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Primary Focus</Text>
              <View style={styles.roleGrid}>
                {FOCUSES.map((f) => (
                  <Pressable
                    key={f.id}
                    style={[styles.roleChip, data.primaryFocus === f.id && styles.roleChipActive]}
                    onPress={() => updateData({ primaryFocus: f.id })}
                  >
                    <Text style={[styles.roleText, data.primaryFocus === f.id && styles.roleTextActive]}>{f.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Farm Name</Text>
              <View style={styles.inputWrapper}>
                <Tractor size={20} color={colors.inkSoft} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Sunny Vale Farm"
                  placeholderTextColor={colors.line}
                  value={data.name}
                  onChangeText={(val) => updateData({ name: val })}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location / Region</Text>
              <View style={styles.inputWrapper}>
                <MapPin size={20} color={colors.inkSoft} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Transylvania, Romania"
                  placeholderTextColor={colors.line}
                  value={data.location}
                  onChangeText={(val) => updateData({ location: val })}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Total Operational Size (Hectares)</Text>
              <View style={styles.inputWrapper}>
                <Scaling size={20} color={colors.inkSoft} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 150"
                  placeholderTextColor={colors.line}
                  keyboardType="numeric"
                  value={data.size}
                  onChangeText={(val) => updateData({ size: val })}
                />
              </View>
            </View>
          </Animated.View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable 
            style={[styles.nextButton, !isValid && styles.nextButtonDisabled]} 
            disabled={!isValid}
            onPress={() => navigation.navigate('SetupStep2')}
          >
            <Text style={styles.nextButtonText}>Continue to Operations</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { padding: 24, paddingTop: 40 },
  stepIndicator: { fontFamily: 'IBMPlexMono', fontSize: 12, color: colors.primary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  title: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 28, color: colors.ink, marginBottom: 8 },
  subtitle: { fontFamily: 'IBMPlexSans', fontSize: 15, color: colors.inkSoft, lineHeight: 22 },
  form: { paddingHorizontal: 24, paddingBottom: 24 },
  inputGroup: { marginBottom: 24 },
  label: { fontFamily: 'SpaceGrotesk-Medium', fontSize: 14, color: colors.ink, marginBottom: 8 },
  roleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  roleChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10 },
  roleChipActive: { borderColor: colors.primary, backgroundColor: 'rgba(107,224,103,0.1)' },
  roleText: { fontFamily: 'SpaceGrotesk-Medium', fontSize: 13, color: colors.inkSoft },
  roleTextActive: { color: colors.primary },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 12, paddingHorizontal: 16, height: 56 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontFamily: 'IBMPlexSans', fontSize: 16, color: colors.ink, height: '100%' },
  footer: { padding: 24, paddingBottom: Platform.OS === 'ios' ? 0 : 24 },
  nextButton: { backgroundColor: colors.primary, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  nextButtonDisabled: { backgroundColor: colors.line },
  nextButtonText: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, color: colors.bg },
});

import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Calendar, ClipboardList, Lightbulb } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '../theme/theme';
import { HeroHeader } from '../components/Header';
import { Card, SectionLabel, StatusPill } from '../components/ui';
import { useData } from '../hooks/useData';
import { apiClient } from '../services/apiClient';

export function PlansScreen({ navigation }: any) {
  const { data: plansData, loading } = useData(() => apiClient.getPlans());

  const plans = plansData || [];

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const scheduled = plans.filter(p => p.status === 'Scheduled');
  const recommended = plans.filter(p => p.status === 'Recommended');

  return (
    <View style={styles.container}>
      <HeroHeader
        title="Plans & Tasks"
        subtitle="Schedules and recommendations"
        gradientColors={[colors.primaryDark, colors.primary]}
        WatermarkIcon={Calendar}
        onAI={() => navigation.navigate('ConsoleStack', { screen: 'AIAssistant' })}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <SectionLabel>Scheduled</SectionLabel>
        <View style={styles.list}>
          {scheduled.map((p, index) => (
            <Animated.View key={p.id} entering={FadeInDown.delay(index * 100).springify().damping(18)}>
              <Card style={styles.cardSpacing} accent={colors.gold}>
                <View style={styles.headerRow}>
                  <View style={styles.headerLeft}>
                    <View style={[styles.iconBox, { backgroundColor: colors.goldSoft }]}>
                      <ClipboardList size={18} color={colors.gold} strokeWidth={2.2} />
                    </View>
                    <Text style={styles.title} numberOfLines={2}>{p.title}</Text>
                  </View>
                </View>
                <View style={styles.details}>
                  <View style={styles.metaRow}>
                    <StatusPill status={p.status} />
                    <Text style={styles.target}>{p.target}  ·  {p.date}</Text>
                  </View>
                  <Text style={styles.product}>{p.product}</Text>
                </View>
              </Card>
            </Animated.View>
          ))}
        </View>

        <SectionLabel>Recommended Actions</SectionLabel>
        <View style={styles.list}>
          {recommended.map((p, index) => (
            <Animated.View key={p.id} entering={FadeInDown.delay((scheduled.length + index) * 100).springify().damping(18)}>
              <Card style={styles.cardSpacing} accent={colors.primary}>
                <View style={styles.headerRow}>
                  <View style={styles.headerLeft}>
                    <View style={[styles.iconBox, { backgroundColor: colors.primarySoft }]}>
                      <Lightbulb size={18} color={colors.primary} strokeWidth={2.2} />
                    </View>
                    <Text style={styles.title} numberOfLines={2}>{p.title}</Text>
                  </View>
                </View>
                <View style={styles.details}>
                  <View style={styles.metaRow}>
                    <StatusPill status={p.status} />
                    <Text style={styles.target}>{p.target}</Text>
                  </View>
                  <Text style={styles.product}>{p.product}</Text>
                </View>
              </Card>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scrollContent: { padding: 18, paddingBottom: 100 },
  list: { flexDirection: 'column', gap: 12, marginBottom: 24 },
  cardSpacing: { paddingVertical: 16, paddingHorizontal: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1, paddingRight: 8 },
  iconBox: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontFamily: 'SpaceGrotesk-Bold', fontSize: 15, color: colors.ink, letterSpacing: -0.3, lineHeight: 20 },
  details: { paddingLeft: 48 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  target: { fontFamily: 'IBMPlexMono', fontSize: 11, color: colors.inkSoft },
  product: { fontFamily: 'IBMPlexSans', fontSize: 13, color: colors.ink, lineHeight: 19 },
});

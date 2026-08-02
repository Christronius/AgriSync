import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { ShieldAlert, ChevronRight, CheckCircle2 } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '../theme/theme';
import { HeroHeader } from '../components/Header';
import { Card, SectionLabel } from '../components/ui';
import { useData } from '../hooks/useData';
import { apiClient } from '../services/apiClient';

export function NotificationsScreen({ navigation }: any) {
  const { data: fieldsData, loading: loadingF } = useData(() => apiClient.getFields());
  const { data: herdsData, loading: loadingH } = useData(() => apiClient.getHerds());

  const fields = fieldsData || [];
  const herds = herdsData || [];

  if (loadingF || loadingH) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const criticalFields = fields.filter(f => f.trap && f.trap.level === "Critical");
  const criticalHerds = herds.filter(h => h.parasite && h.parasite.level === "Critical");
  const hasCritical = criticalFields.length + criticalHerds.length > 0;

  return (
    <View style={styles.container}>
      <HeroHeader
        title="Notifications"
        subtitle="Alerts & system updates"
        gradientColors={["#702632", colors.bad]}
        WatermarkIcon={ShieldAlert}
        onBack={() => navigation.goBack()}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <SectionLabel>Active Alarms</SectionLabel>
        
        {hasCritical ? (
          <Animated.View entering={FadeInDown.delay(0).springify().damping(18)}>
            {criticalFields.map((f, i) => (
              <Pressable key={`field-${f.id}`} onPress={() => navigation.navigate('FieldDetail', { fieldId: f.id })}>
                <Card style={[styles.alertCard, { borderColor: colors.bad, borderWidth: 1 }]}>
                  <View style={styles.alertHeader}>
                    <View style={styles.pulseDot} />
                    <Text style={styles.alertTitle}>FIELD CRITICAL</Text>
                  </View>
                  <Text style={styles.alertItemTitle}>{f.name}</Text>
                  <Text style={styles.alertText}>
                    {f.trap?.pest.split(" · ")[0]} counts are dangerously above threshold ({f.trap?.count}/trap). Immediate intervention required to prevent crop loss.
                  </Text>
                  <View style={styles.alertActionBtn}>
                    <Text style={styles.alertActionText}>Deploy Spraying Drone</Text>
                    <ChevronRight size={14} color={colors.primary} />
                  </View>
                </Card>
              </Pressable>
            ))}

            {criticalHerds.map((h, i) => (
              <Pressable key={`herd-${h.id}`} onPress={() => navigation.navigate('HerdDetail', { herdId: h.id })}>
                <Card style={[styles.alertCard, { borderColor: colors.bad, borderWidth: 1 }]}>
                  <View style={styles.alertHeader}>
                    <View style={styles.pulseDot} />
                    <Text style={styles.alertTitle}>LIVESTOCK CRITICAL</Text>
                  </View>
                  <Text style={styles.alertItemTitle}>{h.name}</Text>
                  <Text style={styles.alertText}>
                    {h.parasite?.name.split(" · ")[0]} infection detected above threshold. High risk of spreading.
                  </Text>
                  <View style={styles.alertActionBtn}>
                    <Text style={styles.alertActionText}>Isolate & Treat Herd</Text>
                    <ChevronRight size={14} color={colors.primary} />
                  </View>
                </Card>
              </Pressable>
            ))}
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInDown.delay(0).springify().damping(18)}>
            <View style={styles.emptyState}>
              <CheckCircle2 size={40} color={colors.good} strokeWidth={1.5} />
              <Text style={styles.emptyTitle}>All clear!</Text>
              <Text style={styles.emptyDesc}>No critical alerts requiring your attention.</Text>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scrollContent: { padding: 18, paddingBottom: 24 },
  alertCard: { backgroundColor: colors.card, padding: 16, marginBottom: 16 },
  alertHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  pulseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.bad },
  alertTitle: { fontFamily: 'IBMPlexMono', fontSize: 12, letterSpacing: 0.5, color: colors.bad, textTransform: 'uppercase', fontWeight: 'bold' },
  alertItem: { marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.line },
  alertItemTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, color: colors.ink, marginBottom: 4 },
  alertText: { fontFamily: 'IBMPlexSans', fontSize: 13.5, color: colors.inkSoft, marginBottom: 8, lineHeight: 20 },
  alertActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', paddingVertical: 4, paddingHorizontal: 10, backgroundColor: colors.primarySoft, borderRadius: 999 },
  alertActionText: { fontFamily: 'IBMPlexSans-SemiBold', fontSize: 12, color: colors.primary },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.line },
  emptyTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, color: colors.ink, marginTop: 16 },
  emptyDesc: { fontFamily: 'IBMPlexSans', fontSize: 13, color: colors.inkSoft, marginTop: 6 },
});

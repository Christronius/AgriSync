import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ShieldCheck, ChevronRight, CheckCircle2, FileText, Circle, Upload } from 'lucide-react-native';
import { colors } from '../theme/theme';
import { Card, SectionLabel, StatusPill, ProgressBar } from '../components/ui';
import { HeroHeader } from '../components/Header';
import { useData } from '../hooks/useData';
import { apiClient } from '../services/apiClient';

export function ComplianceScreen({ navigation }: any) {
  const { data: schemesData, loading: loadingSchemes } = useData(() => apiClient.getSchemes());
  const { data: traceabilityData, loading: loadingTrace } = useData(() => apiClient.getTraceability());

  const schemes = schemesData || [];
  const traceability = traceabilityData || [];

  if (loadingSchemes || loadingTrace) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const onTrackCount = schemes.filter(s => s.status === "On track").length;

  return (
    <View style={styles.container}>
      <HeroHeader
        title="Compliance"
        subtitle="EU APIA & tracking"
        gradientColors={[colors.euBlue, colors.euBlueLight]}
        WatermarkIcon={ShieldCheck}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <SectionLabel>Subsidy schemes</SectionLabel>
        <View style={styles.schemesList}>
          {schemes.map((s, index) => (
            <Animated.View key={s.id} entering={FadeInDown.delay(index * 100).springify().damping(18)}>
              <Card style={{ marginBottom: 12 }}>
                <View style={styles.schemeHeader}>
                  <Text style={styles.schemeName}>{s.name}</Text>
                  <View style={styles.schemeStatus}>
                    <StatusPill status={s.status} />
                    <ChevronRight size={15} color={colors.inkSoft} />
                  </View>
                </View>
                <View style={{ marginBottom: 6 }}>
                  <ProgressBar value={s.progress} color={s.progress >= 70 ? colors.good : s.progress >= 40 ? colors.warn : colors.bad} />
                </View>
                <View style={styles.schemeMeta}>
                  <Text style={styles.schemeMetaText}>{s.progress}% complete</Text>
                  <Text style={styles.schemeMetaText}>deadline {s.deadline}</Text>
                </View>
                {s.docs && s.docs.length > 0 && (
                  <View style={styles.docsList}>
                    {s.docs.map((doc, idx) => (
                      <Pressable 
                        key={idx} 
                        style={({ pressed }) => [styles.docRow, { opacity: pressed ? 0.6 : 1 }]}
                        onPress={() => navigation.navigate('Placeholder', { title: doc.label })}
                      >
                        {doc.done ? (
                          <CheckCircle2 size={14} color={colors.good} />
                        ) : (
                          <Upload size={14} color={colors.euBlue} />
                        )}
                        <Text style={[styles.docText, doc.done && styles.docDone]}>{doc.label}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </Card>
            </Animated.View>
          ))}
        </View>

        <Animated.View entering={FadeInDown.delay(schemes.length * 100).springify().damping(18)}>
          <SectionLabel>Traceability log</SectionLabel>
          <Card style={{ padding: 0, marginBottom: 16 }}>
            {traceability.map((t, i) => (
              <View key={t.id} style={[styles.traceRow, i < traceability.length - 1 && styles.borderBottom]}>
                <CheckCircle2 size={15} color={colors.good} style={{ marginTop: 1 }} />
                <View style={styles.traceContent}>
                  <Text style={styles.traceText}>{t.text}</Text>
                  <Text style={styles.traceTime}>{t.time}</Text>
                </View>
              </View>
            ))}
          </Card>

          <Pressable 
            style={({ pressed }) => [styles.exportBtn, { transform: [{ scale: pressed ? 0.98 : 1 }] }]}
            onPress={() => navigation.navigate('Placeholder', { title: 'APIA Export Configuration' })}
          >
            <FileText size={16} color="#fff" />
            <Text style={styles.exportBtnText}>Generate APIA export</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scrollContent: { padding: 18, paddingBottom: 24 },
  schemesList: { marginBottom: 16 },
  schemeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  schemeName: { fontFamily: 'IBMPlexSans-SemiBold', fontSize: 13, color: colors.ink, maxWidth: '62%' },
  schemeStatus: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  schemeMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  schemeMetaText: { fontFamily: 'IBMPlexMono', fontSize: 10.5, color: colors.inkSoft },
  traceRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', paddingVertical: 12, paddingHorizontal: 14 },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: colors.line },
  traceContent: { flex: 1 },
  traceText: { fontFamily: 'IBMPlexSans', fontSize: 12.5, color: colors.ink },
  traceTime: { fontFamily: 'IBMPlexMono', fontSize: 10, color: colors.inkSoft, marginTop: 2 },
  docsList: { marginTop: 12, borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 8 },
  docRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 },
  docText: { fontFamily: 'IBMPlexSans', fontSize: 12, color: colors.ink },
  docDone: { color: colors.inkSoft, textDecorationLine: 'line-through' },
  exportBtn: { width: '100%', paddingVertical: 14, borderRadius: 14, backgroundColor: colors.euBlue, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, elevation: 4, shadowColor: colors.euBlue, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 },
  exportBtnText: { color: '#fff', fontFamily: 'IBMPlexSans-SemiBold', fontSize: 13.5 },
});

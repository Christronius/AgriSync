import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, Image } from 'react-native';
import { PawPrint, Milk, TrendingUp, Syringe, Bird, Wifi } from 'lucide-react-native';
import { colors } from '../theme/theme';
import { Card, SectionLabel, IconBadge } from '../components/ui';
import { DetailHeader } from '../components/Header';
import { Gauge } from '../components/Gauge';
import { useData } from '../hooks/useData';
import { apiClient } from '../services/apiClient';

const herdStyle: Record<string, any> = {
  dairy: { icon: Milk,     fg: "#D2B27C", bg: "rgba(210,178,124,0.16)" },
  sheep: { icon: PawPrint, fg: "#A9B39C", bg: "rgba(169,179,156,0.14)" },
  poultry: { icon: Bird,   fg: "#D26B5C", bg: "rgba(210,107,92,0.16)" },
};

const herdCams: Record<string, any> = {
  dairy: require('../../assets/cams/dairy.png'),
  sheep: require('../../assets/cams/sheep.png'),
  poultry: require('../../assets/cams/poultry.png'),
};

export function HerdDetailScreen({ route, navigation }: any) {
  const { herdId } = route.params;
  const { data: h, loading } = useData(() => apiClient.getHerd(herdId), [herdId]);

  if (loading || !h) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const hs = herdStyle[h.herdType] || herdStyle.dairy;

  return (
    <View style={styles.container}>
      <DetailHeader
        title={h.name}
        subtitle={`${h.species} · ${h.count} head`}
        onBack={() => navigation.goBack()}
        onUser={() => navigation.navigate('Login')}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.topCard}>
          <View style={styles.topCardHeader}>
            <IconBadge Icon={hs.icon} fg={hs.fg} bg={hs.bg} size={42} />
            <View>
              <Text style={styles.speciesText}>{h.species}</Text>
              <Text style={styles.countText}>{h.count} head</Text>
            </View>
          </View>
          <View style={styles.gaugesRow}>
            <Gauge value={h.health} label="Health" color={h.health >= 75 ? colors.good : h.health >= 55 ? colors.warn : colors.bad} size={68} />
            <Gauge value={Math.round((h.bcs / 5) * 100)} label="Body condition" color={colors.primary} size={68} />
            <Gauge value={h.alerts === 0 ? 100 : Math.max(30, 100 - h.alerts * 25)} label="Care status" color={h.alerts > 0 ? colors.bad : colors.good} size={68} />
          </View>
        </Card>

        <SectionLabel>Live Camera Feed</SectionLabel>
        <Card style={styles.camCard}>
          <Image source={herdCams[h.herdType] || herdCams.dairy} style={styles.camImage} resizeMode="cover" />
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
          <View style={styles.camFooter}>
            <Wifi size={12} color={h.connectionStatus === 'online' ? colors.good : h.connectionStatus === 'unstable' ? colors.warn : colors.bad} />
            <Text style={styles.camFooterText}>
              {h.connectionStatus === 'online' ? 'Connection Stable' : h.connectionStatus === 'unstable' ? 'Connection Unstable' : 'Camera Offline'}
            </Text>
          </View>
        </Card>

        {h.milk && h.milkPred && (
          <>
            <SectionLabel>Milk output prediction</SectionLabel>
            <Card style={styles.milkCard}>
              <View style={styles.milkRow}>
                <Text style={styles.milkVal}>
                  {h.milkPred.expected} <Text style={styles.unitText}>{h.milkPred.unit}</Text>
                </Text>
                <Text style={styles.vsText}>
                  <TrendingUp size={12} color={colors.good} /> from {h.milkPred.lastMonth}
                </Text>
              </View>
            </Card>
          </>
        )}

        <SectionLabel>Treatment plan</SectionLabel>
        <Card>
          <View style={styles.planRow}>
            <Syringe size={16} color={colors.primary} />
            <Text style={styles.planText}>{h.plan}</Text>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scrollContent: { padding: 18, paddingBottom: 24 },
  topCard: { marginBottom: 14 },
  topCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  speciesText: { fontFamily: 'IBMPlexSans-SemiBold', fontSize: 13.5, color: colors.ink },
  countText: { fontFamily: 'IBMPlexMono', fontSize: 10.5, color: colors.inkSoft },
  gaugesRow: { flexDirection: 'row', justifyContent: 'space-around' },
  milkCard: { marginBottom: 14 },
  milkRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  milkVal: { fontFamily: 'IBMPlexMono', fontSize: 13, color: colors.ink },
  unitText: { fontSize: 11.5, color: colors.inkSoft },
  vsText: { fontFamily: 'IBMPlexMono', fontSize: 11.5, color: colors.good },
  planRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  planText: { fontFamily: 'IBMPlexSans', fontSize: 13, color: colors.ink, flexShrink: 1 },
  camCard: { padding: 0, overflow: 'hidden', marginBottom: 14, height: 200, backgroundColor: colors.bg },
  camImage: { width: '100%', height: '100%' },
  liveBadge: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.6)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 5 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FF3B30' },
  liveText: { fontFamily: 'IBMPlexMono-SemiBold', fontSize: 10, color: '#FFF' },
  camFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, gap: 6 },
  camFooterText: { fontFamily: 'IBMPlexSans', fontSize: 11, color: '#FFF' },
});

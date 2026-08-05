import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { Wheat, Sun, CloudSun, CloudRain, Wind, Droplets, ChevronRight, Circle } from 'lucide-react-native';
import { colors } from '../theme/theme';
import { HeroHeader } from '../components/Header';
import { Card, SectionLabel, IconBadge, StatusPill } from '../components/ui';
import { Gauge } from '../components/Gauge';
import { LineChart } from '../components/LineChart';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useData } from '../hooks/useData';
import { apiClient } from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

export function ConsoleScreen({ navigation }: any) {
  const { user } = useAuth();
  const { data: fieldsData, loading: loadingFields } = useData(() => apiClient.getFields());
  const { data: herdsData, loading: loadingHerds } = useData(() => apiClient.getHerds());
  const { data: notifsData, loading: loadingNotifs } = useData(() => apiClient.getNotifications());
  const { data: schemesData, loading: loadingSchemes } = useData(() => apiClient.getSchemes());

  const fields = fieldsData || [];
  const herds = herdsData || [];
  const notifications = notifsData || [];
  const schemes = schemesData || [];

  if (loadingFields || loadingHerds || loadingNotifs || loadingSchemes) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 12, color: colors.inkSoft, fontFamily: 'IBMPlexMono' }}>Fetching telemetry...</Text>
      </View>
    );
  }

  const criticalFields = fields.filter(f => f.trap && f.trap.level === "Critical");
  const criticalHerds = herds.filter(h => h.parasite && h.parasite.level === "Critical");
  const hasCritical = criticalFields.length + criticalHerds.length > 0;
  const attentionFields = fields.filter(f => f.health < 75);

  const revenueFields = fields.filter(f => f.econ && f.econ.margin !== null);
  const farmEconRaw = revenueFields.reduce((acc, f) => ({
    revenue: acc.revenue + f.econ!.revenue, cost: acc.cost + f.econ!.cost, profit: acc.profit + f.econ!.profit,
  }), { revenue: 0, cost: 0, profit: 0 });
  const margin = Math.round((farmEconRaw.profit / (farmEconRaw.revenue || 1)) * 100);

  const avgCrop = fields.length ? Math.round(fields.reduce((acc, f) => acc + f.health, 0) / fields.length) : 0;
  const avgSoil = fields.length ? Math.round(fields.reduce((acc, f) => acc + (f.health * 0.9), 0) / fields.length) : 0;
  const avgLivestock = herds.length ? Math.round(herds.reduce((acc, h) => acc + h.health, 0) / herds.length) : 0;
  const avgCompliance = schemes.length ? Math.round(schemes.reduce((acc, s) => acc + s.progress, 0) / schemes.length) : 0;

  return (
    <View style={styles.container}>
      <HeroHeader
        title={<Text>AgriSync<Text style={{fontSize: 9, fontWeight: '700', transform: [{ translateY: -12 }]}}>®</Text></Text>}
        gradientColors={[colors.primaryDark, colors.primary, colors.primaryLight]}
        onBell={() => navigation.navigate('Notifications')}
        onUser={() => navigation.navigate('AdminPanel')}
        notificationCount={notifications.length}
      />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Animated.View entering={FadeInDown.delay(hasCritical ? 100 : 0).springify().damping(18)}>
            <Card style={styles.overviewCard}>
              <View style={styles.overviewHeader}>
                <Text style={styles.overviewTitle}>Whole-Farm Overview</Text>
                <View style={styles.liveTag}>
                  <Circle size={7} fill={colors.good} color={colors.good} />
                  <Text style={styles.liveTagText}>LIVE</Text>
                </View>
              </View>
              <View style={styles.gaugeRow}>
                <Gauge value={avgSoil} label="Soil" color={avgSoil > 70 ? colors.good : avgSoil > 50 ? colors.warn : colors.bad} size={64} />
                <Gauge value={avgCrop} label="Crop" color={avgCrop > 70 ? colors.good : avgCrop > 50 ? colors.warn : colors.bad} size={64} />
                <Gauge value={avgLivestock} label="Livestock" color={avgLivestock > 70 ? colors.good : avgLivestock > 50 ? colors.warn : colors.bad} size={64} />
                <Gauge value={avgCompliance} label="Compliance" color={avgCompliance > 70 ? colors.good : avgCompliance > 50 ? colors.warn : colors.bad} size={64} />
              </View>
            </Card>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(100).springify().damping(18)}>
            <SectionLabel>Weather · Timișoara</SectionLabel>
            <Card style={{ marginBottom: 18, padding: 0, overflow: 'hidden' }}>
              <View style={{ padding: 16 }}>
                <View style={styles.weatherTop}>
                  <View style={styles.weatherMain}>
                    <IconBadge Icon={Sun} fg={colors.gold} bg={colors.goldSoft} size={48} />
                    <View>
                      <Text style={styles.weatherTemp}>27°C</Text>
                      <Text style={styles.weatherDesc}>Clear · Feels like 29°C</Text>
                    </View>
                  </View>
                  <View style={styles.weatherDetails}>
                    <View style={styles.weatherDetailRow}>
                      <Wind size={13} color={colors.inkSoft} />
                      <Text style={styles.weatherDetailText}>11 km/h</Text>
                    </View>
                    <View style={styles.weatherDetailRow}>
                      <Droplets size={13} color={colors.inkSoft} />
                      <Text style={styles.weatherDetailText}>48% humidity</Text>
                    </View>
                    <View style={styles.weatherDetailRow}>
                      <CloudRain size={13} color={colors.inkSoft} />
                      <Text style={styles.weatherDetailText}>0 mm rain</Text>
                    </View>
                  </View>
                </View>
              </View>
              
              <View style={styles.weatherForecastContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weatherForecastScroll}>
                  {[
                    { d: "Today", Icon: Sun, t: 27, pop: 0 },
                    { d: "Tue", Icon: CloudSun, t: 24, pop: 10 },
                    { d: "Wed", Icon: CloudRain, t: 22, pop: 80 },
                    { d: "Thu", Icon: CloudRain, t: 19, pop: 90 },
                    { d: "Fri", Icon: CloudSun, t: 21, pop: 20 },
                    { d: "Sat", Icon: Sun, t: 25, pop: 5 },
                    { d: "Sun", Icon: Sun, t: 28, pop: 0 }
                  ].map((w, i) => (
                    <View key={i} style={styles.forecastItem}>
                      <Text style={[styles.forecastDay, i === 0 && { color: colors.ink, fontWeight: '700' }]}>{w.d}</Text>
                      <View style={styles.forecastIconWrapper}>
                        <w.Icon size={20} color={w.pop > 50 ? colors.euBlue : colors.gold} strokeWidth={w.pop > 50 ? 2 : 2.5} />
                      </View>
                      <Text style={styles.forecastTemp}>{w.t}°</Text>
                      {w.pop > 0 ? (
                        <Text style={styles.popText}>{w.pop}%</Text>
                      ) : (
                        <Text style={[styles.popText, { color: 'transparent' }]}>0%</Text>
                      )}
                    </View>
                  ))}
                </ScrollView>
              </View>

              <Pressable style={styles.radarBtn} onPress={() => navigation.navigate('Placeholder', { title: 'Live Radar & Spray Conditions' })}>
                <Text style={styles.radarBtnText}>Open Live Radar & Spray Conditions</Text>
                <ChevronRight size={14} color={colors.primary} />
              </Pressable>
            </Card>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).springify().damping(18)}>
            <SectionLabel>Economics summary</SectionLabel>
            <Card onPress={() => navigation.navigate('Economics')}>
              <View style={styles.quarterContainer}>
                <View style={[styles.quarterBlock, { borderRightWidth: 1, borderRightColor: colors.line, paddingRight: 16 }]}>
                  <Text style={styles.quarterTitle}>Q1 Performance</Text>
                  <View style={styles.quarterStat}>
                    <Text style={[styles.econVal, { color: colors.ink }]}>{(farmEconRaw.revenue * 0.45).toLocaleString()}</Text>
                    <Text style={styles.econLbl}>Revenue (RON)</Text>
                  </View>
                  <View style={styles.quarterStat}>
                    <Text style={[styles.econVal, { color: farmEconRaw.profit >= 0 ? colors.good : colors.bad }]}>{((farmEconRaw.profit) * 0.45).toLocaleString()}</Text>
                    <Text style={styles.econLbl}>Net Profit</Text>
                  </View>
                  <View style={{ marginTop: 8, height: 40 }}>
                    <LineChart data={[0, -2000, -8000, -4000, -12000, -18000, -14000, -28000, -22000, -31000, -15000, -5000, -10000, 2000, -3000, 8000, 15000, 12000, 22000, 18000, 25000]} height={40} />
                  </View>
                </View>
                
                <View style={[styles.quarterBlock, { paddingLeft: 16 }]}>
                  <Text style={styles.quarterTitle}>Q2 Performance</Text>
                  <View style={styles.quarterStat}>
                    <Text style={[styles.econVal, { color: colors.ink }]}>{(farmEconRaw.revenue * 0.55).toLocaleString()}</Text>
                    <Text style={styles.econLbl}>Revenue (RON)</Text>
                  </View>
                  <View style={styles.quarterStat}>
                    <Text style={[styles.econVal, { color: farmEconRaw.profit >= 0 ? colors.good : colors.bad }]}>{((farmEconRaw.profit) * 0.55).toLocaleString()}</Text>
                    <Text style={styles.econLbl}>Net Profit</Text>
                  </View>
                  <View style={{ marginTop: 8, height: 40 }}>
                    <LineChart data={[25000, 21000, 28000, 18000, 24000, 15000, 32000, 28000, 41000, 36000, 48000, 42000, 55000, 49000, 62000, 58000, 71000, 65000, farmEconRaw.profit * 0.55]} height={40} />
                  </View>
                </View>
              </View>
            </Card>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scrollContent: { paddingBottom: 24 },
  content: { paddingHorizontal: 18, paddingTop: 0 },
  overviewCard: { marginTop: 16, marginBottom: 16, zIndex: 2 },
  overviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  overviewTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 14, color: colors.ink },
  liveTag: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  liveTagText: { fontFamily: 'IBMPlexMono', fontSize: 10, color: colors.good },
  gaugeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  weatherTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  weatherMain: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  weatherTemp: { fontFamily: 'IBMPlexMono-Bold', fontSize: 26, color: colors.ink },
  weatherDesc: { fontFamily: 'IBMPlexSans', fontSize: 11.5, color: colors.inkSoft },
  weatherDetails: { alignItems: 'flex-end', gap: 6 },
  weatherDetailRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  weatherDetailText: { fontFamily: 'IBMPlexMono', fontSize: 11, color: colors.inkSoft },
  weatherForecastContainer: { borderTopWidth: 1, borderTopColor: colors.line, backgroundColor: 'rgba(255,255,255,0.02)' },
  weatherForecastScroll: { paddingHorizontal: 16, paddingVertical: 14, gap: 20 },
  forecastItem: { alignItems: 'center', gap: 6 },
  forecastDay: { fontFamily: 'IBMPlexMono', fontSize: 11, color: colors.inkSoft },
  forecastIconWrapper: { height: 24, justifyContent: 'center' },
  forecastTemp: { fontFamily: 'IBMPlexMono', fontSize: 13, fontWeight: '700', color: colors.ink },
  popText: { fontFamily: 'IBMPlexMono', fontSize: 10, color: colors.euBlue, fontWeight: '600' },
  radarBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, backgroundColor: colors.primarySoft, borderTopWidth: 1, borderTopColor: colors.line },
  radarBtnText: { fontFamily: 'IBMPlexSans-SemiBold', fontSize: 12.5, color: colors.primary },
  alertBanner: { backgroundColor: colors.bad, borderRadius: 18, padding: 14, marginBottom: 20 },
  alertHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  pulseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
  alertTitle: { fontFamily: 'IBMPlexMono', fontSize: 10.5, letterSpacing: 0.5, color: '#fff', textTransform: 'uppercase' },
  alertText: { fontFamily: 'IBMPlexSans', fontSize: 12.5, color: '#fff', marginBottom: 3 },
  alertAction: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  alertActionText: { fontFamily: 'IBMPlexSans-SemiBold', fontSize: 12, color: '#fff' },
  quarterContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 4 },
  quarterBlock: { flex: 1 },
  quarterTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 13.5, color: colors.primary, marginBottom: 10 },
  quarterStat: { marginBottom: 10 },
  econVal: { fontFamily: 'IBMPlexMono-Bold', fontSize: 16 },
  econLbl: { fontFamily: 'IBMPlexSans', fontSize: 10.5, color: colors.inkSoft, marginTop: 2 },
  chartWrapper: { marginTop: 4, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.line },
});

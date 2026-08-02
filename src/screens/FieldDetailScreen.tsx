import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, Image } from 'react-native';
import { Leaf, Droplet, TrendingUp, TrendingDown, Wheat, Sprout, Flower2, Satellite, Layers, Wifi } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '../theme/theme';
import { Card, SectionLabel, IconBadge } from '../components/ui';
import { DetailHeader } from '../components/Header';
import { Gauge } from '../components/Gauge';
import { useData } from '../hooks/useData';
import { apiClient } from '../services/apiClient';

const cropStyle: Record<string, any> = {
  wheat:     { icon: Wheat,    fg: "#E8B34A",  bg: "rgba(232,179,74,0.16)" },
  corn:      { icon: Sprout,   fg: "#E0A25C",  bg: "rgba(224,162,92,0.16)" },
  pasture:   { icon: Leaf,     fg: colors.primary,  bg: colors.primarySoft },
  sunflower: { icon: Flower2,  fg: "#E08A3C",  bg: "rgba(224,138,60,0.16)" },
};

const ndviImages: Record<number, any> = {
  1: require('../../assets/ndvi/north_field.png'),
  2: require('../../assets/ndvi/south_field.png'),
  3: require('../../assets/ndvi/east_pasture.png'),
  4: require('../../assets/ndvi/west_field.png'),
};

export function FieldDetailScreen({ route, navigation }: any) {
  const { fieldId } = route.params;
  const { data: f, loading } = useData(() => apiClient.getField(fieldId), [fieldId]);

  if (loading || !f) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const cs = cropStyle[f.cropType] || cropStyle.wheat;
  const ndviImage = ndviImages[f.id];

  return (
    <View style={styles.container}>
      <DetailHeader
        title={f.name}
        subtitle={`${f.crop} · ${f.area} ha`}
        onBack={() => navigation.goBack()}
        onUser={() => navigation.navigate('Login')}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.topCard}>
          <View style={styles.topCardHeader}>
            <IconBadge Icon={cs.icon} fg={cs.fg} bg={cs.bg} size={42} />
            <View>
              <Text style={styles.cropText}>{f.crop}</Text>
              <Text style={styles.areaText}>{f.area} ha</Text>
            </View>
          </View>
          <View style={styles.gaugesRow}>
            <Gauge value={f.health} label="Health" color={f.health >= 75 ? colors.good : f.health >= 55 ? colors.warn : colors.bad} size={68} />
            <Gauge value={Math.round(f.ndvi * 100)} label="NDVI proxy" color={colors.primary} size={68} />
            <Gauge value={f.moisture} label="Moisture %" color={colors.gold} size={68} />
          </View>
        </Card>

        <Animated.View entering={FadeInDown.delay(50).springify().damping(18)}>
          <SectionLabel>Satellite View</SectionLabel>
          <Card style={styles.mapCard}>
            <View style={styles.imageContainer}>
              <Image source={require('../../assets/sat/field.png')} style={styles.ndviImage} resizeMode="cover" />
              <View style={styles.camFooter}>
                <Wifi size={12} color={f.connectionStatus === 'online' ? colors.good : f.connectionStatus === 'unstable' ? colors.warn : colors.bad} />
                <Text style={styles.camFooterText}>
                  {f.connectionStatus === 'online' ? 'Connection Stable' : f.connectionStatus === 'unstable' ? 'Connection Unstable' : 'Satellite Offline'}
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* NDVI Satellite Heat Map */}
        {ndviImage && (
          <Animated.View entering={FadeInDown.delay(100).springify().damping(18)}>
            <SectionLabel>Satellite NDVI · Heat Map</SectionLabel>
            <Card style={styles.mapCard}>
              <View style={styles.mapHeader}>
                <View style={styles.mapTitleRow}>
                  <IconBadge Icon={Satellite} fg="#5B8DEF" bg="rgba(91,141,239,0.14)" size={30} />
                  <View style={{ marginLeft: 8 }}>
                    <Text style={styles.mapTitle}>Vegetation Index</Text>
                    <Text style={styles.mapSubtitle}>Last capture · {f.lastAssessed}</Text>
                  </View>
                </View>
                <View style={styles.ndviBadge}>
                  <Text style={styles.ndviBadgeText}>{f.ndvi.toFixed(2)}</Text>
                </View>
              </View>
              <View style={styles.imageContainer}>
                <Image source={ndviImage} style={styles.ndviImage} resizeMode="cover" />
              </View>
              <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#E5675C' }]} />
                  <Text style={styles.legendText}>Stressed</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#E8B34A' }]} />
                  <Text style={styles.legendText}>Moderate</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#7CCB78' }]} />
                  <Text style={styles.legendText}>Healthy</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#2F8C2A' }]} />
                  <Text style={styles.legendText}>Very Healthy</Text>
                </View>
              </View>
            </Card>
          </Animated.View>
        )}

        {f.yieldPred && (
          <>
            <SectionLabel>Output prediction</SectionLabel>
            <Card style={styles.yieldCard}>
              <View style={styles.yieldRow}>
                <View>
                  <Text style={styles.expectedVal}>
                    {f.yieldPred.expected} <Text style={styles.unitText}>{f.yieldPred.unit}</Text>
                  </Text>
                  <Text style={styles.vsText}>vs {f.yieldPred.lastYear} {f.yieldPred.unit} last year</Text>
                </View>
                {f.yieldPred.expected >= f.yieldPred.lastYear ? (
                  <View style={[styles.trendPill, { backgroundColor: colors.primarySoft }]}>
                    <TrendingUp size={15} color={colors.good} />
                    <Text style={[styles.trendText, { color: colors.good }]}>
                      +{(((f.yieldPred.expected - f.yieldPred.lastYear) / f.yieldPred.lastYear) * 100).toFixed(1)}%
                    </Text>
                  </View>
                ) : (
                  <View style={[styles.trendPill, { backgroundColor: colors.badSoft }]}>
                    <TrendingDown size={15} color={colors.bad} />
                    <Text style={[styles.trendText, { color: colors.bad }]}>
                      {(((f.yieldPred.expected - f.yieldPred.lastYear) / f.yieldPred.lastYear) * 100).toFixed(1)}%
                    </Text>
                  </View>
                )}
              </View>
            </Card>
          </>
        )}

        <SectionLabel>Treatment plan</SectionLabel>
        <Card>
          <View style={styles.planRow}>
            <Leaf size={16} color={colors.primary} />
            <Text style={styles.planText}>{f.plan}</Text>
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
  cropText: { fontFamily: 'IBMPlexSans-SemiBold', fontSize: 13.5, color: colors.ink },
  areaText: { fontFamily: 'IBMPlexMono', fontSize: 10.5, color: colors.inkSoft },
  gaugesRow: { flexDirection: 'row', justifyContent: 'space-around' },
  // NDVI Map styles
  mapCard: { padding: 0, marginBottom: 14, overflow: 'hidden' },
  mapHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, paddingBottom: 10 },
  mapTitleRow: { flexDirection: 'row', alignItems: 'center' },
  mapTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 13.5, color: colors.ink },
  mapSubtitle: { fontFamily: 'IBMPlexMono', fontSize: 10, color: colors.inkSoft, marginTop: 1 },
  ndviBadge: { backgroundColor: colors.primarySoft, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999 },
  ndviBadgeText: { fontFamily: 'IBMPlexMono-Bold', fontSize: 13, color: colors.primary },
  imageContainer: { width: '100%', height: 200, backgroundColor: colors.bg },
  ndviImage: { width: '100%', height: '100%' },
  legendRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12, paddingHorizontal: 14, borderTopWidth: 1, borderTopColor: colors.line },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontFamily: 'IBMPlexMono', fontSize: 9.5, color: colors.inkSoft },
  // Yield
  yieldCard: { marginBottom: 14 },
  yieldRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  expectedVal: { fontFamily: 'IBMPlexMono-Bold', fontSize: 24, color: colors.ink },
  unitText: { fontSize: 12, color: colors.inkSoft, fontWeight: '500' },
  vsText: { fontFamily: 'IBMPlexSans', fontSize: 11.5, color: colors.inkSoft, marginTop: 2 },
  trendPill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 5, paddingHorizontal: 9, borderRadius: 999 },
  trendText: { fontFamily: 'IBMPlexMono', fontSize: 13 },
  planRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  planText: { fontFamily: 'IBMPlexSans', fontSize: 13, color: colors.ink, flexShrink: 1 },
  camFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, gap: 6 },
  camFooterText: { fontFamily: 'IBMPlexSans', fontSize: 11, color: '#FFF' },
});

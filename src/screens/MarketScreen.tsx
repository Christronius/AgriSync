import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Coins, TrendingUp, TrendingDown, Wheat, Sprout, Flower2, Milk, PawPrint, Zap, Bird } from 'lucide-react-native';
import { colors } from '../theme/theme';
import { Card, SectionLabel, IconBadge } from '../components/ui';
import { HeroHeader } from '../components/Header';
import { useData } from '../hooks/useData';
import { apiClient } from '../services/apiClient';

const cropStyle: Record<string, any> = {
  wheat:     { icon: Wheat,    fg: "#E8B34A",  bg: "rgba(232,179,74,0.16)" },
  corn:      { icon: Sprout,   fg: "#E0A25C",  bg: "rgba(224,162,92,0.16)" },
  sunflower: { icon: Flower2,  fg: "#E08A3C",  bg: "rgba(224,138,60,0.16)" },
};

const herdStyle: Record<string, any> = {
  dairy: { icon: Milk,     fg: "#D2B27C", bg: "rgba(210,178,124,0.16)" },
  sheep: { icon: PawPrint, fg: "#A9B39C", bg: "rgba(169,179,156,0.14)" },
  poultry: { icon: Bird,   fg: "#D26B5C", bg: "rgba(210,107,92,0.16)" },
};

export function MarketScreen({ navigation }: any) {
  const { data: marketPricesData, loading } = useData(() => apiClient.getMarketPrices());

  const marketPrices = marketPricesData || [];

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeroHeader
        title="Commodity Market"
        subtitle="Live pricing & analytics"
        gradientColors={[colors.teal, colors.tealLight]}
        WatermarkIcon={TrendingUp}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <SectionLabel>Local vs. EU reference prices</SectionLabel>
        <View style={styles.list}>
          {marketPrices.map((m, index) => {
            const style = m.cropType ? cropStyle[m.cropType] : herdStyle[m.herdType!];
            const up = m.trend > 0, flat = m.trend === 0;
            const diffPct = m.assumption ? Math.round(((m.local - m.assumption) / m.assumption) * 1000) / 10 : null;
            
            return (
              <Animated.View key={m.id} entering={FadeInDown.delay(index * 100).springify().damping(18)}>
                <Card 
                  style={{ marginBottom: 12 }} 
                  onPress={() => navigation.navigate('Placeholder', { title: `${m.name} Analytics` })}
                >
                  <View style={styles.headerRow}>
                    <View style={styles.headerLeft}>
                      <IconBadge Icon={style.icon} fg={style.fg} bg={style.bg} />
                      <View>
                        <Text style={styles.itemName}>{m.name}</Text>
                        <Text style={styles.itemUnit}>{m.unit}</Text>
                      </View>
                    </View>
                    <View style={[styles.trendPill, { backgroundColor: flat ? colors.line : up ? colors.primarySoft : colors.badSoft }]}>
                      {!flat && (up ? <TrendingUp size={12} color={up ? colors.good : colors.bad} /> : <TrendingDown size={12} color={up ? colors.good : colors.bad} />)}
                      <Text style={[styles.trendText, { color: flat ? colors.inkSoft : up ? colors.good : colors.bad }]}>
                        {flat ? "flat" : `${up ? "+" : ""}${m.trend}%`}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.pricesRow}>
                    <View style={styles.priceBlock}>
                      <Text style={styles.priceVal}>{typeof m.local === 'number' ? m.local.toFixed(2) : m.local}</Text>
                      <Text style={styles.priceLbl}>Local Market</Text>
                    </View>
                    <View style={styles.priceBlock}>
                      <Text style={[styles.priceVal, { color: colors.inkSoft }]}>{typeof m.global === 'number' ? m.global.toFixed(2) : m.global}</Text>
                      <Text style={styles.priceLbl}>EU reference</Text>
                    </View>
                  </View>

                  {diffPct !== null && Math.abs(diffPct) >= 2 && (
                    <View style={styles.insightAlert}>
                      <Zap size={13} color={colors.goldDark} style={{ marginTop: 1 }} />
                      <Text style={styles.insightText}>
                        Local price is {diffPct > 0 ? "+" : ""}{diffPct}% vs. the {m.assumption} {m.unit} assumption used in your economics — consider updating this season's estimate.
                      </Text>
                    </View>
                  )}
                </Card>
              </Animated.View>
            );
          })}
        </View>
        <Text style={styles.disclaimerText}>
          Example prices for illustration — connect a live feed (e.g. MADR, Euronext) for real-time pricing.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scrollContent: { padding: 18, paddingBottom: 24 },
  list: { flexDirection: 'column', gap: 10 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flexShrink: 1 },
  itemName: { fontFamily: 'IBMPlexSans-SemiBold', fontSize: 13.5, color: colors.ink },
  itemUnit: { fontFamily: 'IBMPlexMono', fontSize: 10, color: colors.inkSoft, marginTop: 2 },
  trendPill: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 999, flexShrink: 0 },
  trendText: { fontFamily: 'IBMPlexMono', fontSize: 11, fontWeight: '600' },
  pricesRow: { flexDirection: 'row', gap: 24, marginTop: 12 },
  priceBlock: {},
  priceVal: { fontFamily: 'IBMPlexMono-Bold', fontSize: 18, color: colors.ink },
  priceLbl: { fontFamily: 'IBMPlexSans', fontSize: 10, color: colors.inkSoft },
  insightAlert: { flexDirection: 'row', gap: 8, alignItems: 'flex-start', marginTop: 12, paddingVertical: 9, paddingHorizontal: 11, backgroundColor: colors.goldSoft, borderRadius: 10 },
  insightText: { fontFamily: 'IBMPlexSans', fontSize: 11.5, color: colors.ink, lineHeight: 16, flexShrink: 1 },
  disclaimerText: { fontFamily: 'IBMPlexSans', fontSize: 10.5, color: colors.inkSoft, marginTop: 14, lineHeight: 14 },
});

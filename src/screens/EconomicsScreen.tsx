import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Coins, TrendingUp, TrendingDown, Wheat, Sprout, Flower2, Milk, PawPrint, Zap, Bird, Leaf } from 'lucide-react-native';
import { colors } from '../theme/theme';
import { Card, SectionLabel, IconBadge } from '../components/ui';
import { HeroHeader } from '../components/Header';
import { useData } from '../hooks/useData';
import { apiClient } from '../services/apiClient';

const cropStyle: Record<string, any> = {
  wheat:     { icon: Wheat,    fg: "#E8B34A",  bg: "rgba(232,179,74,0.16)" },
  corn:      { icon: Sprout,   fg: "#E0A25C",  bg: "rgba(224,162,92,0.16)" },
  sunflower: { icon: Flower2,  fg: "#E08A3C",  bg: "rgba(224,138,60,0.16)" },
  pasture:   { icon: Leaf,     fg: "#7D9D75",  bg: "rgba(125,157,117,0.16)" },
};

const herdStyle: Record<string, any> = {
  dairy: { icon: Milk,     fg: "#D2B27C", bg: "rgba(210,178,124,0.16)" },
  sheep: { icon: PawPrint, fg: "#A9B39C", bg: "rgba(169,179,156,0.14)" },
  poultry: { icon: Bird,   fg: "#D26B5C", bg: "rgba(210,107,92,0.16)" },
};

export function EconomicsScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<'farm' | 'market'>('farm');
  const scrollViewRef = useRef<ScrollView>(null);
  const { data: fieldsData, loading: loadingFields } = useData(() => apiClient.getFields());
  const { data: herdsData, loading: loadingHerds } = useData(() => apiClient.getHerds());
  const { data: marketPricesData, loading: loadingPrices } = useData(() => apiClient.getMarketPrices());

  if (loadingFields || loadingHerds || loadingPrices) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 12, color: colors.inkSoft, fontFamily: 'IBMPlexMono' }}>Compiling economics...</Text>
      </View>
    );
  }

  const fields = fieldsData || [];
  const herds = herdsData || [];
  const marketPrices = marketPricesData || [];

  const revenueFields = fields.filter(f => f.econ && f.econ.margin !== null);
  const revenueHerds = herds.filter(h => h.econ && h.econ.margin !== null);

  const cropEcon = revenueFields.reduce((acc, f) => ({
    revenue: acc.revenue + f.econ!.revenue,
    cost: acc.cost + f.econ!.cost,
    profit: acc.profit + f.econ!.profit,
  }), { revenue: 0, cost: 0, profit: 0 });

  const herdEcon = revenueHerds.reduce((acc, h) => ({
    revenue: acc.revenue + h.econ!.revenue,
    cost: acc.cost + h.econ!.cost,
    profit: acc.profit + h.econ!.profit,
  }), { revenue: 0, cost: 0, profit: 0 });

  const totalEcon = {
    revenue: cropEcon.revenue + herdEcon.revenue,
    cost: cropEcon.cost + herdEcon.cost,
    profit: cropEcon.profit + herdEcon.profit,
  };

  const margin = Math.round((totalEcon.profit / (totalEcon.revenue || 1)) * 100);

  return (
    <View style={styles.container}>
      <HeroHeader
        title="Economics"
        subtitle="Farm financials & market"
        gradientColors={[colors.goldDark, colors.gold, colors.goldLight]}
        WatermarkIcon={Coins}
        onBack={() => navigation.goBack()}
      />
      
      <View style={styles.tabContainer}>
        <Pressable 
          style={[styles.tabButton, activeTab === 'farm' && styles.tabButtonActive]}
          onPress={() => {
            setActiveTab('farm');
            scrollViewRef.current?.scrollTo({ y: 0, animated: false });
          }}
        >
          <Text style={[styles.tabText, activeTab === 'farm' && styles.tabTextActive]}>Farm Economics</Text>
        </Pressable>
        <Pressable 
          style={[styles.tabButton, activeTab === 'market' && styles.tabButtonActive]}
          onPress={() => {
            setActiveTab('market');
            scrollViewRef.current?.scrollTo({ y: 0, animated: false });
          }}
        >
          <Text style={[styles.tabText, activeTab === 'market' && styles.tabTextActive]}>Commodity Market</Text>
        </Pressable>
      </View>

      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'farm' ? (
          <Animated.View entering={FadeInDown.delay(0).springify().damping(18)}>
            <Card style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Total YTD Performance</Text>
              <View style={styles.mainStatRow}>
                <View style={styles.statBlock}>
                  <Text style={[styles.statValue, { color: totalEcon.profit >= 0 ? colors.good : colors.bad }]}>
                    {totalEcon.profit.toLocaleString()}
                  </Text>
                  <Text style={styles.statLabel}>Net Profit (RON)</Text>
                </View>
                <View style={[styles.statBlock, { alignItems: 'flex-end' }]}>
                  <Text style={[styles.statValue, { color: colors.ink }]}>{margin}%</Text>
                  <Text style={styles.statLabel}>Profit Margin</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.subStatRow}>
                <View>
                  <Text style={styles.subStatValue}>{totalEcon.revenue.toLocaleString()}</Text>
                  <Text style={styles.subStatLabel}>Gross Revenue</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.subStatValue}>{totalEcon.cost.toLocaleString()}</Text>
                  <Text style={styles.subStatLabel}>Total Costs</Text>
                </View>
              </View>
            </Card>

            <SectionLabel>Economics Breakdown</SectionLabel>
            <View style={styles.list}>
              {revenueFields.map(f => {
                const styleInfo = cropStyle[f.cropType] || cropStyle.wheat;
                return (
                  <Card key={`field-${f.id}`} style={styles.itemCard}>
                    <View style={styles.itemHeader}>
                      <View style={styles.itemTitleRow}>
                        <IconBadge Icon={styleInfo.icon} fg={styleInfo.fg} bg={styleInfo.bg} size={30} />
                        <Text style={[styles.itemName, { marginLeft: 10 }]}>{f.name}</Text>
                      </View>
                      <Text style={[styles.itemMargin, { color: (f.econ.margin || 0) >= 0 ? colors.good : colors.bad }]}>
                        {f.econ.margin}% margin
                      </Text>
                    </View>
                    <View style={styles.itemStats}>
                      <View style={styles.itemStat}>
                        <Text style={styles.itemStatVal}>{f.econ.revenue.toLocaleString()}</Text>
                        <Text style={styles.itemStatLbl}>Revenue</Text>
                      </View>
                      <View style={styles.itemStat}>
                        <Text style={styles.itemStatVal}>{f.econ.cost.toLocaleString()}</Text>
                        <Text style={styles.itemStatLbl}>Cost</Text>
                      </View>
                      <View style={[styles.itemStat, { alignItems: 'flex-end' }]}>
                        <Text style={[styles.itemStatVal, { color: f.econ.profit >= 0 ? colors.good : colors.bad }]}>
                          {f.econ.profit.toLocaleString()}
                        </Text>
                        <Text style={styles.itemStatLbl}>Profit</Text>
                      </View>
                    </View>
                  </Card>
                );
              })}

              {revenueHerds.map(h => {
                const styleInfo = herdStyle[h.herdType] || herdStyle.dairy;
                return (
                  <Card key={`herd-${h.id}`} style={styles.itemCard}>
                    <View style={styles.itemHeader}>
                      <View style={styles.itemTitleRow}>
                        <IconBadge Icon={styleInfo.icon} fg={styleInfo.fg} bg={styleInfo.bg} size={30} />
                        <Text style={[styles.itemName, { marginLeft: 10 }]}>{h.name}</Text>
                      </View>
                      <Text style={[styles.itemMargin, { color: (h.econ.margin || 0) >= 0 ? colors.good : colors.bad }]}>
                        {h.econ.margin}% margin
                      </Text>
                    </View>
                    <View style={styles.itemStats}>
                      <View style={styles.itemStat}>
                        <Text style={styles.itemStatVal}>{h.econ.revenue.toLocaleString()}</Text>
                        <Text style={styles.itemStatLbl}>Revenue</Text>
                      </View>
                      <View style={styles.itemStat}>
                        <Text style={styles.itemStatVal}>{h.econ.cost.toLocaleString()}</Text>
                        <Text style={styles.itemStatLbl}>Cost</Text>
                      </View>
                      <View style={[styles.itemStat, { alignItems: 'flex-end' }]}>
                        <Text style={[styles.itemStatVal, { color: h.econ.profit >= 0 ? colors.good : colors.bad }]}>
                          {h.econ.profit.toLocaleString()}
                        </Text>
                        <Text style={styles.itemStatLbl}>Profit</Text>
                      </View>
                    </View>
                    {h.econ.note && (
                      <Text style={styles.itemNote}>{h.econ.note}</Text>
                    )}
                  </Card>
                );
              })}
            </View>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInDown.delay(0).springify().damping(18)}>
            <SectionLabel>Commodity Market</SectionLabel>
            <View style={styles.list}>
              {marketPrices.map((m, index) => {
                const style = m.cropType ? cropStyle[m.cropType] : herdStyle[m.herdType!];
                const up = m.trend > 0, flat = m.trend === 0;
                const diffPct = m.assumption ? Math.round(((m.local - m.assumption) / m.assumption) * 1000) / 10 : null;
                
                return (
                  <Card 
                    key={m.id}
                    style={{ marginBottom: 4 }} 
                    onPress={() => navigation.navigate('Placeholder', { title: `${m.name} Analytics` })}
                  >
                    <View style={styles.headerRow}>
                      <View style={styles.headerLeft}>
                        <IconBadge Icon={style.icon} fg={style.fg} bg={style.bg} />
                        <View>
                          <Text style={styles.itemMarketName}>{m.name}</Text>
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
                          Local price is {diffPct > 0 ? "+" : ""}{diffPct}% vs. the {m.assumption} {m.unit} assumption used in your economics.
                        </Text>
                      </View>
                    )}
                  </Card>
                );
              })}
            </View>
            <Text style={styles.disclaimerText}>
              Example prices for illustration — connect a live feed for real-time pricing.
            </Text>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  tabContainer: { flexDirection: 'row', paddingHorizontal: 18, paddingTop: 16, paddingBottom: 8, gap: 12 },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: colors.line },
  tabButtonActive: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  tabText: { fontFamily: 'SpaceGrotesk-Medium', fontSize: 13, color: colors.inkSoft },
  tabTextActive: { color: colors.primary },
  scrollContent: { padding: 18, paddingBottom: 40 },
  summaryCard: {
    padding: 20,
    marginBottom: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
  },
  summaryTitle: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 15,
    color: colors.inkSoft,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mainStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  statBlock: {},
  statValue: {
    fontFamily: 'IBMPlexMono-Bold',
    fontSize: 28,
  },
  statLabel: {
    fontFamily: 'IBMPlexSans',
    fontSize: 12,
    color: colors.inkSoft,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: colors.line,
    marginVertical: 16,
  },
  subStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subStatValue: {
    fontFamily: 'IBMPlexMono-SemiBold',
    fontSize: 18,
    color: colors.ink,
  },
  subStatLabel: {
    fontFamily: 'IBMPlexSans',
    fontSize: 11,
    color: colors.inkSoft,
    marginTop: 2,
  },
  list: { gap: 12 },
  itemCard: {
    padding: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemName: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 15,
    color: colors.ink,
  },
  itemMargin: {
    fontFamily: 'IBMPlexMono-SemiBold',
    fontSize: 12,
  },
  itemStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemStat: {
    flex: 1,
  },
  itemStatVal: {
    fontFamily: 'IBMPlexMono-SemiBold',
    fontSize: 14,
    color: colors.ink,
  },
  itemStatLbl: {
    fontFamily: 'IBMPlexSans',
    fontSize: 10.5,
    color: colors.inkSoft,
    marginTop: 2,
  },
  itemNote: {
    fontFamily: 'IBMPlexSans',
    fontSize: 11,
    color: colors.inkSoft,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    fontStyle: 'italic',
    lineHeight: 16,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flexShrink: 1 },
  itemMarketName: { fontFamily: 'IBMPlexSans-SemiBold', fontSize: 13.5, color: colors.ink },
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

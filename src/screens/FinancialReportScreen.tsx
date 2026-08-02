import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Coins, ChevronLeft, TrendingUp, TrendingDown, Wheat, Milk, Sprout, Flower2, PawPrint, Bird, Leaf } from 'lucide-react-native';
import { colors } from '../theme/theme';
import { HeroHeader } from '../components/Header';
import { Card, SectionLabel, IconBadge } from '../components/ui';
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

export function FinancialReportScreen({ navigation }: any) {
  const { data: fieldsData, loading: loadingFields } = useData(() => apiClient.getFields());
  const { data: herdsData, loading: loadingHerds } = useData(() => apiClient.getHerds());

  if (loadingFields || loadingHerds) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 12, color: colors.inkSoft, fontFamily: 'IBMPlexMono' }}>Compiling report...</Text>
      </View>
    );
  }

  const fields = fieldsData || [];
  const herds = herdsData || [];

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
        title="Financial Report"
        subtitle="Detailed economics & margins"
        gradientColors={[colors.goldDark, colors.gold, colors.goldLight]}
        WatermarkIcon={Coins}
        onBack={() => navigation.goBack()}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).springify().damping(18)}>
          <SectionLabel>Crop Economics</SectionLabel>
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
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify().damping(18)} style={{ marginTop: 24 }}>
          <SectionLabel>Livestock Economics</SectionLabel>
          <View style={styles.list}>
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scrollContent: { padding: 18, paddingBottom: 40 },
  summaryCard: {
    padding: 20,
    marginBottom: 24,
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
});

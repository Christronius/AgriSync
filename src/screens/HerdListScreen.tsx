import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, ActivityIndicator, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { PawPrint, ChevronRight, Bug, Search, X, Milk, Bird } from 'lucide-react-native';
import { colors } from '../theme/theme';
import { Card, IconBadge } from '../components/ui';
import { HeroHeader } from '../components/Header';
import { useData } from '../hooks/useData';
import { apiClient } from '../services/apiClient';

const herdStyle: Record<string, any> = {
  dairy: { icon: Milk,     fg: "#D2B27C", bg: "rgba(210,178,124,0.16)" },
  sheep: { icon: PawPrint, fg: "#A9B39C", bg: "rgba(169,179,156,0.14)" },
  poultry: { icon: Bird,   fg: "#D26B5C", bg: "rgba(210,107,92,0.16)" },
};

export function HerdListScreen({ navigation }: any) {
  const [query, setQuery] = useState("");
  const { data: herdsData, loading } = useData(() => apiClient.getHerds());

  const herds = herdsData || [];

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const filtered = herds.filter(h => h.name.toLowerCase().includes(query.toLowerCase()) || h.species.toLowerCase().includes(query.toLowerCase()));

  return (
    <View style={styles.container}>
      <HeroHeader
        title="Herd"
        subtitle="2 groups · 274 head"
        gradientColors={["#6B5E51", "#A69888"]}
        WatermarkIcon={PawPrint}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
        <View style={styles.searchBar}>
          <Search size={14} color={colors.inkSoft} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search herds or species…"
            placeholderTextColor={colors.inkSoft}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")}>
              <X size={14} color={colors.inkSoft} />
            </Pressable>
          )}
        </View>

        {filtered.map((h, index) => {
          const hs = herdStyle[h.herdType];
          const accent = h.health >= 75 ? colors.good : h.health >= 55 ? colors.warn : colors.bad;
          
          return (
            <Animated.View key={h.id} entering={FadeInDown.delay(index * 100).springify().damping(18)}>
              <Card style={{ marginBottom: 12 }} onPress={() => navigation.navigate('HerdDetail', { herdId: h.id })} accent={accent}>
                <View style={styles.cardRow}>
                  <View style={[styles.cardLeft, { flexShrink: 1 }]}>
                    <IconBadge Icon={hs.icon} fg={hs.fg} bg={hs.bg} />
                    <View style={{ flexShrink: 1 }}>
                      <View style={styles.titleRow}>
                        <Text style={styles.cardTitle} numberOfLines={1}>{h.name}</Text>
                        {h.parasite && h.parasite.level !== "Normal" && <Bug size={13} color={colors.bad} />}
                      </View>
                      <Text style={styles.cardSub} numberOfLines={1}>{h.species} · {h.count} head</Text>
                    </View>
                  </View>
                  <View style={styles.cardRight}>
                    <View style={styles.healthBlock}>
                      <Text style={styles.healthVal}>{h.health}</Text>
                      <Text style={styles.healthLbl}>health</Text>
                    </View>
                    <ChevronRight size={16} color={colors.inkSoft} />
                  </View>
                </View>
                
                {h.plan && (
                  <View style={styles.planRow}>
                    <View style={styles.planDot} />
                    <Text style={styles.planText}>{h.plan}</Text>
                  </View>
                )}
              </Card>
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scrollContent: { padding: 18, paddingBottom: 24 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 13, paddingHorizontal: 12, paddingVertical: 9, marginBottom: 12, gap: 8 },
  searchInput: { flex: 1, fontFamily: 'IBMPlexSans', fontSize: 12.5, color: colors.ink, padding: 0 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardTitle: { fontFamily: 'IBMPlexSans-SemiBold', fontSize: 14, color: colors.ink },
  cardSub: { fontFamily: 'IBMPlexSans', fontSize: 12, color: colors.inkSoft, marginTop: 2 },
  cardRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  healthBlock: { alignItems: 'flex-end' },
  healthVal: { fontFamily: 'IBMPlexMono-Bold', fontSize: 17, color: colors.ink },
  healthLbl: { fontFamily: 'IBMPlexSans', fontSize: 9.5, color: colors.inkSoft },
  planRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.line },
  planDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary },
  planText: { fontFamily: 'IBMPlexSans', fontSize: 12.5, color: colors.inkSoft, flexShrink: 1 },
});

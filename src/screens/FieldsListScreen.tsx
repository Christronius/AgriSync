import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, ActivityIndicator, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Wheat, ChevronRight, Bug, Search, X, Sprout, Leaf, Flower2 } from 'lucide-react-native';
import { colors } from '../theme/theme';
import { Card, IconBadge } from '../components/ui';
import { HeroHeader } from '../components/Header';
import { useData } from '../hooks/useData';
import { apiClient } from '../services/apiClient';

const cropStyle: Record<string, any> = {
  wheat:     { icon: Wheat,    fg: "#E8B34A",  bg: "rgba(232,179,74,0.16)" },
  corn:      { icon: Sprout,   fg: "#E0A25C",  bg: "rgba(224,162,92,0.16)" },
  pasture:   { icon: Leaf,     fg: colors.primary,  bg: colors.primarySoft },
  sunflower: { icon: Flower2,  fg: "#E08A3C",  bg: "rgba(224,138,60,0.16)" },
};

export function FieldsListScreen({ navigation }: any) {
  const [query, setQuery] = useState("");
  const { data: fieldsData, loading } = useData(() => apiClient.getFields());

  const fields = fieldsData || [];

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const filtered = fields.filter(f => f.name.toLowerCase().includes(query.toLowerCase()) || f.crop.toLowerCase().includes(query.toLowerCase()));

  return (
    <View style={styles.container}>
      <HeroHeader
        title="Fields"
        subtitle={`${fields.length} lots · 155 ha total`}
        gradientColors={[colors.goldDark, colors.gold]}
        WatermarkIcon={Wheat}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
        <View style={styles.searchBar}>
          <Search size={14} color={colors.inkSoft} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search fields or crops…"
            placeholderTextColor={colors.inkSoft}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")}>
              <X size={14} color={colors.inkSoft} />
            </Pressable>
          )}
        </View>

        {filtered.map((f, index) => {
          const cs = cropStyle[f.cropType];
          const accent = f.health >= 75 ? colors.good : f.health >= 55 ? colors.warn : colors.bad;
          
          return (
            <Animated.View key={f.id} entering={FadeInDown.delay(index * 100).springify().damping(18)}>
              <Card style={{ marginBottom: 12 }} onPress={() => navigation.navigate('FieldDetail', { fieldId: f.id })} accent={accent}>
                <View style={styles.cardRow}>
                  <View style={[styles.cardLeft, { flexShrink: 1 }]}>
                    <IconBadge Icon={cs.icon} fg={cs.fg} bg={cs.bg} />
                    <View style={{ flexShrink: 1 }}>
                      <View style={styles.titleRow}>
                        <Text style={styles.cardTitle} numberOfLines={1}>{f.name}</Text>
                        {f.trap && f.trap.level !== "Normal" && <Bug size={13} color={colors.bad} />}
                      </View>
                      <Text style={styles.cardSub} numberOfLines={1}>{f.crop} · {f.area} ha</Text>
                      <Text style={styles.cardMeta} numberOfLines={1}>assessed {f.lastAssessed}</Text>
                    </View>
                  </View>
                  <View style={styles.cardRight}>
                    <View style={styles.healthBlock}>
                      <Text style={styles.healthVal}>{f.health}</Text>
                      <Text style={styles.healthLbl}>health</Text>
                    </View>
                    <ChevronRight size={16} color={colors.inkSoft} />
                  </View>
                </View>
                
                {f.plan && (
                  <View style={styles.planRow}>
                    <View style={styles.planDot} />
                    <Text style={styles.planText}>{f.plan}</Text>
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
  cardMeta: { fontFamily: 'IBMPlexMono', fontSize: 10, color: colors.inkSoft, marginTop: 3 },
  cardRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  healthBlock: { alignItems: 'flex-end' },
  healthVal: { fontFamily: 'IBMPlexMono-Bold', fontSize: 17, color: colors.ink },
  healthLbl: { fontFamily: 'IBMPlexSans', fontSize: 9.5, color: colors.inkSoft },
  planRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.line },
  planDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.goldDark },
  planText: { fontFamily: 'IBMPlexSans', fontSize: 12.5, color: colors.inkSoft, flexShrink: 1 },
});

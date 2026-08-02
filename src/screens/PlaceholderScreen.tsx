import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ChevronLeft, Construction } from 'lucide-react-native';
import { colors } from '../theme/theme';

export function PlaceholderScreen({ route, navigation }: any) {
  const title = route.params?.title || "Feature in progress";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.7 : 1 }]}>
          <ChevronLeft size={24} color={colors.ink} />
        </Pressable>
      </View>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Construction size={48} color={colors.primary} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>
          This feature is currently a mockup. In a full production build, this screen will connect to the backend API to handle user inputs and data processing.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingTop: 60, paddingHorizontal: 18, paddingBottom: 10 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 2 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30, paddingBottom: 80 },
  iconContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  title: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 22, color: colors.ink, marginBottom: 12, textAlign: 'center' },
  description: { fontFamily: 'IBMPlexSans', fontSize: 14, color: colors.inkSoft, textAlign: 'center', lineHeight: 22 },
});

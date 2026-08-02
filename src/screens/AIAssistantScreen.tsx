import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Sparkles, Send, Bot, Camera, Sun, PawPrint, Droplet, Circle } from 'lucide-react-native';
import { colors } from '../theme/theme';
import { SectionLabel, Card, IconBadge } from '../components/ui';

export function AIAssistantScreen({ navigation }: any) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi! I'm your farm assistant. Ask me about fields, herds, prices, or compliance — or ask me to activate a connected system, like irrigation." },
  ]);
  const [typing, setTyping] = useState(false);

  type Device = {
    id: number;
    name: string;
    icon: any;
    online: boolean;
    kind: "toggle" | "action" | "status";
    on?: boolean;
    actionLabel?: string;
  };

  const [devices, setDevices] = useState<Device[]>([
    { id: 1, name: "Irrigation — Lot Vest", icon: Droplet, online: true, kind: "toggle", on: false },
    { id: 2, name: "Irrigation — Lot Sud", icon: Droplet, online: true, kind: "toggle", on: true },
    { id: 3, name: "Insect trap camera — Lot Vest", icon: Camera, online: true, kind: "action", actionLabel: "View snapshot" },
    { id: 4, name: "Weather station", icon: Sun, online: true, kind: "status" },
    { id: 5, name: "Livestock wearable gateway", icon: PawPrint, online: true, kind: "status" },
  ]);

  const aiSuggestions = [
    "Why is Lot Vest's margin low?",
    "Turn on irrigation for Lot Vest",
    "What's today's wheat price?",
    "Any APIA deadlines coming up?",
  ];

  function toggleDevice(id: number) {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, on: !d.on } : d));
  }

  function handleSend(text?: string) {
    const q = (text ?? input).trim();
    if (!q) return;
    setMessages(m => [...m, { role: "user", text: q }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages(m => [...m, { role: "ai", text: "I'm processing that information right now..." }]);
      setTyping(false);
    }, 700);
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.aiDark, colors.ai]} style={styles.header}>
        <View style={styles.watermark}>
          <Sparkles size={110} color="#fff" strokeWidth={1.2} />
        </View>
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ChevronLeft size={18} color="#fff" />
          </Pressable>
          <View>
            <Text style={styles.headerTitle}>Farm Assistant</Text>
            <Text style={styles.headerSubtitle}>Ask questions · view & activate systems</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {messages.map((m, i) => (
          <View key={i} style={[styles.bubbleContainer, m.role === 'user' ? styles.bubbleUser : styles.bubbleAI]}>
            {m.role === 'ai' && (
              <View style={styles.aiAvatar}>
                <Bot size={14} color={colors.ai} />
              </View>
            )}
            <LinearGradient
              colors={m.role === 'user' ? [colors.ai, colors.aiDark] : [colors.card, colors.card]}
              style={[styles.bubble, m.role === 'user' ? styles.bubbleStyleUser : styles.bubbleStyleAI]}
            >
              <Text style={[styles.bubbleText, { color: m.role === 'user' ? '#fff' : colors.ink }]}>{m.text}</Text>
            </LinearGradient>
          </View>
        ))}

        <View style={styles.suggestions}>
          {aiSuggestions.map((s, i) => (
            <Pressable key={i} onPress={() => handleSend(s)} style={styles.suggestionBtn}>
              <Text style={styles.suggestionText}>{s}</Text>
            </Pressable>
          ))}
        </View>

        <SectionLabel>Connected systems</SectionLabel>
        <Card style={{ padding: 0, marginBottom: 18 }}>
          {devices.map((d, i) => (
            <View key={d.id} style={[styles.deviceRow, i < devices.length - 1 && styles.borderBottom]}>
              <View style={styles.deviceLeft}>
                <IconBadge Icon={d.icon} fg={d.online ? colors.primary : colors.inkSoft} bg={d.online ? colors.primarySoft : colors.line} size={32} />
                <View>
                  <Text style={styles.deviceName}>{d.name}</Text>
                  <View style={styles.deviceStatus}>
                    <Circle size={6} fill={d.online ? colors.good : colors.inkSoft} color={d.online ? colors.good : colors.inkSoft} />
                    <Text style={styles.deviceStatusText}>{d.online ? "online" : "offline"}</Text>
                  </View>
                </View>
              </View>
              {d.kind === "toggle" && (
                <Pressable onPress={() => toggleDevice(d.id)} style={[styles.switch, d.on ? styles.switchOn : styles.switchOff]}>
                  <View style={styles.switchKnob} />
                </Pressable>
              )}
              {d.kind === "action" && (
                <Pressable style={styles.actionBtn} onPress={() => navigation.navigate('Placeholder', { title: d.actionLabel })}>
                  <Text style={styles.actionBtnText}>{d.actionLabel}</Text>
                </Pressable>
              )}
            </View>
          ))}
        </Card>
      </ScrollView>

      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask about a field, herd, price..."
          placeholderTextColor={colors.inkSoft}
          onSubmitEditing={() => handleSend()}
        />
        <Pressable onPress={() => handleSend()} style={styles.sendBtn}>
          <Send size={16} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { padding: 20, paddingTop: 50, borderBottomLeftRadius: 26, borderBottomRightRadius: 26, overflow: 'hidden' },
  watermark: { position: 'absolute', top: -10, right: -8, opacity: 0.14 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  backBtn: { backgroundColor: 'rgba(255,255,255,0.16)', borderRadius: 11, padding: 8 },
  headerTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 19, color: '#fff' },
  headerSubtitle: { fontFamily: 'IBMPlexSans', fontSize: 11.5, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  scrollContent: { padding: 18, paddingBottom: 100 },
  bubbleContainer: { flexDirection: 'row', marginBottom: 10 },
  bubbleUser: { justifyContent: 'flex-end' },
  bubbleAI: { justifyContent: 'flex-start' },
  aiAvatar: { width: 26, height: 26, borderRadius: 8, backgroundColor: colors.aiSoft, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  bubble: { maxWidth: '76%', paddingVertical: 10, paddingHorizontal: 13 },
  bubbleStyleUser: { borderRadius: 16, borderBottomRightRadius: 4 },
  bubbleStyleAI: { borderRadius: 16, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: colors.line },
  bubbleText: { fontFamily: 'IBMPlexSans', fontSize: 12.5, lineHeight: 18 },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 20 },
  suggestionBtn: { paddingVertical: 7, paddingHorizontal: 11, borderRadius: 999, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card },
  suggestionText: { fontFamily: 'IBMPlexSans', fontSize: 10.5, color: colors.ink },
  deviceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12 },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: colors.line },
  deviceLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  deviceName: { fontFamily: 'IBMPlexSans-SemiBold', fontSize: 12.5, color: colors.ink },
  deviceStatus: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  deviceStatusText: { fontFamily: 'IBMPlexMono', fontSize: 9.5, color: colors.inkSoft },
  switch: { width: 44, height: 26, borderRadius: 999, padding: 2, justifyContent: 'center' },
  switchOn: { backgroundColor: colors.good, alignItems: 'flex-end' },
  switchOff: { backgroundColor: colors.line, alignItems: 'flex-start' },
  switchKnob: { width: 22, height: 22, borderRadius: 999, backgroundColor: '#fff' },
  actionBtn: { backgroundColor: colors.euBlueSoft, borderRadius: 999, paddingVertical: 7, paddingHorizontal: 10 },
  actionBtnText: { fontFamily: 'IBMPlexMono', fontSize: 10, fontWeight: '600', color: colors.euBlue },
  inputArea: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 14, backgroundColor: 'rgba(20,23,15,0.92)', borderTopWidth: 1, borderTopColor: colors.line, flexDirection: 'row', gap: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: colors.line, borderRadius: 999, paddingHorizontal: 14, fontFamily: 'IBMPlexSans', fontSize: 12.5, backgroundColor: colors.card, color: colors.ink },
  sendBtn: { width: 40, height: 40, borderRadius: 999, backgroundColor: colors.ai, alignItems: 'center', justifyContent: 'center' },
});

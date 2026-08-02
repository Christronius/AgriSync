import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform, Modal, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, Send, Bot, Camera, Sun, PawPrint, Droplet, Circle, ClipboardList, Lightbulb, Bluetooth, Wifi, Radio, BatteryMedium, BatteryLow, BatteryFull, Signal, SignalLow, SignalZero, ScanSearch, Plus, Thermometer, Gauge, Wind } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '../theme/theme';
import { SectionLabel, Card, IconBadge, StatusPill } from '../components/ui';
import { HeroHeader } from '../components/Header';
import { useData } from '../hooks/useData';
import { apiClient } from '../services/apiClient';

type DeviceProtocol = 'bluetooth' | 'wifi' | 'lorawan';
type SignalStrength = 'strong' | 'weak' | 'none';

type Device = {
  id: number;
  name: string;
  icon: any;
  online: boolean;
  kind: "toggle" | "action" | "status";
  on?: boolean;
  actionLabel?: string;
  protocol: DeviceProtocol;
  battery: number;
  signal: SignalStrength;
  lastSync: string;
  firmware?: string;
  location?: string;
};

const protocolMeta: Record<DeviceProtocol, { label: string; Icon: any; color: string; bg: string }> = {
  bluetooth: { label: 'BLE', Icon: Bluetooth, color: '#5B8DEF', bg: 'rgba(91,141,239,0.14)' },
  wifi:      { label: 'Wi-Fi', Icon: Wifi, color: colors.primary, bg: colors.primarySoft },
  lorawan:   { label: 'LoRa', Icon: Radio, color: colors.teal, bg: 'rgba(58,174,146,0.14)' },
};

function BatteryIndicator({ level }: { level: number }) {
  const Icon = level > 60 ? BatteryFull : level > 25 ? BatteryMedium : BatteryLow;
  const color = level > 60 ? colors.good : level > 25 ? colors.warn : colors.bad;
  return (
    <View style={s.batteryRow}>
      <Icon size={14} color={color} />
      <Text style={[s.batteryText, { color }]}>{level}%</Text>
    </View>
  );
}

function SignalIndicator({ strength }: { strength: SignalStrength }) {
  const map = {
    strong: { Icon: Signal, color: colors.good, label: 'Strong' },
    weak:   { Icon: SignalLow, color: colors.warn, label: 'Weak' },
    none:   { Icon: SignalZero, color: colors.bad, label: 'None' },
  };
  const info = map[strength];
  return (
    <View style={s.signalRow}>
      <info.Icon size={13} color={info.color} />
      <Text style={[s.signalText, { color: info.color }]}>{info.label}</Text>
    </View>
  );
}

function ProtocolBadge({ protocol }: { protocol: DeviceProtocol }) {
  const info = protocolMeta[protocol];
  return (
    <View style={[s.protocolBadge, { backgroundColor: info.bg }]}>
      <info.Icon size={10} color={info.color} />
      <Text style={[s.protocolText, { color: info.color }]}>{info.label}</Text>
    </View>
  );
}

export function AssistantScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<'chat' | 'systems' | 'schedule'>('chat');
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi! I'm your farm assistant. Ask me about fields, herds, prices, or compliance — or scroll down to see your connected systems and scheduled tasks." },
  ]);
  const [typing, setTyping] = useState(false);
  const [scanning, setScanning] = useState(false);

  const [devices, setDevices] = useState<Device[]>([
    { id: 1, name: "Irrigation Controller", icon: Droplet, online: true, kind: "toggle", on: false, protocol: 'wifi', battery: 100, signal: 'strong', lastSync: '2 min ago', location: 'West Field', firmware: 'v2.1.4' },
    { id: 2, name: "Irrigation Controller", icon: Droplet, online: true, kind: "toggle", on: true, protocol: 'wifi', battery: 100, signal: 'strong', lastSync: '1 min ago', location: 'South Field', firmware: 'v2.1.4' },
    { id: 3, name: "Insect Trap Camera", icon: Camera, online: true, kind: "action", actionLabel: "View snapshot", protocol: 'lorawan', battery: 72, signal: 'strong', lastSync: '8 min ago', location: 'West Field', firmware: 'v1.3.0' },
    { id: 4, name: "Soil Moisture Sensor", icon: Droplet, online: true, kind: "status", protocol: 'bluetooth', battery: 54, signal: 'weak', lastSync: '15 min ago', location: 'East Field' },
    { id: 5, name: "Weather Station", icon: Wind, online: true, kind: "status", protocol: 'lorawan', battery: 88, signal: 'strong', lastSync: '5 min ago', location: 'Central Hub', firmware: 'v3.0.1' },
    { id: 6, name: "Temp Sensor – Barn A", icon: Thermometer, online: false, kind: "status", protocol: 'bluetooth', battery: 12, signal: 'none', lastSync: '3 hrs ago', location: 'Barn A' },
  ]);

  const aiSuggestions = [
    "Turn on irrigation for West Field",
    "What's today's wheat price?",
    "Any APIA deadlines coming up?",
  ];

  const { data: plansData, loading: loadingPlans } = useData(() => apiClient.getPlans());
  const [scheduledActions, setScheduledActions] = useState<any[]>([]);

  React.useEffect(() => {
    if (plansData) {
      setScheduledActions(plansData.filter(p => p.status === 'Scheduled'));
    }
  }, [plansData]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTarget, setNewTarget] = useState("");
  const [newDate, setNewDate] = useState("");

  function handleSchedule() {
    if (!newTitle.trim() || !newTarget.trim()) return;
    setScheduledActions(prev => [{
      id: Date.now(),
      type: "Crop",
      target: newTarget,
      title: newTitle,
      product: "Manual Entry",
      date: newDate || "TBD",
      status: "Scheduled"
    }, ...prev]);
    setModalVisible(false);
    setNewTitle("");
    setNewTarget("");
    setNewDate("");
  }

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

  function handleScan() {
    setScanning(true);
    // Simulate BLE scan
    setTimeout(() => {
      setScanning(false);
    }, 3000);
  }

  const onlineDevices = devices.filter(d => d.online);
  const offlineDevices = devices.filter(d => !d.online);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0} style={styles.container}>
      <HeroHeader
        title="Farm Assistant"
        subtitle="AI · Systems · Plans"
        gradientColors={[colors.aiDark, colors.ai]}
        WatermarkIcon={Sparkles}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">

        <View style={styles.tabContainer}>
          <Pressable style={[styles.tabBtn, activeTab === 'chat' && styles.tabBtnActive]} onPress={() => setActiveTab('chat')}>
            <Text style={[styles.tabText, activeTab === 'chat' && styles.tabTextActive]}>Chat</Text>
          </Pressable>
          <Pressable style={[styles.tabBtn, activeTab === 'systems' && styles.tabBtnActive]} onPress={() => setActiveTab('systems')}>
            <Text style={[styles.tabText, activeTab === 'systems' && styles.tabTextActive]}>Systems</Text>
          </Pressable>
          <Pressable style={[styles.tabBtn, activeTab === 'schedule' && styles.tabBtnActive]} onPress={() => setActiveTab('schedule')}>
            <Text style={[styles.tabText, activeTab === 'schedule' && styles.tabTextActive]}>Schedule</Text>
          </Pressable>
        </View>

        {activeTab === 'chat' ? (
          <View style={styles.chatContainer}>
            {messages.map((m, i) => (
              <View key={i} style={[styles.msgRow, m.role === 'user' ? styles.msgUser : styles.msgAi]}>
                {m.role === 'ai' && (
                  <View style={styles.aiAvatar}>
                    <Sparkles size={14} color="#fff" />
                  </View>
                )}
                <View style={[styles.msgBubble, m.role === 'user' ? styles.bubbleUser : styles.bubbleAi]}>
                  <Text style={[styles.msgText, m.role === 'user' ? styles.msgTextUser : styles.msgTextAi]}>{m.text}</Text>
                </View>
              </View>
            ))}
            {typing && (
               <View style={[styles.msgRow, styles.msgAi]}>
                <View style={styles.aiAvatar}>
                  <Sparkles size={14} color="#fff" />
                </View>
                <View style={[styles.msgBubble, styles.bubbleAi, { paddingVertical: 12 }]}>
                  <ActivityIndicator size="small" color={colors.ai} />
                </View>
              </View>
            )}
          </View>
        ) : activeTab === 'systems' ? (
          <View>
            {/* Bluetooth Scan Section */}
            <Animated.View entering={FadeInDown.delay(0).springify().damping(18)}>
              <Card style={s.scanCard}>
                <View style={s.scanHeader}>
                  <View style={s.scanLeft}>
                    <IconBadge Icon={Bluetooth} fg="#5B8DEF" bg="rgba(91,141,239,0.14)" size={38} />
                    <View style={{ marginLeft: 12, flex: 1 }}>
                      <Text style={s.scanTitle}>Device Discovery</Text>
                      <Text style={s.scanSubtitle}>Scan for nearby BLE & LoRa sensors</Text>
                    </View>
                  </View>
                  <Pressable
                    onPress={handleScan}
                    disabled={scanning}
                    style={({ pressed }) => [s.scanBtn, scanning && { opacity: 0.6 }, { transform: [{ scale: pressed ? 0.96 : 1 }] }]}
                  >
                    {scanning ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <>
                        <ScanSearch size={14} color="#fff" />
                        <Text style={s.scanBtnText}>Scan</Text>
                      </>
                    )}
                  </Pressable>
                </View>
                {scanning && (
                  <View style={s.scanningBar}>
                    <Text style={s.scanningText}>Scanning for devices…</Text>
                  </View>
                )}
                <View style={s.scanStats}>
                  <View style={s.scanStatItem}>
                    <Text style={s.scanStatVal}>{devices.length}</Text>
                    <Text style={s.scanStatLbl}>Total</Text>
                  </View>
                  <View style={[s.scanStatItem, { borderLeftWidth: 1, borderLeftColor: colors.line, borderRightWidth: 1, borderRightColor: colors.line }]}>
                    <Text style={[s.scanStatVal, { color: colors.good }]}>{onlineDevices.length}</Text>
                    <Text style={s.scanStatLbl}>Online</Text>
                  </View>
                  <View style={s.scanStatItem}>
                    <Text style={[s.scanStatVal, { color: offlineDevices.length > 0 ? colors.bad : colors.inkSoft }]}>{offlineDevices.length}</Text>
                    <Text style={s.scanStatLbl}>Offline</Text>
                  </View>
                </View>
              </Card>
            </Animated.View>

            {/* Online Devices */}
            <Animated.View entering={FadeInDown.delay(100).springify().damping(18)}>
              <SectionLabel>Online · {onlineDevices.length} devices</SectionLabel>
              <View style={{ gap: 12, marginBottom: 24 }}>
                {onlineDevices.map(d => (
                  <Card key={d.id} style={s.deviceCard}>
                    <View style={s.deviceTopRow}>
                      <View style={s.deviceInfo}>
                        <IconBadge Icon={d.icon} fg={colors.primary} bg={colors.primarySoft} size={36} />
                        <View style={{ marginLeft: 10, flex: 1 }}>
                          <Text style={s.dName} numberOfLines={1}>{d.name}</Text>
                          {d.location && <Text style={s.dLocation}>{d.location}</Text>}
                        </View>
                      </View>
                      <View style={s.deviceActions}>
                        {d.kind === "toggle" && (
                          <Pressable onPress={() => toggleDevice(d.id)} style={[styles.switch, d.on ? styles.switchOn : styles.switchOff]}>
                            <View style={styles.switchKnob} />
                          </Pressable>
                        )}
                        {d.kind === "action" && (
                          <Pressable style={s.viewBtn} onPress={() => navigation.navigate('Placeholder', { title: d.actionLabel })}>
                            <Text style={s.viewBtnText}>{d.actionLabel}</Text>
                          </Pressable>
                        )}
                        {d.kind === "status" && (
                          <View style={s.statusDot}>
                            <Circle size={8} fill={colors.good} color={colors.good} />
                          </View>
                        )}
                      </View>
                    </View>
                    <View style={s.deviceMeta}>
                      <ProtocolBadge protocol={d.protocol} />
                      <SignalIndicator strength={d.signal} />
                      <BatteryIndicator level={d.battery} />
                      <Text style={s.syncText}>Synced {d.lastSync}</Text>
                    </View>
                  </Card>
                ))}
              </View>
            </Animated.View>

            {/* Offline Devices */}
            {offlineDevices.length > 0 && (
              <Animated.View entering={FadeInDown.delay(200).springify().damping(18)}>
                <SectionLabel>Offline · {offlineDevices.length} devices</SectionLabel>
                <View style={{ gap: 12, marginBottom: 24 }}>
                  {offlineDevices.map(d => (
                    <Card key={d.id} style={[s.deviceCard, { opacity: 0.7 }]}>
                      <View style={s.deviceTopRow}>
                        <View style={s.deviceInfo}>
                          <IconBadge Icon={d.icon} fg={colors.inkSoft} bg={colors.line} size={36} />
                          <View style={{ marginLeft: 10, flex: 1 }}>
                            <Text style={[s.dName, { color: colors.inkSoft }]} numberOfLines={1}>{d.name}</Text>
                            {d.location && <Text style={s.dLocation}>{d.location}</Text>}
                          </View>
                        </View>
                        <Pressable style={s.reconnectBtn} onPress={() => navigation.navigate('Placeholder', { title: `Reconnect ${d.name}` })}>
                          <Text style={s.reconnectText}>Reconnect</Text>
                        </Pressable>
                      </View>
                      <View style={s.deviceMeta}>
                        <ProtocolBadge protocol={d.protocol} />
                        <BatteryIndicator level={d.battery} />
                        <Text style={s.syncText}>Last seen {d.lastSync}</Text>
                      </View>
                    </Card>
                  ))}
                </View>
              </Animated.View>
            )}

            {/* Add Device Button */}
            <Animated.View entering={FadeInDown.delay(300).springify().damping(18)}>
              <Pressable 
                style={({ pressed }) => [s.addDeviceBtn, { transform: [{ scale: pressed ? 0.98 : 1 }] }]}
                onPress={() => navigation.navigate('Placeholder', { title: 'Pair New Device' })}
              >
                <Plus size={18} color={colors.ai} />
                <Text style={s.addDeviceText}>Pair New Device</Text>
              </Pressable>
            </Animated.View>
          </View>
        ) : (
          <View>
            <Animated.View entering={FadeInDown.delay(100).springify().damping(18)}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingRight: 4 }}>
                <Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: 13.5, color: colors.inkSoft, textTransform: 'uppercase', letterSpacing: 0.5, marginLeft: 4 }}>Scheduled</Text>
                <Pressable onPress={() => setModalVisible(true)} style={{ backgroundColor: colors.goldSoft, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 }}>
                  <Text style={{ fontFamily: 'IBMPlexSans-SemiBold', fontSize: 11, color: colors.goldDark }}>+ Schedule</Text>
                </Pressable>
              </View>
              <View style={styles.list}>
                {scheduledActions.map((p) => (
                  <Card key={p.id} style={styles.cardSpacing} accent={colors.gold}>
                    <View style={styles.planHeaderRow}>
                      <View style={styles.headerLeft}>
                        <View style={[styles.iconBox, { backgroundColor: colors.goldSoft }]}>
                          <ClipboardList size={18} color={colors.gold} strokeWidth={2.2} />
                        </View>
                        <Text style={styles.title} numberOfLines={2}>{p.title}</Text>
                      </View>
                    </View>
                    <View style={styles.details}>
                      <View style={styles.metaRow}>
                        <StatusPill status={p.status} />
                        <Text style={styles.target}>{p.target}  ·  {p.date}</Text>
                      </View>
                      <Text style={styles.product}>{p.product}</Text>
                    </View>
                  </Card>
                ))}
              </View>
            </Animated.View>
          </View>
        )}
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

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Scheduled Action</Text>
            
            <TextInput style={styles.modalInput} placeholder="Task Title (e.g. Fungicide pass)" placeholderTextColor={colors.inkSoft} value={newTitle} onChangeText={setNewTitle} />
            <TextInput style={styles.modalInput} placeholder="Target (e.g. West Field)" placeholderTextColor={colors.inkSoft} value={newTarget} onChangeText={setNewTarget} />
            <TextInput style={styles.modalInput} placeholder="Date (e.g. Jul 22)" placeholderTextColor={colors.inkSoft} value={newDate} onChangeText={setNewDate} />

            <View style={styles.modalActions}>
              <Pressable style={[styles.modalBtn, { backgroundColor: colors.line }]} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalBtnText}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.modalBtn, { backgroundColor: colors.gold }]} onPress={handleSchedule}>
                <Text style={[styles.modalBtnText, { color: '#fff' }]}>Save</Text>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

// IoT-specific styles
const s = StyleSheet.create({
  scanCard: { marginBottom: 24, padding: 16 },
  scanHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  scanLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  scanTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 15, color: colors.ink },
  scanSubtitle: { fontFamily: 'IBMPlexSans', fontSize: 11.5, color: colors.inkSoft, marginTop: 2 },
  scanBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#5B8DEF', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999 },
  scanBtnText: { fontFamily: 'IBMPlexSans-SemiBold', fontSize: 12, color: '#fff' },
  scanningBar: { backgroundColor: 'rgba(91,141,239,0.08)', borderRadius: 10, padding: 10, marginBottom: 14, alignItems: 'center' },
  scanningText: { fontFamily: 'IBMPlexMono', fontSize: 11, color: '#5B8DEF' },
  scanStats: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 14 },
  scanStatItem: { flex: 1, alignItems: 'center' },
  scanStatVal: { fontFamily: 'IBMPlexMono-Bold', fontSize: 20, color: colors.ink },
  scanStatLbl: { fontFamily: 'IBMPlexSans', fontSize: 10.5, color: colors.inkSoft, marginTop: 2 },
  deviceCard: { padding: 14 },
  deviceTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  deviceInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  deviceActions: { marginLeft: 8 },
  dName: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 13.5, color: colors.ink },
  dLocation: { fontFamily: 'IBMPlexMono', fontSize: 10.5, color: colors.inkSoft, marginTop: 2 },
  deviceMeta: { flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  protocolBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 3, paddingHorizontal: 7, borderRadius: 999 },
  protocolText: { fontFamily: 'IBMPlexMono', fontSize: 9.5, fontWeight: '600' },
  batteryRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  batteryText: { fontFamily: 'IBMPlexMono', fontSize: 10, fontWeight: '600' },
  signalRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  signalText: { fontFamily: 'IBMPlexMono', fontSize: 10, fontWeight: '600' },
  syncText: { fontFamily: 'IBMPlexMono', fontSize: 10, color: colors.inkSoft },
  viewBtn: { backgroundColor: colors.euBlueSoft, borderRadius: 999, paddingVertical: 7, paddingHorizontal: 10 },
  viewBtnText: { fontFamily: 'IBMPlexMono', fontSize: 10, fontWeight: '600', color: colors.euBlue },
  statusDot: { padding: 4 },
  reconnectBtn: { borderWidth: 1, borderColor: colors.line, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 12 },
  reconnectText: { fontFamily: 'IBMPlexMono', fontSize: 10, fontWeight: '600', color: colors.inkSoft },
  addDeviceBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1.5, borderColor: colors.aiSoft, borderStyle: 'dashed', borderRadius: 16, paddingVertical: 16, marginBottom: 24 },
  addDeviceText: { fontFamily: 'IBMPlexSans-SemiBold', fontSize: 14, color: colors.ai },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scrollContent: { padding: 18, paddingBottom: 24 },
  
  tabContainer: { flexDirection: 'row', backgroundColor: colors.card, padding: 4, borderRadius: 12, marginBottom: 24 },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  tabBtnActive: { backgroundColor: colors.aiSoft },
  tabText: { fontFamily: 'IBMPlexSans-SemiBold', fontSize: 13, color: colors.inkSoft },
  tabTextActive: { color: colors.ai },
  
  // Chat
  chatContainer: { gap: 16, paddingBottom: 24 },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, width: '100%' },
  msgUser: { justifyContent: 'flex-end' },
  msgAi: { justifyContent: 'flex-start' },
  aiAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.ai, alignItems: 'center', justifyContent: 'center' },
  msgBubble: { maxWidth: '80%', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 18 },
  bubbleUser: { backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  bubbleAi: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderBottomLeftRadius: 4 },
  msgText: { fontFamily: 'IBMPlexSans', fontSize: 13.5, lineHeight: 20 },
  msgTextUser: { color: '#fff' },
  msgTextAi: { color: colors.ink },

  // Devices
  switch: { width: 44, height: 26, borderRadius: 999, padding: 2, justifyContent: 'center' },
  switchOn: { backgroundColor: colors.good, alignItems: 'flex-end' },
  switchOff: { backgroundColor: colors.line, alignItems: 'flex-start' },
  switchKnob: { width: 22, height: 22, borderRadius: 999, backgroundColor: '#fff' },
  
  // Plans
  list: { flexDirection: 'column', gap: 12, marginBottom: 24 },
  cardSpacing: { paddingVertical: 16, paddingHorizontal: 16 },
  planHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  headerLeft: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, flex: 1, paddingRight: 8 },
  iconBox: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontFamily: 'SpaceGrotesk-Bold', fontSize: 15, color: colors.ink, letterSpacing: -0.3, lineHeight: 20, paddingTop: 6 },
  details: { paddingLeft: 48 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  target: { fontFamily: 'IBMPlexMono', fontSize: 11, color: colors.inkSoft, flexShrink: 1 },
  product: { fontFamily: 'IBMPlexSans', fontSize: 13, color: colors.ink, lineHeight: 19 },
  
  // Input
  inputArea: { padding: 14, backgroundColor: 'rgba(20,23,15,0.92)', borderTopWidth: 1, borderTopColor: colors.line, flexDirection: 'row', gap: 8, paddingBottom: Platform.OS === 'ios' ? 30 : 14 },
  input: { flex: 1, borderWidth: 1, borderColor: colors.line, borderRadius: 999, paddingHorizontal: 14, fontFamily: 'IBMPlexSans', fontSize: 12.5, backgroundColor: colors.card, color: colors.ink, height: 40 },
  sendBtn: { width: 40, height: 40, borderRadius: 999, backgroundColor: colors.ai, alignItems: 'center', justifyContent: 'center' },
  
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', backgroundColor: colors.card, borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 10 },
  modalTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, color: colors.ink, marginBottom: 16 },
  modalInput: { borderWidth: 1, borderColor: colors.line, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontFamily: 'IBMPlexSans', fontSize: 14, color: colors.ink, marginBottom: 12, backgroundColor: colors.bg },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 8 },
  modalBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 999 },
  modalBtnText: { fontFamily: 'IBMPlexSans-SemiBold', fontSize: 13, color: colors.ink },
});

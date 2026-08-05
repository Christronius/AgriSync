import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform, Modal, ActivityIndicator } from 'react-native';
import { Sparkles, Send, Bluetooth, ScanSearch, Plus, ClipboardList } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '../theme/theme';
import { SectionLabel, Card, IconBadge, StatusPill, AIGlow } from '../components/ui';
import { HeroHeader } from '../components/Header';
import { useData } from '../hooks/useData';
import { apiClient } from '../services/apiClient';
import { useAssistant } from '../hooks/useAssistant';
import { DeviceCard } from '../components/assistant/DeviceCard';
import * as Haptics from 'expo-haptics';

export function AssistantScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<'chat' | 'systems' | 'schedule'>('chat');
  const scrollViewRef = useRef<ScrollView>(null);
  const [input, setInput] = useState("");
  const [scanning, setScanning] = useState(false);
  const { messages, typing, devices, toggleDevice, handleSend } = useAssistant();

  const { data: plansData } = useData(() => apiClient.getPlans());
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

  const submitChat = () => {
    if (!input.trim()) return;
    handleSend(input);
    setInput("");
  };

  function handleScan() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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

      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
        <View style={styles.tabContainer}>
          <Pressable style={[styles.tabBtn, activeTab === 'chat' && styles.tabBtnActive]} onPress={() => { setActiveTab('chat'); scrollViewRef.current?.scrollTo({ y: 0, animated: false }); Haptics.selectionAsync(); }}>
            <Text style={[styles.tabText, activeTab === 'chat' && styles.tabTextActive]}>Chat</Text>
          </Pressable>
          <Pressable style={[styles.tabBtn, activeTab === 'systems' && styles.tabBtnActive]} onPress={() => { setActiveTab('systems'); scrollViewRef.current?.scrollTo({ y: 0, animated: false }); Haptics.selectionAsync(); }}>
            <Text style={[styles.tabText, activeTab === 'systems' && styles.tabTextActive]}>Systems</Text>
          </Pressable>
          <Pressable style={[styles.tabBtn, activeTab === 'schedule' && styles.tabBtnActive]} onPress={() => { setActiveTab('schedule'); scrollViewRef.current?.scrollTo({ y: 0, animated: false }); Haptics.selectionAsync(); }}>
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
                  <DeviceCard key={d.id} d={d} onToggle={toggleDevice} />
                ))}
              </View>
            </Animated.View>

            {/* Offline Devices */}
            {offlineDevices.length > 0 && (
              <Animated.View entering={FadeInDown.delay(200).springify().damping(18)}>
                <SectionLabel>Offline · {offlineDevices.length} devices</SectionLabel>
                <View style={{ gap: 12, marginBottom: 24 }}>
                  {offlineDevices.map(d => (
                    <DeviceCard key={d.id} d={d} />
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
          onSubmitEditing={submitChat}
        />
        <Pressable onPress={submitChat} style={styles.sendBtn}>
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
  aiAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.ai, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  msgBubble: { maxWidth: '80%', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 18 },
  bubbleUser: { backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  bubbleAi: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderBottomLeftRadius: 4 },
  msgText: { fontFamily: 'IBMPlexSans', fontSize: 13.5, lineHeight: 20 },
  msgTextUser: { color: '#fff' },
  msgTextAi: { color: colors.ink },

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

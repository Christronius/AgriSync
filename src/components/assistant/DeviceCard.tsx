import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '../../theme/theme';
import { Bluetooth, Wifi, Radio, BatteryMedium, BatteryLow, BatteryFull, Signal, SignalLow, SignalZero } from 'lucide-react-native';
import { Device, DeviceProtocol, SignalStrength } from '../../types/models';
import { Card, PulseDot } from '../ui';
import * as Haptics from 'expo-haptics';

const protocolMeta: Record<DeviceProtocol, { label: string; Icon: any; color: string; bg: string }> = {
  bluetooth: { label: 'BLE', Icon: Bluetooth, color: '#5B8DEF', bg: 'rgba(91,141,239,0.14)' },
  wifi:      { label: 'Wi-Fi', Icon: Wifi, color: colors.primary, bg: colors.primarySoft },
  lorawan:   { label: 'LoRa', Icon: Radio, color: colors.teal, bg: 'rgba(58,174,146,0.14)' },
};

function BatteryIndicator({ level }: { level: number }) {
  const Icon = level > 60 ? BatteryFull : level > 25 ? BatteryMedium : BatteryLow;
  const color = level > 60 ? colors.good : level > 25 ? colors.warn : colors.bad;
  return (
    <View style={styles.batteryRow}>
      <Icon size={14} color={color} />
      <Text style={[styles.batteryText, { color }]}>{level}%</Text>
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
    <View style={styles.signalRow}>
      <info.Icon size={13} color={info.color} />
      <Text style={[styles.signalText, { color: info.color }]}>{info.label}</Text>
    </View>
  );
}

function ProtocolBadge({ protocol }: { protocol: DeviceProtocol }) {
  const info = protocolMeta[protocol];
  return (
    <View style={[styles.protocolBadge, { backgroundColor: info.bg }]}>
      <info.Icon size={10} color={info.color} />
      <Text style={[styles.protocolText, { color: info.color }]}>{info.label}</Text>
    </View>
  );
}

export function DeviceCard({ d, onToggle }: { d: Device, onToggle?: (id: number) => void }) {
  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onToggle) onToggle(d.id);
  };

  return (
    <Card style={styles.deviceCard}>
      <View style={styles.deviceTopRow}>
        <View style={styles.deviceInfo}>
          <d.icon size={22} color={d.online ? colors.primary : colors.inkSoft} style={{ marginRight: 12 }} />
          <View>
            <Text style={styles.dName}>{d.name}</Text>
            {d.location && <Text style={styles.dLocation}>{d.location}</Text>}
          </View>
        </View>

        <View style={styles.deviceActions}>
          {!d.online ? (
            <View style={styles.reconnectBtn}>
              <Text style={styles.reconnectText}>Reconnect</Text>
            </View>
          ) : d.kind === 'toggle' ? (
            <Pressable onPress={handleToggle} style={[styles.switch, d.on ? styles.switchOn : styles.switchOff]}>
              <View style={styles.switchKnob} />
            </Pressable>
          ) : d.kind === 'action' ? (
            <Pressable style={styles.viewBtn} onPress={handleToggle}>
              <Text style={styles.viewBtnText}>{d.actionLabel}</Text>
            </Pressable>
          ) : (
            <View style={styles.statusDot}>
              <PulseDot color={colors.primary} size={8} />
            </View>
          )}
        </View>
      </View>

      <View style={styles.deviceMeta}>
        <ProtocolBadge protocol={d.protocol} />
        <BatteryIndicator level={d.battery} />
        <SignalIndicator strength={d.signal} />
        <Text style={styles.syncText}>{d.lastSync}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  deviceCard: { padding: 14, marginBottom: 12 },
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
  switch: { width: 44, height: 26, borderRadius: 999, padding: 2, justifyContent: 'center' },
  switchOn: { backgroundColor: colors.good, alignItems: 'flex-end' },
  switchOff: { backgroundColor: colors.line, alignItems: 'flex-start' },
  switchKnob: { width: 22, height: 22, borderRadius: 999, backgroundColor: '#fff' },
});

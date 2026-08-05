import { useState, useCallback } from 'react';
import { Device } from '../types/models';
import { Droplet, Camera, Thermometer, Wind } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export type Message = {
  id: string;
  role: 'ai' | 'user';
  text: string;
};

export function useAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'ai', text: "Hi! I'm your farm assistant. Ask me about fields, herds, prices, or compliance — or scroll down to see your connected systems and scheduled tasks." },
  ]);
  const [typing, setTyping] = useState(false);

  const [devices, setDevices] = useState<Device[]>([
    { id: 1, name: "Irrigation Controller", icon: Droplet, online: true, kind: "toggle", on: false, protocol: 'wifi', battery: 100, signal: 'strong', lastSync: '2 min ago', location: 'West Field', firmware: 'v2.1.4' },
    { id: 2, name: "Irrigation Controller", icon: Droplet, online: true, kind: "toggle", on: true, protocol: 'wifi', battery: 100, signal: 'strong', lastSync: '1 min ago', location: 'South Field', firmware: 'v2.1.4' },
    { id: 3, name: "Insect Trap Camera", icon: Camera, online: true, kind: "action", actionLabel: "View snapshot", protocol: 'lorawan', battery: 72, signal: 'strong', lastSync: '8 min ago', location: 'West Field', firmware: 'v1.3.0' },
    { id: 4, name: "Soil Moisture Sensor", icon: Droplet, online: true, kind: "status", protocol: 'bluetooth', battery: 54, signal: 'weak', lastSync: '15 min ago', location: 'East Field' },
    { id: 5, name: "Weather Station", icon: Wind, online: true, kind: "status", protocol: 'lorawan', battery: 88, signal: 'strong', lastSync: '5 min ago', location: 'Central Hub', firmware: 'v3.0.1' },
    { id: 6, name: "Temp Sensor – Barn A", icon: Thermometer, online: false, kind: "status", protocol: 'bluetooth', battery: 12, signal: 'none', lastSync: '3 hrs ago', location: 'Barn A' },
  ]);

  const toggleDevice = useCallback((id: number) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, on: !d.on } : d));
  }, []);

  const handleSend = useCallback((text: string) => {
    const q = text.trim();
    if (!q) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: q };
    setMessages(m => [...m, userMsg]);
    setTyping(true);

    // Simple Intent Parsing for Demo
    setTimeout(() => {
      let aiText = "I'm processing that information right now...";
      
      const lowerQ = q.toLowerCase();
      if (lowerQ.includes("turn on") && lowerQ.includes("irrigation") && lowerQ.includes("west field")) {
        // Find West Field Irrigation
        const targetId = 1; // From mock data
        setDevices(prev => prev.map(d => d.id === targetId ? { ...d, on: true } : d));
        aiText = "I have successfully triggered the Irrigation Controller for the West Field. Flow rate is optimal.";
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else if (lowerQ.includes("wheat price")) {
        aiText = "The current reference price for Wheat in your region is 0.98 RON/kg, up +0.02 RON from yesterday.";
      } else if (lowerQ.includes("apia")) {
        aiText = "Your next APIA compliance deadline is in 14 days (Submission of SAPS forms). All required documents are currently attached to your profile.";
      }

      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'ai', text: aiText };
      setMessages(m => [...m, aiMsg]);
      setTyping(false);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 1500);
  }, []);

  return {
    messages,
    typing,
    devices,
    toggleDevice,
    handleSend
  };
}

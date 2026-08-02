import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Wheat, Mail, Lock } from 'lucide-react-native';
import { colors } from '../theme/theme';
import { useAuth } from '../context/AuthContext';
import { ActivityIndicator } from 'react-native';

export function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();

  const handleLogin = async () => {
    if (!email) return;
    await login(email);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.primaryDark, colors.primary, colors.primaryLight]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
        <View style={styles.watermark}>
          <Wheat size={180} color="#fff" strokeWidth={1.2} />
        </View>
        <Pressable 
          onPress={() => navigation.canGoBack() ? navigation.goBack() : null} 
          style={styles.backBtn}
        >
          <ChevronLeft size={24} color="#fff" />
        </Pressable>
      </LinearGradient>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.formContent}>
          <View>
            <View style={styles.titleArea}>
              <Text style={styles.title}>Welcome back.</Text>
              <Text style={styles.subtitle}>Log in to access your digital farm twin and real-time telemetry.</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Mail size={18} color={colors.inkSoft} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="name@farm.com"
                  placeholderTextColor={colors.inkSoft}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Lock size={18} color={colors.inkSoft} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={colors.inkSoft}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
              <Pressable onPress={() => navigation.navigate('Placeholder', { title: 'Password Recovery' })}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </Pressable>
            </View>

            <Pressable 
              style={({ pressed }) => [styles.loginBtn, { transform: [{ scale: pressed ? 0.98 : 1 }] }]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginBtnText}>Sign In</Text>
              )}
            </Pressable>

            <Pressable 
              style={({ pressed }) => [styles.skipBtn, { opacity: pressed ? 0.7 : 1 }]}
              onPress={() => login('guest@farm.com')}
              disabled={loading}
            >
              <Text style={styles.skipBtnText}>Skip for now</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { height: 210, paddingHorizontal: 18, paddingTop: 60, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, overflow: 'hidden' },
  watermark: { position: 'absolute', top: 20, right: -40, opacity: 0.18 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  formContent: { flex: 1, padding: 24, justifyContent: 'center' },
  titleArea: { marginBottom: 24 },
  title: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 34, color: colors.ink, letterSpacing: -0.5, marginBottom: 6 },
  subtitle: { fontFamily: 'IBMPlexSans', fontSize: 15, color: colors.inkSoft, lineHeight: 22 },
  inputGroup: { marginBottom: 18 },
  label: { fontFamily: 'IBMPlexMono', fontSize: 11.5, letterSpacing: 0.5, textTransform: 'uppercase', color: colors.inkSoft, marginBottom: 10 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 16, paddingHorizontal: 18, height: 60 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontFamily: 'IBMPlexSans', fontSize: 15, color: colors.ink, height: '100%' },
  forgotText: { fontFamily: 'IBMPlexSans', fontSize: 12.5, color: colors.primary, textAlign: 'right', marginTop: 10, fontWeight: '600' },
  loginBtn: { backgroundColor: colors.primary, borderRadius: 16, height: 60, alignItems: 'center', justifyContent: 'center', marginTop: 12, shadowColor: colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 6 },
  loginBtnText: { fontFamily: 'IBMPlexSans-SemiBold', fontSize: 17, color: '#fff', letterSpacing: 0.3 },
  skipBtn: { height: 48, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  skipBtnText: { fontFamily: 'IBMPlexSans-SemiBold', fontSize: 14, color: colors.inkSoft },
});

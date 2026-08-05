import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, Keyboard, Platform } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StackActions } from '@react-navigation/native';
import { Home, Wheat, PawPrint, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react-native';
import { colors } from '../theme/theme';

import { ConsoleStack } from './ConsoleStack';
import { FieldsStack } from './FieldsStack';
import { HerdStack } from './HerdStack';
import { ComplianceStack } from './ComplianceStack';
import * as Haptics from 'expo-haptics';

import { AssistantScreen } from '../screens/AssistantScreen';

const Tab = createMaterialTopTabNavigator();

function PremiumTabBar({ state, descriptors, navigation }: any) {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => setKeyboardVisible(false));
    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

  if (isKeyboardVisible) return null;

  return (
    <View style={{ backgroundColor: colors.bg }}>
      <View style={styles.tabBar}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const color = isFocused ? colors.primary : colors.inkSoft;

          return (
            <Pressable
              key={index}
              onPress={onPress}
              style={styles.tabItem}
            >
              {options.tabBarIcon && options.tabBarIcon({ focused: isFocused, color })}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const safePopToTop = (navigation: any, routeName: string) => {
  const state = navigation.getState();
  const route = state?.routes?.find((r: any) => r.name === routeName);
  if (route?.state?.index > 0) {
    try {
      navigation.dispatch(StackActions.popToTop());
    } catch (e) {}
  }
};

export function TabNavigator() {
  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      tabBar={props => <PremiumTabBar {...props} />}
      screenOptions={{ swipeEnabled: true }}
    >
      <Tab.Screen 
        name="ConsoleStack" 
        component={ConsoleStack} 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
              <Home size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
        listeners={({ navigation }) => ({
          blur: () => safePopToTop(navigation, 'ConsoleStack'),
        })}
      />
      <Tab.Screen 
        name="FieldsStack" 
        component={FieldsStack} 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
              <Wheat size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
        listeners={({ navigation }) => ({
          blur: () => safePopToTop(navigation, 'FieldsStack'),
        })}
      />
      <Tab.Screen 
        name="HerdStack" 
        component={HerdStack} 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
              <PawPrint size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
        listeners={({ navigation }) => ({
          blur: () => safePopToTop(navigation, 'HerdStack'),
        })}
      />
      <Tab.Screen 
        name="Assistant" 
        component={AssistantScreen} 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
              <Sparkles size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />

      <Tab.Screen 
        name="Compliance" 
        component={ComplianceStack} 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
              <ShieldCheck size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
        listeners={({ navigation }) => ({
          blur: () => safePopToTop(navigation, 'ComplianceStack'),
        })}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    height: 64,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerFocused: {
    backgroundColor: colors.primarySoft,
  },
});

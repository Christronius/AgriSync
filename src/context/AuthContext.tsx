import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '../api/supabase';
import { Session } from '@supabase/supabase-js';

type User = {
  id: string;
  email: string;
  name: string;
  setupCompleted: boolean;
} | null;

interface AuthContextType {
  user: User;
  session: Session | null;
  login: (email: string, password?: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password?: string) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  completeSetup: (profileData: any) => Promise<{ error: Error | null }>;
  resetSetup: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        checkUserSetup(session.user.id, session.user.email || '');
      } else {
        setLoading(false);
      }
    }).catch(err => {
      console.warn("Supabase getSession error (likely invalid URL):", err);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        checkUserSetup(session.user.id, session.user.email || '');
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserSetup = async (userId: string, email: string) => {
    try {
      // Admin bypass (for dev/testing)
      if (email.toLowerCase().includes('admin')) {
        setUser({ id: userId, email, name: 'System Admin', setupCompleted: true });
        setLoading(false);
        return;
      }

      // Check if farm profile exists
      const { data, error } = await supabase
        .from('farm_profile')
        .select('farm_id')
        .eq('farm_id', userId) // Using userId as farm_id for simplicity in 1:1 mapping
        .maybeSingle();

      setUser({
        id: userId,
        email: email,
        name: 'Farm Admin',
        setupCompleted: !!data // If data exists, setup is complete
      });
    } catch (err) {
      console.error('Failed to check user setup', err);
      setUser({ id: userId, email, name: 'Farm Admin', setupCompleted: false });
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password = 'dummy_password') => {
    setLoading(true);

    // Development bypass
    if (email === 'guest@farm.com' || email === 'admin@admin.com') {
      const isAdmin = email === 'admin@admin.com';
      setUser({
        id: 'mock-user-id',
        email,
        name: isAdmin ? 'System Admin' : 'Farm Admin',
        setupCompleted: isAdmin // admin skips onboarding, guest sees it
      });
      setSession({
        access_token: 'mock-token',
        refresh_token: 'mock-token',
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: 'bearer',
        user: { id: 'mock-user-id', email, app_metadata: {}, user_metadata: {}, aud: 'authenticated', created_at: '' }
      });
      setLoading(false);
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    return { error };
  };

  const signUp = async (email: string, password = 'dummy_password') => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);
    return { error };
  };

  const completeSetup = async (profileData: any) => {
    setLoading(true);
    try {
      if (!session?.user) throw new Error('No user session');
      
      const userId = session.user.id;
      
      // Development bypass for completeSetup
      if (userId === 'mock-user-id') {
        if (user) setUser({ ...user, setupCompleted: true });
        return { error: null };
      }

      // 1. Ensure farm exists first
      const { error: farmError } = await supabase
        .from('farms')
        .upsert({ id: userId, owner_id: userId, name: profileData.name || 'My Farm' });
        
      if (farmError) throw farmError;

      // 2. Insert farm profile
      const { error: profileError } = await supabase
        .from('farm_profile')
        .upsert({
          farm_id: userId,
          role: profileData.role,
          scale: profileData.scale,
          primary_focus: profileData.primaryFocus,
          location: profileData.location,
          size_hectares: profileData.size,
          operations: profileData.operations,
          crops: profileData.crops,
          irrigation: profileData.irrigation,
          storage: profileData.storage,
          livestock_details: profileData.livestockDetails,
          tech: profileData.tech,
          machinery: profileData.machinery,
          compliance_region: profileData.complianceRegion,
          certifications: profileData.certifications
        });

      if (profileError) throw profileError;

      // Update local state
      if (user) {
        setUser({ ...user, setupCompleted: true });
      }
      return { error: null };
    } catch (err: any) {
      return { error: err as Error };
    } finally {
      setLoading(false);
    }
  };

  const resetSetup = async () => {
    if (user && session?.user) {
      // In a real app we might delete the farm_profile row in Supabase, 
      // but for this UI test we'll just manipulate local state if we want to force re-run.
      // Or we can delete it from DB:
      await supabase.from('farm_profile').delete().eq('farm_id', session.user.id);
      setUser({ ...user, setupCompleted: false });
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, login, signUp, logout, completeSetup, resetSetup, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

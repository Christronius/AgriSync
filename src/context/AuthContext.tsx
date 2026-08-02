import React, { createContext, useContext, useState, ReactNode } from 'react';

type User = {
  id: string;
  email: string;
  name: string;
} | null;

interface AuthContextType {
  user: User;
  login: (email: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  // In a real app, you would check secure storage for a JWT on mount
  React.useEffect(() => {
    const checkAuth = async () => {
      // Simulate checking secure storage
      await new Promise(res => setTimeout(res, 500));
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(res => setTimeout(res, 600));
    setUser({
      id: '1',
      email: email,
      name: 'Farm Admin'
    });
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
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

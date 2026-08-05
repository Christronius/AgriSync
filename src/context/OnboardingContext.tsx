import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface OnboardingData {
  name: string;
  location: string;
  size: string;
  role: string;
  scale: string;
  primaryFocus: string;
  operations: string[];
  crops: string[];
  irrigation: string;
  storage: string;
  livestockDetails: Record<string, { size: number; housing: string; pasture: string }>;
  tech: string[];
  machinery: string[];
  complianceRegion: string;
  certifications: string[];
}

interface OnboardingContextType {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  resetData: () => void;
}

const defaultData: OnboardingData = {
  name: '',
  location: '',
  size: '',
  role: '',
  scale: '',
  primaryFocus: '',
  operations: [],
  crops: [],
  irrigation: '',
  storage: '',
  livestockDetails: {},
  tech: [],
  machinery: [],
  complianceRegion: '',
  certifications: []
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData>(defaultData);

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const resetData = () => {
    setData(defaultData);
  };

  return (
    <OnboardingContext.Provider value={{ data, updateData, resetData }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}

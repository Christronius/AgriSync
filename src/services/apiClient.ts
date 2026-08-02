import { fields, herds, marketPrices, plans, schemes, traceability, notifications } from '../data/api';
import { Field, Herd, MarketPrice, Plan, Scheme, Traceability, Notification } from '../types/models';

const DELAY = 400; // Simulate network latency

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const apiClient = {
  getFields: async (): Promise<Field[]> => {
    await delay(DELAY);
    return fields as Field[];
  },
  getField: async (id: number): Promise<Field | undefined> => {
    await delay(DELAY);
    return (fields as Field[]).find(f => f.id === id);
  },
  getHerds: async (): Promise<Herd[]> => {
    await delay(DELAY);
    return herds as Herd[];
  },
  getHerd: async (id: number): Promise<Herd | undefined> => {
    await delay(DELAY);
    return (herds as Herd[]).find(h => h.id === id);
  },
  getMarketPrices: async (): Promise<MarketPrice[]> => {
    await delay(DELAY);
    return marketPrices as MarketPrice[];
  },
  getPlans: async (): Promise<Plan[]> => {
    await delay(DELAY);
    return plans as Plan[];
  },
  getSchemes: async (): Promise<Scheme[]> => {
    await delay(DELAY);
    return schemes as Scheme[];
  },
  getTraceability: async (): Promise<Traceability[]> => {
    await delay(DELAY);
    return traceability as Traceability[];
  },
  getNotifications: async (): Promise<Notification[]> => {
    await delay(DELAY);
    return notifications as unknown as Notification[];
  }
};

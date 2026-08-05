export interface SensorData {
  d: string;
  v: number;
}

export type DeviceProtocol = 'bluetooth' | 'wifi' | 'lorawan';
export type SignalStrength = 'strong' | 'weak' | 'none';

export interface Device {
  id: number;
  name: string;
  icon: any; // LucideIcon
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
}

export interface YieldPred {
  expected: number;
  lastYear: number;
  lastMonth?: number;
  unit: string;
}

export interface EconData {
  revenue: number;
  cost: number;
  profit: number;
  margin: number | null;
  note?: string;
  period?: string;
}

export interface TrapData {
  pest: string;
  unit: string;
  threshold: number;
  level: string;
  data: SensorData[];
  count?: number;
  recommendation: string;
}

export interface Field {
  id: number;
  name: string;
  crop: string;
  cropType: string;
  area: number;
  health: number;
  moisture: number;
  ndvi: number;
  lastAssessed: string;
  sensor: SensorData[];
  yieldPred: YieldPred | null;
  plan: string;
  econ: EconData;
  trap: TrapData | null;
  satelliteImageUrl?: string;
  connectionStatus?: 'online' | 'offline' | 'unstable';
}

export interface ParasiteData {
  name: string;
  unit: string;
  threshold: number;
  level: string;
  data: SensorData[];
  recommendation: string;
}

export interface Herd {
  id: number;
  name: string;
  species: string;
  herdType: string;
  count: number;
  health: number;
  bcs: number;
  alerts: number;
  milk: SensorData[] | null;
  milkPred?: YieldPred;
  plan: string;
  econ: EconData;
  parasite: ParasiteData | null;
  cameraFeedUrl?: string;
  connectionStatus?: 'online' | 'offline' | 'unstable';
}

export interface MarketPrice {
  id: number;
  name: string;
  cropType?: string;
  herdType?: string;
  unit: string;
  local: number;
  global: number;
  trend: number;
  assumption: number | null;
}

export interface Plan {
  id: number;
  type: string;
  target: string;
  title: string;
  product: string;
  date: string;
  status: string;
}

export interface SchemeDoc {
  label: string;
  done: boolean;
}

export interface Scheme {
  id: number;
  name: string;
  deadline: string;
  status: string;
  progress: number;
  docs: SchemeDoc[];
}

export interface Traceability {
  id: number;
  text: string;
  time: string;
}

export interface Notification {
  id: number;
  icon: string;
  level: string;
  text: string;
  time: string;
  recommendation: string;
  target: string;
  targetId: number;
}

export interface Device {
  id: number;
  name: string;
  icon: any;
  online: boolean;
  kind: "toggle" | "action" | "status";
  on?: boolean;
  actionLabel?: string;
}

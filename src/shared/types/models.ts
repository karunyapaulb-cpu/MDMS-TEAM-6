export interface Zone {
  id: number;
  name: string;
  location: string;
  pincode: string;
  description: string;
  admin: string;
  status: string;
  totalMeters?: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  zoneId: number | null;
  status: string;
  meterCount?: number;
}

export interface Meter {
  id: number;
  meterNumber: string;
  userId: number;
  zoneId: number;
  owner?: string;
  zone?: string;
  address: string;
  status: string;
  installedDate: string;
  tariffCategory: string;
  lastReading: number;
}

export interface Reading {
  id: number;
  meterId: number;
  meterNumber?: string;
  date: string;
  value: number;
  units: number;
  notes: string;
}

export interface Alert {
  id: number;
  zoneId: number;
  meterId: number;
  message: string;
  severity: string;
  status: string;
  timestamp: string;
}

export interface Notification {
  id: number;
  userId: number;
  type: string;
  message: string;
  isRead: boolean;
  timestamp: string;
}

export interface AuditLog {
  id: number;
  user: string;
  action: string;
  resource: string;
  status: string;
  timestamp: string;
}

export interface Setting {
  id: number;
  zoneId: number | null;
  highConsumption: number;
  lowConsumption: number;
  abnormalFrequency: number;
  inactiveDuration: number;
  emailEnabled: boolean;
  smsEnabled: boolean;
  retentionDays: number;
  autoLogoutMinutes: number;
  auditRetentionDays: number;
  timeZone: string;
  language: string;
  currency: string;
}

export interface ChartPoint {
  label: string;
  current: number;
  previous: number;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UserDashboardData {
  name: string;
  zone: string;
  meterNumber: string;
  lastSynced: string | null;
  currentConsumption: number;
  monthlyBill: number;
  dueDate: string | null;
  outstandingBalance: number;
  lastPayment: number;
  paidOn: string | null;
}

export interface ZoneDashboardData {
  zone: string;
  activeMeters: number;
  averageUsage: number;
  usageChange: number;
  pendingAlerts: number;
}

export interface EnterpriseDashboardData {
  totalZones: number;
  totalMeters: number;
  criticalAlerts: number;
  recentAlerts: Alert[];
}

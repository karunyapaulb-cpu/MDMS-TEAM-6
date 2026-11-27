import API from "../../../services/http";

import { getUsers, getSettings } from "../../../services/mdmsService";

import type {
  EnterpriseDashboardData,
  ChartPoint,
  AuditLog,
} from "../../../shared/types/models";

export const getEnterpriseDashboard = () =>
  API.get<EnterpriseDashboardData>("/analytics/enterprise-dashboard");

export const getZoneComparison = (period: string) =>
  API.get<ChartPoint[]>("/analytics/zone-comparison", { params: { period } });

export const getEnterpriseUsers = (search: string) => getUsers({ search });

export const getEnterpriseSettings = () => getSettings();

export const getAuditLogs = (user: string, status: string, date: string) =>
  API.get<AuditLog[]>("/audit-logs", {
    params: {
      user,
      status,
      date: date || undefined,
    },
  });

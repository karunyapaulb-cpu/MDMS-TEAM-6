import API from "./http";

import type {
  Zone,
  User,
  Meter,
  Reading,
  Alert,
  Setting,
  ChartPoint,
  PagedResult,
} from "../shared/types/models";

export interface MeterFilters {
  zoneId?: number;
  userId?: number;
  status?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
sortDirection?: "asc" | "desc";
}

export interface ReadingFilters {
  userId?: number;
  zoneId?: number;
  meterId?: number;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}

export interface ConsumptionFilters {
  userId?: number;
  zoneId?: number;
  meterId?: number;
  range?: string;
  endDate?: string;
}

export const getZones = () => API.get<Zone[]>("/zones");

export const getZone = (id: number) => API.get<Zone>(`/zones/${id}`);

export const getUsers = (
  params: {
    zoneId?: number;
    role?: string;
    search?: string;
  } = {},
) => API.get<User[]>("/users", { params });

export const getUser = (id: number) => API.get<User>(`/users/${id}`);

export const getMeters = (params: MeterFilters = {}) =>
  API.get<PagedResult<Meter>>("/meters", { params });

export const getMeter = (id: number) => API.get<Meter>(`/meters/${id}`);

export const getReadings = (params: ReadingFilters) =>
  API.get<PagedResult<Reading>>("/readings", { params });

export const getConsumption = (params: ConsumptionFilters) =>
  API.get<ChartPoint[]>("/analytics/consumption", {
    params,
  });

export const getAlerts = (
  params: {
    zoneId?: number;
    severity?: string;
    status?: string;
  } = {},
) => API.get<Alert[]>("/alerts", { params });

export const getSettings = (zoneId?: number) =>
  API.get<Setting>("/settings", {
    params: { zoneId },
  });

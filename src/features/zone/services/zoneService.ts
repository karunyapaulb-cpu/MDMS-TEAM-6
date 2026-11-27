import API from "../../../services/http";

import { DEMO_ZONE_ID } from "../../../services/demoConfig";

import {
  getConsumption,
  getMeters,
  getUsers,
  getSettings,
  getReadings,
} from "../../../services/mdmsService";

import type { ZoneDashboardData } from "../../../shared/types/models";

export const getZoneDashboard = () =>
  API.get<ZoneDashboardData>("/analytics/zone-dashboard", {
    params: { zoneId: DEMO_ZONE_ID },
  });

export const getZoneConsumption = (
  range: string,
  meterId?: number,
  endDate?: string,
) =>
  getConsumption({
    zoneId: DEMO_ZONE_ID,
    range,
    meterId,
    endDate,
  });

export const getZoneMeters = () =>
  getMeters({
    zoneId: DEMO_ZONE_ID,
    pageSize: 100,
  });

export const getZoneCustomers = (search: string) =>
  getUsers({
    zoneId: DEMO_ZONE_ID,
    role: "Consumer",
    search,
  });

export const getZoneSettings = () => getSettings(DEMO_ZONE_ID);

export const getZoneReadings = (
  from: string,
  to: string,
  page: number,
  meterId?: number,
) =>
  getReadings({
    zoneId: DEMO_ZONE_ID,
    from,
    to,
    page,
    meterId,
  });

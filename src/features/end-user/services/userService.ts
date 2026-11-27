import API from "../../../services/http";

import { DEMO_USER_ID } from "../../../services/demoConfig";

import { getConsumption, getReadings } from "../../../services/mdmsService";

import type {
  UserDashboardData,
  Notification,
} from "../../../shared/types/models";

export const getUserDashboard = () =>
  API.get<UserDashboardData>("/analytics/user-dashboard", {
    params: { userId: DEMO_USER_ID },
  });

export const getUserConsumption = (range: string, endDate?: string) =>
  getConsumption({
    userId: DEMO_USER_ID,
    range,
    endDate,
  });

export const getUserReadings = (from: string, to: string, page: number) =>
  getReadings({
    userId: DEMO_USER_ID,
    from,
    to,
    page,
    pageSize: 10,
  });

export const getNotifications = (unreadOnly: boolean) =>
  API.get<Notification[]>("/notifications", {
    params: {
      userId: DEMO_USER_ID,
      unreadOnly,
    },
  });

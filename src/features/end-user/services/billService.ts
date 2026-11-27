import API from "../../../services/http";
import type { Bill, BillDay, PagedResult } from "../types/bill";

export const getBills = (userId: number, status: string, page: number) =>
  API.get<PagedResult<Bill>>("/bills", {
    params: {
      userId,
      status,
      page,
      pageSize: 10,
    },
  });

export const getBillDetails = (id: number) =>
  API.get<{ bill: Bill; days: BillDay[] }>(`/bills/${id}`);

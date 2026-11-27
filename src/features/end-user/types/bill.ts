export interface Bill {
  id: number;
  userId: number;
  month: string;
  amount: number;
  dueDate: string;
  status: string;
  paidOn: string | null;
}

export interface BillDay {
  id: number;
  billId: number;
  date: string;
  reading: number;
  consumption: number;
  cost: number;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

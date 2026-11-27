import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBillDetails } from "../services/billService";
import type { Bill, BillDay } from "../types/bill";
import StatCard from "../../../shared/components/StatCard";
import DataTable from "../../../shared/components/DataTable";
import Loader from "../../../shared/components/Loader";

export default function BillDetails() {
  const { billId } = useParams();

  const [bill, setBill] = useState<Bill | null>(null);
  const [days, setDays] = useState<BillDay[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getBillDetails(Number(billId))
      .then(({ data }) => {
        setBill(data.bill);
        setDays(data.days);
      })
      .catch(() => setError("Bill could not be loaded."));
  }, [billId]);

  if (error) return <p>{error}</p>;
  if (!bill) return <Loader />;

  return (
    <>
      <h1>Bill details</h1>

      <div className="stats-grid">
        <StatCard label="Billing month" value={bill.month.slice(0, 7)} />
        <StatCard label="Total amount" value={`₹${bill.amount}`} />
        <StatCard label="Due date" value={bill.dueDate.slice(0, 10)} />
        <StatCard label="Status" value={bill.status} />
      </div>

      <DataTable
        rows={days}
        rowKey={(day) => day.id}
        columns={[
          {
            header: "Date",
            render: (d) => d.date.slice(0, 10),
          },
          {
            header: "Reading",
            render: (d) => d.reading,
          },
          {
            header: "Consumption (kWh)",
            render: (d) => d.consumption,
          },
          {
            header: "Cost",
            render: (d) => `₹${d.cost.toFixed(2)}`,
          },
        ]}
      />

      <div className="tabs">
        <button disabled>Download PDF</button>
        <button onClick={() => window.print()}>Print</button>
        <button disabled>Pay now</button>
      </div>
    </>
  );
}

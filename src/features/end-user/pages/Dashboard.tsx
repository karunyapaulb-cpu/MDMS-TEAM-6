import { useCallback, useState } from "react";
import { Link } from "react-router-dom";

import StatCard from "../../../shared/components/StatCard";
import ChartCard from "../../../shared/components/ChartCard";
import UsageChart from "../../../shared/components/UsageChart";
import Skeleton from "../../../shared/components/Skeleton";
import TimeRangeToggle from "../../../shared/components/TimeRangeToggle";

import type { TimeRange } from "../../../shared/components/TimeRangeToggle";

import useApi from "../../../shared/hooks/useApi";

import { getUserDashboard, getUserConsumption } from "../services/userService";

export default function Dashboard() {
  const [range, setRange] = useState<TimeRange>("Week");

  const summary = useApi(useCallback(getUserDashboard, []));

  const chart = useApi(useCallback(() => getUserConsumption(range), [range]));

  if (summary.loading) return <Skeleton />;
  if (summary.error) return <p>{summary.error}</p>;
  if (!summary.data) return <p>No dashboard data.</p>;

  const data = summary.data;

  return (
    <>
      <section className="welcome-banner">
        <div>
          <h1>Welcome, {data.name}</h1>

          <p>{new Date().toLocaleDateString("en-IN")}</p>

          <p>Zone: {data.zone}</p>
        </div>

        <div>
          <p>Meter: {data.meterNumber}</p>

          <p>
            Last synced:{" "}
            {data.lastSynced
              ? new Date(data.lastSynced).toLocaleString()
              : "Unavailable"}
          </p>
        </div>
      </section>

      <div className="stats-grid">
        <StatCard
          label="Current consumption"
          value={`${data.currentConsumption} kWh`}
        />

        <StatCard
          label="Latest monthly bill"
          value={`₹${data.monthlyBill.toFixed(2)}`}
          hint={`Due: ${data.dueDate?.slice(0, 10) ?? "-"}`}
        />

        <StatCard
          label="Outstanding balance"
          value={`₹${data.outstandingBalance.toFixed(2)}`}
        />

        <StatCard
          label="Last payment"
          value={`₹${data.lastPayment.toFixed(2)}`}
          hint={`Paid on: ${data.paidOn?.slice(0, 10) ?? "-"}`}
        />
      </div>

      <ChartCard
        title="Consumption overview"
        actions={<TimeRangeToggle value={range} onChange={setRange} />}
      >
        {chart.loading ? (
          <Skeleton />
        ) : chart.error ? (
          <p>{chart.error}</p>
        ) : (
          <UsageChart data={chart.data ?? []} />
        )}
      </ChartCard>

      <h3>Quick actions</h3>

      <div className="quick-actions">
        <Link to="/user/bills?status=Pending">Pay bill</Link>
        <Link to="/user/bills">View bill history</Link>
        <Link to="/user/meter-data">View detailed usage</Link>
        <Link to="/user/alerts">Manage notifications</Link>
      </div>
    </>
  );
}

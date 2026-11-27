import { useCallback } from "react";
import { Link } from "react-router-dom";

import PageHeader from "../../../shared/components/PageHeader";
import StatCard from "../../../shared/components/StatCard";
import ChartCard from "../../../shared/components/ChartCard";
import UsageChart from "../../../shared/components/UsageChart";
import StatusBadge from "../../../shared/components/StatusBadge";
import Skeleton from "../../../shared/components/Skeleton";

import useApi from "../../../shared/hooks/useApi";

import {
  getEnterpriseDashboard,
  getZoneComparison,
} from "../services/enterpriseService";

export default function Dashboard() {
  const summary = useApi(useCallback(() => getEnterpriseDashboard(), []));

  const chart = useApi(useCallback(() => getZoneComparison("Month"), []));

  if (summary.loading) return <Skeleton />;
  if (summary.error) return <p>{summary.error}</p>;
  if (!summary.data) return null;

  const data = summary.data;

  return (
    <>
      <PageHeader
        title="Enterprise dashboard"
        subtitle="Monitor all electricity distribution zones"
      />

      <div className="stats-grid">
        <StatCard label="Total zones" value={data.totalZones} />

        <StatCard label="Total meters" value={data.totalMeters} />

        <StatCard label="Critical alerts" value={data.criticalAlerts} />
      </div>

      <ChartCard title="Average consumption per zone (kWh)">
        {chart.loading ? (
          <Skeleton />
        ) : chart.error ? (
          <p>{chart.error}</p>
        ) : (
          <UsageChart
            type="bar"
            currentLabel="Average consumption per meter"
            data={(chart.data ?? []).map((item) => ({
              ...item,
              current: item.previous,
            }))}
          />
        )}
      </ChartCard>

      <section className="table-card">
        <PageHeader
          title="Recent critical alerts"
          actions={<Link to="/enterprise/alerts">View all</Link>}
        />

        {data.recentAlerts.map((alert) => (
          <div key={alert.id} className="notification">
            <strong>{alert.message}</strong>

            <p>Meter ID: {alert.meterId}</p>

            <StatusBadge status={alert.severity} />
          </div>
        ))}
      </section>
    </>
  );
}

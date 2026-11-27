import { useCallback, useState } from "react";
import { Link } from "react-router-dom";

import PageHeader from "../../../shared/components/PageHeader";
import StatCard from "../../../shared/components/StatCard";
import ChartCard from "../../../shared/components/ChartCard";
import UsageChart from "../../../shared/components/UsageChart";
import TimeRangeToggle from "../../../shared/components/TimeRangeToggle";
import Skeleton from "../../../shared/components/Skeleton";

import type { TimeRange } from "../../../shared/components/TimeRangeToggle";

import useApi from "../../../shared/hooks/useApi";

import { getZoneDashboard, getZoneConsumption } from "../services/zoneService";

export default function Dashboard() {
  const [range, setRange] = useState<TimeRange>("Week");

  const summary = useApi(useCallback(()=>getZoneDashboard(), []));

  const chart = useApi(useCallback(() => getZoneConsumption(range), [range]));

  if (summary.loading) return <Skeleton />;
  if (summary.error) return <p>{summary.error}</p>;
  if (!summary.data) return null;

  const data = summary.data;

  return (
    <>
      <PageHeader title="Zone dashboard" subtitle={`Zone: ${data.zone}`} />

      <div className="stats-grid">
        <StatCard label="Active meters" value={data.activeMeters} />

        <StatCard
          label="Average usage"
          value={`${data.averageUsage} kWh`}
          hint={`${data.usageChange}% change from previous period`}
        />

        <StatCard label="Pending alerts" value={data.pendingAlerts} />
      </div>

      <ChartCard
        title="Zone consumption"
        actions={
          <TimeRangeToggle
            value={range}
            onChange={setRange}
            options={["Week", "Month"]}
          />
        }
      >
        {chart.loading ? (
          <Skeleton />
        ) : chart.error ? (
          <p>{chart.error}</p>
        ) : (
          <UsageChart data={chart.data ?? []} />
        )}
      </ChartCard>

      <div className="quick-actions">
        <Link to="/zone/meters?add=true">Add meter</Link>
        <Link to="/zone/reports">Generate report</Link>
      </div>
    </>
  );
}

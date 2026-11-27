import { useCallback, useState } from "react";

import PageHeader from "../../../shared/components/PageHeader";
import DataTable from "../../../shared/components/DataTable";
import ChartCard from "../../../shared/components/ChartCard";
import UsageChart from "../../../shared/components/UsageChart";
import Input from "../../../shared/components/Input";
import Skeleton from "../../../shared/components/Skeleton";
import TimeRangeToggle from "../../../shared/components/TimeRangeToggle";

import type { TimeRange } from "../../../shared/components/TimeRangeToggle";

import useApi from "../../../shared/hooks/useApi";
import { DEMO_DATE } from "../../../services/demoConfig";

import { getUserConsumption, getUserReadings } from "../services/userService";

export default function MeterData() {
  const [range, setRange] = useState<TimeRange>("Week");
  const [from, setFrom] = useState("2026-11-17");
  const [to, setTo] = useState(DEMO_DATE);
  const [page, setPage] = useState(1);

  const chart = useApi(
    useCallback(() => getUserConsumption(range, to), [range, to]),
  );

  const readings = useApi(
    useCallback(() => getUserReadings(from, to, page), [from, to, page]),
  );

  return (
    <>
      <PageHeader
        title="Meter data"
        subtitle="Detailed electricity consumption analysis"
      />

      <div className="filter-bar">
        <Input
          label="From date"
          type="date"
          value={from}
          max={to}
          onChange={(e) => {
            setFrom(e.target.value);
            setPage(1);
          }}
        />

        <Input
          label="To date"
          type="date"
          value={to}
          min={from}
          max={DEMO_DATE}
          onChange={(e) => {
            setTo(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <ChartCard
        title="Current vs previous consumption"
        actions={
          <TimeRangeToggle
            value={range}
            onChange={setRange}
            options={["Day", "Week", "Month"]}
          />
        }
      >
        {chart.loading ? (
          <Skeleton />
        ) : chart.error ? (
          <p>{chart.error}</p>
        ) : (
          <UsageChart data={chart.data ?? []} compare />
        )}
      </ChartCard>

      <h3>Meter readings</h3>

      {readings.error && <p>{readings.error}</p>}

      <DataTable
        rows={readings.data?.items ?? []}
        rowKey={(r) => r.id}
        loading={readings.loading}
        page={page}
        total={readings.data?.total ?? 0}
        onPageChange={setPage}
        columns={[
          {
            header: "Date",
            render: (r) => new Date(r.date).toLocaleString("en-IN"),
          },
          {
            header: "Meter",
            render: (r) => r.meterNumber,
          },
          {
            header: "Reading",
            render: (r) => r.value,
          },
          {
            header: "Difference (kWh)",
            render: (r) => r.units,
          },
          {
            header: "Notes",
            render: (r) => r.notes,
          },
        ]}
      />
    </>
  );
}

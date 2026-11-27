import { useCallback, useState } from "react";

import PageHeader from "../../../shared/components/PageHeader";
import ChartCard from "../../../shared/components/ChartCard";
import UsageChart from "../../../shared/components/UsageChart";
import DataTable from "../../../shared/components/DataTable";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";
import Toast from "../../../shared/components/Toast";
import Skeleton from "../../../shared/components/Skeleton";

import useApi from "../../../shared/hooks/useApi";

import { DEMO_DATE } from "../../../services/demoConfig";

import {
  getZoneMeters,
  getZoneConsumption,
  getZoneReadings,
} from "../services/zoneService";

export default function Reports() {
  const [from, setFrom] = useState("2026-11-01");
  const [to, setTo] = useState(DEMO_DATE);
  const [meter, setMeter] = useState("");
  const [range, setRange] = useState("Month");
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");

  const meters = useApi(useCallback(()=>getZoneMeters(), []));

  const chart = useApi(
    useCallback(
      () => getZoneConsumption(range, Number(meter) || undefined, to),
      [range, meter, to],
    ),
  );

  const readings = useApi(
    useCallback(
      () => getZoneReadings(from, to, page, Number(meter) || undefined),
      [from, to, page, meter],
    ),
  );

  return (
    <>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Analyse electricity usage across your zone"
        actions={
          <button
            onClick={() =>
              setMessage("Report parameters validated. Export comes later.")
            }
          >
            Generate report
          </button>
        }
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

        <Select
          label="Meter"
          value={meter}
          onChange={(e) => {
            setMeter(e.target.value);
            setPage(1);
          }}
          options={[
            { value: "", label: "All meters" },
            ...(meters.data?.items ?? []).map((m) => ({
              value: String(m.id),
              label: m.meterNumber,
            })),
          ]}
        />

        <Select
          label="Period"
          value={range}
          onChange={(e) => setRange(e.target.value)}
          options={[
            { value: "Week", label: "Week" },
            { value: "Month", label: "Month" },
            { value: "Year", label: "Year" },
          ]}
        />
      </div>

      <ChartCard title="Energy usage trend">
        {chart.loading ? (
          <Skeleton />
        ) : chart.error ? (
          <p>{chart.error}</p>
        ) : (
          <UsageChart data={chart.data ?? []} compare />
        )}
      </ChartCard>

      <h3>Reading summary</h3>

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
            header: "Meter",
            render: (r) => r.meterNumber,
          },
          {
            header: "Date",
            render: (r) => r.date.slice(0, 10),
          },
          {
            header: "Consumption",
            render: (r) => r.units,
          },
          {
            header: "Reading",
            render: (r) => r.value,
          },
        ]}
      />

      <Toast message={message} onClose={() => setMessage("")} />
    </>
  );
}

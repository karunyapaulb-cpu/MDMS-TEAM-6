import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";

import PageHeader from "../../../shared/components/PageHeader";
import StatusBadge from "../../../shared/components/StatusBadge";
import ChartCard from "../../../shared/components/ChartCard";
import UsageChart from "../../../shared/components/UsageChart";
import DataTable from "../../../shared/components/DataTable";
import Skeleton from "../../../shared/components/Skeleton";

import useApi from "../../../shared/hooks/useApi";

import {
  getMeter,
  getUser,
  getConsumption,
  getReadings,
} from "../../../services/mdmsService";

export default function MeterDetails() {
  const { meterId } = useParams();
  const id = Number(meterId);

  const [page, setPage] = useState(1);

  const meter = useApi(useCallback(() => getMeter(id), [id]));

  const ownerId = meter.data?.userId;

  const owner = useApi(
    useCallback(
      () => (ownerId ? getUser(ownerId) : Promise.resolve({ data: null })),
      [ownerId],
    ),
  );

  const chart = useApi(
    useCallback(() => getConsumption({ meterId: id, range: "Week" }), [id]),
  );

  const readings = useApi(
    useCallback(() => getReadings({ meterId: id, page }), [id, page]),
  );

  if (meter.loading) return <Skeleton />;
  if (meter.error) return <p>{meter.error}</p>;
  if (!meter.data) return <p>Meter not found.</p>;

  const m = meter.data;

  return (
    <>
      <PageHeader
        title={`Meter ${m.meterNumber}`}
        subtitle="Meter information and recent readings"
      />

      <div className="details-grid">
        <div>Owner: {owner.data?.name ?? m.userId}</div>
        <div>Address: {m.address}</div>
        <div>
          Status: <StatusBadge status={m.status} />
        </div>
        <div>Installed: {m.installedDate.slice(0, 10)}</div>
        <div>Tariff: {m.tariffCategory}</div>
        <div>Last reading: {m.lastReading} kWh</div>
      </div>

      <ChartCard title="Meter usage">
        {chart.loading ? (
          <Skeleton />
        ) : chart.error ? (
          <p>{chart.error}</p>
        ) : (
          <UsageChart data={chart.data ?? []} />
        )}
      </ChartCard>

      <h3>Recent readings</h3>

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
            render: (r) => r.date.replace("T", " "),
          },
          {
            header: "Reading",
            render: (r) => r.value,
          },
          {
            header: "Consumption",
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

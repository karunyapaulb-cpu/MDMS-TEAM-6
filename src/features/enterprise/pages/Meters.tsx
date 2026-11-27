import { useCallback, useState } from "react";

import PageHeader from "../../../shared/components/PageHeader";
import MeterTable from "../../../shared/components/MeterTable";
import ChartCard from "../../../shared/components/ChartCard";
import UsageChart from "../../../shared/components/UsageChart";
import Select from "../../../shared/components/Select";
import Skeleton from "../../../shared/components/Skeleton";

import useApi from "../../../shared/hooks/useApi";

import { getZones } from "../../../services/mdmsService";
import { getZoneComparison } from "../services/enterpriseService";

export default function Meters() {
  const [zone, setZone] = useState("");

  const zones = useApi(useCallback(() => getZones(), []));

  const chart = useApi(useCallback(() => getZoneComparison("Month"), []));

  return (
    <>
      <PageHeader
        title="Meter management"
        subtitle="View meters across all zones"
      />

      <div className="filter-bar">
        <Select
          label="Zone"
          value={zone}
          onChange={(e) => setZone(e.target.value)}
          options={[
            { value: "", label: "All zones" },
            ...(zones.data ?? []).map((z) => ({
              value: String(z.id),
              label: z.name,
            })),
          ]}
        />
      </div>

      <MeterTable key={zone} zoneId={Number(zone) || undefined} enterprise />

      <br />

      <ChartCard title="Consumption by zone">
        {chart.loading ? (
          <Skeleton />
        ) : chart.error ? (
          <p>{chart.error}</p>
        ) : (
          <UsageChart data={chart.data ?? []} type="bar" />
        )}
      </ChartCard>
    </>
  );
}

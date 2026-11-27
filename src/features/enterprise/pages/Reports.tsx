import { useCallback, useState } from "react";

import PageHeader from "../../../shared/components/PageHeader";
import ChartCard from "../../../shared/components/ChartCard";
import UsageChart from "../../../shared/components/UsageChart";
import Select from "../../../shared/components/Select";
import DataTable from "../../../shared/components/DataTable";
import Skeleton from "../../../shared/components/Skeleton";

import useApi from "../../../shared/hooks/useApi";
import { getZoneComparison } from "../services/enterpriseService";

export default function Reports() {
  const [period, setPeriod] = useState("Month");

  const { data, loading, error } = useApi(
    useCallback(() => getZoneComparison(period), [period]),
  );

  return (
    <>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Compare electricity consumption between zones"
        actions={
          <Select
            label="Period"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            options={[
              { value: "Week", label: "Week" },
              { value: "Month", label: "Month" },
              { value: "Year", label: "Year" },
            ]}
          />
        }
      />

      <ChartCard title="Zone consumption comparison">
        {loading ? (
          <Skeleton />
        ) : error ? (
          <p>{error}</p>
        ) : (
          <UsageChart
            data={data ?? []}
            type="bar"
            compare
            currentLabel="Total consumption (kWh)"
            previousLabel="Average per meter (kWh)"
          />
        )}
      </ChartCard>

      <DataTable
        rows={data ?? []}
        rowKey={(r) => r.label}
        loading={loading}
        columns={[
          { header: "Zone", render: (r) => r.label },
          {
            header: "Total consumption",
            render: (r) => `${r.current} kWh`,
            sortValue: (r) => r.current,
          },
          {
            header: "Average per meter",
            render: (r) => `${r.previous} kWh`,
          },
        ]}
      />
    </>
  );
}

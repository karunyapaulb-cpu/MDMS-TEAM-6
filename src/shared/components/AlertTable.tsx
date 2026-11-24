import { useCallback, useState } from "react";

import DataTable from "./DataTable";
import type { Column } from "./DataTable";
import StatusBadge from "./StatusBadge";
import Select from "./Select";

import useApi from "../hooks/useApi";
import { getAlerts, getZones } from "../../services/mdmsService";

import type { Alert } from "../types/models";

export default function AlertTable({
  zoneId,
  enterprise = false,
}: {
  zoneId?: number;
  enterprise?: boolean;
}) {
  const [severity, setSeverity] = useState("");
  const [status, setStatus] = useState("");
  const [selectedZone, setSelectedZone] = useState("");

  const request = useCallback(
    () =>
      getAlerts({
        zoneId: enterprise ? Number(selectedZone) || undefined : zoneId,
        severity,
        status,
      }),
    [zoneId, enterprise, selectedZone, severity, status],
  );

  const { data, loading, error } = useApi(request);

  const zones = useApi(useCallback(getZones, []));

  const columns: Column<Alert>[] = [
    { header: "ID", render: (a) => a.id },
    { header: "Meter", render: (a) => a.meterId },
    { header: "Message", render: (a) => a.message },
    {
      header: "Severity",
      render: (a) => <StatusBadge status={a.severity} />,
    },
    {
      header: "Status",
      render: (a) => <StatusBadge status={a.status} />,
    },
    {
      header: "Time",
      render: (a) => new Date(a.timestamp).toLocaleString("en-IN"),
    },
  ];

  if (enterprise) {
    columns.splice(1, 0, {
      header: "Zone",
      render: (a) =>
        zones.data?.find((z) => z.id === a.zoneId)?.name ?? a.zoneId,
    });
  }

  return (
    <>
      <div className="filter-bar">
        {enterprise && (
          <Select
            label="Zone"
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            options={[
              { value: "", label: "All zones" },
              ...(zones.data ?? []).map((z) => ({
                value: String(z.id),
                label: z.name,
              })),
            ]}
          />
        )}

        <Select
          label="Severity"
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          options={[
            { value: "", label: "All severities" },
            { value: "Critical", label: "Critical" },
            { value: "Warning", label: "Warning" },
          ]}
        />

        <Select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={[
            { value: "", label: "All statuses" },
            { value: "Pending", label: "Pending" },
            { value: "Resolved", label: "Resolved" },
          ]}
        />
      </div>

      {error && <p className="error">{error}</p>}

      <DataTable
        rows={data ?? []}
        columns={columns}
        rowKey={(a) => a.id}
        loading={loading}
      />
    </>
  );
}

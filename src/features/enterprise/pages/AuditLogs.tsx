import { useCallback, useState } from "react";

import PageHeader from "../../../shared/components/PageHeader";
import DataTable from "../../../shared/components/DataTable";
import StatusBadge from "../../../shared/components/StatusBadge";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";

import useApi from "../../../shared/hooks/useApi";
import { getAuditLogs } from "../services/enterpriseService";

export default function AuditLogs() {
  const [user, setUser] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");

  const { data, loading, error } = useApi(
    useCallback(() => getAuditLogs(user, status, date), [user, status, date]),
  );

  return (
    <>
      <PageHeader
        title="Audit logs"
        subtitle="Track system activities and administrative actions"
      />

      <div className="filter-bar">
        <Input
          label="User"
          value={user}
          placeholder="Search user"
          onChange={(e) => setUser(e.target.value)}
        />

        <Select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={[
            { value: "", label: "All statuses" },
            { value: "Success", label: "Success" },
            { value: "Failed", label: "Failed" },
          ]}
        />

        <Input
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button
          onClick={() => {
            setUser("");
            setStatus("");
            setDate("");
          }}
        >
          Clear filters
        </button>
      </div>

      {error && <p>{error}</p>}

      <DataTable
        rows={data ?? []}
        rowKey={(log) => log.id}
        loading={loading}
        columns={[
          { header: "Log ID", render: (l) => l.id },
          {
            header: "Timestamp",
            render: (l) => new Date(l.timestamp).toLocaleString("en-IN"),
            sortValue: (l) => l.timestamp,
          },
          { header: "User", render: (l) => l.user },
          { header: "Action", render: (l) => l.action },
          { header: "Resource", render: (l) => l.resource },
          {
            header: "Status",
            render: (l) => <StatusBadge status={l.status} />,
          },
        ]}
      />
    </>
  );
}

import { useCallback, useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import PageHeader from "../../../shared/components/PageHeader";
import DataTable from "../../../shared/components/DataTable";
import StatusBadge from "../../../shared/components/StatusBadge";
import ChartCard from "../../../shared/components/ChartCard";
import Tabs from "../../../shared/components/Tabs";
import Select from "../../../shared/components/Select";
import Modal from "../../../shared/components/Modal";

import useApi from "../../../shared/hooks/useApi";

import type { User } from "../../../shared/types/models";

import { getZones } from "../../../services/mdmsService";
import { getEnterpriseUsers } from "../services/enterpriseService";

export default function Users() {
  const [tab, setTab] = useState("Admins");
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("2026");
  const [selected, setSelected] = useState<User | null>(null);

  const users = useApi(useCallback(() => getEnterpriseUsers(search), [search]));

  const allUsers = useApi(useCallback(() => getEnterpriseUsers(""), []));

  const zones = useApi(useCallback(()=>getZones(), []));

  const rows = (users.data ?? []).filter((u) =>
    tab === "Admins" ? u.role !== "Consumer" : u.role === "Consumer",
  );

  const chartData =
    year === "2026"
      ? [
          {
            name: "Active",
            value: (allUsers.data ?? []).filter((u) => u.status === "Active")
              .length,
          },
          {
            name: "Deactivated",
            value: (allUsers.data ?? []).filter(
              (u) => u.status === "Deactivated",
            ).length,
          },
        ]
      : [];

  const colors = ["#2563eb", "#ef4444"];

  return (
    <>
      <PageHeader
        title="User & Role Management"
        subtitle="View administrators and consumers"
      />

      <Tabs tabs={["Admins", "Consumers"]} active={tab} onChange={setTab} />

      <br />

      {users.error && <p>{users.error}</p>}

      <DataTable
        rows={rows}
        rowKey={(u) => u.id}
        loading={users.loading}
        search={search}
        onSearch={setSearch}
        columns={[
          { header: "ID", render: (u) => u.id },
          { header: "Name", render: (u) => u.name },
          { header: "Email", render: (u) => u.email },
          { header: "Role", render: (u) => u.role },
          {
            header: "Zone",
            render: (u) =>
              zones.data?.find((z) => z.id === u.zoneId)?.name ?? "All zones",
          },
          {
            header: "Status",
            render: (u) => <StatusBadge status={u.status} />,
          },
        ]}
        actions={(user) => (
          <button onClick={() => setSelected(user)}>View</button>
        )}
      />

      <br />

      <ChartCard
        title="User status distribution"
        actions={
          <Select
            label="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            options={[
              { value: "2026", label: "2026" },
              { value: "2025", label: "2025" },
            ]}
          />
        }
      >
        {chartData.length ? (
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={65}
                  outerRadius={100}
                  label
                >
                  {chartData.map((item, i) => (
                    <Cell key={item.name} fill={colors[i]} />
                  ))}
                </Pie>

                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p>No historical user-status data for this year.</p>
        )}
      </ChartCard>

      <Modal
        open={selected !== null}
        title="User information"
        onClose={() => setSelected(null)}
      >
        {selected && (
          <>
            <p>Name: {selected.name}</p>
            <p>Email: {selected.email}</p>
            <p>Phone: {selected.phone}</p>
            <p>Role: {selected.role}</p>
            <p>Status: {selected.status}</p>
          </>
        )}
      </Modal>
    </>
  );
}

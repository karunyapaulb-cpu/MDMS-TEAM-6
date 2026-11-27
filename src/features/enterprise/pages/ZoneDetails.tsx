import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";

import PageHeader from "../../../shared/components/PageHeader";
import StatCard from "../../../shared/components/StatCard";
import Tabs from "../../../shared/components/Tabs";
import MeterTable from "../../../shared/components/MeterTable";
import DataTable from "../../../shared/components/DataTable";
import StatusBadge from "../../../shared/components/StatusBadge";
import Skeleton from "../../../shared/components/Skeleton";

import useApi from "../../../shared/hooks/useApi";

import { getZone, getUsers, getMeters } from "../../../services/mdmsService";

export default function ZoneDetails() {
  const { zoneId } = useParams();
  const id = Number(zoneId);

  const [tab, setTab] = useState("Meters");

  const zone = useApi(useCallback(() => getZone(id), [id]));

  const users = useApi(useCallback(() => getUsers({ zoneId: id }), [id]));

  const meters = useApi(
    useCallback(() => getMeters({ zoneId: id, pageSize: 1 }), [id]),
  );

  if (zone.loading) return <Skeleton />;
  if (zone.error) return <p>{zone.error}</p>;
  if (!zone.data) return null;

  return (
    <>
      <PageHeader title={zone.data.name} subtitle={zone.data.description} />

      <div className="stats-grid">
        <StatCard label="Zone admin" value={zone.data.admin} />

        <StatCard label="Total meters" value={meters.data?.total ?? 0} />

        <StatCard
          label="Customers"
          value={users.data?.filter((u) => u.role === "Consumer").length ?? 0}
        />

        <StatCard label="Status" value={zone.data.status} />
      </div>

      <Tabs tabs={["Meters", "Users"]} active={tab} onChange={setTab} />

      <br />

      {tab === "Meters" ? (
        <MeterTable zoneId={id} enterprise />
      ) : (
        <DataTable
          rows={users.data ?? []}
          loading={users.loading}
          rowKey={(u) => u.id}
          columns={[
            { header: "ID", render: (u) => u.id },
            { header: "Name", render: (u) => u.name },
            { header: "Email", render: (u) => u.email },
            { header: "Role", render: (u) => u.role },
            {
              header: "Status",
              render: (u) => <StatusBadge status={u.status} />,
            },
          ]}
        />
      )}
    </>
  );
}

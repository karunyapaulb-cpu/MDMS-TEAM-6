import { useCallback, useState } from "react";

import PageHeader from "../../../shared/components/PageHeader";
import DataTable from "../../../shared/components/DataTable";
import StatusBadge from "../../../shared/components/StatusBadge";
import Modal from "../../../shared/components/Modal";
import MeterTable from "../../../shared/components/MeterTable";
import Input from "../../../shared/components/Input";
import Toast from "../../../shared/components/Toast";

import useApi from "../../../shared/hooks/useApi";

import type { User } from "../../../shared/types/models";

import { DEMO_ZONE_ID } from "../../../services/demoConfig";
import { getZoneCustomers } from "../services/zoneService";

export default function Users() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<User | null>(null);

  const [addOpen, setAddOpen] = useState(false);
  const [message, setMessage] = useState("");

  const { data, loading, error } = useApi(
    useCallback(
      () => getZoneCustomers(search),
      [search]
    )
  );

  return (
    <>
      <PageHeader
        title="User management"
        subtitle="Customers belonging to your zone"
        actions={
          <button onClick={() => setAddOpen(true)}>
            + Add customer
          </button>
        }
      />

      {error && <p>{error}</p>}

      <DataTable
        rows={data ?? []}
        rowKey={(u) => u.id}
        loading={loading}
        search={search}
        onSearch={setSearch}
        columns={[
          { header: "ID", render: (u) => u.id },
          {
            header: "Name",
            render: (u) => u.name,
            sortValue: (u) => u.name,
          },
          { header: "Email", render: (u) => u.email },
          { header: "Phone", render: (u) => u.phone },
          {
            header: "Meters",
            render: (u) => u.meterCount,
          },
          {
            header: "Status",
            render: (u) => <StatusBadge status={u.status} />,
          },
        ]}
        actions={(user) => (
          <button onClick={() => setSelected(user)}>
            View
          </button>
        )}
      />

      <Modal
        open={selected !== null}
        title="Customer details"
        onClose={() => setSelected(null)}
      >
        {selected && (
          <>
            <h3>{selected.name}</h3>
            <p>{selected.email}</p>
            <p>{selected.phone}</p>

            <h3>Assigned meters</h3>

            <MeterTable
              zoneId={DEMO_ZONE_ID}
              userId={selected.id}
            />
          </>
        )}
      </Modal>

      <Modal
        open={addOpen}
        title="Add customer"
        onClose={() => setAddOpen(false)}
      >
        <form
          className="form-stack"
          onSubmit={(e) => {
            e.preventDefault();
            setAddOpen(false);
            setMessage("Customer validated. No data saved.");
          }}
        >
          <Input label="Full name" required />
          <Input label="Email" type="email" required />
          <Input
            label="Phone"
            type="tel"
            pattern="[0-9]{10}"
            required
          />
          <Input label="Address" required />

          <button>Validate customer</button>
        </form>
      </Modal>

      <Toast
        message={message}
        onClose={() => setMessage("")}
      />
    </>
  );
}
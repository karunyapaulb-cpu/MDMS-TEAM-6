import { useCallback, useState } from "react";
import { Link } from "react-router-dom";

import PageHeader from "../../../shared/components/PageHeader";
import DataTable from "../../../shared/components/DataTable";
import StatusBadge from "../../../shared/components/StatusBadge";
import Modal from "../../../shared/components/Modal";
import ConfirmDialog from "../../../shared/components/ConfirmDialog";
import Input from "../../../shared/components/Input";
import Toast from "../../../shared/components/Toast";

import useApi from "../../../shared/hooks/useApi";

import { getZones } from "../../../services/mdmsService";

import type { Zone } from "../../../shared/types/models";

export default function Zones() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Zone | null>(null);
  const [confirm, setConfirm] = useState<Zone | null>(null);
  const [message, setMessage] = useState("");

  const { data, loading, error } = useApi(useCallback(() => getZones(), []));

  return (
    <>
      <PageHeader
        title="Zone management"
        subtitle="Manage all electricity distribution zones"
        actions={
          <button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            + Add zone
          </button>
        }
      />

      {error && <p>{error}</p>}

      <DataTable
        rows={data ?? []}
        rowKey={(z) => z.id}
        loading={loading}
        columns={[
          { header: "Zone ID", render: (z) => z.id },
          {
            header: "Zone name",
            render: (z) => z.name,
            sortValue: (z) => z.name,
          },
          { header: "Admin", render: (z) => z.admin },
          {
            header: "Total meters",
            render: (z) => z.totalMeters,
          },
          {
            header: "Status",
            render: (z) => <StatusBadge status={z.status} />,
          },
        ]}
        actions={(zone) => (
          <details>
            <summary>Actions</summary>

            <div className="action-menu">
              <Link to={`/enterprise/zones/${zone.id}`}>View</Link>

              <button
                onClick={() => {
                  setEditing(zone);
                  setOpen(true);
                }}
              >
                Edit
              </button>

              <button onClick={() => setConfirm(zone)}>
                {zone.status === "Active" ? "Deactivate" : "Activate"}
              </button>
            </div>
          </details>
        )}
      />

      <Modal
        open={open}
        title={editing ? "Edit zone" : "Add zone"}
        onClose={() => setOpen(false)}
      >
        <form
          key={editing?.id ?? "new"}
          className="form-stack"
          onSubmit={(e) => {
            e.preventDefault();
            setOpen(false);
            setMessage("Zone validated. No data saved.");
          }}
        >
          <Input label="Zone name" defaultValue={editing?.name} required />

          <Input
            label="Assigned admin"
            defaultValue={editing?.admin}
            required
          />

          <Input label="Location" defaultValue={editing?.location} required />

          <Input
            label="Pincode"
            defaultValue={editing?.pincode}
            pattern="[0-9]{6}"
            required
          />

          <label className="form-field">
            Description
            <textarea defaultValue={editing?.description} required />
          </label>

          <button>Validate zone</button>
        </form>
      </Modal>

      <ConfirmDialog
        open={confirm !== null}
        message={`Confirm status change for ${confirm?.name ?? ""}?`}
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          setConfirm(null);
          setMessage("Demo action confirmed.");
        }}
      />

      <Toast message={message} onClose={() => setMessage("")} />
    </>
  );
}

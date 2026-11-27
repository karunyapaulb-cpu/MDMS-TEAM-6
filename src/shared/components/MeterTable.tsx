import { useCallback, useState } from "react";
import { Link } from "react-router-dom";

import DataTable from "./DataTable";
import type { Column } from "./DataTable";

import StatusBadge from "./StatusBadge";
import Modal from "./Modal";
import ConfirmDialog from "./ConfirmDialog";
import Input from "./Input";
import Select from "./Select";
import Toast from "./Toast";

import useApi from "../hooks/useApi";
import { getMeters } from "../../services/mdmsService";

import type { Meter } from "../types/models";

interface Props {
  zoneId?: number;
  userId?: number;
  enterprise?: boolean;
  allowAdd?: boolean;
  initialAdd?: boolean;
}

export default function MeterTable({
  zoneId,
  userId,
  enterprise = false,
  allowAdd = false,
  initialAdd = false,
}: Props) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [formOpen, setFormOpen] = useState(initialAdd);
  const [editing, setEditing] = useState<Meter | null>(null);
  const [confirm, setConfirm] = useState<Meter | null>(null);
  const [message, setMessage] = useState("");

  const request = useCallback(
    () =>
      getMeters({
        zoneId,
        userId,
        status,
        search,
        page,
        pageSize: 10,
        sortBy,
        sortDirection,
      }),
    [zoneId, userId, status, search, page, sortBy, sortDirection],
  );

  const { data, loading, error } = useApi(request);

  const columns: Column<Meter>[] = [
    {
      header: "Meter ID",
      render: (row) => row.meterNumber,
      sortValue: (row) => row.meterNumber,
      sortKey: "meterNumber",
    },
    {
      header: "Owner",
      render: (row) => row.owner,
      sortValue: (row) => row.owner ?? "",
      sortKey: "owner",
    },
    {
      header: "Status",
      render: (m) => <StatusBadge status={m.status} />,
    },
    {
      header: "Last Reading",
      render: (row) => row.lastReading,
      sortValue: (row) => row.lastReading ?? 0,
      sortKey: "lastReading",
    },
  ];

  if (enterprise) {
    columns.splice(2, 0, {
      header: "Zone",
      render: (m) => m.zone,
    });
  }

  return (
    <>
      <div className="filter-bar">
        <Select
          label="Status"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          options={[
            { value: "", label: "All statuses" },
            { value: "Active", label: "Active" },
            { value: "Deactivated", label: "Deactivated" },
          ]}
        />

        {allowAdd && (
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            + Add meter
          </button>
        )}
      </div>

      {error && <p className="error">{error}</p>}

      <DataTable
        rows={data?.items ?? []}
        columns={columns}
        rowKey={(m) => m.id}
        loading={loading}
        page={page}
        pageSize={10}
        total={data?.total ?? 0}
        onPageChange={setPage}
        search={search}
        onSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onSort={(key, direction) => {
          setSortBy(key);
          setSortDirection(direction);
          setPage(1);
        }}
        selectable
        actions={(meter) => (
          <details>
            <summary>Actions</summary>

            <div className="action-menu">
              <Link
                to={`/${enterprise ? "enterprise" : "zone"}/meters/${meter.id}`}
              >
                View details
              </Link>

              {allowAdd && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(meter);
                      setFormOpen(true);
                    }}
                  >
                    Edit
                  </button>

                  <button type="button" onClick={() => setConfirm(meter)}>
                    {meter.status === "Active" ? "Deactivate" : "Activate"}
                  </button>
                </>
              )}
            </div>
          </details>
        )}
      />

      <Modal
        open={formOpen}
        title={editing ? "Edit meter" : "Add meter"}
        onClose={() => setFormOpen(false)}
      >
        <form
          key={editing?.id ?? "new"}
          className="form-stack"
          onSubmit={(e) => {
            e.preventDefault();
            setFormOpen(false);
            setMessage("Validation successful. No data saved.");
          }}
        >
          <Input
            label="Meter number"
            defaultValue={editing?.meterNumber}
            required
            pattern="MTR-[A-Za-z0-9\-]+"
            placeholder="MTR-001"
          />

          <Input
            label="Customer ID"
            type="number"
            min={1}
            defaultValue={editing?.userId}
            required
          />

          <Input label="Address" defaultValue={editing?.address} required />

          <Input
            label="Installed date"
            type="date"
            defaultValue={editing?.installedDate?.slice(0, 10)}
            required
          />

          <Select
            label="Tariff category"
            defaultValue={editing?.tariffCategory}
            options={[
              { value: "Domestic", label: "Domestic" },
              { value: "Commercial", label: "Commercial" },
              { value: "Industrial", label: "Industrial" },
            ]}
          />

          <button type="submit">Validate meter</button>
        </form>
      </Modal>

      <ConfirmDialog
        open={confirm !== null}
        message={`Confirm status change for ${confirm?.meterNumber ?? ""}?`}
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          setConfirm(null);
          setMessage("Demo action confirmed. No data changed.");
        }}
      />

      <Toast message={message} onClose={() => setMessage("")} />
    </>
  );
}

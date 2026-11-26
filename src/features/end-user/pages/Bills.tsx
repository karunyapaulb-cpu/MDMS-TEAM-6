import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "../../../shared/components/DataTable";
import PageHeader from "../../../shared/components/PageHeader";
import StatusBadge from "../../../shared/components/StatusBadge";
import { getBills } from "../services/billService";
import type { Bill } from "../types/bill";

export default function Bills() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError("");

    getBills(3, status, page)
      .then(({ data }) => {
        if (active) {
          setBills(data.items);
          setTotal(data.total);
        }
      })
      .catch(() => {
        if (active) setError("Unable to load bills.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [status, page]);

  return (
    <>
      <PageHeader
        title="My bills"
        subtitle="View your electricity billing history"
        actions={
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All statuses</option>
            <option>Paid</option>
            <option>Pending</option>
            <option>Overdue</option>
          </select>
        }
      />

      {error ? (
        <p className="error">{error}</p>
      ) : (
        <DataTable
          rows={bills}
          rowKey={(bill) => bill.id}
          loading={loading}
          total={total}
          page={page}
          onPageChange={setPage}
          columns={[
            {
              header: "Month",
              render: (b) =>
                new Date(b.month).toLocaleDateString("en-IN", {
                  month: "long",
                  year: "numeric",
                }),
            },
            {
              header: "Amount",
              render: (b) => `₹${b.amount.toFixed(2)}`,
              sortValue: (b) => b.amount,
            },
            {
              header: "Due date",
              render: (b) => b.dueDate.slice(0, 10),
            },
            {
              header: "Status",
              render: (b) => <StatusBadge status={b.status} />,
            },
          ]}
          actions={(bill) => (
            <Link to={`/user/bills/${bill.id}`}>
              {bill.status === "Paid" ? "View" : "View / Pay"}
            </Link>
          )}
        />
      )}

      <p>All bills are generated on the 1st of every month.</p>
    </>
  );
}

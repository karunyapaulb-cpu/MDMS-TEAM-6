import { useState } from "react";
import type { ReactNode } from "react";
import Loader from "./Loader";
import EmptyState from "./EmptyState";

export interface Column<T> {
  header: string;
  render: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
}

interface Props<T> {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string | number;
  loading?: boolean;
  total?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  search?: string;
  onSearch?: (value: string) => void;
  actions?: (row: T) => ReactNode;
  selectable?: boolean;
}

export default function DataTable<T>({
  rows,
  columns,
  rowKey,
  loading = false,
  total,
  page = 1,
  pageSize = 10,
  onPageChange,
  search = "",
  onSearch,
  actions,
  selectable = false,
}: Props<T>) {
  const [sort, setSort] = useState(-1);
  const [ascending, setAscending] = useState(true);
  const [selected, setSelected] = useState<(string | number)[]>([]);

  const sortedRows = [...rows];

  const sortValue = columns[sort]?.sortValue;

  if (sortValue) {
    sortedRows.sort((a, b) => {
      const x = sortValue(a);
      const y = sortValue(b);

      const result =
        typeof x === "number" && typeof y === "number"
          ? x - y
          : String(x).localeCompare(String(y));

      return ascending ? result : -result;
    });
  }

  if (loading) return <Loader />;

  return (
    <div className="table-card">
      {onSearch && (
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
      )}

      {rows.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                {selectable && <th>Select</th>}

                {columns.map((column, i) => (
                  <th key={column.header}>
                    <button
                      disabled={!column.sortValue}
                      onClick={() => {
                        setSort(i);
                        setAscending(sort === i ? !ascending : true);
                      }}
                    >
                      {column.header}
                      {sort === i ? (ascending ? " ↑" : " ↓") : ""}
                    </button>
                  </th>
                ))}

                {actions && <th>Actions</th>}
              </tr>
            </thead>

            <tbody>
              {sortedRows.map((row) => (
                <tr key={rowKey(row)}>
                  {selectable && (
                    <td>
                      <input
                        type="checkbox"
                        checked={selected.includes(rowKey(row))}
                        onChange={(e) => {
                          const key = rowKey(row);

                          setSelected((old) =>
                            e.target.checked
                              ? [...old, key]
                              : old.filter((x) => x !== key),
                          );
                        }}
                      />
                    </td>
                  )}

                  {columns.map((column) => (
                    <td key={column.header}>{column.render(row)}</td>
                  ))}

                  {actions && <td>{actions(row)}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {onPageChange && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
            Previous
          </button>

          <span>
            Page {page} of{" "}
            {Math.max(1, Math.ceil((total ?? rows.length) / pageSize))}
          </span>

          <button
            disabled={page * pageSize >= (total ?? rows.length)}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default function EmptyState({
  message = "No records found",
}: {
  message?: string;
}) {
  return <div className="empty-state">{message}</div>;
}

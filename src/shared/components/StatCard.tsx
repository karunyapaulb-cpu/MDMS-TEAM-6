interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
}

export default function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="stat-card">
      <p>{label}</p>
      <h2>{value}</h2>
      {hint && <small>{hint}</small>}
    </div>
  );
}

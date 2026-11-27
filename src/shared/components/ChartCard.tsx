import type { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}

export default function ChartCard({ title, children, actions }: Props) {
  return (
    <section className="chart-card">
      <div className="page-header">
        <h3>{title}</h3>
        {actions}
      </div>
      {children}
    </section>
  );
}

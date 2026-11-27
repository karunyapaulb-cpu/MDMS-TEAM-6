import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

import type { ChartPoint } from "../types/models";

interface Props {
  data: ChartPoint[];
  type?: "line" | "bar";
  compare?: boolean;
  currentLabel?: string;
  previousLabel?: string;
}

export default function UsageChart({
  data,
  type = "line",
  compare = false,
  currentLabel = "Current consumption",
  previousLabel = "Previous consumption",
}: Props) {
  if (!data.length) {
    return <p>No chart data available.</p>;
  }

  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        {type === "bar" ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Bar dataKey="current" name={currentLabel} fill="#2563eb" />

            {compare && (
              <Bar dataKey="previous" name={previousLabel} fill="#14b8a6" />
            )}
          </BarChart>
        ) : (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Line
              type="monotone"
              dataKey="current"
              name={currentLabel}
              stroke="#2563eb"
              strokeWidth={3}
            />

            {compare && (
              <Line
                type="monotone"
                dataKey="previous"
                name={previousLabel}
                stroke="#14b8a6"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            )}
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

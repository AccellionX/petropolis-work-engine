"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useDemo } from "@/context/demo-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CompletionChart() {
  const { hourly } = useDemo();

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Today&apos;s completion</CardTitle>
          <p className="mt-1 text-sm text-slate-500">
            Completed vs still open by hour.
          </p>
        </div>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={hourly} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="hour"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={28}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                boxShadow: "0 8px 24px rgba(15,39,68,0.08)",
              }}
            />
            <Legend />
            <Bar
              dataKey="completed"
              name="Completed"
              fill="#0d9488"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="pending"
              name="Open"
              fill="#0f2744"
              radius={[6, 6, 0, 0]}
              fillOpacity={0.75}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

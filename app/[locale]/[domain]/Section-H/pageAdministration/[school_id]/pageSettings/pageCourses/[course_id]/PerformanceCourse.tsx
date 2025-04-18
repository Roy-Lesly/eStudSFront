import { NodeCourse } from "@/Domain/schemas/interfaceGraphql";
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Label,
} from "recharts";


const DonutChart = (
  { label, value, total, color = "#0088FE" }:
    { label: string, value: number, total: number, color?: string; }) => {
  const data = [
    { name: "Count", value },
    { name: "Remaining", value: total - value },
  ];

  const COLORS = [color, "#f0f0f0"];
  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;

  return (
    <div className="w-full max-w-[180px] mx-auto text-center">
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            innerRadius={53}
            outerRadius={83}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={COLORS[0]} />
            <Cell fill={COLORS[1]} />
            <Label
              value={`${percentage}%`}
              position="center"
              className="font-bold"
            />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <p className="font-medium text-lg text-slate-800">{label} ({value})</p>
    </div>
  );
};

const PerformanceCourse = ({ data }: { data: NodeCourse }) => {
  const total = data.countTotal;
  const totalWithAverage = data.countWithAverage;
  console.log(data, 51)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <DonutChart label="Total" value={total} total={total} color={COLOR_MAP.Total} />
      <DonutChart label="Submitted CA" value={data?.countSubmittedCa} total={total} color={COLOR_MAP.SubmittedCa} />
      <DonutChart label="Submitted Exam" value={data?.countSubmittedExam} total={total} color={COLOR_MAP.SubmittedExam} />
      <DonutChart label="Submitted Resit" value={data?.countSubmittedResit} total={total} color={COLOR_MAP.SubmittedResit} />

      <DonutChart label="Existing" value={data?.countWithAverage} total={total} color={COLOR_MAP.Existing} />
      <DonutChart label="Missing" value={data?.countMissingAverage} total={total} color={COLOR_MAP.Missing} />
      <DonutChart label="Validated" value={data?.countValidated} total={totalWithAverage} color={COLOR_MAP.Validated} />
      <DonutChart label="Resit" value={data?.countResit} total={total} color={COLOR_MAP.Resit} />
    </div>
  );
};

export default PerformanceCourse;


const COLOR_MAP: Record<string, string> = {
  Total: "#000000",              // black
  SubmittedCa: "#7e22ce",        // purple
  SubmittedExam: "#7e22ce",      // purple
  SubmittedResit: "#7e22ce",     // purple
  Existing: "#0d9488",           // teal
  Missing: "#dc2626",            // red
  Resit: "#fb923c",              // orange
  Validated: "#16a34a",          // green
};
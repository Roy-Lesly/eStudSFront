import { NodeSpecialty } from "@/Domain/schemas/interfaceGraphql";
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Label,
} from "recharts";

const donutData = [
  {
    title: "Total",
    value: 20,
    color: "#2196F3",
  },
  {
    title: "Submitted CA",
    value: 20,
    color: "#4CAF50",
  },
  {
    title: "Submitted Exam",
    value: 45,
    color: "#4CAF50",
  },
  {
    title: "Submitted Resit",
    value: 95,
    color: "#4CAF50",
  },
  {
    title: "Passed",
    value: 10,
    color: "#FF9800",
  },
  {
    title: "Failed",
    value: 30,
    color: "#2196F3",
  },
  {
    title: "Resit",
    value: 10,
    color: "#9E9E9E",
  },
  {
    title: "Didn’t Sit",
    value: 5,
    color: "#F44336",
  },
];

const DonutCard = ({ title, value, color }: any) => {
  const chartData = [
    { name: title, value },
    { name: "Remaining", value: 100 - value },
  ];

  return (
    <div className="flex flex-col items-center p-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
      <div className="flex flex-col justify-between w-full aspect-square max-w-[200px] gap-2 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              innerRadius="50%"
              outerRadius="73%"
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              <Cell fill={color} />
              <Cell fill="#e5e7eb" />
              {/* {title} */}
              <Label
                value={`${value}%`}
                position="center"
                fontSize="22px"
                fill="#111827"
                fontWeight="bold"
              />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-end justify-center text-center text-gray-800 text-lg">
          <span className="">
            {title}
          </span>
        </div>
      </div>
    </div>
  );
};

const PerformanceSpecialty = ({data}:{data: NodeSpecialty}) => {
  return (
    <div className="w-full p-4 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold text-center mb-6">
        Specialty Performance Summary
      </h2>
      <div className="flex flex-wrap justify-center">
        {donutData.map((item, index) => (
          <DonutCard
            key={index}
            title={item.title}
            value={item.value}
            color={item.color}
          />
        ))}
      </div>
    </div>
  );
};

export default PerformanceSpecialty;

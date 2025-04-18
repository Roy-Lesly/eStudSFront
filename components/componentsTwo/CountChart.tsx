"use client";
import Image from "next/image";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";


const CountChart = ({ data, title }: any) => {
  return (
    <div className="bg-white h-full p-4 rounded-xl w-full">
      {/* TITLE */}
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-lg">{title}</h1>
        <Image src="/images/dash/moreDark.png" alt="" width={20} height={20} />
      </div>
      {/* CHART */}
      <div className="h-[75%] relative w-full">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="50%"
            outerRadius="100%"
            barSize={22}
            data={data}
          >
            <RadialBar background dataKey="count" label={{ position: "insideStart", fill: "#fff" }} />
          </RadialBarChart>
        </ResponsiveContainer>
        <Image
          src="/images/dash/maleFemale.png"
          alt=""
          width={50}
          height={50}
          className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 top-1/2"
        />
      </div>
      {/* BOTTOM */}
      <div className="flex gap-16 justify-center">
        <div className="flex flex-col gap-1">
        <div className="flex gap-6 justify-center">
            <div className="bg-[#2f8edb] h-5 rounded-full w-5" />
            <h1 className="font-bold">{data[0]?.count}</h1>
          </div>
          <h2 className="text-gray-300 text-sm">{data[0]?.name} - ({data[0]?.percent}%)</h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex gap-6 justify-center">
            <div className="bg-pink-300 h-5 rounded-full w-5" />
            <h1 className="font-bold">{data[1]?.count}</h1>
          </div>
          <h2 className="text-gray-300 text-sm">{data[1]?.name} - ({data[1]?.percent}%)</h2>
        </div>
      </div>
    </div>
  );
};

export default CountChart;

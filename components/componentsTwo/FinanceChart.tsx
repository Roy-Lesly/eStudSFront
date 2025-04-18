"use client";

import { DashFinanceChardInter } from "@/Domain/Utils-H/dashControl/dashInter";
import Image from "next/image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const FinanceChart = ({ data }: { data: DashFinanceChardInter[]}) => {
  return (
    <div className="bg-white h-full p-4 rounded-xl w-full">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-lg">Finance</h1>
        <Image src="/images/dash/moreDark.png" alt="" width={20} height={20} />
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tick={{ fill: "#373A3C" }}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis axisLine={true} tick={{ fill: "#373A3C" }} tickLine={true} tickMargin={5} />
          <Tooltip />
          <Legend
            align="center"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }}
          />

          {/* <Line type="monotone" dataKey="registration" stroke="#7CCC63" strokeWidth={5} /> */}
          <Line type="monotone" dataKey="registration" stroke="#E83E8C" strokeWidth={3} />
          <Line type="monotone" dataKey="tuition" stroke="#3BAFDA" strokeWidth={3} />
          {/* <Line type="monotone" dataKey="scholarship" stroke="#ef5675" strokeWidth={5} /> */}
          {/* <Line type="monotone" dataKey="expenses" stroke="#CFCEFF" strokeWidth={5} /> */}
          001233
          {/* <Line type="" */}

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinanceChart;

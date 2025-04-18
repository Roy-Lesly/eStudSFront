"use client";
import { GetLevelInter } from "@/Domain/Utils-H/appControl/appInter";
import Image from "next/image";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const SpecialtyLevelIncountChart = (
  { data, levels }:
    { data: any, levels: GetLevelInter[] }
) => {

  const colors = [ "#3BAFDA", "#DA4453", "#20C997", "#967ADC" ]


  return (
    <div className="bg-white h-full p-4 rounded-lg">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-lg">Income Statistics</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <ResponsiveContainer width="100%" height="95%">
        <BarChart width={500} height={300} data={data} barSize={15}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
          <XAxis
            dataKey="specialty_name"
            axisLine={true}
            tick={{ fill: "#373A3C" }}
            tickLine={false}
          />
          <YAxis className="border-2 ml-10 p-2" axisLine={true} tick={{ fill: "#373A3C" }} tickLine={false} tickMargin={0} />
          <Tooltip
            contentStyle={{ borderRadius: "10px", borderColor: "lightgray" }}
          />
          <Legend
            align="left"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "20px", paddingBottom: "30px" }}
          />

          {levels && levels.sort((a: GetLevelInter, b: GetLevelInter) => a.level < b.level ? -1 : 1 ).map((item: GetLevelInter, index: number) => <Bar
            key={item.level}
            // dataKey={`${item.level}`}
            dataKey={`level_${item.level}`}
            fill={colors[index]}
            legendType="circle"
            radius={[2, 2, 0, 0]}
          />)}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpecialtyLevelIncountChart;

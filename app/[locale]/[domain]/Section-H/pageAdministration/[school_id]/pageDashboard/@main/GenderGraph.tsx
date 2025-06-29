'use client';

import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#3498db', '#e91e63'];

const GenderGraph = ({
  title,
  genderData,
}: {
  title: string;
  genderData: { name: string; count: string | number }[];
}) => {

  const data = genderData?.map((item) => ({
    name: item.name,
    value: Number(item.count),
  }));

  if (!data.length || data.every((d) => d.value === 0)) {
    return (
      <div className="w-full md:w-1/4 bg-white rounded-2xl shadow-lg p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>
        <p className="text-center text-gray-500">No gender data available</p>
      </div>
    );
  }

  return (
    <div className="w-full md:w-1/4 bg-white rounded-2xl shadow-lg p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>
      <div className="flex justify-center items-center" style={{ height: '250px' }}>
        <PieChart width={250} height={250}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </div>
    </div>
  );
};

export default GenderGraph;

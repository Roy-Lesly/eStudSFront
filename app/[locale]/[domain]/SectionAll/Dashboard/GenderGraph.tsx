'use client';

import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#3498db', '#e91e63'];

const GenderGraph = ({
  title,
  data,
}: {
  title: "Staff" | "Students";
  data: any;
}) => {

  const gender = data ? JSON.parse(data) : null;
  const renderGender = gender && title === "Students" ? gender?.genderStudent : gender?.genderLecturer ;

  const { t } = useTranslation("common");

  if (!renderGender?.length || renderGender?.every((d: { value: number }) => d.value === 0)) {
    return (
      <div className="w-full md:w-1/4 bg-white rounded-2xl shadow-lg p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>
        <p className="text-center text-gray-500">{t("No gender data")}</p>
      </div>
    );
  }

  return (
    <div className="w-full md:w-1/4 bg-white rounded-2xl p-2 md:p-4 shadow-xl border-slate-200">
      <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
      <div className="flex justify-center items-center" style={{ height: '270px' }}>
        <PieChart width={200} height={270}>
          <Pie
            data={renderGender}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {renderGender?.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={16} />
        </PieChart>
      </div>
    </div>
  );
};

export default GenderGraph;

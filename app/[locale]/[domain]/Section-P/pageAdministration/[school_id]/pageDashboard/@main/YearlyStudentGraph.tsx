'use client';
import React from 'react';
import { BarChart3 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useTranslation } from 'react-i18next';


const YearlyStudentGraph = (
    { data }: any
) => {

    const { t } = useTranslation("common");

    const DataYearly = data?.map((d: any) => {
        return {
            year: d.academicYear.slice(0, 4),
            active: d.active,
            inactive: d.inactive,
        }
    }).reverse()

  return (
    
          <div className="w-full md:w-1/2 bg-white rounded-2xl shadow-md p-4 md:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <BarChart3 size={20} /> {t("Student's Statistics")}
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={DataYearly}>
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="active" fill="#0ea5e9" name="Active" />
                <Bar dataKey="inactive" fill="#facc15" name="Inactive" />
              </BarChart>
            </ResponsiveContainer>
          </div>
  );
}

export default YearlyStudentGraph;

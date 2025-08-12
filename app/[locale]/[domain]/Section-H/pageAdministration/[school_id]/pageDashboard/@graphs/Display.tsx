
'use client';

import { BarChart3 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import React from 'react';

const Display = (
  { data }: any
) => {

  const DataSpecialtyLevelCount = data?.map((d: any) => {
    return {
      specialty: d?.specialty,
      l100: d?.l100,
      l200: d?.l200,
      l300: d?.l300,
      l400: d?.l400,
      l500: d?.l500,
    }
  })
  // }).reverse()

  // console.log(data);

  return (
    <div className="flex w-full gap-4">
      <div className="w-full bg-white rounded-2xl shadow-md p-4 md:col-span-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <BarChart3 size={20} />Top 10 Specialties
          </h2>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={DataSpecialtyLevelCount}>
            <XAxis dataKey="specialty" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="l100" fill="#FF6B6B" name="l100" />  // Bright Red
            <Bar dataKey="l200" fill="#4ECDC4" name="l200" />  // Teal
            <Bar dataKey="l300" fill="#FFD93D" name="l300" />  // Sharp Yellow
            <Bar dataKey="l400" fill="#1A8FE3" name="l400" />  // Vivid Blue
            {/* <Bar dataKey="l500" fill="#9B59B6" name="l500" />  // Purple */}
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

export default Display;

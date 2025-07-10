'use client';

import {
  Star,
  Clock,
} from 'lucide-react';

const ButtomSlot = () => {
console.log("count");

  return (
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-md p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <Star size={20} /> Top Performer
          </h2>
          <p className="text-sm text-gray-600">Week | Month | Year performance stats here...</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <Clock size={20} /> Attendance
          </h2>
          <p className="text-sm text-gray-600">Attendance overview / chart placeholder...</p>
        </div>
      </div>
  );
};

export default ButtomSlot;

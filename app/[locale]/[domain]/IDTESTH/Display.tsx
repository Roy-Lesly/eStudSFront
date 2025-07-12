'use client';

import React, { useRef } from 'react';
import SingleID from './SingleID';
import { generateIDCardHigh } from '@/utils/generateIDCardHigh';


const IDCardGenerator = ({ students }: { students: any[] }) => {
    const hiddenRef = useRef<HTMLDivElement>(null);


    return (
        <div className="p-4 flex items-center justify-center flex-col">
            <button
                onClick={() => generateIDCardHigh({students: students})}
                className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Download ID Cards PDF
            </button>

            {/* Preview visible cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border rounded p-2">
                {students.map((student, idx) => (
                    <SingleID key={`preview-${idx}`} student={student} />
                ))}
            </div>

            {/* Hidden cards for PDF (HD Version) */}
            <div
                ref={hiddenRef}
                className="absolute top-[-9999px] left-[-9999px] opacity-0"
            >
                {students.map((student, idx) => (
                    <SingleID key={`pdf-${idx}`} student={student} isPdf />
                ))}
            </div>
        </div>
    );
};

export default IDCardGenerator;

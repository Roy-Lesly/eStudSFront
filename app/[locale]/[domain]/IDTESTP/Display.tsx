'use client';

import React, { useRef } from 'react';
import SingleID from './SingleID';
import { generateIDCardPrim } from '@/utils/generateIDCardPrim';


const IDCardGenerator = ({ students }: { students: any[] }) => {
    const hiddenRef = useRef<HTMLDivElement>(null);


    return (
        <div className="p-4 flex items-center justify-center flex-col">
            <button
                onClick={() => generateIDCardPrim({students: students})}
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
        </div>
    );
};

export default IDCardGenerator;

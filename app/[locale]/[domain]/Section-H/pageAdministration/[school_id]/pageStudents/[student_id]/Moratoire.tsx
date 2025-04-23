'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EdgeResult, EdgeSchoolFees } from '@/Domain/schemas/interfaceGraphql';
import { GrStatusGood } from 'react-icons/gr';
import { FaTimes } from 'react-icons/fa';
import ResultsEdit from './Comps/ResultsEdit';
import MoratoireCheck from './Comps/MoratoireCheck';

const Moratoire = ({ data, results, params }: { data: EdgeSchoolFees, results: EdgeResult[], params: any }) => {
    const [selectedSemester, setSelectedSemester] = useState<string>('I');
    const [viewMoratoire, setViewMoratoire] = useState<boolean>(false);
    const balance = data?.node?.balance
    const statusPlatform = data?.node?.platformPaid
    const info = JSON.parse(data?.node?.userprofile?.info)
    const statusMoratoire = info?.moratoire?.status ?? null;
    const approvedSchedule = info?.moratoire?.approvedSchedule ?? null;
    const cumulativeTotalMoratoire = sumTotalAmounts(approvedSchedule)
    const cumulativeBalanceMoratoire = sumDueAmounts(approvedSchedule)
    const respectPayment = (cumulativeTotalMoratoire - cumulativeBalanceMoratoire) >= balance

     const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSemester(e.target.value);
      };


    if (!info.moratoire){
        return <div>No Moratoire</div>
    }


    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="overflow-x-auto p-4"
        >
            <div className='flex flex-col gap-2 text-slate-800'>
                <div className='w-full my-1 justify-between flex'>
                    <div className='flex gap-6 md:gap-10'>
                        <div>Application: <span className='mx-2 text-lg font-medium'>{statusMoratoire ? "Yes" : "-"}</span></div>
                        <div>Status: <span className='mx-2 text-lg font-medium'>{statusMoratoire ? statusMoratoire : "-"}</span></div>
                    </div>
                    <div className='flex flex-row items-center gap-4 justify-center'>Upto Date: {respectPayment ? <GrStatusGood color='green' size={28} /> : <FaTimes color='red' size={25} />}</div>
                    <div className='flex flex-row items-center gap-4 justify-center'>Account Status: {statusPlatform ? <GrStatusGood color='green' size={28} /> : <FaTimes color='red' size={25} />}</div>
                </div>
            </div>


            {/* Header Section */}
            <div className="bg-slate-100 flex flex-col gap-4 items-center justify-between mb-4 md:flex-row p-2 rounded w-full">
                <motion.h1
                    className="font-bold text-gray-800 text-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    {data?.node?.userprofile?.user?.fullName || "Student Name"}
                </motion.h1>
                <motion.h2
                    className="text-gray-700 text-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7 }}
                >
                    Class: {data?.node?.userprofile?.specialty?.mainSpecialty?.specialtyName}
                </motion.h2>
                <div className="text-gray-700 text-lg">
                    Level: {data?.node?.userprofile?.specialty?.level.level || "N/A"}
                </div>
                <div>
                    Year: {data?.node?.userprofile.specialty.academicYear || "N/A"}
                </div>
            </div>



            <div className="mb-4 text-black">

                <div className='flex flex-col items-center justify-between md:flex-row'>
                    <div
                        className="flex font-semibold items-center justify-between mb-2 text-slate-800 text-xl">
                        Semester {selectedSemester} - Results
                    </div>

                    <button 
                        className='border px-4 py-1 rounded bg-blue-50 text-lg font-medium'
                        onClick={() => setViewMoratoire(!viewMoratoire)}
                    >
                        View Moratoire
                    </button>

                    <div className="mb-6">
                        <select
                            value={selectedSemester}
                            onChange={handleSemesterChange}
                            className="border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 px-4 py-2 rounded-md shadow-sm text-gray-700 transition"
                        >
                            <option value="I">1st Semester</option>
                            <option value="II">2nd Semester</option>
                        </select>
                    </div>
                </div>


                <MoratoireCheck
                    statusMoratoire={statusMoratoire}
                    respectPayment={respectPayment}
                >
                    {selectedSemester === 'I' ? <ResultsEdit canEdit={false} data={results.filter((item) => item.node.course.semester === "I")} /> : null}
                    {selectedSemester === 'II' ? <ResultsEdit canEdit={false} data={results.filter((item) => item.node.course.semester === "II")} /> : null}
                </MoratoireCheck>

            </div>

        </motion.div >
    );
};

export default Moratoire;

const sumDueAmounts = (milestones: any[]): number => {
    const today = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD'

    if (milestones) {
        return milestones?.reduce((sum, milestone) => {
            return milestone?.due_date <= today ? sum + milestone.amount : sum;
        }, 0);
    }
    return 0
};

const sumTotalAmounts = (milestones: any[]): number => {
    return milestones?.reduce((sum, milestone) => sum + milestone.amount, 0);
};
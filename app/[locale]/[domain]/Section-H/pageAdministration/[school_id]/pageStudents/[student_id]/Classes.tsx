'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { EdgeSchoolFees } from '@/Domain/schemas/interfaceGraphql';
import { decodeUrlID } from '@/functions';
import { FaRightLong } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';

const Classes = ({ data, params }: { data: EdgeSchoolFees[], params: any }) => {

    const router = useRouter();
    const thisUserprofile = data.filter((item: EdgeSchoolFees) => decodeUrlID(item.node.userprofile.id) == decodeUrlID(params.student_id))[0].node?.userprofile
    // const thisUserprofile = data.filter((item: EdgeSchoolFees) => item.node.userprofile.id == params.student_id)
    console.log(thisUserprofile, 14)

    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.2 },
        },
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white overflow-x-auto rounded-lg shadow-md"
        >

<div className='gap-2 mb-4 p-4'>
    <h1>Present Class</h1>
    <div className='flex justify-between'>
        <span>{thisUserprofile.specialty.mainSpecialty.specialtyName}</span>
        <span>{thisUserprofile.specialty.academicYear}</span>
        <span>{thisUserprofile.specialty.level.level}</span>
    </div>
</div>

            <h2 className="font-semibold mb-2 text-2xl text-center">My Other Classes</h2>

            <motion.table
                className="bg-gray-100 border-collapse min-w-full"
                variants={sectionVariants}
            >
                <thead>
                    <tr className="bg-blue-600 text-white">
                        <th className="px-4 py-2 text-left">#</th>
                        <th className="px-4 py-2 text-left">Class</th>
                        <th className="px-4 py-2 text-left">Academic Year</th>
                        <th className="px-4 py-2 text-left">Level</th>
                        <th className="px-4 py-2 text-left">Campus</th>
                        <th className="px-4 py-2 text-left">Go to</th>
                    </tr>
                </thead>

                <tbody>
                    {data.filter((item: EdgeSchoolFees) => decodeUrlID(item.node.userprofile.id) !== decodeUrlID(params.student_id))?.map((sch: EdgeSchoolFees, index: number) => (
                        <motion.tr key={index} variants={sectionVariants} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-2">{index + 1}</td>
                            <td className="px-4 py-2">{sch.node.userprofile.specialty.mainSpecialty?.specialtyName}</td>
                            <td className="px-4 py-2">{sch.node.userprofile.specialty.academicYear}</td>
                            <td className="px-4 py-2">{sch.node.userprofile.specialty.level?.level}</td>
                            <td className="px-4 py-2">{sch.node.userprofile.specialty.school?.campus}</td>
                            <td className="px-4 py-2">
                                <button
                                    onClick={() => router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/${sch.node.userprofile.id}/?user=${sch.node.userprofile.user.id}`)}
                                    className="bg-green-200 p-1 rounded-full"
                                    >
                                    <FaRightLong color="green" size={21} />
                                </button>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </motion.table>
        </motion.div>
    );
};

export default Classes;

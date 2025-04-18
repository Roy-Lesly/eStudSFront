'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { NodeClassRoom } from '@/Domain/schemas/interfaceGraphqlSecondary';

const Classes = ({ data }: { data: NodeClassRoom[] }) => {

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
            <h2 className="font-semibold mb-6 text-2xl text-center">Table of My Classes</h2>

            <motion.table
                className="bg-gray-100 border-collapse min-w-full"
                variants={sectionVariants}
            >
                <thead>
                    <tr className="bg-blue-600 text-white">
                        <th className="px-4 py-2 text-left">Level</th>
                        <th className="px-4 py-2 text-left">Section</th>
                        <th className="px-4 py-2 text-left">Option</th>
                        <th className="px-4 py-2 text-left">Academic Year</th>
                        <th className="px-4 py-2 text-left">Campus</th>
                    </tr>
                </thead>

                <tbody>
                    {data.map((classroom: NodeClassRoom, index: number) => (
                        <motion.tr key={index} variants={sectionVariants} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-2">{classroom.level?.level}</td>
                            <td className="px-4 py-2">{classroom.stream}</td>
                            <td className="px-4 py-2">{classroom.option}</td>
                            <td className="px-4 py-2">{classroom.academicYear}</td>
                            <td className="px-4 py-2">{classroom.school?.campus}</td>
                        </motion.tr>
                    ))}
                </tbody>
            </motion.table>
        </motion.div>
    );
};

export default Classes;

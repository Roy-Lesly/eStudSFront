'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { decodeUrlID } from '@/functions';
import { FaRightLong } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { EdgeSchoolFeesPrim } from '@/utils/Domain/schemas/interfaceGraphqlPrimary';

const Classes = ({ data, params }: { data: EdgeSchoolFeesPrim[], params: any }) => {

    const router = useRouter();
    const { t } = useTranslation("common");
    const thisUserprofileprim = data.filter((item: EdgeSchoolFeesPrim) => decodeUrlID(item.node.userprofileprim.id) == decodeUrlID(params.student_id))[0].node?.userprofileprim

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
                <h1>{t("Present Class")}</h1>
                <div className='flex justify-between'>
                    <span>{thisUserprofileprim?.classroomprim.level}</span>
                    <span>{thisUserprofileprim?.classroomprim.academicYear}</span>
                    <span>{thisUserprofileprim?.classroomprim.level}</span>
                </div>
            </div>

            <h2 className="font-semibold mb-2 text-2xl text-center">{t("My Other Classes")}</h2>

            <motion.table
                className="bg-gray-100 border-collapse min-w-full"
                variants={sectionVariants}
            >
                <thead>
                    <tr className="bg-blue-600 text-white">
                        <th className="px-4 py-2 text-left">#</th>
                        <th className="px-4 py-2 text-left">{t("Class")}</th>
                        <th className="px-4 py-2 text-left">{t("Academic Year")}</th>
                        <th className="px-4 py-2 text-left">{t("Level")}</th>
                        <th className="px-4 py-2 text-left">{t("Campus")}</th>
                        <th className="px-4 py-2 text-left">{t("Go to")}</th>
                    </tr>
                </thead>

                <tbody>
                    {data.filter((item: EdgeSchoolFeesPrim) => decodeUrlID(item.node.userprofileprim.id) !== decodeUrlID(params.student_id))?.map((sch: EdgeSchoolFeesPrim, index: number) => (
                        <motion.tr key={index} variants={sectionVariants} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-2">{index + 1}</td>
                            <td className="px-4 py-2">{sch.node.userprofileprim.classroomprim.level}</td>
                            <td className="px-4 py-2">{sch.node.userprofileprim.classroomprim.academicYear}</td>
                            <td className="px-4 py-2">{sch.node.userprofileprim.classroomprim.school?.campus}</td>
                            <td className="px-4 py-2">
                                <button
                                    onClick={() => router.push(`/${params.locale}/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/${sch.node.userprofileprim.id}/?user=${sch.node.userprofileprim.customuser.id}`)}
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

'use client';
import React, { useState } from "react";
import { motion } from "framer-motion";
import ButtonUpdate from '@/components/Buttons/ButtonUpdate';
import { EdgeResult, EdgeSchoolHigherInfo } from "@/Domain/schemas/interfaceGraphql";
import FillMarksComponent from "@/components/componentsOne/FillMarksComponent";


const tableVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.5 } },
};

const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.6 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.4, duration: 0.6 } },
};




const FillMarksAll = (
    { values, data, params, schoolInfo }:
        { values: { title: string, pageType: "ca" | "exam" | "resit" }, data: EdgeResult[], params: any, schoolInfo: EdgeSchoolHigherInfo }
) => {

    const defaultFormData = data.map((item: EdgeResult) => {
        const rawInfoData = typeof item.node.infoData === "string" ? JSON.parse(item.node.infoData) : {};

        let infoData = { ...rawInfoData };

        return {
            ...item,
            node: {
                id: item.node.id,
                infoData,
                logs: item.node.logs,
                course: item.node.course,
                student: item.node.student,
            },
        };
    });

    const [formData, setFormData] = useState(defaultFormData);

    const handleUpdate = async () => {
        const confirmUpdate = window.confirm(`Are you sure you want to update`);
        if (!confirmUpdate) {
            return;
        }
    };


    const sortedFormData = formData.sort((a, b) => {
        const nameA = a.node.student.customuser.fullName.toLowerCase();
        const nameB = b.node.student.customuser.fullName.toLowerCase();
        return nameA.localeCompare(nameB);
    });

    return (
        <div className="flex flex-col gap-2 p-4 rounded w-full">

            {formData && formData.length > 0 ? (
                <motion.div
                    variants={tableVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: -20 }}
                    className="overflow-x-auto"
                >
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="bg-gradient-to-r from-blue-100 mb-4 p-4 rounded-xl shadow-lg to-teal-100 via-slate-50"
                    >
                        {/* Course and Instructor Info */}
                        <motion.div
                            variants={itemVariants}
                            className="flex flex-row font-semibold gap-10 items-center justify-between text-blue-800 text-lg"
                        >
                            <h2 className="flex tracking-wide uppercase">
                                Course: {formData[0].node.course?.mainCourse.courseName}
                            </h2>
                            <h2 className="hidden md:flex tracking-wide uppercase">
                                Lecturer: {formData[0].node.course?.assignedTo?.fullName}
                            </h2>
                        </motion.div>

                        {/* Student Info, Title, and Button */}
                        <motion.div
                            variants={itemVariants}
                            className="flex flex-row items-center justify-between"
                        >
                            {/* Student Specialty Info */}
                            <div className="flex flex-row font-semibold gap-4 text-blue-900 text-lg">
                                <h2 className="hidden md:flex uppercase">
                                    {formData[0].node.student?.specialty?.mainSpecialty?.specialtyName}
                                </h2>
                                <h2 className="hidden md:flex">
                                    {formData[0].node.student?.specialty?.level.level} -
                                </h2>
                                <h2 className="hidden md:flex">
                                    {formData[0].node.student?.specialty?.academicYear}
                                </h2>
                            </div>

                            {/* Title */}
                            <motion.h2
                                whileHover={{ scale: 1.1 }}
                                className="drop-shadow-lg font-bold text-center text-teal-800 text-xl"
                            >
                                {values.title.toUpperCase()}
                            </motion.h2>

                            {/* Update Button */}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="hidden"
                            >
                                <ButtonUpdate handleUpdate={handleUpdate} dataToSubmit={["XXXXX"]} />
                            </motion.div>
                        </motion.div>
                    </motion.div>


                    <FillMarksComponent
                        formData={sortedFormData}
                        setFormData={setFormData}
                        schoolInfo={schoolInfo}
                        values={values}
                        params={params}
                    />

                </motion.div>
            ) : null}



        </div>
    );
};

export default FillMarksAll;



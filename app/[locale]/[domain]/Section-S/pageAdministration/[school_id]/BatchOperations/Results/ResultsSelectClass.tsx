'use client';
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaRightLong } from "react-icons/fa6";
import MyTableComp from "@/section-s/Table/MyTableComp";
import { EdgeClassRoom, TableColumn } from "@/Domain/schemas/interfaceGraphqlSecondary";
import MyInputField from "@/MyInputField";

const ResultsSelectClass = ({ params, searchParams, data }: { params: any, searchParams: any, data: any }) => {
    const router = useRouter();

    const [formData, setFormData] = useState({
        level: "",
        academicYear: "",
        stream: "",
    });

    const thisYear = new Date().getFullYear();
    const streams = ["GENERAL", "TECHNICAL", "COMMERCIAL"];
    const ListAcademicYears = [`${thisYear - 2}/${thisYear - 1}`, `${thisYear - 1}/${thisYear}`, `${thisYear}/${thisYear + 1}`];

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        const { academicYear, stream } = formData;
        if (academicYear && stream) {
            router.push(`/${params.domain}/Section-S/pageAdministration/${params.school_id}/BatchOperations/?pageType=results&&academicYear=${academicYear}&&stream=${stream}`);
        }
    };

    const buttonVariants = {
        hover: { scale: 1.1, boxShadow: "0px 4px 10px rgba(0,0,0,0.2)" },
        tap: { scale: 0.8 },
    };

    const Columns: TableColumn<EdgeClassRoom>[] = [
        { header: "#", align: "center", render: (_item: EdgeClassRoom, index: number) => index + 1, },
        { header: "Class", accessor: "node.level.level", align: "center" },
        { header: "Section", accessor: "node.stream", align: "center" },
        { header: "option", accessor: "node.option", align: "center" },
        { header: "Academic Year", accessor: "node.academicYear", align: "center" },
        {
            header: "action", align: "center",
            render: (item) => <button
                onClick={() => router.push(`/${params.domain}/Section-S/pageAdministration/${params.school_id}/BatchOperations/Results/?class=${item.node.id}&type=subject`)}
                className="bg-green-200 p-2 rounded-full"
            >
                <FaRightLong color="green" size={23} />
            </button>,
        },
    ];

    const onRowClick = (row: any) => {
        router.push(`/${params.domain}/Section-S/pageAdministration/${params.school_id}/BatchOperations/Results/?class=${row.id}&type=subject`);
    };

    return (
        <div className="flex flex-col gap-4 rounded w-full">
            <motion.div
                className="bg-white mx-auto p-2 rounded-lg shadow-lg w-full"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 0.5 } }}
            >
                <h2 className="font-semibold px-6 text-2xl text-center text-slate-800">Select Classroom Parameters</h2>

                <div className="flex flex-col gap-4 items-center justify-between md:flex-row w-full">
                    <MyInputField
                        id="academicYear"
                        name="academicYear"
                        value={formData.academicYear}
                        onChange={handleChange}
                        label="Academic Year"
                        placeholder="Select Academic Year"
                        required
                        type="select"
                        options={ListAcademicYears}
                    />

                    <MyInputField
                        id="stream"
                        name="stream"
                        value={formData.stream}
                        onChange={handleChange}
                        label="Section"
                        placeholder="Select Section"
                        required
                        type="select"
                        options={streams}
                    />

                    <motion.button
                        onClick={handleSubmit}
                        className="bg-indigo-500 focus:outline-none font-medium hover:bg-indigo-600 mt-4 px-4 py-2 rounded-md shadow-md text-white w-full"
                        whileHover={{ scale: 1.1, boxShadow: "0px 4px 10px rgba(0,0,0,0.2)" }}
                        whileTap={{ scale: 0.8 }}
                    >
                        Search
                    </motion.button>
                </div>
            </motion.div>

            {data && data.length > 0 && (
                <MyTableComp
                    data={data}
                    columns={Columns}
                    rowKey={(item, index) => item.node.id || index}
                />
            )}
        </div>
    );
};

export default ResultsSelectClass;

'use client';
import React, { useState } from "react";
import { motion } from "framer-motion";
import { TableColumn } from "@/Domain/schemas/interfaceGraphqlSecondary";
import MyInputField from "@/MyInputField";
import { gql, useMutation } from "@apollo/client";
import ButtonUpdate from "@/section-h/Buttons/ButtonUpdate";
import MyTableComp from "@/section-h/Table/MyTableComp"; // Importing the MyTableComp component
import { EdgeResult, EdgeSchoolHigherInfo } from "@/Domain/schemas/interfaceGraphql";
import { decodeUrlID } from "@/functions";
import { JwtPayload } from "@/serverActions/interfaces";
import { jwtDecode } from "jwt-decode";


const FillMarksAll = ({ values, data, params, schoolInfo }: { values: any, data: EdgeResult[], params: any, schoolInfo: EdgeSchoolHigherInfo }) => {

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

    const [dataToSubmit, setDataToSubmit] = useState<any[]>([]); // Initialized as an empty array

    const defaultFormData = data.map((item: EdgeResult) => {
        const info = typeof item.node.info === "string" ? JSON.parse(item.node.info) : {};
        return {
            ...item,
            node: {
                id: item.node.id,
                info: info,
                logs: item.node.logs,
                ca: item.node.ca,
                exam: item.node.exam,
                resit: item.node.resit,
                average: item.node.average,
                course: item.node.course,
                student: item.node.student,
            },
        };
    });

    const [formData, setFormData] = useState(defaultFormData);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement> | any,
        index: number,
        field: string
    ) => {
        let { value } = e.target;
        value = Math.max(0, Math.min(
            values.pageType === "ca" ? schoolInfo.node.caLimit :
                values.pageType === "exam" ? schoolInfo.node.examLimit :
                    schoolInfo.node.resitLimit, Math.abs(parseFloat(value || '0'))));


        setFormData((prevFormData) => {
            const updatedFormData = prevFormData.map((item, i) =>
                i === index
                    ? {
                        ...item,
                        node: {
                            ...item.node,
                            info: {
                                ...item.node.info,
                                [field]: value,
                            },
                        },
                    }
                    : item
            );

            // Update `dataToSubmit`
            setDataToSubmit((prevDataToSubmit) => {
                const currentRecord = updatedFormData[index];
                const currentId = parseInt(decodeUrlID(currentRecord.node.id))

                const updatedInfo = {
                    ...currentRecord.node.info,
                    [field]: parseFloat(value), // Parse as number if required
                };

                const newData = {
                    node: {
                        ...currentRecord.node,
                        id: parseInt(decodeUrlID(currentRecord.node.id)),
                        info: JSON.stringify(updatedInfo),
                    },
                };

                // Check if the record exists in `dataToSubmit`
                const existingIndex = prevDataToSubmit.findIndex(
                    (record) => record.node.id === currentId
                );

                if (existingIndex !== -1) {
                    // Update existing record
                    return prevDataToSubmit.map((record, idx) =>
                        idx === existingIndex ? newData : record
                    );
                } else {
                    // Add new record
                    return [...prevDataToSubmit, newData];
                }
            });

            return updatedFormData;
        });
    };

    const [createResults] = useMutation(UPDATE_RESULT);
    const [updateResults] = useMutation(SUBMIT_RESULT);

    const handleUpdate = async () => {
        const confirmUpdate = window.confirm(`Are you sure you want to update`);
        if (!confirmUpdate) {
            return;
        }
        try {
            await createResults({
                variables: {
                    courseId: parseInt(params.course_id)
                }
            });
            window.location.reload();
        } catch (error) {
            alert(`Error Updating: ${error}`);
        }
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem("token")
        const user: JwtPayload | any = jwtDecode(token ? token : "")

        if (dataToSubmit.length > 0 && user.user_id) {
            const successMessages: string[] = [];
            const errorMessages: string[] = [];
            for (let index = 0; index < dataToSubmit.length; index++) {
                const res = dataToSubmit[index].node;
                console.log(res, 148)
                console.log({
                    ...res,
                    updatedById: user.user_id
                }, 148)
                try {
                    const result = await updateResults({
                        variables: {
                            ...res,
                            updatedById: user.user_id
                        }
                    });
                    console.log(result)

                    if (result.data.updateResult.result.id) {
                        successMessages.push(
                            `${result.data.updateResult.result.course.mainCourse.courseName} - ${result.data.updateResult.result.student.user.fullName}`
                        );
                    }
                } catch (err: any) {
                    errorMessages.push(`Error updating ${res.course?.mainCourse?.courseName}: ${err.message}`);
                }
            }

            // Show a single alert summarizing the results
            let alertMessage = "";
            if (successMessages.length > 0) {
                // alertMessage += `✅ Successfully updated:\n${successMessages.join("\n")}\n\n`;
                alertMessage += `✅ Successfully Submitted`;
                window.location.reload();
            }
            if (errorMessages.length > 0) {
                alertMessage += `❌ Errors occurred:\n${errorMessages.join("\n")}`;
            }
            alert(alertMessage);
        }
    };

    const Columns: TableColumn<EdgeResult>[] = [
        {
            header: '#',
            align: 'left',
            responsiveHidden: true,
            render: (item, index: number) => { return <span>{index + 1}</span> }
        },
        {
            header: 'Student Name',
            accessor: 'node.student.user.fullName',
            align: 'left', // Corrected to one of "left", "center", "right"
        },
        {
            header: 'Results',
            align: 'center', // Corrected to one of "left", "center", "right"
            render: (item, index: number) => {
                // Determine the corresponding sequence fields based on selectedSemester
                // const semFields = ['ca', 'exam', 'resit']
                const semFields = ['ca', 'exam', 'resit'].filter((item: string) => item === values.pageType)

                return (
                    <div className="flex gap-2 justify-center">
                        {/* Create input fields dynamically for each term */}
                        {semFields.map((field, idx) => (
                            <MyInputField
                                id={field}
                                name={field}
                                label=""
                                value={String(item.node.info[field]) || ''}
                                onChange={(e) => handleInputChange(e, index, field)}
                                placeholder={`${field}`}
                                type="number"
                                min={0}
                                max={70}
                                readOnly={values.pageType != field}
                            />
                        ))}
                    </div>
                );
            },
        },
    ];


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

                    <MyTableComp
                        columns={Columns}
                        data={formData}
                        rowKey={(item, index) => item.node.id || index}
                    />

                    {dataToSubmit.length > 0 ? (
                        <ButtonUpdate handleUpdate={handleSubmit} dataToSubmit={dataToSubmit} />
                    ) : null}



                </motion.div>
            ) : null}



        </div>
    );
};

export default FillMarksAll;




const SUBMIT_RESULT = gql`
mutation UpdateResult(
    $id: ID!, 
    $updatedById: ID!, 
    $info: JSONString!
) {
    updateResult(
        id: $id, 
        infoField: $info 
        updatedById: $updatedById 
    ) {
        result {
            id
            course { mainCourse {courseName}}
            student { user { fullName}}
            info
        }
    }
}
`;

const UPDATE_RESULT = gql`
  mutation Create(
    $courseId: ID!
  ) {
    createResult(
      courseId: $courseId, 
      infoField: "{}"
    ) {
      result {
        id student { user { fullName}} 
        course { mainCourse {courseName}}
        info
      }
    }
  }
`;



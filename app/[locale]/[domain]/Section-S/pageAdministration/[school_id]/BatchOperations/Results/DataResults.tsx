'use client';
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { EdgeResultSecondary, TableColumn } from "@/Domain/schemas/interfaceGraphqlSecondary";
import MyInputField from "@/MyInputField";
import { gql, useMutation } from "@apollo/client";
import ButtonUpdate from "@/section-s/Buttons/ButtonUpdate";
import { decodeUrlID } from "@/functions";
import MyTableComp from "@/section-s/Table/MyTableComp"; // Importing the MyTableComp component


const DataResults = (
    { params, searchParams, data }:
        { params: any, searchParams: any, data: EdgeResultSecondary[] }
) => {

    const tableVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.5 } },
    };


    const router = useRouter();
    const [selectedTerm, setSelectedTerm] = useState<string>('1st Term');
    const [dataToSubmit, setDataToSubmit] = useState<any[]>([]); // Initialized as an empty array

    const defaultFormData = data.map((item: EdgeResultSecondary) => {
        const info = typeof item.node.info === "string" ? JSON.parse(item.node.info) : {};
        return {
            ...item,
            node: {
                id: item.node.id,
                info: info,
                subject: item.node.subject,
                student: item.node.student,
                active: item.node?.active || true
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
        value = Math.max(0, Math.min(20, Math.abs(parseFloat(value || '0'))));


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
                const currentId = currentRecord.node.id;

                const updatedInfo = {
                    ...currentRecord.node.info,
                    [field]: parseFloat(value), // Parse as number if required
                };

                const newData = {
                    node: {
                        ...currentRecord.node,
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

    const handleTermChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTerm(e.target.value);
    };

    const [createResultSecondary] = useMutation(UPDATE_RESULT);
    const [updateResultsSecondary] = useMutation(SUBMIT_RESULT);

    const handleUpdate = async () => {
        const confirmUpdate = window.confirm(`Are you sure you want to update`);
        if (!confirmUpdate) {
            return;
        }
        try {
            await createResultSecondary({
                variables: {
                    subjectId: parseInt(decodeUrlID(searchParams.subject))
                }
            });
            window.location.reload();
        } catch (error) {
            alert(`Error Updating: ${error}`);
        }
    };

    const handleSubmit = async () => {
        if (dataToSubmit.length > 0) {
            const successMessages: string[] = [];
            const errorMessages: string[] = [];

            for (let index = 0; index < dataToSubmit.length; index++) {
                const res = dataToSubmit[index].node;
                try {
                    const result = await updateResultsSecondary({
                        variables: res
                    });

                    if (result.data.updateResultSecondary.resultSecondary.id) {
                        successMessages.push(
                            `${result.data.updateResultSecondary.resultSecondary.subject.mainSubject.subjectName} - ${result.data.updateResultSecondary.resultSecondary.student.user.fullName}`
                        );
                    }
                } catch (err: any) {
                    errorMessages.push(`Error updating ${res.subject?.mainSubject?.subjectName}: ${err.message}`);
                }
            }

            // Show a single alert summarizing the results
            let alertMessage = "";
            if (successMessages.length > 0) {
                alertMessage += `✅ Successfully updated:\n${successMessages.join("\n")}\n\n`;
            }
            if (errorMessages.length > 0) {
                alertMessage += `❌ Errors occurred:\n${errorMessages.join("\n")}`;
            }

            alert(alertMessage);
            window.location.reload();
        }
    };

    const Columns: TableColumn<EdgeResultSecondary>[] = [
        {
            header: 'Student Name',
            accessor: 'node.student.user.fullName',
            align: 'left', // Corrected to one of "left", "center", "right"
        },
        {
            header: 'Subject',
            accessor: 'node.subject.mainSubject.subjectName',
            align: 'left', // Corrected to one of "left", "center", "right"
        },
        {
            header: 'Results',
            align: 'center', // Corrected to one of "left", "center", "right"
            render: (item, index: number) => {
                // Determine the corresponding sequence fields based on selectedTerm
                const seqFields = selectedTerm === "1st Term"
                    ? ['seq_1', 'seq_2']
                    : selectedTerm === "2nd Term"
                        ? ['seq_3', 'seq_4']
                        : ['seq_5', 'seq_6'];
        
                return (
                    <div className="flex gap-2 justify-center">
                        {/* Create input fields dynamically for each term */}
                        {seqFields.map((field, idx) => (
                            <MyInputField
                            id={field}
                            name={field}
                            label=""
                            value={String(item.node.info[field]) || ''}
                            onChange={(e) => handleInputChange(e, index, field)}
                            placeholder={`${field}`}
                            type="number"
                            min={0}
                            max={20}
                        />
                            // <input
                            //     key={field}
                            //     type="number"
                            //     value={item.node.info[field] || ''}
                            //     onChange={(e) => handleInputChange(e, index, field)} // Update value on change
                            //     className="border border-gray-300 p-1 rounded-md text-center w-16"
                            // />
                        ))}
                    </div>
                );
            },
        },
        {
            header: 'Average',
            align: 'right',
            render: (item) => {
                const result = selectedTerm === "1st Term"
                    ? item.node.info.average_term_1 || "-"
                    : selectedTerm === "2nd Term"
                        ? item.node.info.average_term_2 || "-"
                        : item.node.info.average_term_3 || "-";

                // Return result as string, fallback to "N/A" if null
                return result ? result.toString() : "N/A";
            },
        },
    ];


    return (
        <div className="flex flex-col gap-2 rounded w-full">

            {formData && formData.length > 0 ? (
                <motion.div
                    variants={tableVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: -20 }}
                    className="overflow-x-auto"
                >
                    <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-row font-semibold text-center text-gray-800 text-lg">
                            <h2>{formData[0].node.subject?.mainSubject.subjectName.toUpperCase()} -</h2>
                            <h2 className="hidden md:flex">{formData[0].node.student?.classroom?.level.level.toUpperCase()} -</h2>
                            <h2 className="hidden md:flex">{formData[0].node.student?.classroom?.academicYear} -</h2>
                            <h2 className="hidden md:flex">{formData[0].node.student?.classroom?.stream.toUpperCase()}</h2>
                        </div>
                        <h2 className="font-semibold text-center text-gray-800 text-xl">
                            {selectedTerm.toUpperCase()} RESULTS
                        </h2>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className=""
                        >
                            <select
                                value={selectedTerm}
                                onChange={handleTermChange}
                                className="border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 px-4 py-2 rounded-md shadow-sm text-gray-700 transition"
                                aria-label="Select Term"
                            >
                                <option value="1st Term">1st Term</option>
                                <option value="2nd Term">2nd Term</option>
                                <option value="3rd Term">3rd Term</option>
                            </select>
                        </motion.div>
                    </div>

                    <div className="mb-2">
                        <ButtonUpdate handleUpdate={handleUpdate} dataToSubmit={["XXXXX"]} />
                    </div>

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

export default DataResults;





const SUBMIT_RESULT = gql`
mutation UpdateResult(
    $id: ID!, 
    $info: JSONString!
) {
    updateResultSecondary(
        id: $id, 
        infoField: $info 
    ) {
        resultSecondary {
            id
            subject { mainSubject { subjectName}}
            student { user { fullName}}
        }
    }
}
`;

const UPDATE_RESULT = gql`
  mutation Create(
    $subjectId: ID!
  ) {
    createResultSecondary(
      subjectId: $subjectId, 
      infoField: "{}"
    ) {
      resultSecondary {
        id student { user { fullName}} subject { mainSubject {subjectName}}
      }
    }
  }
`;



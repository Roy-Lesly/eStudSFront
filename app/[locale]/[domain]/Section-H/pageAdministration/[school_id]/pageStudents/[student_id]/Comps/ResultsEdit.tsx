import { EdgeResult } from '@/Domain/schemas/interfaceGraphql'
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import { decodeUrlID } from '@/functions';
import MyInputField from '@/MyInputField';
import ButtonUpdate from '@/section-h/Buttons/ButtonUpdate';
import MyTableComp from '@/section-h/Table/MyTableComp'
import { JwtPayload } from '@/serverActions/interfaces';
import { gql, useMutation } from '@apollo/client';
import { jwtDecode } from 'jwt-decode';
import React, { useState } from 'react'

const ResultsEdit = ({ data }: { data: EdgeResult[] }) => {
    const [dataToSubmit, setDataToSubmit] = useState<any[]>([]);
    const token = localStorage.getItem("token")
    const user: JwtPayload | null = token ? jwtDecode(token) : null

    const Columns: TableColumn<EdgeResult>[] = [
        {
            header: '#',
            align: 'left',
            responsiveHidden: true,
            render: (item, index: number) => { return <span>{index + 1}</span> }
        },
        {
            header: 'Course Name',
            accessor: 'node.course.mainCourse.courseName',
            align: 'left',
        },
        {
            header: 'Results',
            align: 'center',
            render: (item, index: number) => {
                const semFields = ['ca', 'exam', 'resit']

                return (
                    <div className="flex gap-2 justify-center">
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
                            />
                        ))}
                    </div>
                );
            },
        },
    ];

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
                    [field]: parseFloat(value),
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

    const [updateResults] = useMutation(SUBMIT_RESULT);

    const handleSubmit = async () => {

        if (dataToSubmit.length > 0 && user?.user_id) {
            const successMessages: string[] = [];
            const errorMessages: string[] = [];
            for (let index = 0; index < dataToSubmit.length; index++) {
                const res = dataToSubmit[index].node;
                try {
                    const result = await updateResults({
                        variables: {
                            ...res,
                            updatedById: user.user_id
                        }
                    });

                    if (result.data.updateResult.result.id) {
                        successMessages.push(
                            `${result.data.updateResult.result.course.mainCourse.courseName} - ${result.data.updateResult.result.student.user.fullName}`
                        );
                    }
                } catch (err: any) {
                    errorMessages.push(`Error updating ${res.subject?.mainCourse?.courseName}: ${err.message}`);
                }
            }

            // Show a single alert summarizing the results
            let alertMessage = "";
            if (successMessages.length > 0) {
                // alertMessage += `✅ Successfully updated:\n${successMessages.join("\n")}\n\n`;
                alertMessage += `✅ Successfully Submitted`;
                alert(alertMessage);
                window.location.reload();
            }
            if (errorMessages.length > 0) {
                alertMessage += `❌ Errors occurred:\n${errorMessages.join("\n")}`;
                alert(alertMessage);
            }

        }
    };

    return (
        <div>
            {data.length < 1 ?
                <div className='flex items-center justify-center my-20'>No Results For This Semester</div>
                :
                <div className='flex items-center justify-center w-full'>
                    <MyTableComp
                        columns={Columns}
                        data={formData.sort((a: EdgeResult, b: EdgeResult) => a.node.student.user.fullName > b.node.student.user.fullName ? 1 : a.node.student.user.fullName < b.node.student.user.fullName ? -1 : 0)}
                        rowKey={(item, index) => item.node.id || index}
                    />
                </div>}
            {dataToSubmit.length > 0 ? (
                <ButtonUpdate handleUpdate={handleSubmit} dataToSubmit={dataToSubmit} />
            ) : null}
        </div>
    )
}

export default ResultsEdit

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
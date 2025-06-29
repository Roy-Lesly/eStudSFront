import { EdgeResult } from '@/Domain/schemas/interfaceGraphql'
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import { decodeUrlID } from '@/functions';
import MyInputField from '@/MyInputField';
import ButtonUpdate from '@/section-h/Buttons/ButtonUpdate';
import MyTableComp from '@/section-h/Table/MyTableComp'
import { JwtPayload } from '@/serverActions/interfaces';
import { ApiFactory } from '@/utils/graphql/ApiFactory';
import { gql } from '@apollo/client';
import { jwtDecode } from 'jwt-decode';
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';

const ResultsEdit = ({ data, canEdit, params }: { data: EdgeResult[], canEdit: boolean, params: any }) => {
    const { t } = useTranslation("common");
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
                                key={idx}
                                id={field}
                                name={field}
                                label=""
                                value={String(item.node.infoData[field]) || ''}
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
        const infoData = typeof item.node.infoData === "string" ? JSON.parse(item.node.infoData) : {};
        return {
            ...item,
            node: {
                id: item.node.id,
                infoData: infoData,
                logs: item.node.logs,
                ca: infoData?.ca,
                exam: infoData?.exam,
                resit: infoData?.resit,
                average: infoData?.average,
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
                            infoData: {
                                ...item.node.infoData,
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
                    ...currentRecord.node.infoData,
                    [field]: parseFloat(value),
                };

                const newData = {
                    node: {
                        ...currentRecord.node,
                        id: parseInt(decodeUrlID(currentRecord.node.id)),
                        infoData: JSON.stringify(updatedInfo),
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

    const handleSubmit = async () => {

        if (dataToSubmit.length > 0 && user?.user_id) {
            let count = 0
            for (let index = 0; index < dataToSubmit.length; index++) {
                const newData = dataToSubmit[index].node;

                const res = await ApiFactory({
                    newData: { ...newData, delete: false },
                    mutationName: "createUpdateDeleteResult",
                    modelName: "result",
                    successField: "id",
                    query,
                    router: null,
                    params: params,
                    redirect: false,
                    reload: false,
                    returnResponseField: true,
                    redirectPath: ``,
                    actionLabel: "processing",
                });
                count = count + (res ? 1 : 0)
            }

            if (count === dataToSubmit.length) {
                alert(t("Operation Completed"))
                window.location.reload();
            } else {
                alert(t("Operation Failed"))
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
                        data={formData.sort((a: EdgeResult, b: EdgeResult) => a.node.student.customuser.fullName > b.node.student.customuser.fullName ? 1 : a.node.student.customuser.fullName < b.node.student.customuser.fullName ? -1 : 0)}
                        rowKey={(item, index) => item.node.id || index}
                    />
                </div>}
            {canEdit && dataToSubmit.length > 0 ? (
                <ButtonUpdate handleUpdate={handleSubmit} dataToSubmit={dataToSubmit} />
            ) : null}
        </div>
    )
}

export default ResultsEdit

const query = gql`
mutation Result(
    $id: ID!, 
    $infoData: JSONString!
    $delete: Boolean!, 
) {
    createUpdateDeleteResult(
        id: $id, 
        infoData: $infoData
        delete: $delete 
    ) {
        result {
            id
            course { mainCourse {courseName}}
            student { customuser { fullName}}
            infoData
        }
    }
}
`;
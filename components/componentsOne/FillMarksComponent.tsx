'use client';
import { EdgeResult, EdgeSchoolHigherInfo } from '@/utils/Domain/schemas/interfaceGraphql';
import { TableColumn } from '@/utils/Domain/schemas/interfaceGraphqlSecondary';
import React, { useState } from 'react';
import MyInputField from '../MyInputField';
import { decodeUrlID } from '@/utils/functions';
import ButtonUpdate from '../section-h/Buttons/ButtonUpdate';
import { JwtPayload } from '@/utils/serverActions/interfaces';
import { jwtDecode } from 'jwt-decode';
import { gql } from '@apollo/client';
import { ApiFactory } from '@/utils/graphql/ApiFactory';
import MyTableComp from '../section-h/Table/MyTableComp';

const FillMarksComponent = (
    { values, formData, setFormData, schoolInfo, params }:
        { values: any, formData: EdgeResult[], setFormData: any, schoolInfo: EdgeSchoolHigherInfo, params: any }
) => {

    const [dataToSubmit, setDataToSubmit] = useState<any[]>([]); // Initialized as an empty array

    const Columns: TableColumn<EdgeResult>[] = [
        {
            header: '#',
            align: 'left',
            responsiveHidden: true,
            render: (item, index: number) => { return <span>{index + 1}</span> }
        },
        {
            header: 'Student Name',
            accessor: 'node.student.customuser.fullName',
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
                                readOnly={values.pageType != field}
                            />
                        ))}
                    </div>
                );
            },
        },
    ];

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

        setFormData((prevFormData: any) => {
            const updatedFormData = prevFormData.map((item: any, i: number) =>
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


    const handleSubmit = async () => {
        const token = localStorage.getItem("token")
        const user: JwtPayload | any = jwtDecode(token ? token : "")

        if (dataToSubmit.length > 0 && user.user_id) {
            let count = 1;
            for (let index = 0; index < dataToSubmit.length; index++) {
                const newData = {
                    ...dataToSubmit[index].node,
                    infoData: JSON.stringify(dataToSubmit[index].node.infoData),
                    delete: false
                };

                const res = await ApiFactory({
                    newData: newData,
                    editData: newData,
                    mutationName: "createUpdateDeleteResult",
                    modelName: "result",
                    successField: "id",
                    query,
                    router: null,
                    params,
                    returnResponseField: true,
                    redirect: false,
                    reload: false,
                    redirectPath: ``,
                    actionLabel: "processing",
                });
                if (count === dataToSubmit.length) {
                    alert("COMPLETED !!!");
                    window.location.reload();
                }
                if (res) {
                    count = count + 1
                }
            }

        }
    };


    return (
        <>
            <MyTableComp
                columns={Columns}
                data={formData}
                rowKey={(item, index) => item.node.id || index}
            />

            {dataToSubmit.length > 0 ? (
                <ButtonUpdate handleUpdate={handleSubmit} dataToSubmit={dataToSubmit} />
            ) : null}
        </>
    );
}

export default FillMarksComponent;




const query = gql`
mutation Result(
    $id: ID!,
    $infoData: JSONString!
    $delete: Boolean!
) {
    createUpdateDeleteResult(
        id: $id, 
        infoData: $infoData
        delete: $delete
    ) {
        result {
            id
        }
    }
}
`;
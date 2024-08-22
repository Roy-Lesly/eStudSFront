'use client';
import { EdgeResult, EdgeSchoolHigherInfo } from '@/utils/Domain/schemas/interfaceGraphql';
import { TableColumn } from '@/utils/Domain/schemas/interfaceGraphqlSecondary';
import React, { useState } from 'react';
import MyInputField from '../MyInputField';
import { decodeUrlID } from '@/utils/functions';
import ButtonUpdate from '../Buttons/ButtonUpdate';
import { JwtPayload } from '@/utils/serverActions/interfaces';
import { jwtDecode } from 'jwt-decode';
import { gql } from '@apollo/client';
import { ApiFactory } from '@/utils/graphql/ApiFactory';
import MyTableComp from '../Table/MyTableComp';


const FillMarksComponent = (
    { values, formData, setFormData, schoolInfo, params }:
        { values: any, formData: EdgeResult[], setFormData: any, schoolInfo: EdgeSchoolHigherInfo, params: any }
) => {

    const [dataToSubmit, setDataToSubmit] = useState<any[]>([]); // Initialized as an empty array

    const Columns: TableColumn<EdgeResult>[] = [
        { header: '#', align: 'left', responsiveHidden: true, render: (item, index: number) => { return <span>{index + 1}</span> } },
        { header: 'Student Name', accessor: 'node.student.customuser.fullName', align: 'left' },
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
                                // value={String(item.node.infoData[field]) || ''}
                                value={String(item.node.infoData?.[field] ?? "")}
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

        value = Math.max(
            0,
            Math.min(
                values.pageType === "ca"
                    ? schoolInfo.node.caLimit
                    : values.pageType === "exam"
                        ? schoolInfo.node.examLimit
                        : schoolInfo.node.resitLimit,
                Math.abs(parseFloat(value || "0"))
            )
        );

        const newFormData = [...formData];
        const updatedInfoData = {
            ...newFormData[index].node.infoData,
            [field]: value,
        };

        newFormData[index] = {
            ...newFormData[index],
            node: {
                ...newFormData[index].node,
                infoData: updatedInfoData,
            },
        };

        setFormData(newFormData); // ✅ Safe

        const currentId = parseInt(decodeUrlID(newFormData[index].node.id));

        const newData = {
            node: {
                ...newFormData[index].node,
                id: currentId,
                info: JSON.stringify(updatedInfoData),
            },
        };

        setDataToSubmit((prev) => {
            const existingIndex = prev.findIndex((r) => r.node.id === currentId);
            if (existingIndex !== -1) {
                const updated = [...prev];
                updated[existingIndex] = newData;
                return updated;
            } else {
                return [...prev, newData];
            }
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
                    updatedById: user.user_id,
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
    $updatedById: ID!
    $delete: Boolean!
) {
    createUpdateDeleteResult(
        id: $id, 
        infoData: $infoData
        updatedById: $updatedById
        delete: $delete
    ) {
        result {
            id
        }
    }
}
`;
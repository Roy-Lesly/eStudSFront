import { decodeUrlID } from '@/functions';
import MyInputField from '@/MyInputField';
import ButtonUpdate from '@/components/Buttons/ButtonUpdate';
import MyTableComp from '@/components/Table/MyTableComp'
import { JwtPayload } from '@/serverActions/interfaces';
import { EdgeResultPrimary, TableColumn } from '@/utils/Domain/schemas/interfaceGraphqlPrimary';
import { ApiFactory } from '@/utils/graphql/ApiFactory';
import { gql } from '@apollo/client';
import { jwtDecode } from 'jwt-decode';
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';


const getSemesterFields = (selectedTerm: string): string[] => {
    const termMap: Record<string, string[]> = {
        "1": ['seq_1', 'seq_2'],
        "2": ['seq_3', 'seq_4'],
        "3": ['seq_5', 'seq_6'],
    };
    return termMap[selectedTerm] || [];
};


const ResultsEdit = ({ data, canEdit, params, selectedTerm }: { data: EdgeResultPrimary[], canEdit: boolean, params: any, selectedTerm: string }) => {
    const { t } = useTranslation("common");
    const [dataToSubmit, setDataToSubmit] = useState<any[]>([]);
    const token = localStorage.getItem("token")
    const user: JwtPayload | null = token ? jwtDecode(token) : null

    const Columns: TableColumn<EdgeResultPrimary>[] = [
        {
            header: '#',
            align: 'left',
            responsiveHidden: true,
            render: (item, index: number) => { return <span>{index + 1}</span> }
        },
        {
            header: `${t("Subject Name")}`,
            accessor: 'node.subjectprim.mainsubjectprim.subjectName',
            align: 'left',
        },
        {
            header: 'Results',
            align: 'center',
            render: (item, index: number) => {
                const semFields = getSemesterFields(selectedTerm);

                return (
                    <div className="flex gap-2 justify-center">
                        {semFields.map((field, idx) => (
                            <MyInputField
                                key={idx}
                                id={field}
                                name={field}
                                // label={field.replace("_", " ")}
                                label={""}
                                value={String(item.node.infoData[field]) || ''}
                                onChange={(e) => handleInputChange(e, index, field)}
                                placeholder={`${field.replace("_", " ")}`}
                                type="number"
                                min={0}
                                max={20}
                            />
                        ))}
                    </div>
                );
            },
        },
    ];

    const defaultFormData = data.map((item: EdgeResultPrimary) => {
        const infoData = typeof item.node.infoData === "string" ? JSON.parse(item.node.infoData) : {};
        return {
            ...item,
            node: {
                id: item.node.id,
                subjectprim: item.node.subjectprim,
                student: item.node.student,
                logs: item.node.logs,
                createdBy: item.node.createdBy,
                updatedBy: item.node.updatedBy,
                infoData: {
                    seq_1: infoData?.seq_1,
                    seq_2: infoData?.seq_2,
                    seq_3: infoData?.seq_3,
                    seq_4: infoData?.seq_4,
                    seq_5: infoData?.seq_5,
                    seq_6: infoData?.seq_6
                },
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

                const newData = {
                    ...dataToSubmit[index].node,
                    createdById: parseInt(decodeUrlID(dataToSubmit[index].node?.createdBy?.id)) || user?.user_id,
                    updatedById: user?.user_id,
                    delete: false
                };

                const res = await ApiFactory({
                    newData: newData,
                    mutationName: "createUpdateDeleteResultPrim",
                    modelName: "resultprim",
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
                alert(t("Operation Completed") + " " + "✅")
                window.location.reload();
            } else {
                alert(t("Operation Failed"))
            }
        }
    };

    return (
        <div>
            {data.length < 1 ?
                <div className='flex items-center justify-center my-20'>{t("No Results For This Semester")}</div>
                :
                <div className='flex items-center justify-center w-full'>
                    <MyTableComp
                        columns={Columns}
                        data={formData.sort((a: EdgeResultPrimary, b: EdgeResultPrimary) => a.node.student.customuser.fullName > b.node.student.customuser.fullName ? 1 : a.node.student.customuser.fullName < b.node.student.customuser.fullName ? -1 : 0)}
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
    $createdById: ID, 
    $updatedById: ID!, 
    $delete: Boolean!, 
) {
    createUpdateDeleteResultPrim(
        id: $id, 
        infoData: $infoData
        createdById: $createdById
        updatedById: $updatedById 
        delete: $delete 
    ) {
        resultprim {
            id
        }
    }
}
`;
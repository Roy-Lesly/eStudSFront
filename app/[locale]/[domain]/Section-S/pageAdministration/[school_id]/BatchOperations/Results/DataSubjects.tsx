'use client';
import React from "react";
import { useRouter } from "next/navigation";
import { FaRightLong } from "react-icons/fa6";
import { EdgeSubject } from "@/Domain/schemas/interfaceGraphqlSecondary";
import MyTableComp from "@/section-s/Table/MyTableComp";

interface TableColumn<T> {
    header: string;
    accessor?: keyof T | string;
    align?: "left" | "center" | "right";
    render?: (item: T, index: number) => React.ReactNode;
}

const DataSubjects = (
    { params, data }:
        { params: any, data: EdgeSubject[] }
) => {

    const router = useRouter();

    const Columns: TableColumn<EdgeSubject>[] = [
        {
          header: "#",
          align: "center",
          render: (_item: EdgeSubject, index: number) => index + 1,
        },
        {
          header: "Subject Name",
          accessor: "node.mainSubject.subjectName",
          align: "left",
        },
        {
          header: "Subject Code",
          accessor: "node.subjectCode",
          align: "center",
        },
        {
          header: "Coefficient",
          accessor: "node.subjectCoefficient",
          align: "center",
        },
        {
          header: "Type",
          accessor: "node.subjectType",
          align: "center",
        },
        {
          header: "Actions",
          align: "center",
          render: (item: EdgeSubject) => (
            <button 
                onClick={() => router.push(`/${params.domain}/Section-S/pageAdministration/${params.school_id}/BatchOperations/Results/?subject=${item.node.id}&type=result`)}
                className="bg-green-200 p-2 rounded-full"
            >
                <FaRightLong color="green" size={23} />
            </button>
          ),
        },
    ];

    return (
        <div className="flex flex-col gap-4 rounded w-full">
            {data?.length ? (
                <MyTableComp
                    columns={Columns}
                    data={data}
                    rowKey={(item, index) => item.node.id || index}
                />
            ) : (
                <div>No data available</div> // Optional: Show a fallback message when no data is present.
            )}
        </div>
    );
}

export default DataSubjects;

import { EdgeResult } from '@/Domain/schemas/interfaceGraphql'
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary'
import MyTableComp from '@/components/Table/MyTableComp'
import ServerError from '@/ServerError'
import React from 'react'

const ResultLogs = ({ data }: { data: EdgeResult[] }) => {

    const Columns: TableColumn<EdgeResult>[] = [
        { header: "#", align: "center", render: (_item: EdgeResult, index: number) => index + 1, },
        { header: "Full Name", accessor: "node.student.customuser.fullName", align: "left" },
        { header: "Course", accessor: "node.course.mainCourse.courseName", align: "left" },
        {
            header: "Logs",
            align: "left",
            render: (item: EdgeResult) => {
                let logs = item.node.logs; // Ensure logs exist
                try {
                    logs = JSON.parse(item.node.logs); // Convert JSON string to array
                } catch (error) {
                    console.error("Error parsing logs:", error);
                    return "Invalid logs format";
                }

                if (!logs || logs.length === 0) return "No logs";

                return (
                    <div className="w-full overflow-auto">
                        <table className="w-full border-collapse border border-gray-300 text-sm">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="border border-gray-300 px-2 py-1">By</th>
                                    <th className="border border-gray-300 px-2 py-1">Date</th>
                                    <th className="border border-gray-300 px-2 py-1">Action</th>
                                    <th className="border border-gray-300 px-2 py-1">Changes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log: any, index: number) => (
                                    <tr key={index} className="text-center">
                                        <td className="border border-gray-300 px-2 py-1">{log.by}</td>
                                        <td className="border border-gray-300 px-2 py-1">
                                            {new Date(log.date).toLocaleString()}
                                        </td>
                                        <td className="border border-gray-300 px-2 py-1">{log.action}</td>
                                        <td className="border border-gray-300 px-2 py-1">
                                            {Object.entries(log)
                                                .filter(([key]) => !["by", "date", "action"].includes(key))
                                                .map(([key, value]: any) => (
                                                    <div key={key} className="text-xs">
                                                        <strong>{key.toUpperCase()}:</strong> {value.initial} → {value.final}
                                                    </div>
                                                ))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            }
        }]

    return (
        <div>
            {/* {data ? <MyTableComp
                data={data}
                columns={Columns}
                table_title={`Total: ${data?.length}`}
            />
                :
                <ServerError type='network' />
            } */}
        </div>
    )
}

export default ResultLogs

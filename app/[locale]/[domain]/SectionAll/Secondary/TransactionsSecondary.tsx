import { EdgeSchoolFees, EdgeTransactions } from '@/Domain/schemas/interfaceGraphql'
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary'
import MyTableComp from '@/section-h/Table/MyTableComp'
import ServerError from '@/ServerError'
import React from 'react'

const TransactionsSecondary = ({ data }: { data: EdgeTransactions[] }) => {

    const Columns: TableColumn<EdgeTransactions>[] = [
        { header: "#", align: "center", render: (_item: EdgeTransactions, index: number) => index + 1, },
        { header: "Matricle", accessor: "node.schoolfees.userprofile.customuser.matricle", align: "left" },
        { header: "Full Name", accessor: "node.schoolfees.userprofile.customuser.fullName", align: "left" },
        { header: "Class", accessor: "node.schoolfees.userprofile.specialty.mainSpecialty.specialtyName", align: "left" },
        { header: "Level", accessor: "node.schoolfees.userprofile.specialty.level.level", align: "center" },
        { header: "Year", accessor: "node.schoolfees.userprofile.specialty.academicYear", align: "center" },
        { header: "Date", align: "center", render: (item: EdgeTransactions) => (item.node.createdAt.slice(0, 10) + " " + item.node.createdAt.slice(11, 16)) },
    ]

    return (
        <div>
            {data ? <MyTableComp
                data={data}
                columns={Columns}
                table_title={`Total: ${data?.length}`}
            />
                :
                <ServerError type='network' />
            }
        </div>
    )
}

export default TransactionsSecondary

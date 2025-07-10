import { EdgeSchoolFees } from '@/Domain/schemas/interfaceGraphql'
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary'
import MyTableComp from '@/section-h/Table/MyTableComp'
import ServerError from '@/ServerError'
import React from 'react'

const PlatformCharge = ({ data }: { data: EdgeSchoolFees[] }) => {

    const Columns: TableColumn<EdgeSchoolFees>[] = [
        { header: "#", align: "center", render: (_item: EdgeSchoolFees, index: number) => index + 1, },
        { header: "Matricle", accessor: "node.userprofile.customuser.matricle", align: "left" },
        { header: "Full Name", accessor: "node.userprofile.customuser.fullName", align: "left" },
        { header: "Gender", accessor: "node.userprofile.customuser.sex", align: "center" },
        { header: "Class", accessor: "node.userprofile.specialty.mainSpecialty.specialtyName", align: "left" },
        { header: "Level", accessor: "node.userprofile.specialty.level.level", align: "center" },
        { header: "Year", accessor: "node.userprofile.specialty.academicYear", align: "center" },
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

export default PlatformCharge

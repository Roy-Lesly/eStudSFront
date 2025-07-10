import React, { useState } from 'react'
import { motion } from "framer-motion";
import SearchMultiple from '@/section-h/Search/SearchMultiple';
import { gql, useQuery } from '@apollo/client';
import Loader from '@/section-h/common/Loader';
import MyTableComp from '@/section-h/Table/MyTableComp';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import { EdgeCustomUser } from '@/Domain/schemas/interfaceGraphql';
import { FaRightLong } from 'react-icons/fa6';
import UserSetup from './UserSetup';


const UserManagement = ({ searchParams, params }: { params: any, searchParams: any }) => {

    const [page, setPage] = useState(1)
    const [selectedUser, setSelectedUser] = useState<EdgeCustomUser>()
    const { data, loading, error } = useQuery(GET_DATA,
        {
            variables: {
                fullName: searchParams?.fullName || "",
                schoolId: params?.school_id || ""
            }
        }
    );
    if (loading) return <p><Loader /></p>;
    if (error) return <p>Error: {error.message}</p>;

    const Columns: TableColumn<EdgeCustomUser>[] = [
        { header: '#', align: 'left', render: (_item: EdgeCustomUser, index: number) => index + 1, responsiveHidden: true },
        { header: 'Username', accessor: 'node.matricle', align: 'left' },
        { header: 'Full Name', accessor: 'node.fullName', align: 'left' },
        { header: 'Telephone', accessor: 'node.telephone', align: 'left' },
        {
            header: "View", align: "center",
            render: (item) => <button
                onClick={() => { setPage(2); setSelectedUser(item) }}
                className="bg-green-200 p-1 rounded-full"
            >
                <FaRightLong color="green" size={21} />
            </button>,
        },
    ]

    return (
        <div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="p-4 bg-white shadow-md rounded-lg"
            >
                <h2 className="text-xl font-semibold mb-2">User Access and Pages</h2>


                {data && page === 1 && <>
                    <div>
                        <SearchMultiple
                            names={['fullName']}
                            extraSearch={searchParams}
                            link={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageManagement/pageUserManagement/${params.tenant_name}`}
                        />
                    </div>
                    <div className='w-full'>

                        <MyTableComp
                            data={data?.allCustomUsers?.edges}
                            columns={Columns}
                        />
                    </div>
                </>}

                {selectedUser && page === 2 && <UserSetup user={selectedUser} setPage={setPage} />}

            </motion.div>
        </div>
    )
}

export default UserManagement



const GET_DATA = gql`
    query GetData (
        $fullName: String!
        $schoolId: Decimal!
    ) {
        allCustomUsers (
            fullName: $fullName,
            schoolId: $schoolId,
            last: 10
        ) {
            edges {
                node {
                    id
                    matricle
                    firstName
                    lastName
                    fullName
                    address
                    telephone
                    role
                    isActive
                    isSuperuser
                    isHod
                    page { 
                        edges {
                            node {
                            id
                            name
                            }
                        }
                    }
                }
            }
        }
    }
`;
import React from 'react'
import { motion } from "framer-motion";
import { gql, useQuery } from '@apollo/client';
import Loader from '@/section-h/common/Loader';
import MyTableComp from '@/section-h/Table/MyTableComp';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import { FaRightLong } from 'react-icons/fa6';


const RolesAndPages = ({ period }: { period: any }) => {

    const { data, loading, error } = useQuery(GET_DATA);
    if (loading) return <p><Loader /></p>;
    if (error) return <p>Error: {error.message}</p>;

    const ColumnsRoles: TableColumn<any>[] = [
        { header: "Role", accessor: "name", align: "left" },
    ]

    const Columns: TableColumn<any>[] = [
        { header: "#", align: "center", render: (_item: any, index: number) => index + 1, },
        { header: "Page Access", accessor: "node.name", align: "left" },
        { header: "Description", accessor: "node.description", align: "left" },
        {
            header: "View", align: "center",
            render: (item) => <button
                // onClick={() => router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/${item.node.id}/?user=${item.node.customuser.id}`)}
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
                <div className='flex gap-6 flex-col w-full'>
                    <div className='w-full'>
                        {/* <h2 className="text-xl font-semibold mb-1">User Roles</h2> */}
                        <MyTableComp
                            table_title='USer Roles'
                            data={[
                                { name: "Admin", description: "description" },
                                { name: "Lecturer", description: "description" },
                                { name: "Student", description: "description" },
                            ]}
                            columns={ColumnsRoles}
                        />
                    </div>

                    <hr className='border-4 border-blue-500' />

                    <div className='w-full'>
                        {/* <h2 className="text-xl font-semibold">Users Access Pages</h2> */}
                        <MyTableComp
                            table_title='Users Access Pages'
                            data={data?.allPages?.edges}
                            columns={Columns}
                            button_action={() => console.log("object")}
                            button_type="add"
                        />
                    </div>
                </div>

            </motion.div>
        </div>
    )
}

export default RolesAndPages


const GET_DATA = gql`
    query GetData {
        allPages {
            edges {
                node {
                    id
                    name
                    description
                }
            }
        }
    }
`;

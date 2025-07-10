'use client';

import React, { useState } from 'react'; // Importing icons
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-h/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import ServerError from '@/ServerError';
import { decodeUrlID } from '@/functions';
import { Metadata } from 'next';
import SearchMultiple from '@/section-h/Search/SearchMultiple';
import DefaultLayout from '@/DefaultLayout';
import { EdgeCustomUser } from '@/Domain/schemas/interfaceGraphql';
import MyTableComp from '@/section-h/Table/MyTableComp';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import { FaRightLong } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';


export const metadata: Metadata = {
    title: "List-Lecturers Page",
    description: "This is List-Lecturers Page Admin Settings",
};

const List = ({ params, data, searchParams }: { params: any; data: any, searchParams: any }) => {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

    return (
        <DefaultLayout
            pageType='admin'
            domain={params.domain}
            searchComponent={
                <SearchMultiple
                    names={['fullName']}
                    link={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageMarksEntry`}
                />
            }
            sidebar={
                <Sidebar
                    params={params}
                    menuGroups={GetMenuAdministration()}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />
            }
            headerbar={
                <Header
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    searchComponent={
                        <></>
                    }
                />
            }
        >
            <Breadcrumb
                department="Marks Entry"
                subRoute="List"
                pageName="Marks Entry Page"
                mainLink={`${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation`}
                subLink={`${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation`}
            />

            <div className="bg-gray-50 flex flex-col items-center justify-center p-2">

                {data ?
                    data.allCustomUsers?.edges.length ?
                        <div className="flex flex-col gap-2 w-full">
                            {/* <DataTable data={dataAdmin.allCustomUsers.edges} params={params} /> */}
                            <DataTable data={data.allCustomUsers.edges} params={params} />
                        </div>
                        :
                        <ServerError type="notFound" item="Marks Entry" />
                    :
                    <ServerError type="network" item="Marks Entry" />
                }

            </div>
        </DefaultLayout>
    );
};

export default List;



const DataTable = ({ data, params }: { data: EdgeCustomUser[], params: any }) => {

    const router = useRouter();

    const Columns: TableColumn<EdgeCustomUser>[] = [
        {
            header: "#",
            align: "center",
            render: (_item: EdgeCustomUser, index: number) => index + 1,
        },
        {
            header: "Full Name",
            accessor: "node.fullName",
            align: "left",
        },
        {
            header: "Full Name",
            accessor: "node.role",
            align: "left",
        },
        {
            header: "User Name",
            accessor: "node.username",
            align: "left",
        },
        {
            header: "Gender",
            accessor: "node.sex",
            align: "center",
        },
        {
            header: "Address",
            accessor: "node.address",
            align: "center",
        },
        {
            header: "Telephone",
            accessor: "node.telephone",
            align: "center",
        },
        {
            header: "Actions",
            align: "center",
            render: (item: EdgeCustomUser) => (
                <button
                    onClick={() => router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageMarksEntry/${parseInt(decodeUrlID(item.node.id))}`)}
                    className="bg-green-200 p-2 rounded-full"
                >
                    <FaRightLong color="green" size={23} />
                </button>
            ),
        },
    ];

    return <div className='w-full'>
        {data?.length ? (<>
            <MyTableComp
                columns={Columns}
                data={data}
                rowKey={(item, index) => item.node.id || index}
            />
        </>
        ) : (
            <div>No data available</div> // Optional: Show a fallback message when no data is present.
        )}
    </div>
}

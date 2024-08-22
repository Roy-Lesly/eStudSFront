'use client';
import { EdgeTenant } from '@/Domain/schemas/interfaceGraphql';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import MyTableComp from '@/components/Table/MyTableComp';
import ServerError from '@/ServerError';
import { gql, useQuery } from '@apollo/client';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React from 'react'
import { FaArrowRightLong } from 'react-icons/fa6';

const SelectTenant = ({ params }: { params: any }) => {
    const pa = useParams();
    const path = usePathname();
    const router = useRouter();


    const Columns: TableColumn<EdgeTenant>[] = [
        { header: "#", align: "center", render: (_item: EdgeTenant, index: number) => index + 1, },
        { header: "Tenant", accessor: "node.schoolName", align: "left" },
        { header: "Schema Name", accessor: "node.schemaName", align: "left" },
        { header: "Type", accessor: "node.schoolType", align: "center" },
        {
            header: "Is Active", align: "center",
            render: (item: EdgeTenant) => (
                <span className={item.node.isActive ? "text-white py-2 px-3 rounded bg-green-500 font-bold" : "text-gray-400"}>
                    {item.node.isActive ? "Active" : "-"}
                </span>
            ),
        }, { header: "User", accessor: "node.customuser.matricle", align: "left" },
        {
            header: "Domain", align: "left",
            render: (item: EdgeTenant) => item.node?.domains?.edges
                .map(domainEdge => domainEdge.node.domain)
                .join(", ")
        },
        {
            header: "Action", align: "center",
            render: (item: EdgeTenant) => {
                const firstDomain = item.node.domains.edges.length > 0
                    ? item.node.domains.edges[0].node.domain
                    : "";

                const subdomain = firstDomain ? firstDomain.split(".")[0] : "";

                return (
                    <button onClick={() => OnSelect(subdomain, item.node.id)} className='rounded-3xl px-3 py-2 bg-green-800'>
                        <FaArrowRightLong color="white" size={30} />
                    </button>
                );
            }
        },
    ]

    const { data, loading, error } = useQuery(GET_TENANT);
    if (loading) return <div className={`py-20 rounded-md text-white flex items-center justify-center gap-4`}>
        <span className="text-black text-xl">Loading Tenants ...</span>
        <span className={`border-bluedash animate-spin border-6  border-t-transparent flex h-[96px] rounded-full w-[96px]`}>.</span>
    </div>;
    console.log(data)
    if (error) return <p>Error: {error.message}</p>;

    const OnSelect = (tenant_name: string, tenant_id: string) => {
        router.push(`${path}${tenant_name}?id=${tenant_id}`);
    }

    return (
        <>
            {loading ?
                null
                :
                <div className='flex flex-col gap-10 items-center justify-center border rounded-lg w-full p-10'>
                    <span className='text-2xl md:text-4xl font-semibold md:font-bold tracking-widest'>Select Tenant</span>

                    {data?.allTenants?.edges.length ?
                        <MyTableComp
                            data={data?.allTenants?.edges}
                            columns={Columns}
                            table_title='System Tenants'
                        />
                        :
                        <ServerError type='network' item="Tenants" />
                    }

                </div>
            }
        </>
    )
}

export default SelectTenant


const GET_TENANT = gql`
    query GetData {
    allTenants {
        edges {
            node {
                id 
                
                schemaName 
                schoolName 
                schoolType 
                isActive 
                description
                domains { 
                    edges {
                        node { domain }
                    }
                }
            }
        }
    }
  }
`;
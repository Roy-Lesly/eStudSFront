'use client';

import React, { useState } from 'react';
import DefaultLayout from '@/DefaultLayout';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { getMenuAdministration } from '@/section-h/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import SearchMultiple from '@/section-h/Search/SearchMultiple';
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";



import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import UserLogins from './UserLogins';
import { EdgeTenant } from '@/Domain/schemas/interfaceGraphql';
// import UserLogins from '../../UserLogins';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);



export const parseJson = (data: string | Record<string, boolean>): Record<string, boolean> => {
    if (typeof data === "string") {
        try {
            return JSON.parse(data);
        } catch (error) {
            console.error('Error parsing JSON:', error);
            return {};
        }
    }
    return data;
};

const List = ({ params, searchParams, tenant }: { params: any, searchParams: any, tenant: EdgeTenant }) => {

    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

    const [activeTab, setActiveTab] = useState("overview");




    return (
        <DefaultLayout
            pageType='admin'
            domain={params.domain}
            searchComponent={<SearchMultiple
                names={[]}
                link={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageManagement/pageDashboard`}
            />}
            sidebar={
                <Sidebar
                    params={params}
                    menuGroups={getMenuAdministration(params)}
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

            <div className="p-2 lg:p-0 w-full bg-gray-100">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-2xl font-bold text-gray-800"
                >
                    Tenant - {tenant.node.schoolName} - LOGINS
                </motion.h1>

                <div className="mt-4 flex w-full gap-4">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`px-2 py-2 border rounded-md w-full ${activeTab === "overview" ? "bg-blue-500 text-white" : "bg-white border-gray-300 text-gray-800"
                            }`}
                    >
                        {searchParams?.dateAfter || "Today"}
                    </button>
                    <button
                        onClick={() => setActiveTab("user_management")}
                        className={`px-2 py-2 border rounded-md w-full ${activeTab === "user_management" ? "bg-blue-500 text-white" : "bg-white border-gray-300 text-gray-800"
                            }`}
                    >
                        Last 7 days
                    </button>
                    <button
                        onClick={() => setActiveTab("system_updates")}
                        className={`px-2 py-2 border rounded-md w-full ${activeTab === "system_updates" ? "bg-blue-500 text-white" : "bg-white border-gray-300 text-gray-800"
                            }`}
                    >
                        Last 30 Days
                    </button>
                    <button
                        onClick={() => setActiveTab("financials")}
                        className={`px-2 py-2 border rounded-md w-full  ${activeTab === "financials" ? "bg-blue-500 text-white" : "bg-white border-gray-300 text-gray-800"
                            }`}
                    >
                        Last 6 Months
                    </button>
                    <div className='  rounded-md w-full '>
                        <SearchMultiple 
                            names={[ "dateAfter"]}
                            link=''
                            extraSearch={searchParams}
                            select={[
                                // { type: 'date', name: 'dateAfter', dataSelect: ['MALE', 'FEMALE'] },
                              ]}
                        />
                    </div>
                </div>

                <div className="mt-4">
                    {activeTab === "overview" && (
                        <UserLogins period="today" date={searchParams?.dateAfter} />
                    )}

                    {activeTab === "user_management" && (
                        <UserLogins period="week" date={searchParams?.dateAfter} />
                    )}

                    {activeTab === "system_updates" && (
                        <UserLogins period="month" date={searchParams?.dateAfter} />
                    )}

                    {activeTab === "financials" && (
                        <UserLogins period="6 months" date={searchParams?.dateAfter} />
                    )}
                </div>
            </div>

        </DefaultLayout >
    );
};

export default List;



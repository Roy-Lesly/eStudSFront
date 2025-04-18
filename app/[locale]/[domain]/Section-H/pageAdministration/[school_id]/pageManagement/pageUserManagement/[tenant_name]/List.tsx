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
import UserManagement from './UserManagement';
import RolesAndPages from './RolesAndPages';

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

const List = ({ params, searchParams }: { params: any, searchParams: any }) => {

    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

    const [activeTab, setActiveTab] = useState("roles_and_permissions");

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

            <div className="p-2 lg:p-0 w-full min-h-screen bg-gray-100">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-2xl font-bold text-gray-800"
                >
                    Tenant Management Dashboard
                </motion.h1>

                <div className="mt-4 flex gap-4">
                    <button
                        onClick={() => setActiveTab("roles_and_permissions")}
                        className={`px-4 py-2 border font-medium text-lg rounded-md ${activeTab === "roles_and_permissions" ? "bg-blue-500 text-white" : "bg-white border-gray-300 text-gray-800"
                            }`}
                    >
                        Roles and Permissions
                    </button>
                    <button
                        onClick={() => setActiveTab("user_management")}
                        className={`px-4 py-2 border font-medium text-lg rounded-md ${activeTab === "user_management" ? "bg-blue-500 text-white" : "bg-white border-gray-300 text-gray-800"
                            }`}
                    >
                        User Previledges
                    </button>
                    {/* <button
                        onClick={() => setActiveTab("system_updates")}
                        className={`px-4 py-2 border font-medium text-lg rounded-md ${activeTab === "system_updates" ? "bg-blue-500 text-white" : "bg-white border-gray-300 text-gray-800"
                            }`}
                    >
                        ---
                    </button> */}
                </div>

                <div className="mt-6">
                    {activeTab === "roles_and_permissions" && (
                        <RolesAndPages period="today" />
                    )}

                    {activeTab === "user_management" && (
                        <UserManagement searchParams={searchParams} params={params} />
                    )}

                    {activeTab === "system_updates" && (
                        <UserManagement searchParams={searchParams} params={params} />
                    )}

                    {activeTab === "financials" && (
                        <UserManagement searchParams={searchParams} params={params} />
                    )}
                </div>
            </div>

        </DefaultLayout >
    );
};

export default List;



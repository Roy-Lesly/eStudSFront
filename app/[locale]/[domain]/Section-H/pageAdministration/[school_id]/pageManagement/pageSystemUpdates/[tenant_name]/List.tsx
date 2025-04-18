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
import UpdateUpdateResult from './UpdateResult';
import UpdateResult from './UpdateResult';
import UpdatePublish from './UpdatePublish';

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

// const List = ({ params, data, searchParams }: { params: any; data: any, searchParams: any }) => {
const List = ({ params, dataLogins }: { params: any, dataLogins: any }) => {

    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const router = useRouter();

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

            <div className="p-2 lg:p-0 w-full min-h-screen bg-gray-100">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-2xl font-bold text-gray-800"
                >
                    Tenant Management Dashboard
                </motion.h1>

                <div className="mt-4 flex gap-4 md:gap-10 justify-left items-center w-full">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`px-4 md:px-10 py-2 border text-lg font-medium rounded-md ${activeTab === "overview" ? "bg-blue-500 text-white" : "bg-white border-gray-300 text-gray-800"
                            }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab("result")}
                        className={`px-4 md:px-10 py-2 border text-lg font-medium rounded-md ${activeTab === "user_management" ? "bg-blue-500 text-white" : "bg-white border-gray-300 text-gray-800"
                            }`}
                    >
                        Update Result
                    </button>
                    <button
                        onClick={() => setActiveTab("publish")}
                        className={`px-4 md:px-10 py-2 border text-lg font-medium rounded-md ${activeTab === "system_updates" ? "bg-blue-500 text-white" : "bg-white border-gray-300 text-gray-800"
                            }`}
                    >
                        Update Publish
                    </button>
                    <button
                        onClick={() => setActiveTab("financials")}
                        className={`px-4 md:px-10 py-2 border text-lg font-medium rounded-md ${activeTab === "financials" ? "bg-blue-500 text-white" : "bg-white border-gray-300 text-gray-800"
                            }`}
                    >
                        Update
                    </button>
                </div>

                <div className="mt-6">
                    {activeTab === "overview" && (
                        <UserManagement period="today" />
                    )}

                    {activeTab === "result" && (
                        <UpdateResult />
                    )}

                    {activeTab === "publish" && (
                        <UpdatePublish />
                    )}

                </div>
            </div>

        </DefaultLayout >
    );
};

export default List;



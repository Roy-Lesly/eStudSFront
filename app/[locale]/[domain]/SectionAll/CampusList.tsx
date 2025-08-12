'use client';

import React, { useState } from 'react';
import DefaultLayout from '@/DefaultLayout';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { GetMenuAdministration as MenuHigher } from '@/section-h/Sidebar/MenuAdministration';
import { GetMenuAdministration as MenuSecondary } from '@/section-s/Sidebar/MenuAdministration';
import { GetMenuAdministration as MenuPrimary } from '@/section-p/Sidebar/MenuAdministration';
import { GetMenuAdministration as MenuVocational } from '@/section-h/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import SearchMultiple from '@/section-h/Search/SearchMultiple';
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
import RolesAndPages from '@/app/[locale]/[domain]/SectionAll/RolesAndPages';
import UserManagement from '@/app/[locale]/[domain]/SectionAll/UserManagement';


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

const CampusList = (
    { params, searchParams, data, section }:
        { params: any, searchParams: any, data: any, section: "H" | "S" | "P" | "V" }
) => {

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
                    menuGroups={ section === "H" ? MenuHigher() : section === "S" ? MenuSecondary() : section === "P" ? MenuPrimary() : MenuVocational()}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />
            }
            headerbar={
                <Header
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    searchComponent={null}
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
                </div>

                <div className="mt-6">
                    {activeTab === "roles_and_permissions" && (
                        <RolesAndPages period="today" />
                    )}

                    {activeTab === "user_management" && (
                        <UserManagement
                            searchParams={searchParams}
                            params={params}
                            dataExtra={data}
                        />
                    )}

                    {activeTab === "system_updates" && (
                        <UserManagement
                            searchParams={searchParams}
                            params={params}
                            dataExtra={data}
                        />
                    )}

                    {activeTab === "financials" && (
                        <UserManagement
                            searchParams={searchParams}
                            params={params}
                            dataExtra={data}
                        />
                    )}
                </div>
            </div>

        </DefaultLayout >
    );
};

export default CampusList;



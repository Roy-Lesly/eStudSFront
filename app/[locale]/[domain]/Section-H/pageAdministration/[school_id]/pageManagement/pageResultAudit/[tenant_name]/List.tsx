'use client';

import React, { useState } from 'react';
import DefaultLayout from '@/DefaultLayout';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-h/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import SearchMultiple from '@/Search/SearchMultiple';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { EdgeResult } from '@/Domain/schemas/interfaceGraphql';
import ResultLogs from './ResultLogs';

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

const List = (
    { params, dataResults, sp }:
        { params: any, dataResults: EdgeResult[], sp: any }
) => {

    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

    const [activeTab, setActiveTab] = useState<number>(1);

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

            <div className="p-2 lg:p-0 w-full min-h-screen bg-gray-100">

                <div className="mt-4 flex gap-4">
                    <button
                        onClick={() => setActiveTab(1)}
                        className={`md:w-1/6 px-4 py-2 border rounded-md ${activeTab === 1 ? "bg-blue-500 text-white" : "bg-white border-gray-300 text-gray-800"
                            }`}
                    >
                        Recent Changes
                    </button>

                    <div className="w-full">
                        <SearchMultiple
                            names={['fullName', 'specialty', 'courseName', 'semester', 'academicYear']}
                            extraSearch={sp}
                            link={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageManagement/pageResultAudit/${params.tenant_name}`}
                        />
                    </div>

                </div>

                <div className="mt-6">
                    {activeTab === 1 && (
                        <ResultLogs data={dataResults} />
                    )}

                    {activeTab === 2 && (
                        <>Nothing</>
                        // <PlatformCharge data={dataResults} />
                    )}
                </div>
            </div>

        </DefaultLayout >
    );
};

export default List;



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
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import ResultLogsHigher from './Higher/ResultLogsHigher';
import ResultLogsPrimary from './Primary/ResultLogsPrimary';
import ResultLogsSecondary from './Secondary/ResultLogsSecondary';

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

const ListResultAudit = (
    { params, dataResults, sp, section }:
        { params: any, dataResults: any[], sp: any, section: string }
) => {


    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

    const [activeTab, setActiveTab] = useState<number>(1);

    return (
        <DefaultLayout
            pageType='admin'
            domain={params.domain}
            searchComponent={null}
            sidebar={
                <Sidebar
                    params={params}
                    menuGroups={section === "H" ? MenuHigher() : section === "S" ? MenuSecondary() : section === "P" ? MenuPrimary() : MenuVocational()}
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
                            names={
                                section === "H" ? ['fullName', 'specialty', 'courseName', 'semester', 'academicYear'] :
                                section === "S" ? ['fullName', 'level', 'subjectName', 'academicYear'] :
                                section === "P" ? ['fullName', 'level', 'subjectName', 'academicYear'] :
                                section === "V" ? ['fullName', 'level', 'subjectName', 'academicYear'] :
                                []
                            }
                            extraSearch={sp}
                            link={`/${params.domain}/Section-${section}/pageAdministration/${params.school_id}/pageManagement/pageResultAudit/${params.tenant_name}`}
                        />
                    </div>

                </div>

                <div className="mt-6">
                    {activeTab === 1 && <>
                        {section === "H" ? <ResultLogsHigher data={dataResults} /> : null}
                        {section === "S" ? <ResultLogsSecondary data={dataResults} /> : null}
                        {section === "P" ? <ResultLogsPrimary data={dataResults} /> : null}
                        {section === "V" ? <ResultLogsHigher data={dataResults} /> : null}
                    </>}

                    {activeTab === 2 && (
                        <>Nothing</>
                        // <PlatformCharge data={dataResults} />
                    )}
                </div>
            </div>

        </DefaultLayout >
    );
};

export default ListResultAudit;



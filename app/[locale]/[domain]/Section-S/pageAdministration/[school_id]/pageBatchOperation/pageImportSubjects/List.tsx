'use client';

import React, { useState } from 'react'; // Importing icons
import Sidebar from '@/section-s/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-s/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import { Metadata } from 'next';
import DefaultLayout from '@/DefaultLayout';
import { useTranslation } from 'react-i18next';
import ComingSoon from '@/components/ComingSoon';


export const metadata: Metadata = {
    title: "List-Lecturers Page",
    description: "e-conneq School System. List-Lecturers Page Admin Settings",
};

const List = ({ params, data, searchParams }: { params: any; data: any, searchParams: any }) => {
    const { t } = useTranslation("common");
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

    return (
        <DefaultLayout
            pageType='admin'
            domain={params.domain}
            searchComponent={<></>}
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
            <div className="bg-gray-50 flex flex-col items-center justify-center p-2">
                {/* <SelectSpecialty
                    params={params}
                    apiData={data}
                /> */}
                <ComingSoon />
            </div>
        </DefaultLayout>
    );
};

export default List;

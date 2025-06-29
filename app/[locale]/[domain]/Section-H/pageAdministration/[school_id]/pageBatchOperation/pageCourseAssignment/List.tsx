'use client';

import React, { useState } from 'react'; // Importing icons
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-h/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import { Metadata } from 'next';
import DefaultLayout from '@/DefaultLayout';
import { useTranslation } from 'react-i18next';
import SelectSpecialty from './SelectSpecialty';


export const metadata: Metadata = {
    title: "List-Lecturers Page",
    description: "This is List-Lecturers Page Admin Settings",
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
            <Breadcrumb
                department={t("Course Assignment")}
                subRoute="List"
                pageName={t("Course Assignment Page")}
                mainLink={`${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation`}
                subLink={`${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation`}
            />

            <div className="bg-gray-50 flex flex-col items-center justify-center p-2">
                <SelectSpecialty
                    params={params}
                    apiData={data}
                />
            </div>
        </DefaultLayout>
    );
};

export default List;

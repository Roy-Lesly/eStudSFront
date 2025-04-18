'use client';

import React, { useState } from 'react';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { getMenuAdministration } from '@/section-h/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import { Metadata } from 'next';
import ServerError from '@/ServerError';
import DefaultLayout from '@/DefaultLayout';
import { decodeUrlID } from '@/functions';
import AdmissionForm from './AdmissionForm';


export const metadata: Metadata = {
    title: "Courses Page",
    description: "This is Courses Page Admin Settings",
};

const List = ({ params, data, dataSpecialties, searchParams }: { params: any; data: any, dataSpecialties: any, searchParams: any }) => {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

    return (
        <DefaultLayout
            pageType='admin'
            domain={params.domain}
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
            <Breadcrumb
                department="Admission"
                subRoute="List"
                pageName="Admission"
                mainLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/pageStudents/pageAdmission/${parseInt(decodeUrlID(searchParams.id))}`}
            />

            <div className="bg-gray-50 flex flex-col items-center justify-center">


                <div className="bg-white mt-2 mx-auto rounded shadow w-full">

                    {dataSpecialties?.allSpecialties ?
                        dataSpecialties?.allSpecialties?.edges.length ?
                            <AdmissionForm data={data} dataSpecialties={dataSpecialties}  params={params} />
                            :
                            <div>No Specialties Found</div>
                        :
                        <ServerError type='network' item="Registration" />
                    }
                </div>

            </div>
        </DefaultLayout>
    );
};

export default List;
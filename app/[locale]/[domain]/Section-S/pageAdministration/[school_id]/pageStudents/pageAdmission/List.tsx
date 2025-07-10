'use client';

import React, { useState } from 'react';
import Sidebar from '@/section-s/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-s/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import ServerError from '@/ServerError';
import DefaultLayout from '@/DefaultLayout';
import { decodeUrlID } from '@/functions';
import AdmissionForm from './AdmissionForm';
import { FaArrowDown } from 'react-icons/fa';
import Link from 'next/link';


const List = ({ params, dataPreinscription, dataSpecialties, searchParams }: { params: any; dataPreinscription: any, dataSpecialties: any, searchParams: any }) => {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

    return (
        <DefaultLayout
            pageType='admin'
            domain={params.domain}
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
                department="Admission"
                subRoute="List"
                pageName="Admission"
                mainLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/pageStudents/pageAdmission/${parseInt(decodeUrlID(searchParams.id))}`}
            />

            <div className="bg-gray-50 flex flex-col items-center justify-center">


                <div className="bg-white mt-2 mx-auto rounded shadow w-full">

                    {dataSpecialties?.allSpecialties ?
                        dataSpecialties?.allSpecialties?.edges.length ?
                            <AdmissionForm
                                data={dataPreinscription}
                                dataSpecialties={dataSpecialties}
                                params={params}
                            />
                            :
                            <div className='flex flex-col gap-16 items-center justify-center  py-20 '>
                                <span className='text-red rounded py-2 px-6 tracking-wider text-2xl font-bold'>No Specialties / Classes Found</span>
                                <Link
                                    href={`/${params.locale}/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pageSpecialties`}
                                    className='text-teal-800 flex gap-4 text-xl tracking-wider font-semibold'
                                >
                                    Click to Create
                                    <FaArrowDown size={30} />
                                </Link>
                            </div>
                        :
                        <ServerError type='network' item="Registration" />
                    }
                </div>

            </div>
        </DefaultLayout>
    );
};

export default List;
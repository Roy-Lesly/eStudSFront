'use client';

import React, { useState } from 'react';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-p/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import ServerError from '@/ServerError';
import DefaultLayout from '@/DefaultLayout';
import { decodeUrlID } from '@/functions';
import { FaArrowDown } from 'react-icons/fa';
import Link from 'next/link';
import PreFormPrimary from '@/app/[locale]/[domain]/pre-inscription/New/SectionPrimary/PreFormPrimary';
import { useTranslation } from 'react-i18next';


const List = ({ params, data, searchParams }: { params: any; data: any, searchParams: any }) => {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const { t } = useTranslation("common");

    console.log(data);
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
                department=""
                subRoute="List"
                pageName="Student's Registration Page"
                mainLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/pageStudents/pageAdmission/${parseInt(decodeUrlID(searchParams.id))}`}
            />

            <div className="bg-gray-50 flex flex-col items-center justify-center">


                <div className="bg-white mt-2 mx-auto rounded shadow w-full">

                    {data?.allAcademicYearsPrim.length ?
                        <PreFormPrimary
                            source={"admin"}
                            params={params}
                            data={data}
                        />
                        :
                        <div className='flex flex-col gap-16 items-center justify-center  py-20 '>
                            <span className='text-red rounded py-2 px-6 tracking-wider text-2xl font-bold'>No Classes Found</span>
                            <Link
                                href={`/${params.locale}/${params.domain}/Section-P/pageAdministration/${params.school_id}/pageAcademics/pageClassrooms`}
                                className='text-teal-800 flex gap-4 text-xl tracking-wider font-semibold'
                            >
                                {t("Click to Create")}
                                <FaArrowDown size={30} />
                            </Link>
                        </div>
                    }
                </div>

            </div>
        </DefaultLayout>
    );
};

export default List;
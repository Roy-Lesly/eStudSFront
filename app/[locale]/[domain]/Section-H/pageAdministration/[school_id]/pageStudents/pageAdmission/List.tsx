'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-h/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import ServerError from '@/ServerError';
import DefaultLayout from '@/DefaultLayout';
import { decodeUrlID } from '@/functions';
import AdmissionForm from './AdmissionForm';
import { FaArrowDown } from 'react-icons/fa';
import Link from 'next/link';
import { EdgePreInscription, EdgeSpecialty, NodeSpecialty } from '@/utils/Domain/schemas/interfaceGraphql';
import { useTranslation } from 'react-i18next';


const List = (
    { params, dataPreinscription, dataSpecialties, searchParams, dataExtra }:
    { params: any; dataPreinscription: EdgePreInscription, dataSpecialties: EdgeSpecialty[], searchParams: any, dataExtra: any }
) => {
    
    const { t } = useTranslation("common");
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [specialtyOne, setSpecialtyOne] = useState<NodeSpecialty>();

    useEffect(() => {
        if (dataPreinscription && dataSpecialties && dataExtra?.allMainSpecialties) {
            const msId = decodeUrlID(dataPreinscription?.node.specialtyOne?.id)
            const y = dataPreinscription.node.academicYear
            const l = dataPreinscription.node.level
            const specialty = dataSpecialties?.filter((s: EdgeSpecialty) => (decodeUrlID(s.node.mainSpecialty.id) == msId && s.node.academicYear == y && s.node.level.level.toString() == l.replace("A_", "")))
            if (specialty.length){
                setSpecialtyOne(specialty[0].node)
            }
        }
    }, [ dataPreinscription ])

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

                    {dataSpecialties ?
                        dataSpecialties?.length ?
                            <AdmissionForm
                                data={dataPreinscription}
                                dataSpecialties={dataSpecialties}
                                dataMainSpecialties={dataExtra?.allMainSpecialties?.edges}
                                dataPrograms={dataExtra?.allPrograms?.edges}
                                dataLevels={dataExtra?.allLevels?.edges}
                                dataSchoolInfo={dataExtra?.allSchoolInfos?.edges}
                                specialtyOne={specialtyOne}
                                params={params}
                            />
                            :
                            <div className='flex flex-col gap-16 items-center justify-center  py-20 '>
                                <span className='text-red rounded py-2 px-6 tracking-wider text-2xl font-bold'>{t("No Specialties / Classes Found")}</span>
                                <Link
                                    href={`/${params.locale}/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pageSpecialties`}
                                    className='text-teal-800 flex gap-4 text-xl tracking-wider font-semibold'
                                >
                                    {t("Click to Create")}
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
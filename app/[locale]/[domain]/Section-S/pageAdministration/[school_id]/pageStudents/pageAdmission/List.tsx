'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/section-s/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-s/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/DefaultLayout';
import { decodeUrlID } from '@/functions';
import AdmissionForm from './AdmissionForm';
import { FaArrowDown, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';
import { EdgeClassRoomSec, NodeClassRoomSec } from '@/utils/Domain/schemas/interfaceGraphqlSecondary';
import { gql, useLazyQuery } from '@apollo/client';
import { errorLog } from '@/utils/graphql/GetAppolloClient';
import { useTranslation } from 'react-i18next';

const List = (
    { params, dataPreinscription, dataClassroomsSec, searchParams }:
        { params: any, dataPreinscription: any, dataClassroomsSec: EdgeClassRoomSec[], searchParams: any }
) => {

    const { t } = useTranslation("common");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [matchingClassroom, setMatchingClassroom] = useState<NodeClassRoomSec | null>(null);
    const [showFetchButton, setShowFetchButton] = useState(false);

    const firstPreinscription = dataPreinscription?.allPreinscriptionsSec?.edges?.[0]?.node;

    const academicYear = firstPreinscription?.academicYear;
    const level = firstPreinscription?.level?.replace("_", " ");
    const stream = firstPreinscription?.stream;

    const [getClassrooms, { data: classroomsData, loading, error }] = useLazyQuery(GET_CLASSROOM_SEC_QUERY);

    useEffect(() => {
        if (!firstPreinscription) return;

        const matched = dataClassroomsSec.find(({ node }) => (
            node.academicYear === academicYear &&
            node.level === level &&
            node.stream === stream
        ));

        if (matched) {
            setMatchingClassroom(matched.node);
            setShowFetchButton(false);
        } else {
            setMatchingClassroom(null);
            const currentAcademicYear = dataClassroomsSec?.[0]?.node?.academicYear;
            if (currentAcademicYear !== academicYear) {
                setShowFetchButton(true);
            }
        }
    }, [dataClassroomsSec, academicYear, level, stream, firstPreinscription]);

    useEffect(() => {
        errorLog(error);
        if (classroomsData?.allClassroomsSec?.edges?.length) {
            setMatchingClassroom(classroomsData.allClassroomsSec.edges[0].node);
        }
    }, [classroomsData, error]);

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
                    searchComponent={<></>}
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
                    {matchingClassroom ? (
                        <AdmissionForm
                            data={dataPreinscription}
                            dataClassroomsSec={dataClassroomsSec}
                            myClassroom={matchingClassroom}
                            params={params}
                        />
                    ) : (
                        <div className='flex flex-col gap-4 items-center justify-center py-20'>
                            <span className='text-red rounded py-2 px-6 tracking-wider text-2xl font-bold'>
                                {t("No Specialties / Classes Found")}
                            </span>
                            <span className='text-slate-800 rounded px-6 tracking-wider text-lg font-bold'>
                                {t("Academic Year")}: {academicYear}
                            </span>
                            <span className='text-slate-800 rounded px-6 tracking-wider text-lg font-bold'>
                                {t("Classroom")}: {level}
                            </span>
                            <span className='text-slate-800 rounded px-6 mb-10 tracking-wider text-lg font-bold'>
                                {t("Section")}: {stream}
                            </span>

                            {showFetchButton ? (
                                <button
                                    onClick={() => getClassrooms({ variables: { academicYear, level, stream } })}
                                    className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex gap-3 items-center text-xl font-semibold'
                                >
                                    {t("Fetch Classroom Data")}
                                    <FaArrowRight size={24} />
                                </button>
                            ) : (
                                <Link
                                    href={`/${params.locale}/${params.domain}/Section-S/pageAdministration/${params.school_id}/pageAcademics/pageClassrooms`}
                                    className='text-teal-800 flex gap-4 text-xl tracking-wider font-semibold'
                                >
                                    {t("Click to Create")}
                                    <FaArrowDown size={30} />
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </DefaultLayout>
    );
};

export default List;

const GET_CLASSROOM_SEC_QUERY = gql`
    query AlClassroomSec($academicYear: String!, $level: String!, $stream: String!) {
        allClassroomsSec(academicYear: $academicYear, level: $level, stream: $stream) {
            edges {
                node {
                    id
                    level
                    academicYear
                    stream
                    cycle
                    select
                }
            }
        }
    }
`;
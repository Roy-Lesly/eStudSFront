'use client';

import { EdgeSeries } from '@/utils/Domain/schemas/interfaceGraphqlPrimary';
import { EdgeClassRoomSec, NodeClassRoomSec } from '@/utils/Domain/schemas/interfaceGraphqlSecondary';
import { decodeUrlID } from '@/utils/functions';
import { gql, useLazyQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const ClassAssignmentForm = (
    { formData, setFormData, onNext, onPrevious, dataClassroomsSec, myClassroom, programsData }:
        { formData: any, setFormData: any, onNext: any, onPrevious: any, dataClassroomsSec: EdgeClassRoomSec[], myClassroom: NodeClassRoomSec, programsData: string[] }
) => {
    const { classAssignment } = formData;
    const { t } = useTranslation("common");

    const [count, setCount] = useState<number>(0);
    const [optionClassrooms, setOptionClassrooms] = useState<{ value: string, label: string }[]>([]);
    const [optionSeries, setOptionSeries] = useState<{ value: string, label: string }[]>([]);
    const [optionPrograms, setOptionsPrograms] = useState<{ value: string, label: string }[]>([]);

    const [getSeries, { data: seriesData }] = useLazyQuery(GET_SERIES);

    useEffect(() => {

        if (count < 2) {
            if (dataClassroomsSec?.length) {
                const options = dataClassroomsSec.map(({ node }) => ({
                    value: decodeUrlID(node.id),
                    label: `${node.level} - ${node.academicYear}`
                }));
                setOptionClassrooms(options);
            }

            if (classAssignment?.classroomsecId) {
                const cls = dataClassroomsSec?.find((item: EdgeClassRoomSec) => decodeUrlID(item.node.id) == classAssignment?.classroomsecId)
                getSeries({
                    variables: {
                        level: cls?.node?.level || myClassroom.level
                    },
                });
            }
            setCount(count + 1)
        }
        if (count == 2 && seriesData?.allSeries?.edges) {
            const options = seriesData?.allSeries?.edges.map(({ node }: EdgeSeries) => ({
                value: decodeUrlID(node.id),
                label: `${node.name} - ${node.level}`
            }));
            if (options?.length) {
                const matchedSeries = options?.find((item: any) => item.value == classAssignment?.seriesId);
                handleChange("seriesId", matchedSeries ? matchedSeries.value : '');
                setOptionSeries(options);
            }
            setCount(count + 1)
        }
        if (count == 2 && (!seriesData || !seriesData?.allSeries?.edges?.length)) {
            setOptionSeries([]);
            setCount(count + 1)
        }
        if (count == 2 && programsData?.length && !optionPrograms.length) {
            console.log(programsData);
            const options = programsData.map((item: string) => { return { value: item, label: item } })
            setOptionsPrograms(options);
            setCount(count + 1)
        }
    }, [classAssignment, seriesData, count]);

    useEffect(() => {
        if (count != 2 && seriesData?.allSeries.edges.length) {
            setCount(2)
        }
    }, [seriesData])

    const handleChange = (name: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            classAssignment: {
                ...prev.classAssignment,
                [name]: value,
            },
        }));
        if (name === "classroomsecId") { handleChange("seriesId", null) }
        setCount(0);
    };

    const classId = classAssignment?.classroomsecId || decodeUrlID(myClassroom?.id) || '';
    const filteredClassroom = optionClassrooms?.find(item => item.value == classId);

    const series = classAssignment?.seriesId || '';
    const filteredSeries = optionSeries?.find(item => item.value == series);

    return (
        <div className="flex flex-col gap-4 rounded shadow-2xl bg-white p-2 md:p-4">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">{t("Class Assignment")}</h2>
            <div className="space-y-3">
                <div className="flex flex-col gap-1">
                    <label className="text-gray-800 font-semibold text-sm">{t("Classroom")}</label>
                    <select
                        name="classroomsecId"
                        value={classAssignment?.classroomsecId || filteredClassroom?.value || ''}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-md font-semibold"
                    >
                        <option value="">{t("Select Classroom   ")}</option>
                        {optionClassrooms?.map(({ value, label }) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-gray-800 font-semibold text-sm">{t("Series")}</label>
                    <select
                        name="seriesId"
                        value={classAssignment.seriesId || filteredSeries?.value || ''}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-md font-semibold"
                    >
                        <option value="">{t("Select Series")}</option>
                        {optionSeries?.map(({ value, label }) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-gray-800 font-semibold text-sm">{t("Session")}</label>
                    <select
                        name="session"
                        value={classAssignment.session || 'Morning'}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-md font-semibold"
                    >
                        <option value="Morning">{t("Morning")}</option>
                        <option value="Evening">{t("Evening")}</option>
                    </select>
                </div>

                {/* Program */}

                <div className="flex flex-col gap-1">
                    <label className="text-gray-800 font-semibold text-sm">{t("Program")}</label>
                    <select
                        name="programsec"
                        value={classAssignment.programsec || ''}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-md font-semibold"
                    >
                        <option value="">{t("Select Program")}</option>
                        {optionPrograms?.map(({ value, label }) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </div>


            </div>

            <div className='flex justify-between  mt-6'>
                <button
                    className="flex items-center justify-center w-32 gap-2 bg-red hover:bg-orange-700 text-white font-bold px-4 py-2 rounded-lg transition"
                    onClick={onPrevious}
                >
                    <FaArrowLeft /> {t("Previous")}
                </button>
                <button
                    className="flex items-center justify-center w-30 gap-4 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg transition"
                    onClick={onNext}
                >
                    {t("Next")} <FaArrowRight />
                </button>
            </div>
        </div>
    );
};

export default ClassAssignmentForm;





export const GET_SERIES = gql`
    query GetData (
        $level: String!
    ) {
        allSeries(
            level: $level
        ) {
            edges {
                node {
                    id name level
                }
            }
        }
    }
`


export const GET_PROGRAMS = gql`
    query GetData {
        allProgramsSec {
            edges {
                node {
                    id name
                }
            }
        }
    }
`



export const GET_CLASSROOM_SEC_QUERY = gql`
    query 
        AlClassroomSec(
            $academicYear: String!,
            $level: String!,
            $stream: String!
        ) {
            allClassroomsSec(
                academicYear: $academicYear,
                level: $level,
                stream: $stream
            ) {
                edges {
                    node {
                        id level academicYear stream cycle
                    }
                }
            }
        }

`


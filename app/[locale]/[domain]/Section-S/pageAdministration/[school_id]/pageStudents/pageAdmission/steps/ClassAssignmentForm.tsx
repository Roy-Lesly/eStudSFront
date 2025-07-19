'use client';

import { EdgeProgram } from '@/utils/Domain/schemas/interfaceGraphql';
import { EdgeSeries } from '@/utils/Domain/schemas/interfaceGraphqlPrimary';
import { EdgeClassRoomSec, NodeClassRoomSec } from '@/utils/Domain/schemas/interfaceGraphqlSecondary';
import { decodeUrlID } from '@/utils/functions';
import { errorLog } from '@/utils/graphql/GetAppolloClient';
import { gql, useLazyQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const ClassAssignmentForm = (
    { formData, setFormData, onNext, onPrevious, dataClassroomsSec, myClassroom, loading, setLoading, programsData }:
        { formData: any, setFormData: any, onNext: any, onPrevious: any, dataClassroomsSec: EdgeClassRoomSec[], myClassroom: NodeClassRoomSec, loading: boolean, setLoading: any, programsData: EdgeProgram[] }
) => {
    const { classAssignment } = formData;
    const { t } = useTranslation("common");

    const [count, setCount] = useState<number>(0);
    const [optionClassrooms, setOptionClassrooms] = useState<{ value: string, label: string }[]>([]);
    const [optionSeries, setOptionSeries] = useState<{ value: string, label: string }[]>([]);
    const [optionPrograms, setOptionsPrograms] = useState<{ value: string, label: string }[]>([]);
    const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>();

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
                        classroom: cls?.node?.level || myClassroom.level
                    },
                });
            }
            setCount(count + 1)
        }
        if (count == 2 && seriesData?.allSeries?.edges) {
            const options = seriesData?.allSeries?.edges.map(({ node }: EdgeSeries) => ({
                value: decodeUrlID(node.id),
                label: `${node.name} - ${node.classroom}`
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
        if (count == 2 && programsData?.length) {
            const options = programsData.map(({ node }: EdgeProgram) => ({
                value: decodeUrlID(node.id),
                label: `${node.name}`
            }));
            if (options?.length) {
                const matchedProgram = options?.find((item: any) => item.value == classAssignment?.programsecId);
                handleChange("programsecId", matchedProgram ? matchedProgram.value : '');
                setOptionsPrograms(options);
            } else {
                handleChange("programsecId", null)
            }
            setCount(count + 1)
        }
    }, [classAssignment, seriesData, count]);

    useEffect(() => {
        if (count != 2 && seriesData?.allSeries.edges.length) {
            setCount(2)
        }
    } , [seriesData])

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

    const programs = classAssignment?.programsecId || '';
    const filteredPrograms = optionPrograms?.find(item => item.value == programs);

    return (
        <div className="space-y-5">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">{t("Class Assignment")}</h2>
            {[
                { label: 'Active (true/false)', name: 'active', defaultValue: true },
            ].map(({ label, name, defaultValue }) => (
                <div key={name} className="flex flex-col gap-1">
                    <label htmlFor={name} className="text-gray-800 font-semibold text-sm">{label}</label>
                    <input
                        id={name}
                        name={name}
                        placeholder={label}
                        value={classAssignment[name] ?? defaultValue ?? ''}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-black font-semibold"
                    />
                </div>
            ))}

            <div className="flex flex-col gap-1">
                <label className="text-gray-800 font-semibold text-sm">Classroom</label>
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
                <label className="text-gray-800 font-semibold text-sm">Series</label>
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
                <label className="text-gray-800 font-semibold text-sm">Session</label>
                <select
                    name="session"
                    value={classAssignment.session || 'Morning'}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded-md font-semibold"
                >
                    <option value="Morning">Morning</option>
                    <option value="Evening">Evening</option>
                </select>
            </div>

            {/* Program */}

            <div className="flex flex-col gap-1">
                <label className="text-gray-800 font-semibold text-sm">Program</label>
                <select
                    name="programsecId"
                    value={classAssignment.programsecId || filteredPrograms?.value || ''}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded-md font-semibold"
                >
                    <option value="">{t("Select Program")}</option>
                    {optionPrograms?.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>
            </div>
{/* 
            {myClassroom?.select ? <div className="flex flex-col gap-1">
                <label htmlFor={"name"} className="text-gray-800 font-semibold text-sm">{("Additional Subjects IDs (comma separated)")}</label>
                <input
                    id="additionalsubjectsIds"
                    name="additionalsubjectsIds"
                    placeholder="additionalsubjectsId"
                    value={classAssignment["additionalsubjectsIds"] ?? ''}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-black font-semibold"
                />
            </div> : null} */}

            <div className="flex gap-4 pt-4 justify-between w-full">
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded" onClick={onPrevious}>Back</button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" onClick={onNext}>Next</button>
            </div>
        </div>
    );
};

export default ClassAssignmentForm;





export const GET_SERIES = gql`
    query GetData (
        $classroom: String!
    ) {
        allSeries(
            classroom: $classroom
        ) {
            edges {
                node {
                    id name classroom
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


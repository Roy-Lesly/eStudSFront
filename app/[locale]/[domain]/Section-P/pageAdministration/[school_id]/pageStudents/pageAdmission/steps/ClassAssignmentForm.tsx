'use client';

import { EdgeClassRoomPrim } from '@/utils/Domain/schemas/interfaceGraphqlPrimary';
import { decodeUrlID, getAcademicYear, getAcademicYearList } from '@/utils/functions';
import { gql } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const ClassAssignmentForm = (
    { formData, setFormData, onNext, onPrevious, classroomList, myClassroom, programsData }:
        { formData: any, setFormData: any, onNext: any, onPrevious: any, classroomList: EdgeClassRoomPrim[] | null, myClassroom?: EdgeClassRoomPrim, programsData: string[] }
) => {

    const [warning, setWarning] = useState(true)
    const { classAssignment } = formData;
    const { t } = useTranslation("common");

    const [count, setCount] = useState<number>(0);
    const [optionClassrooms, setOptionClassrooms] = useState<{ value: string, label: string }[]>([]);

    // console.log(myClassroom);

    useEffect(() => {
        if (classAssignment?.classroomprimId && !formData?.classAssignment?.classroomprimId) {
            setFormData((prev: any) => ({
                ...prev,
                classAssignment: {
                    ...prev.classAssignment,
                    classroomprimId: classAssignment.classroomprimId,
                },
            }));
        }

        if (count < 2) {
            if (classroomList?.length) {
                const options = classroomList?.map(({ node }) => ({
                    value: decodeUrlID(node.id),
                    label: `${node.level} - ${node.academicYear}`
                }));
                setOptionClassrooms(options);
            }
            setCount(count + 1)
        }
    }, [classAssignment, count]);


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

    const classId = classAssignment?.classroomprimId || decodeUrlID(myClassroom?.node.id || "");
    const filteredClassroom = optionClassrooms?.find(item => item.value == classId);
    if ((!classAssignment?.classroomprimId || !filteredClassroom?.value) && warning) {
        alert(t("No Classroom Found"));
        setWarning(false);
    }

    return (
        <div className="space-y-5">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">{t("Class Assignment")}</h2>

            <div className="flex flex-col gap-1">
                <label className="text-gray-800 font-semibold text-sm">{t("Academic Year")}</label>
                <select
                    name="selectedAcademicYear"
                    value={formData?.classAssignment?.selectedAcademicYear}
                    onChange={(e) => handleChange("selectedAcademicYear", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded-md font-semibold"
                >
                    <option value="">{t("Select Year")}</option>
                    {getAcademicYearList()?.map((item: string) => (
                        <option key={item} value={item}>{item}</option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-gray-800 font-semibold text-sm">{t("Classroom")}</label>
                <select
                    name="classroomprimId"
                    value={classAssignment?.classroomprimId || filteredClassroom?.value || ''}
                    onChange={(e) => handleChange("classroomprimId", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded-md font-semibold"
                >
                    <option value="">{t("Select Classroom")}</option>
                    {optionClassrooms?.filter((item: any) => item.label.includes(formData?.classAssignment?.selectedAcademicYear))
                        .map(({ value, label }) => (
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
                    {/* <option value="Evening">{t("Evening")}</option> */}
                </select>
            </div>

            {/* Program */}

            <div className="flex flex-col gap-1">
                <label className="text-gray-800 font-semibold text-sm">{t("Program")}</label>
                <select
                    name="programsprim"
                    value={classAssignment.programsprim || ''}
                    onChange={(e) => handleChange("programsprim", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded-md font-semibold"
                >
                    <option value="">{t("Select Program")}</option>
                    {programsData?.map((item: string) => (
                        <option key={item} value={item}>{item}</option>
                    ))}
                </select>
            </div>

            <div className="flex gap-4 pt-4 justify-between w-full">
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded" onClick={onPrevious}>{t("Back")}</button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" onClick={onNext}>{t("Next")}</button>
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


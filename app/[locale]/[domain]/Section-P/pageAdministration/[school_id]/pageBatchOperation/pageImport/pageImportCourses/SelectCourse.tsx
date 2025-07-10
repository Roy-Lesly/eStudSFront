'use client';
import { getData } from '@/functions';
import React, { useEffect, useState } from 'react';
import { GetLevelUrl, GetCourseUrl } from '@/Domain/Utils-H/appControl/appConfig';
import { DomainInter, GetLevelInter, GetCourseInter } from '@/Domain/Utils-H/appControl/appInter';
import { protocol } from '@/config';
import { FaArrowRight } from 'react-icons/fa6';
import CourseTable from './CourseTable';
import { GetSpecialtyInter } from '@/Domain/Utils-H/appControl/appInter';
import { GetSpecialtyUrl } from '@/Domain/Utils-H/appControl/appConfig';

const SelectCourse = ({ params, apiDomains, apiYears }: any) => {

    const [count, setCount] = useState<number>(0)
    const [levelData, setLevelData] = useState<GetLevelInter[]>()
    const [courseData, setCourseData] = useState<GetCourseInter[]>();

    const [domainData, setDomainData] = useState<DomainInter[]>(apiDomains);
    const [selectedDomainID, setSelectedDomainID] = useState<number>();
    const [yearDataID, setYearDataID] = useState<string>();
    const [levelDataID, setLevelDataID] = useState<number>();
    const [specialtyData, setSpecialtyData] = useState<GetSpecialtyInter[]>();
    const [courseDataTwo, setCourseDataTwo] = useState<GetCourseInter[]>();
    const [selectedYear, setSelectedYear] = useState<string>();
    const [selectedYearTwo, setSelectedYearTwo] = useState<string>();

    const [selectedSpecialty, setSelectedSpecialty] = useState<GetSpecialtyInter>();
    const [selectedSpecialtyID, setSelectedSpecialtyID] = useState<string>();

    const [toImportSpecialty, setToImportSpecialty] = useState<GetSpecialtyInter>();

    const thisYear = new Date().getFullYear();



    useEffect(() => {
        if (count == 0) {
            const getLevels = async () => {
                var res = await getData(protocol + "api" + params.domain + GetLevelUrl, {}, params.domain)
                if (res && res.results) { setLevelData(res.results) }
            }
            getLevels();
            setCount(1);
        }
        if (count == 1) {
            if (selectedDomainID && selectedYear) {
                const getSpecialties = async () => {
                    var res = await getData(protocol + "api" + params.domain + GetSpecialtyUrl, {
                        school__id: params.school_id,
                        main_specialty__field__domain__id: selectedDomainID,
                        academic_year: selectedYear,
                        fieldList: ["id", "main_specialty__specialty_name", "level__level", "academic_year"]
                    }, params.domain)
                    if (res && res.results) { setSpecialtyData(res.results) }
                    if (res && res["unauthorized"]) { console.log("object") }
                }
                getSpecialties()
            }

            if (selectedDomainID && selectedSpecialtyID && selectedYear) {
                const getCourses = async () => {
                    var res = await getData(protocol + "api" + params.domain + GetCourseUrl, {
                        specialty__school__id: params.school_id,
                        main_course__field__domain__id: selectedDomainID,
                        specialty__academic_year: selectedYear,
                        fieldList: [
                            "id", "main_course__course_name", "main_course__id", "course_code", "course_credit", "course_type",
                            "semester", "hours", "assigned_to__id", "assigned", "assigned_to__id"
                        ]
                    }, params.domain)
                    if (res && res.results) { setCourseData(res.results) }
                    if (res && res["unauthorized"]) { console.log("object") }
                }
                getCourses()
                const filSpec = specialtyData?.filter((item: GetSpecialtyInter) => item.id == parseInt(selectedSpecialtyID))
                if (filSpec) { setSelectedSpecialty(filSpec[0]) }
            }
            setCount(2)
        }

        if (count == 2) {
            if (selectedDomainID && selectedYearTwo) {
                const getCourses = async () => {
                    var res = await getData(protocol + "api" + params.domain + GetCourseUrl, {
                        specialty__school__id: params.school_id,
                        main_course__field__domain__id: selectedDomainID,
                        specialty__academic_year: selectedYearTwo,
                        fieldList: [
                            "id", "main_course__course_name", "main_course__id",
                        ]
                    }, params.domain)
                    if (res && res.results) { setCourseDataTwo(res.results) }
                    if (res && res["unauthorized"]) { console.log("object") }
                }
                const getToImportSpeciaties = async () => {
                    var res = await getData(protocol + "api" + params.domain + GetSpecialtyUrl, {
                        school__id: params.school_id,
                        main_specialty__field__domain__id: selectedDomainID,
                        academic_year: selectedYearTwo,
                        fieldList: [
                            "id", "main_specialty__specialty_name", "main_specialty__id",
                        ]
                    }, params.domain)
                    console.log(res, 1044)
                    if (res && res.count) { setToImportSpecialty(res.results[0]); }
                    if (res && res["unauthorized"]) { console.log("object") }
                }
                getCourses()
                getToImportSpeciaties()
            }
            setCount(3)
        }
    }, [count, params, selectedDomainID, selectedYear, levelDataID, selectedYearTwo, specialtyData, selectedSpecialtyID])


    return (
        <div className="flex flex-col gap-2 m-4 p-2 w-full">
            <div className='bg-white flex flex-col gap-4 md:flex-row p-2 rounded'>


                <div className='border flex flex-col gap-2 justify-between md:text-lg p-2 rounded text-sm w-full'>
                    <div className='flex items-center justify-center w-full'>
                        <label className="dark:text-white font-medium mb-2 md:w-1/4 text-black w-full">
                            Select Domain
                        </label>
                        <select
                            required={true}
                            onChange={(e) => { setCount(1); setSelectedDomainID(parseInt(e.target.value)) }}
                            className={`w-3/4 appearance-none rounded border border-stroke bg-transparent px-2 md:px-6 py-1 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                                }`}
                        >
                            <option value={0}>------------------</option>
                            {domainData && domainData.map((item: DomainInter) => (<option key={item.id} value={item.id} className="dark:text-bodydark my-2 text-body">
                                {item.domain_name}
                            </option>))}
                        </select>
                    </div>
                    <div className='flex items-center w-full'>
                        <label className="block dark:text-white font-medium mb-2 text-black w-1/4">
                            Select Year
                        </label>
                        <select
                            required={true}
                            onChange={(e) => { setCount(1); setSelectedYear(e.target.value) }}
                            className={`w-3/4 appearance-none rounded border border-stroke bg-transparent px-4 md:px-6 py-1 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                                }`}
                        >
                            <option value={0}>------------------</option>
                            {apiYears?.map((item: string) => (<option key={item} value={item} className="dark:text-bodydark my-2 text-body">
                                {item}
                            </option>))}
                        </select>
                    </div>
                    <div className='flex items-center w-full'>
                        <label className="dark:text-white font-medium mb-2 text-black w-1/4">
                            Select Specialty
                        </label>
                        <select
                            required={true}
                            onChange={(e) => { setCount(1); setSelectedSpecialtyID(e.target.value) }}
                            className={`w-3/4 appearance-none rounded border border-stroke bg-transparent px-4 md:px-6 py-1 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                                }`}
                        >
                            <option value={0}>------------------</option>
                            {specialtyData && specialtyData.map((item: GetSpecialtyInter) => (
                                <option key={item.id} value={item.id} className="dark:text-bodydark my-2 text-body">
                                    {item.specialty_name} - {item.academic_year} - {item.level}
                                </option>))}
                        </select>
                    </div>

                </div>


                <div className='flex gap-2 items-center justify-center lg:w-72 md:w-60 w-40'>
                    <FaArrowRight size={50} />
                </div>


                <div className='flex flex-col gap-2 justify-between p-2 w-full'>
                    <div className='flex items-center w-full'>
                        <div className="dark:text-white font-medium text-black w-1/3">
                            Selected Class
                        </div>
                        {selectedSpecialty && selectedYearTwo ? <div className='w-2/3'>
                            {selectedSpecialty.specialty_name}
                        </div> : <div></div>}
                    </div>
                    <div className='flex items-center w-full'>
                        <div className="dark:text-white font-medium mb-2 text-black w-1/3">
                            Select Year
                        </div>
                        <select
                            required={true}
                            onChange={(e) => { setCount(2); setSelectedYearTwo(e.target.value) }}
                            className={`w-2/3 border  appearance-none rounded  border-stroke bg-transparent px-2 md:px-6 py-1 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                                }`}
                        >
                            <option value={0}>------------------</option>
                            {[`${thisYear - 2}/${thisYear - 1}`, `${thisYear - 1}/${thisYear}`, `${thisYear}/${thisYear + 1}`].map((item: string) => (<option key={item} value={item} className="dark:text-bodydark my-2 text-body">
                                {item}
                            </option>))}
                        </select>
                    </div>
                    <div className='flex items-center w-full'>
                        <div className="dark:text-white font-medium text-black w-1/3">
                            Selected Level
                        </div>
                        {selectedSpecialty && selectedYearTwo && <div className='w-2/3'>
                            {selectedSpecialty.level}
                        </div>}
                    </div>
                </div>


            </div>

            <div className='bg-white flex flex-col gap-4 md:flex-row p-2 rounded'>
                <CourseTable params={params} thisYear={yearDataID} selectedYearCourses={courseData} toImportCourses={courseDataTwo} setToImportCourses={setCourseDataTwo} toImportSpecialty={toImportSpecialty} />
            </div>

        </div>
    )
}

export default SelectCourse



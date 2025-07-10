'use client';
import { getData } from '@/functions';
import React, { useEffect, useState } from 'react';
import { GetLevelUrl, GetSpecialtyUrl } from '@/Domain/Utils-H/appControl/appConfig';
import { DomainInter, GetLevelInter, GetSpecialtyInter } from '@/Domain/Utils-H/appControl/appInter';
import { protocol } from '@/config';
import { FaArrowLeft } from 'react-icons/fa6';
import SpecialtyTable from './SpecialtyTable';

const SelectSpecialty = ({ params, apiDomains, apiYears }: any) => {

    console.log(apiDomains)

    const [count, setCount] = useState<number>(0)
    const [levelData, setLevelData] = useState<GetLevelInter[]>()
    const [specialtyData, setSpecialtyData] = useState<GetSpecialtyInter[]>();

    const [domainData, setDomainData] = useState<DomainInter[]>(apiDomains);
    const [domainDataID, setDomainDataID] = useState<number>();
    const [yearDataID, setYearDataID] = useState<string>();
    const [levelDataID, setLevelDataID] = useState<number>();
    
    const [specialtyDataTwo, setSpecialtyDataTwo] = useState<GetSpecialtyInter[]>();
    const [yearDataTwoID, setYearDataTwoID] = useState<string>();

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
            if (domainDataID && yearDataID) {
                const getSpecialties = async () => {
                    var res = await getData(protocol + "api" + params.domain + GetSpecialtyUrl, {
                        school__id: params.school_id,
                        main_specialty__field__domain__id: domainDataID,
                        academic_year: yearDataID,
                        fieldList: ["id", "main_specialty__specialty_name", "level__level", "academic_year"]
                    }, params.domain)
                    if (res && res.results) { setSpecialtyData(res.results) }
                    if (res && res["unauthorized"]) { console.log("object") }
                }
                getSpecialties()
            }
            setCount(2)
        }
        if (count == 2) {
            if (domainDataID && yearDataTwoID) {
                const getSpecialties = async () => {
                    var res = await getData(protocol + "api" + params.domain + GetSpecialtyUrl, {
                        school__id: params.school_id,
                        main_specialty__field__domain__id: domainDataID,
                        academic_year: yearDataTwoID,
                        fieldList: [
                            "id", "main_specialty__specialty_name", "main_specialty__id", "level__level", "level__id", 
                            "academic_year", "tuition", "payment_one", "payment_two", "payment_three"
                        ]
                    }, params.domain)
                    if (res && res.results) { setSpecialtyDataTwo(res.results) }
                    if (res && res["unauthorized"]) { console.log("object") }
                }
                getSpecialties()
            }
            setCount(3)
        }
    }, [count, params, domainDataID, yearDataID, levelDataID, yearDataTwoID])

    return (
        <div className="flex flex-col gap-2 m-4 p-2 w-full">
            <div className='bg-white flex flex-col gap-4 md:flex-row p-2 rounded'>

                <div className='flex flex-col gap-2 justify-between w-full'>
                    <div className='flex items-center justify-center w-full'>
                        <label className="block dark:text-white font-medium mb-2 md:w-full text-black w-1/5">
                            Select Domain
                        </label>
                        <select
                            required={true}
                            onChange={(e) => { setCount(1); setDomainDataID(parseInt(e.target.value)) }}
                            className={`relative z-20 w-4/5 appearance-none rounded border border-stroke bg-transparent px-2 md:px-6 py-1 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                                }`}
                        >
                            <option value={0}>------------------</option>
                            {domainData && domainData.map((item: DomainInter) => (<option key={item.id} value={item.id} className="dark:text-bodydark my-2 text-body">
                                {item.domain_name}
                            </option>))}
                        </select>
                    </div>
                    <div className='flex items-center w-full'>
                        <label className="block dark:text-white font-medium mb-2 md:w-full text-black w-1/5">
                            Select Year
                        </label>
                        <select
                            required={true}
                            onChange={(e) => { setCount(1); setYearDataID(e.target.value) }}
                            className={`relative z-20 w-4/5 appearance-none rounded border border-stroke bg-transparent px-2 md:px-6 py-1 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                                }`}
                        >
                            <option value={0}>------------------</option>
                            {[`${thisYear - 2}/${thisYear - 1}`, `${thisYear - 1}/${thisYear}`, `${thisYear}/${thisYear + 1}`].map((item: string) => (<option key={item} value={item} className="dark:text-bodydark my-2 text-body">
                                {item}
                            </option>))}
                        </select>
                    </div>
                </div>


                <div className='flex gap-2 items-center justify-center md:text-lg w-72'>
                    <FaArrowLeft size={50} />
                </div>


                <div className='border flex justify-between md:text-lg p-2 rounded text-sm w-full'>
                    <div className='flex items-center w-full'>
                        <label className="block dark:text-white font-medium mb-2 md:w-full text-black w-1/5">
                            Select Year
                        </label>
                        <select
                            required={true}
                            onChange={(e) => { setCount(1); setYearDataTwoID(e.target.value) }}
                            className={`relative z-20 w-4/5 appearance-none rounded border border-stroke bg-transparent px-4 md:px-6 py-1 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                                }`}
                        >
                            <option value={0}>------------------</option>
                            {apiYears?.map((item: string) => (<option key={item} value={item} className="dark:text-bodydark my-2 text-body">
                                {item}
                            </option>))}
                        </select>
                    </div>

                </div>

            </div>

            <div className='bg-white flex flex-col gap-4 md:flex-row p-2 rounded'>
                <SpecialtyTable params={params} thisYear={yearDataID} setExistingYearSpecialties={setSpecialtyData} existingYearSpecialties={specialtyData} toImportSpecialties={specialtyDataTwo} setToImportSpecialties={setSpecialtyDataTwo} />
            </div>

        </div>
    )
}

export default SelectSpecialty



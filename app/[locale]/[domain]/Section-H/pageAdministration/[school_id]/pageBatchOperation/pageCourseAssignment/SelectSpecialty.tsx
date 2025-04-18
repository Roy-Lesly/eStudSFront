'use client';
import { MyButtonSubmitCreate } from '@/section-h/common/MyButtons/MyButtonSubmit';
import { getData } from '@/functions';
import React, { useEffect, useState } from 'react';
import { GetSpecialtyUrl } from '@/Domain/Utils-H/appControl/appConfig';
import { GetDomainInter, GetLevelInter, GetSpecialtyInter } from '@/Domain/Utils-H/appControl/appInter';
import { protocol } from '@/config';
import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';


const SchemaCreate = z.object({
    semester: z.string().trim().min(1, { message: "Must Contain 1 Characters Minimum" }),
    specialty_id: z.coerce.number().int().gte(0),
})

type Inputs = z.infer<typeof SchemaCreate>;


const SelectSpecialty = ({ params, apiLevels, apiDomains }: any) => {

    const domain = useParams().domain
    const router = useRouter()
    const [count, setCount] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(true)
    const [submitting, setSubmitting] = useState<boolean>(false)
    const [specialtyData, setSpecialtyData] = useState<GetSpecialtyInter[]>();

    const [domainDataID, setDomainDataID] = useState<number>();
    const [yearDataID, setYearDataID] = useState<string>();
    const [levelDataID, setLevelDataID] = useState<number>();

    const thisYear = new Date().getFullYear();

    const { register, handleSubmit, formState: { errors }, } = useForm<Inputs>({
        resolver: zodResolver(SchemaCreate),
    });



    useEffect(() => {
        if (count == 0) {
            setCount(1);
        }
        if (count == 1) {
            if (domainDataID && yearDataID && levelDataID) {
                const getSpecialties = async () => {
                    var res = await getData(protocol + "api" + domain + GetSpecialtyUrl, {
                        school_id: params.school_id,
                        domain_id: domainDataID,
                        academic_year: yearDataID,
                        level_id: levelDataID,
                    }, params.domain)
                    if (res && res.results) {
                        setSpecialtyData(res.results);
                        setLoading(false)
                    }
                    if (res && res["unauthorized"]) { console.log("object") }
                }
                getSpecialties()
                setCount(2)
            }
            setCount(3)
        }
        if (count == 3) {
        }
    }, [count, params, domainDataID, yearDataID, levelDataID, domain])

    const onSubmit = handleSubmit((formVals) => {
        const specialty_id = formVals.specialty_id
        const semester = formVals.semester
        if (!specialty_id) return;
        if (!semester) return;
        setSubmitting(true);

        const call = async () => {
            if (specialty_id && semester) {
                router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageCourseAssignment/Actions?specialty_id=${specialty_id}&semester=${semester}`)
            }
        }
        call();
    });


    return (
        <form className='bg-white flex flex-col gap-2 md:w-[500px] mt-20 p-6 rounded' onSubmit={onSubmit}>
            <div className='flex flex-col gap-2 justify-between md:text-lg text-sm'>
                
                <div className='flex items-center justify-center w-full'>
                    <label className="block dark:text-white font-medium mb-2 md:w-full text-black w-1/4">
                        Select Domain
                    </label>
                    <select
                        required={true}
                        onChange={(e) => { setCount(1); setDomainDataID(parseInt(e.target.value)) }}
                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-10 py-2 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                            }`}
                    >
                        <option value={0}>------------------</option>
                        {apiDomains && apiDomains.map((item: GetDomainInter) => (<option key={item.id} value={item.id} className="dark:text-bodydark my-2 text-body">
                            {item.domain_name}
                        </option>))}
                    </select>
                </div>

                <div className='flex items-center w-full'>
                    <label className="block dark:text-white font-medium mb-2 md:w-full text-black w-1/4">
                        Select Year
                    </label>
                    <select
                        required={true}
                        onChange={(e) => { setCount(1); setYearDataID(e.target.value) }}
                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-10 py-2 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                            }`}
                    >
                        <option value={0}>------------------</option>
                        {[`${thisYear - 2}/${thisYear - 1}`, `${thisYear - 1}/${thisYear}`, `${thisYear}/${thisYear + 1}`].map((item: string) => (<option key={item} value={item} className="dark:text-bodydark my-2 text-body">
                            {item}
                        </option>))}
                    </select>
                </div>
                
                <div className='flex items-center w-full'>
                    <label className="block dark:text-white font-medium mb-2 md:w-full text-black w-1/4">
                        Select Level
                    </label>
                    <select
                        required={true}
                        onChange={(e) => { setCount(1); setLevelDataID(parseInt(e.target.value)) }}
                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-10 py-2 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                            }`}
                    >
                        <option value={0}>------------------</option>
                        {apiLevels && apiLevels.map((item: GetLevelInter) => (<option key={item.id} value={item.id} className="dark:text-bodydark my-2 text-body">
                            {item.level}
                        </option>))}
                    </select>
                </div>

                <div className='flex items-center w-full'>
                    <label className="block dark:text-white font-medium mb-2 md:w-full text-black w-1/4">
                        Select Class
                    </label>
                    <select
                        {...register('specialty_id')}
                        name='specialty_id'
                        required={true}
                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-10 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                            }`}
                    >
                        <option value={""}>------------------</option>
                        {specialtyData && specialtyData.map((item: GetSpecialtyInter) => (<option key={item.id} value={item.id} className="dark:text-bodydark my-2 text-body">
                            {item.specialty_name} - {item.level} - {item.academic_year}
                        </option>)
                        )}
                    </select>
                </div>

                <div className='flex items-center w-full'>
                    <label className="block dark:text-white font-medium mb-2 md:w-full text-black w-1/4">
                        Select Semester
                    </label>
                    <select
                        {...register('semester')}
                        name='semester'
                        required={true}
                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-10 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                            }`}
                    >
                        <option value={""}>------------------</option>
                        {["I", "II"].map((item: string) => (<option key={item} value={item} className="dark:text-bodydark my-2 text-body">
                            {item}
                        </option>)
                        )}
                    </select>
                </div>

                {submitting ?
                    <div>Submitting ...</div>
                    :
                    loading ?
                        <div>Loading ...</div>
                        :
                        // <MyButtonModal type="create" title='Next' clicked={submitting} />

                        <button type='submit' className='bg-green-500 font-medium my-10 px-6 py-2 rounded text-lg text-white'>Next</button>
                }
            </div>


        </form>
    )
}

export default SelectSpecialty


export const SubmitAdmitStudentButton = () => {
    const [submitClicked, setSubmitClicked] = useState(false)

    return (
        <div className='flex items-center justify-center'>
            {submitClicked ?
                <div className="animate-spin border-4 border-greenlight border-solid border-t-transparent h-10 mt-4 rounded-full w-10"></div>
                :
                <div onClick={() => setSubmitClicked(true)}><MyButtonSubmitCreate /></div>
            }
        </div>
    )
}
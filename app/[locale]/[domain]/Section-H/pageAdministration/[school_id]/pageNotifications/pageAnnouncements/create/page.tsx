import { Metadata } from 'next'
import React from 'react'
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'
import { getData } from '@/functions'
import { redirect } from 'next/navigation'
import { AcademicYearUrl, GetLevelUrl } from '@/Domain/Utils-H/appControl/appConfig'
import { GetLevelInter } from '@/Domain/Utils-H/appControl/appInter'
import { protocol } from '@/config'

const page = async ({
    params,
    searchParams,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params;
  const sp = await searchParams;

    const apiAcademicYear: any = await getData(protocol + "api" + p.domain + AcademicYearUrl, { ...sp, nopage: true }, p.domain);
    const Filter = () => {
        if (apiAcademicYear.count){
            var filA = apiAcademicYear.results.filter((item: string) => item.includes(new Date().getFullYear().toString()))
            return filA
        }
    }
    const year = Filter()

    return (
        
            <>
                <Breadcrumb
                    pageName="Select Target For Announcements"
                    pageName1="Back To Announcements"
                    link1={`/Section-H/pageAdministration/${p.school_id}/pageNotifications/pageAnnouncements`}
                />

                {apiAcademicYear && apiAcademicYear.count && year && <SelectTarget params={p} years={year} />}

            </>
        
    )
}

export default page

export const metadata: Metadata = {
    title: "Select Target",
    description: "This is Announcements Page",
};


const SelectTarget = async({ params, years }: any) => {

    const apiLevel: any = await getData(protocol + "api" + params.domain + GetLevelUrl, {  }, params.domain);

    const onSubmitServerAction = async (formData: FormData) => {
        'use server'

        var target = formData.get("target");
        var year = formData.get("year");
        var level = formData.get("level");

        if (target == "schools") {
            redirect(`/Section-H/pageAdministration/${params.school_id}/pageNotifications/pageAnnouncements/create/action?target=${target}`)
        }
        if (target == "domains") {
            redirect(`/Section-H/pageAdministration/${params.school_id}/pageNotifications/pageAnnouncements/create/action?target=${target}`)
        }
        if (target == "specialty" && year && level){
            redirect(`/Section-H/pageAdministration/${params.school_id}/pageNotifications/pageAnnouncements/create/action?target=${target}&year=${year}&level=${level}`)
        }
      }

    return <div className='bg-white flex flex-col gap-10 md:p-20 p-10 rounded'>

        <form action={onSubmitServerAction} className='flex flex-col gap-4'>

            <div className='flex flex-col gap-2 items-start justify-start mb-6'>
                <span className='font-semibold italic:'>Select Target</span>
                <select name='target' className='border md:w-60 px-4 py-2 rounded text-lg'>
                    <option>--------------</option>
                    <option value={"schools"}>Campus</option>
                    <option value={"domains"}>Domain</option>
                    <option value={"specialty"}>Class</option>
                    <option value={"custom"}>Custom</option>
                </select>
            </div>

            <div className='flex flex-col items-start justify-start mb-6'>
                <div className='flex font-semibold gap-4 items-center'>
                    <span>Select Academic Year</span>
                    <span className='italic text-red text-sm'>Optional</span>
                </div>
                <select name='year' className='border md:w-60 px-4 py-2 rounded text-lg'>
                    <option value="">--------------</option>
                    {years.map((item: string) => <option key={item} value={item}>{item}</option>)}
                </select>
            </div>

            <div className='flex flex-col items-start justify-start mb-6'>
                <div className='flex font-semibold gap-4 items-center'>
                    <span>Select Level</span>
                    <span className='italic text-red text-sm'>Optional</span>
                </div>
                <select name='level' className='border md:w-60 px-4 py-2 rounded text-lg'>
                    <option value="">--------------</option>
                    {apiLevel && apiLevel.count && apiLevel.results.map((item: GetLevelInter) => <option key={item.level} value={item.level}>{item.level}</option>)}
                </select>
            </div>

            <button type="submit" className='bg-blue-500 font-semibold items-center px-6 py-2 rounded text-white tracking-wide'>Submit</button>

        </form>

        <div className='flex flex-col gap-2'>
            <div className='flex gap-4'>
                <span className='font-semibold w-20'>Campus:</span>
                <span>If Announcement is for a Campus. example Campus A - Littoral</span>
            </div>
            <div className='flex gap-4'>
                <span className='font-semibold w-20'>Domain:</span>
                <span>If Announcement is for a Domain. example Health</span>
            </div>
            <div className='flex gap-4'>
                <span className='font-semibold w-20'>Class:</span>
                <span>If Announcement is for a Class. example Nursing, Level-100, Year-2023/2024</span>
            </div>
            <div className='flex gap-4'>
                <span className='font-semibold w-20'>Custom:</span>
                <span>If Announcement is for a Student</span>
            </div>
        </div>

    </div>
}
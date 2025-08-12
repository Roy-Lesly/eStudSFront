import { Metadata } from 'next'
import React from 'react'
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'
import { getData } from '@/functions'
import { redirect } from 'next/navigation'
import MultiSelect from './MultiSelect'
import { NotificationUrl } from '@/Domain/Utils-H/notiControl/notiConfig'
import { ActionCreate } from '@/serverActions/actionGeneral'
import { GetDomainUrl, GetSchoolInfoUrl, GetSpecialtyUrl } from '@/Domain/Utils-H/appControl/appConfig'
import { SchemaCreateEditNotifiation } from '@/Domain/schemas/schemas'
import { protocol } from '@/config'

const page = async ({
    params,
    searchParams,
}: {
    params: any;
    searchParams: any;
}) => {
    const p = await params; const sp = await searchParams;

    return (

        <>
            <Breadcrumb
                pageName="New Announcements"
                pageName1="Back To Announcements"
                link1={`/Section-H/pageAdministration/${params.school_id}/pageNotifications/pageAnnouncements`}
            />

            {searchParams && <CreateAnnouncements params={params} searchParams={searchParams} />}

        </>

    )
}

export default page

export const metadata: Metadata = {
    title: "Create Announcements",
    description: "e-conneq School System. Announcements Page",
};


const CreateAnnouncements = async ({ params, searchParams }: any) => {

    const apiSchool: any = await getData(protocol + "api" + params.domain + GetSchoolInfoUrl, { nopage: true, fieldList: ["id", "school_name", "town", "campus__name"] }, params.domain);
    const apiDomain: any = await getData(protocol + "api" + params.domain + GetDomainUrl, { nopage: true }, params.domain);
    const apiSpecialty: any = await getData(GetSpecialtyUrl, {
        nopage: true, academic_year: searchParams.year, level__level: searchParams.level, fieldList: [
            "id", "main_specialty__specialty_name", "academic_year", "level__level"
        ]
    }, params.domain);

    const onSubmitServerAction = async (formData: FormData) => {
        'use server'

        var target = searchParams.target;
        var message_one = formData.get("message_one");
        var message_two = formData.get("message_two");
        var noti_type = formData.get("noti_type");
        var role = formData.get("role");
        var status = true;
        var schools = formData.get("schools");
        var domains = formData.get("domains");
        var specialty = formData.get("specialty");
        var ending_at = formData.get("ending_at");

        var data: any = { target, message_one, message_two, noti_type, role, ending_at, status }
        if (target == "schools" && schools) { data = { ...data, schools: [parseInt(schools.toString())] } }
        if (target == "domains" && domains) { data = { ...data, domains: [parseInt(domains.toString())] } }
        if (target == "specialty" && specialty) { data = { ...data, specialty: [parseInt(specialty.toString())] } }

        const response = await ActionCreate(data, SchemaCreateEditNotifiation, protocol + "api" + params.domain + NotificationUrl, `/Section-H/pageAdministration/${params.school_id}/pageNotifications/pageAnnouncements`)
        if (response.id) {
            redirect(`/Section-H/pageAdministration/${params.school_id}/pageNotifications/pageAnnouncements`)
        }

    }

    return <div className='bg-white flex flex-col gap-3 p-10 rounded'>

        <form action={onSubmitServerAction} className='flex flex-col gap-4'>

            {searchParams.target == "schools" ? <MultiSelect formFieldName="schools" options={apiSchool} type="schools" />
                :
                null
            }

            {searchParams.target == "domains" ? <MultiSelect formFieldName="domains" options={apiDomain} type="domains" />
                :
                null
            }

            {searchParams.target == "specialty" ? <MultiSelect formFieldName="specialty" options={apiSpecialty} type="specialty" />
                :
                null
            }

            {searchParams.target == "custom" ? <div>
                dd
            </div>
                :
                null
            }


            <div className='flex flex-col gap-1'>
                <span className='font-semibold italic:'>Message One</span>
                <textarea name="message_one" maxLength={255} rows={3} placeholder='1st Message ...' className='border-2 p-2 rounded w-full' />
            </div>

            <div className='flex flex-col gap-1'>
                <span className='font-semibold italic:'>Message Two</span>
                <textarea name="message_two" maxLength={255} rows={3} placeholder='2nd Message ...' className='border-2 p-2 rounded w-full' />
            </div>

            <div className='flex flex-col gap-1 px-10'>
                <span className='font-semibold italic:'>Select Notification Category</span>
                <select name="noti_type" required className='border px-4 py-2 rounded'>
                    <option value={""}>--------------</option>
                    <option value={"time"}>Time Table</option>
                    <option value={"fees"}>School Fees</option>
                    <option value={"announcement"}>Announcement</option>
                    <option value={"results"}>Results</option>
                    <option value={"others"}>Others</option>
                </select>
            </div>


            <div className="flex gap-2 justify-between px-10">
                <div className='flex flex-col gap-1 w-full'>
                    <span className='font-semibold italic:'>Target</span>
                    <select name="role" required className='border px-6 py-2 rounded'>
                        <option value={""}>--------------</option>
                        <option value={"student"}>Students</option>
                        <option value={"teacher"}>Lecturers</option>
                    </select>
                </div>

                <div className='flex flex-col gap-1 w-full'>
                    <span className='font-semibold italic:'>Valid Till?</span>
                    <input type='date' name='ending_at' required className='border px-4 py-1 rounded' />
                </div>
            </div>

            <button type="submit" className='bg-blue-500 font-semibold items-center px-6 py-2 rounded text-white tracking-wide'>Submit</button>

        </form>

    </div>
}
import { Metadata } from 'next'
import React from 'react'
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'
import Link from 'next/link'

const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params;
  const sp = await searchParams;

  // const apiNotification: ResultInter[] | any = await getData(protocol + "api" + p.domain + GetNotificationUrl, { ...sp, nopage: true }, p.domain);

  return (

    <>
      <Breadcrumb
        pageName="Announcements"
        pageName1="Back To Announcements"
        link1={`/Section-H/pageAdministration/${p.school_id}/pageNotifications/pageAnnouncements`}
      />
      <></>

      {/* {apiNotification && <Announcements apiNotification={apiNotification} params={p} />} */}

    </>

  )
}

export default page

export const metadata: Metadata = {
  title: "Announcements",
  description: "e-conneq School System. Announcements Page",
};


const Announcements = ({ apiNotification, params }: any) => {

  return <div className='bg-white flex flex-col gap-3 p-2 rounded'>
    <div className='flex gap-4 items-center justify-end'>
      <Link href={`/pageAdministration/${params.school_id}/pageNotifications/pageAnnouncements/create`} className='bg-green-500 font-semibold px-6 py-2 rounded text-black'><span className='font-bold'>+</span> Post Message</Link>
    </div>

    <div>
      <div className='bg-blue-900 font-semibold grid grid-cols-11 p-2 rounded text-white'>
        <div className='col-span-1'>No</div>
        <div className='col-span-1'>Target</div>
        <div className='col-span-1'>Type</div>
        <div className='col-span-5'>Message</div>
        <div className='col-span-1'>Duration</div>
        <div className='col-span-1 flex items-center justify-center'>Action</div>
      </div>


    </div>

  </div>
}
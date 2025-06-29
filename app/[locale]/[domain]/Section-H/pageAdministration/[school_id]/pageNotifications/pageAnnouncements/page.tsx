import { Metadata } from 'next'
import React from 'react'
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'
import { getData } from '@/functions'
import Link from 'next/link'
import { GetNotificationUrl } from '@/Domain/Utils-H/notiControl/notiConfig'
import { ResultInter } from '@/Domain/Utils-H/appControl/appInter'
import { GetNotificationInter } from '@/Domain/Utils-H/notiControl/notiInter'
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

  const apiNotification: ResultInter[] | any = await getData( protocol + "api" + p.domain + GetNotificationUrl, { ...sp, nopage: true }, p.domain);

  return (
    
      <>
        <Breadcrumb
          pageName="Announcements"
          pageName1="Back To Announcements"
          link1={`/Section-H/pageAdministration/${p.school_id}/pageNotifications/pageAnnouncements`}
        />

        {apiNotification && <Announcements apiNotification={apiNotification} params={p} />}

      </>
    
  )
}

export default page

export const metadata: Metadata = {
  title: "Announcements",
  description: "This is Announcements Page",
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

      { apiNotification.length > 0 ? apiNotification.map((item: GetNotificationInter, index: number) => <div key={item.id} className='font-semibold grid grid-cols-11 odd:bg-blue-100 p-2 rounded text-black'>
        <div className='col-span-1'>{index + 1}</div>
        <div className='capitalize col-span-1'>{item.target}</div>
        <div className='capitalize col-span-1'>{item.noti_type}</div>
        <div className='col-span-5 text-wrap'>{item.message_one}, {item.message_two}</div>
        <div className='col-span-1 text-wrap'>{item.created_at?.slice(2, 10)} - {item.ending_at?.slice(2, 10)}</div>
        <div className='col-span-1 flex gap-2 items-center justify-center'>
          <div className='font-bold'>{item.status ? <span className='text-green-500'>Active</span> : <span className='text-red'>Active</span> }</div>
          <Link href={`/pageAdministration/${params.school_id}/pageNotifications/pageAnnouncements/${item.id}`} className='bg-green-500 px-4 py-1 rounded'>View</Link>
        </div>
      </div>)
      : 
      <div className='flex font-semibold italic items-center justify-center py-40 text-lg tracking-widest'>No Announcements Found</div>
      }

    </div>

  </div>
}
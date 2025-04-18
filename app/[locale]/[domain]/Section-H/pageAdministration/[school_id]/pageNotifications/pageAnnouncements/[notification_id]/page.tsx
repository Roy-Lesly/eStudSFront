import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'
import {  } from '@/appControl/appConfig'
import { getData } from '@/functions'
import { GetNotificationInter } from '@/Domain/Utils-H/notiControl/notiInter'
import { GetNotificationUrl } from '@/Domain/Utils-H/notiControl/notiConfig'
import { protocol } from '@/config'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string,  domain: string, notification_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiNotification: GetNotificationInter[] | any = await getData( protocol + "api" + params.domain + GetNotificationUrl, { id: params.notification_id, nopage: true, }, params.domain
  );

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Announcements Details"
          pageName1="Back To Announcements"
          link1={`/pageAdministration/${params.school_id}/pageNotifications/pageAnnouncements`}
        />

        {apiNotification && <Announcements apiNotification={apiNotification} params={params} />}

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title: "Announcements-Details",
  description: "This is Announcements Details Page",
};

const Announcements = ({ apiNotification, params }: any) => {

  console.log(apiNotification, 52)

  return <div className='bg-white flex flex-col gap-3 p-2 rounded'>
    <div className='flex gap-4 items-center justify-end'>
      <button className='bg-red font-semibold px-6 py-2 rounded text-black'><span className='font-bold'>-</span> Delete Message</button>
    </div>

    <div className='flex gap-6'>

      <div className='flex flex-col gap-5'>
        <span>Title:</span>
        <span>Message One:</span>
        <span>Message Two:</span>
        <span>Target:</span>
        <span>Date Created:</span>
        <span>Date Ending:</span>
        <span>Created By:</span>
      </div>

      {apiNotification.length == 1 ? <form className='capitalize flex flex-col font-semibold gap-2 italic text-black'>
        <input className='border px-4 py-1 rounded' type='text' name="noti_type" placeholder='' defaultValue={apiNotification[0].noti_type} />
        <input className='border px-4 py-1 rounded' type='text' name="message_one" placeholder='' defaultValue={apiNotification[0].message_one} />
        <input className='border px-4 py-1 rounded' type='text' name="message_two" placeholder='' defaultValue={apiNotification[0].message_two} />
        <input className='border px-4 py-1 rounded' type='text' name="target" placeholder='' defaultValue={apiNotification[0].target} />
        <input className='border px-4 py-1 rounded' type='date' name="target" placeholder='' defaultValue={apiNotification[0].created_at} />
        <input className='border px-4 py-1 rounded' type='date' name="target" placeholder='' defaultValue={apiNotification[0].ending_at} />
        <input className='border px-4 py-1 rounded' type='text' name="target" placeholder='' defaultValue={apiNotification[0].created_by__full_name} />
      </form>
      :
      <div></div>}

    </div>

  </div>
}
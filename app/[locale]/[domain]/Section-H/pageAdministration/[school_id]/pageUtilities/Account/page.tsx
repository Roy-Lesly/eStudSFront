import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import { getData } from '@/functions'
import { protocol } from '@/config'
import NotificationError from '@/section-h/common/NotificationError'
import { GetAccountUrl } from '@/Domain/Utils-H/feesControl/feesConfig'
import Link from 'next/link'
import { AcademicYearUrl } from '@/Domain/Utils-H/appControl/appConfig'
import ListAccountPage from '@/componentsTwo/ListUtility/ListAccountPage'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiAccount: any = await getData(protocol + "api" + params.domain + GetAccountUrl, { ...searchParams, nopage: true,  }, params.domain)
  const apiYears: any = await getData(protocol + "api" + params.domain + AcademicYearUrl, { school: params.school_id }, params.domain)

  if (apiYears && apiYears.count < 1) {
    return (
      <LayoutAdmin>
        <>
          {searchParams && <NotificationError errorMessage={searchParams} />}
          <div className='flex flex-col flex-grow font-medium gap-10 items-center justify-center my-20 text-black text-lg tracking-widest w-full'>
            <span>No Class Created !!!</span>
            <span>Consider Creating Classes</span>
          </div>
        </>
      </LayoutAdmin>
    )
  }

  if (apiAccount && apiAccount.length) {
    return (
      <LayoutAdmin>
        <>
          {searchParams && <NotificationError errorMessage={searchParams} />}
          {apiAccount && <ListAccountPage params={params} data={apiAccount} />}
        </>
      </LayoutAdmin>
    )
  }

  return (
    <LayoutAdmin>
      <div className='flex flex-col gap-10 items-center justify-center my-20'>
        {searchParams && <NotificationError errorMessage={searchParams} />}
        <span className='text-black text-lg'>Click Next to Update Account Settings</span>
        <Link href={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageUtilities/Account/UpdateAccount`} className='bg-blue-800 border font-semibold px-6 py-2 rounded text-lg text-white tracking-widest'>
          Next
        </Link>
      </div>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title: "Admin-Accounts",
  description: "This is Admin-Depts Page",
};

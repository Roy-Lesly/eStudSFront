import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'
import { getData } from '@/functions'
import SelectSpecialty from './SelectSpecialty'
import { redirect } from 'next/navigation'
import NotificationError from '@/section-h/common/NotificationError'
import { GetDomainUrl, GetLevelUrl } from '@/Domain/Utils-H/appControl/appConfig'
import { protocol } from '@/config'

const page = async ({
  params,
  searchParams
}: {
  params: { school_id: string, domain: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {

  const apiDomains: any = await getData(protocol + "api" + params.domain + GetDomainUrl, { nopage: true }, params.domain);
  const apiLevels: any = await getData(protocol + "api" + params.domain + GetLevelUrl, { nopage: true }, params.domain);

  return (
    <LayoutAdmin>
        <>
            <Breadcrumb
                pageName={`Select Class and Semester For Course Assignment`}
                pageName1="Dashboard" 
                link1={`/${params.domain}/Section-H/pageAdministration/${params.school_id}`}
            />

            {searchParams && <NotificationError errorMessage={searchParams} />}

            {apiDomains && apiLevels && <Select params={params} apiDomains={apiDomains} apiLevels={apiLevels} />}
            
        </>
    </LayoutAdmin>
  )
}

export default page;

export const metadata: Metadata = {
    title:
      "Selection Page",
  };


const Select = ({ params, apiLevels, apiDomains }: any) => {

  const onSubmitServerAction = async (formData: FormData) => {
    'use server';




  }

    return <div className='border-2 flex flex-col gap-10 items-center justify-center rounded'>

      <SelectSpecialty params={params} apiLevels={apiLevels} apiDomains={apiDomains} />

    </div>
}
import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'
import { getData } from '@/functions'
import NotificationError from '@/section-h/common/NotificationError'
import { AcademicYearUrl, GetDomainUrl } from '@/Domain/Utils-H/appControl/appConfig'
import { protocol } from '@/config'
import SelectSpecialty from './SelectSpecialty'

const page = async ({
  params,
  searchParams
}: {
  params: { school_id: string, domain: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {

  const apiDomains: any = await getData(protocol + "api" + params.domain + GetDomainUrl, { nopage: true }, params.domain);
  const apiYears: any = await getData(protocol + "api" + params.domain + AcademicYearUrl, { nopage: true }, params.domain);

  console.log(apiDomains, 22)

  return (
    <LayoutAdmin>
        <>
            <Breadcrumb
                pageName={`Import Classes From Another Year`}
                pageName1="Dashboard" 
                link1="/pageShop" 
            />

            {searchParams && <NotificationError errorMessage={searchParams} />}

            {apiDomains && apiYears && apiYears.count && <SelectSpecialty params={params} apiDomains={apiDomains} apiYears={apiYears.results} />}
            
        </>
    </LayoutAdmin>
  )
}

export default page;

export const metadata: Metadata = {
    title:
      "Selection Page",
  };

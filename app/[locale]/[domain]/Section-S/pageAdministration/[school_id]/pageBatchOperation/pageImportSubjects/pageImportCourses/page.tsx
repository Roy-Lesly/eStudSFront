import { Metadata } from 'next'
import React from 'react'
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'
import { getData } from '@/functions'
import NotificationError from '@/section-h/common/NotificationError'
import { AcademicYearUrl, GetDomainUrl } from '@/Domain/Utils-H/appControl/appConfig'
import { protocol } from '@/config'
import SelectCourse from './SelectCourse'

const page = async ({
  params,
  searchParams
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params;
  const sp = await searchParams;

  const apiDomains: any = await getData(protocol + "api" + p.domain + GetDomainUrl, { nopage: true }, p.domain);
  const apiYears: any = await getData(protocol + "api" + p.domain + AcademicYearUrl, { nopage: true, school: params.school_id }, p.domain);

  return (
    
        <>
            <Breadcrumb
                pageName={`Import Courses From Another Year`}
                pageName1="Dashboard" 
                link1="/pageShop" 
            />

            {sp && <NotificationError errorMessage={sp} />}

            {apiDomains && apiYears && apiYears.count && <SelectCourse params={p} apiDomains={apiDomains} apiYears={apiYears.results} />}
            
        </>
    
  )
}

export default page;

export const metadata: Metadata = {
    title:
      "Selection Page",
  };

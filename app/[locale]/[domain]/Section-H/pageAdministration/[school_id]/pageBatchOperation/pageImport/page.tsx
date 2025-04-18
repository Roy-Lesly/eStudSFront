import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'
import { getData } from '@/functions'
import NotificationError from '@/section-h/common/NotificationError'
import { GetDomainUrl } from '@/Domain/Utils-H/appControl/appConfig'
import { protocol } from '@/config'
import Link from 'next/link'

const page = async ({
  params,
  searchParams
}: {
  params: { school_id: string, domain: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {

  const apiDomains: any = await getData(protocol + "api" + params.domain + GetDomainUrl, { nopage: true }, params.domain);

  return (
    <LayoutAdmin>
        <>
            <Breadcrumb
                pageName={`Select Import Type`}
                pageName1="Dashboard" 
                link1={`/${params.domain}/Section-H/pageAdministration/${params.school_id}`}
            />

            {searchParams && <NotificationError errorMessage={searchParams} />}

            {apiDomains && <Select params={params} />}
            
        </>
    </LayoutAdmin>
  )
}

export default page;

export const metadata: Metadata = {
    title:
      "Selection Page",
  };


const Select = ({ params }: any) => {

    return <div className='border-1 flex flex-col gap-10 items-center justify-center pt-32 rounded'>

      <Link href={`/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageImport/pageImportSpecialties`} className="bg-blue-950 font-medium justify-center px-4 py-2 rounded text-center text-lg text-white tracking-widest w-[190px]">Import Classes</Link>
      
      <Link href={`/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageImport/pageImportCourses`} className="bg-blue-950 font-medium justify-center px-4 py-2 rounded text-center text-lg text-white tracking-widest w-[190px]">Import Courses</Link>
    
    </div>
}
import { Metadata } from 'next'
import React from 'react'
import ListDepartmentPage from '@/componentsTwo/ListAdmin/ListDepartmentPage'
import { getData } from '@/functions'
import { protocol } from '@/config'
import NotificationError from '@/section-h/common/NotificationError'
import { GetDepartmentUrl } from '@/Domain/Utils-H/userControl/userConfig'

const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params;
  const sp = await searchParams;

  const apiData: any = await getData(protocol + "api" + p.domain + GetDepartmentUrl, { ...sp }, p.domain)
  
  return (
    
      <>

        {sp && <NotificationError errorMessage={sp} />}

        {apiData && apiData.results && <ListDepartmentPage params={p} data={apiData.results} />}

      </>
    
  )
}

export default page

export const metadata: Metadata = {
  title: "Admin-Departments",
  description: "This is Admin-Depts Page",
};

import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import { getData } from '@/functions'
import { protocol } from '@/config'
import NotificationError from '@/section-h/common/NotificationError'
import { GetCustomUserUrl } from '@/Domain/Utils-H/userControl/userConfig'
import ListAdminsPage from '@/componentsTwo/ListProfiles/ListAdminPage'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: any = await getData(protocol + "api" + params.domain + GetCustomUserUrl, { 
    nopage: true, role: "admin", is_staff: false, is_active: true, school__id: params.school_id, ...searchParams}, params.domain)
  
  return (
    <LayoutAdmin>
      <>

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {apiData && <ListAdminsPage params={params} data={apiData} searchParams={searchParams} />}

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title: "Admin Settings",
  description: "This is Admin Settings Page",
};

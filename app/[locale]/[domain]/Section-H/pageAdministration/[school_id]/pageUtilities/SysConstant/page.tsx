import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import ListConstantPage from '@/componentsTwo/ListAdmin/ListConstantPage'
import { getData } from '@/functions'
import { protocol } from '@/config'
import { GetSysConstantUrl } from '@/Domain/Utils-H/appControl/appConfig'
import NotificationError from '@/section-h/common/NotificationError'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: any = await getData(protocol + "api" + params.domain + GetSysConstantUrl, { ...searchParams, fieldList: [ "id", "name", "sys_category__id", "sys_category__name"] }, params.domain)
  console.log(apiData, 19)
  return (
    <LayoutAdmin>
      <>

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {apiData && apiData.results && <ListConstantPage params={params} data={apiData.results} />}

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title: "Admin Constants",
  description: "This is Admin Constants Page",
};

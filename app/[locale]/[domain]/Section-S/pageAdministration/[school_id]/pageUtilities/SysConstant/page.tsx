import { Metadata } from 'next'
import React from 'react'
import ListConstantPage from '@/componentsTwo/ListAdmin/ListConstantPage'
import { getData } from '@/functions'
import { protocol } from '@/config'
import { GetSysConstantUrl } from '@/Domain/Utils-H/appControl/appConfig'
import NotificationError from '@/section-h/common/NotificationError'

const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params;
  const sp = await searchParams;

  const apiData: any = await getData(protocol + "api" + p.domain + GetSysConstantUrl, { ...sp, fieldList: ["id", "name", "sys_category__id", "sys_category__name"] }, p.domain)
  console.log(apiData, 19)
  return (

    <>

      {sp && <NotificationError errorMessage={sp} />}

      {apiData && apiData.results && <ListConstantPage params={p} data={apiData.results} />}

    </>

  )
}

export default page

export const metadata: Metadata = {
  title: "Admin Constants",
  description: "e-conneq School System. Admin Constants Page",
};

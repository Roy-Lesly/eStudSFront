import { Metadata } from 'next'
import React from 'react'
import ListCategoryPage from '@/componentsTwo/ListAdmin/ListCategoryPage'
import { getData } from '@/functions'
import { protocol } from '@/config'
import { GetSysCategoryUrl } from '@/Domain/Utils-H/appControl/appConfig'
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

  const apiData: any = await getData(protocol + "api" + p.domain + GetSysCategoryUrl, { ...sp }, params.domain)
  
  return (
      <>

        {sp && <NotificationError errorMessage={sp} />}

        {apiData && apiData.results && <ListCategoryPage params={p} data={apiData.results} />}

      </>
  )
}

export default page

export const metadata: Metadata = {
  title: "Admin Category",
  description: "This is Admin Category Page",
};

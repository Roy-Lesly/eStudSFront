import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import ListCategoryPage from '@/componentsTwo/ListAdmin/ListCategoryPage'
import { getData } from '@/functions'
import { protocol } from '@/config'
import { GetSysCategoryUrl } from '@/Domain/Utils-H/appControl/appConfig'
import NotificationError from '@/section-h/common/NotificationError'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: any = await getData(protocol + "api" + params.domain + GetSysCategoryUrl, { ...searchParams }, params.domain)
  
  return (
    <LayoutAdmin>
      <>

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {apiData && apiData.results && <ListCategoryPage params={params} data={apiData.results} />}

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title: "Admin Category",
  description: "This is Admin Category Page",
};

import { Metadata } from 'next'
import React from 'react'
import ListAccountPage from '@/componentsTwo/List/ListAccountPage'
import { getData } from '@/functions'
import { protocol } from '@/config'
import NotificationError from '@/section-h/common/NotificationError'
import { GetAccountUrl } from '@/Domain/Utils-H/feesControl/feesConfig'
import LayoutTenant from '@/compTenant/LayoutTenant'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  
  return (
    <LayoutTenant>
      <>

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {/* {apiData && apiData.results && <ListAccountPage params={params} data={apiData.results} />} */}

      </>
    </LayoutTenant>
  )
}

export default page

export const metadata: Metadata = {
  title: "Tenant Admin",
  description: "This is Tenant Admin Page",
};

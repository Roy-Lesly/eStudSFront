import { Metadata } from 'next'
import React from 'react'
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'
import { getData } from '@/functions'
import NotificationError from '@/section-h/common/NotificationError'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { AppearanceUrl, GetAppearanceUrl } from '@/Domain/Utils-H/userControl/userConfig'
import { ActionEdit } from '@/serverActions/actionGeneral'
import { protocol } from '@/config'
import { SchemaAppearanceUpdate } from '@/Domain/schemas/schemas'
import initTranslations from '@/initTranslations'


const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params;
  const sp = await searchParams;

  const apiData: any = await getData(protocol + "api" + p.domain + GetAppearanceUrl, { user__id: p.user_id, nopage: true, fieldList: ["id", "user__id", "user__full_name", "lang", "dark_mode"] }, p.domain);

  return (

    <>
      <Breadcrumb
        pageName="Profile Settings"
        pageName1="Dashboard"
        link1={`/Section-H/pageAdministration/pageMySettings/${p.user_id}`}
      />

      {sp && <NotificationError errorMessage={sp} />}

      {apiData?.count && apiData.results.length == 1 ? <List params={p} apiData={apiData.results[0]} searchParams={searchParams} /> : <div className='flex font-medium h-full italic items-center justify-center md:my-72 text-2xl'>No User Profile Settings Found</div>}

    </>

  )

}

export default page

export const metadata: Metadata = {
  title: "Settings",
  description: "e-conneq School System. Settings Page",
};



const List = async ({ apiData, params }: any) => {

  // const { t } = await initTranslations(params.locale, ['home', 'common'])
  return <></>
}

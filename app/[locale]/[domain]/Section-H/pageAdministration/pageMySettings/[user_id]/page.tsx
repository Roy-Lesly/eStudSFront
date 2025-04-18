import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
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
  params: { locale:string, user_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: any = await getData(protocol + "api" + params.domain + GetAppearanceUrl, { user__id: params.user_id, nopage: true, fieldList: [ "id", "user__id", "user__full_name", "lang", "dark_mode" ] }, params.domain);

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Profile Settings"
          pageName1="Dashboard"
          link1={`/Section-H/pageAdministration/pageMySettings/${params.user_id}`}
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {apiData?.count && apiData.results.length == 1 ? <List params={params} apiData={apiData.results[0]} searchParams={searchParams} /> : <div className='flex font-medium h-full italic items-center justify-center md:my-72 text-2xl'>No User Profile Settings Found</div>}

      </>
    </LayoutAdmin>
  )

}

export default page

export const metadata: Metadata = {
  title: "Settings",
  description: "This is Settings Page",
};



const List = async ({ apiData, params }: any) => {

  const { t } = await initTranslations(params.locale, ['home', 'common'])

  const OnUpdate = async (formData: FormData) => {
    'use server'
    var id = apiData.id
    var user_id = apiData.user__id
    var lang = formData.get("lang")
    var dark_mode = formData.get("dark_mode")

    var data = { id, user_id, lang, dark_mode }

    const response = await ActionEdit(data, apiData.id, SchemaAppearanceUpdate, protocol + "api" + params.domain + AppearanceUrl, params.domain)

    console.log(70, response)

    if (response?.id && lang && dark_mode) {
      cookies().set("NEXT_LOCALE", lang.toString())
      cookies().set("color-theme", dark_mode.toString())

      redirect(`/Section-H/pageAdministration/pageMySettings/${params.user_id}?success=Appearance Updated Successfully`)
    } else {
      redirect(`/Section-H/pageAdministration/pageMySettings/${params.user_id}?error=Error Updating`)
    }

  }

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark flex flex-col flex-grow gap-6 md:flex-row md:p-20 md:text-xl py-20 rounded-sm shadow-default text-lg">

      <div className="flex flex-col gap-4 w-full">

        <div className='flex h-60 items-center justify-center md:h-72 text-center w-full'>
          Photo
        </div>

        <form action={OnUpdate} className="flex flex-col gap-6 items-center w-full">

          <div className='flex items-center justify-center my-4 text-2xl text-center'>Appearance</div>

          <div className='flex gap-4 md:gap-10'>
            <span className='md:w-32 w-full'>Language</span>:
            <select name="lang" defaultValue={apiData.lang} className='border-2 md:w-72 rounded w-48'>
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="es">Spanish</option>
            </select>
          </div>
          <div className='flex gap-4 md:gap-10'>
            <span className='md:w-32 w-full'>Dark Mode</span>:
            <select name="dark_mode" defaultValue={apiData.dark_mode} className='border-2 md:w-72 rounded w-48'>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>

          <button className='bg-blue-500 md:my-20 md:px-10 md:py-2 mt-10 px-4 py-2 rounded text-white'>{t("update")}</button>

        </form>



      </div>




      <div className="hidden md:flex my-2 w-full">About Me</div>

    </div>
  )
}

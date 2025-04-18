import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb';
import { MyButtonSubmitCreate } from '@/section-h/common/MyButtons/MyButtonSubmit';
import NotificationError from '@/section-h/common/NotificationError';
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin';
import { ActionCreate } from '@/serverActions/actionGeneral';
import { SchemaCreateEditProgram } from '@/Domain/schemas/schemas';
import { ProgramUrl } from '@/Domain/Utils-H/userControl/userConfig';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React from 'react'
import { protocol } from '@/config';

const CreatePage = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Create Program" 
          pageName1="Settings" 
          pageName2="Programs" 
          link1={`/Section-H/pageAdministration/${params.school_id}/pageSettings`} 
          link2={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pagePrograms`} 
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}
        <Create params={params} />
      </>
    </LayoutAdmin>
  )
}

export default CreatePage



export const metadata: Metadata = {
  title:
    "Program-Create",
  description: "This is Programs Page",
};

const Create = ({ params }:any) => {

  const onSubmitServerAction = async (formData: FormData) => {
    'use server';

    const name = formData.get("name")
    const data = {
      name: name ? name?.toString().toUpperCase() : "",
      description: formData.get("description")
    }
    const response = await ActionCreate(data, SchemaCreateEditProgram, protocol + "api" + params.domain + ProgramUrl, `` )

    if (response.error) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pagePrograms/create?error=${JSON.stringify(response.error).replaceAll(" ", "-")}`)
    }
    if (response.errors) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pagePrograms/create?error=${JSON.stringify(response.errors).replaceAll(" ", "-")}`)
    }
    if (response?.detail) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pagePrograms/create?error=${JSON.stringify(response.detail).replaceAll(" ", "-")}`)
    }
    if (response?.id) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pagePrograms?created=Successfully-Created-${JSON.stringify(response.name).replaceAll(" ", "-")}`)
    }
  }

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">

      <div className='md:p-6 p-2'>
        <div className="gap-9 grid grid-cols-1">
          <div className="flex flex-col gap-9">
            {/* <!-- Input Fields --> */}
            <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">

              <form className="flex flex-col gap-5.5 p-6.5" action={onSubmitServerAction}>

                <div>
                  <label className="block dark:text-white font-medium mb-3 text-black text-lg">
                    Program
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter Program"
                    className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary outline-none px-5 py-3 rounded-lg text-black transition w-full"
                  />
                </div>

                <div>
                  <label className="block dark:text-white font-medium mb-3 md:mt-4 mt-2 text-black text-lg">
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    placeholder="Enter Description"
                    className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary outline-none px-5 py-3 rounded-lg text-black transition w-full"
                  />
                </div>

                <div className='flex items-end justify-end'>
                  <MyButtonSubmitCreate />
                </div>
              </form>

            </div>


          </div>
        </div>
      </div>
    
    </div>
  )
}
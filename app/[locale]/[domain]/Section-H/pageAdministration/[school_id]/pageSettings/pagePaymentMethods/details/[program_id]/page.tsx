import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb';
import { MyButtonSubmitEdit } from '@/section-h/common/MyButtons/MyButtonSubmit';
import NotificationError from '@/section-h/common/NotificationError';
import ServerError from '@/section-h/common/ServerError';
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin';
import { getData } from '@/functions';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React, { FC } from 'react'
import { ProgramUrl } from '@/Domain/Utils-H/userControl/userConfig';
import { ProgramInter } from '@/Domain/Utils-H/userControl/userInter';
import { SchemaCreateEditProgram } from '@/Domain/schemas/schemas';
import { ActionEdit, ActionDelete } from '@/serverActions/actionGeneral';
import { protocol } from '@/config';

const EditPage = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, program_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: ProgramInter | any = await getData(protocol + "api" + params.domain + ProgramUrl, { id: params.program_id, ...searchParams }, params.domain);

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Edit Program"
          pageName1="Settings"
          pageName2="Programs"
          link1={`/Section-H/pageAdministration/${params.program_id}`}
          link2={`/Section-H/pageAdministration/${params.program_id}/pageSettings`}
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}

        { apiData && apiData != "ECONNREFUSED" && <EditDelete apiData={apiData} params={params} />}
        {apiData == "ECONNREFUSED" && <ServerError />}

      </>
    </LayoutAdmin>
  )
}

export default EditPage



export const metadata: Metadata = {
  title:
    "Program-Edit",
    description: "This is Program Page",
};


interface EditDeleteProps {
  apiData: ProgramInter
  params: any
}

const EditDelete: FC<EditDeleteProps> = async ({ apiData, params }) => {


  const onSubmitServerAction = async (formData: FormData) => {
    'use server'

    const name = formData.get("name")
    const description = formData.get("description")

    const data = {
      name: name ? name.toString().toUpperCase() : name,
      description: description ? description.toString().toUpperCase() : description,
    }
    const response = await ActionEdit(data, params.program_id, SchemaCreateEditProgram, protocol  + "api" + params.domain + ProgramUrl, `/Section-H/pageAdministration/${params.school_id}/pageSettings/pagePrograms`)

    if (response.error) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pagePrograms/details/${params.program_id}?error=${JSON.stringify(response.error).replaceAll(" ", "-")}`)
    }
    if (response?.errors) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pagePrograms/details/${params.program_id}?error=${JSON.stringify(response.errors).replaceAll(" ", "-")}`)
    }
    if (response?.detail) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pagePrograms/details/${params.program_id}?error=${JSON.stringify(response.detail).replaceAll(" ", "-")}`)
    }
    if (response?.id) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pagePrograms?updated=Successfully-Updated-${JSON.stringify(response.name).replaceAll(" ", "-")}`)
    }
  }

  const onSubmitDeleteAction = async () => {
    'use server'

    const response = await ActionDelete(ProgramUrl, params.program_id)

    if (response?.error) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pagePrograms/${params.program_id}?error=${JSON.stringify(response.error).replaceAll(" ", "-")}`)
    }
    if (response?.detail) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pagePrograms/${params.program_id}?error=${JSON.stringify(response.detail).replaceAll(" ", "-")}`)
    }
    if (response?.success) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pagePrograms?deleted=Successfuly-Deleted-!!!`)
    }
  }

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">

      <div className='md:p-6 p-2'>
        <div className="gap-9 grid grid-cols-1">
          <div className="flex flex-col gap-9">
            {/* <!-- Input Fields --> */}
            <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">
            <div className="border-b border-stroke dark:border-strokedark flex gap-2 items-center justify-between md:gap-10 px-4 py-2">
                  <div className="dark:text-white flex flex-col font-medium gap-2 items-start justify-start md:flex-row md:gap-10 md:items-center md:justify-between text-black w-full">
                    <span className='hidden md:flex'>Editing ...</span>
                    <span className='flex'>Program: {apiData.name}</span>
                  </div>
                  <form action={onSubmitDeleteAction} className='flex md:mx-10 mx-2'>
                    <button className='bg-reddark font-medium md:px-6 px-4 py-2 rounded text-white tracking-wide'>Delete</button>
                  </form>
                </div>

              <form className="flex flex-col gap-5.5 p-6.5" action={onSubmitServerAction}>

                <div>
                  <label className="block dark:text-white font-medium mb-3 text-black text-sm">
                    Program Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder={apiData.name}
                    defaultValue={apiData.name}
                    className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary outline-none px-5 py-3 rounded-lg text-black transition w-full"
                  />
                </div>

                <div>
                  <label className="block dark:text-white font-medium mb-3 text-black text-sm">
                    Program Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    placeholder={apiData.description}
                    defaultValue={apiData.description}
                    className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary outline-none px-5 py-3 rounded-lg text-black transition w-full"
                  />
                </div>

                <div className='flex items-end justify-end'>
                  <MyButtonSubmitEdit />
                </div>

              </form>

            </div>


          </div>
        </div>
      </div>

    </div>
  )
}
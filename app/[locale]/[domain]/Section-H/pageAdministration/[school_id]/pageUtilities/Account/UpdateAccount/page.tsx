import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import { getData } from '@/functions'
import { protocol } from '@/config'
import NotificationError from '@/section-h/common/NotificationError'
import { AcademicYearUrl, GetSysCategoryUrl, GetSysConstantUrl } from '@/Domain/Utils-H/appControl/appConfig'
import { GetAccountUrl } from '@/Domain/Utils-H/feesControl/feesConfig'
import ListAccountsUpdatePage from '@/componentsTwo/ListUtility/ListAccountsUpdatePage'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiYears: any = await getData(protocol + "api" + params.domain + AcademicYearUrl, { school: params.school_id }, params.domain)
  const apiSysCategory: any = await getData(protocol + "api" + params.domain + GetSysCategoryUrl, { name: "Account", nopage: true }, params.domain)
  const apiSysConstant: any = await getData(protocol + "api" + params.domain + GetSysConstantUrl, { sys_category__name: "Account", nopage: true }, params.domain)
  const apiAccount: any = await getData(protocol + "api" + params.domain + GetAccountUrl, { ...searchParams, nopage: true, fieldList: ["id", "name", "number", "status", "year", "balance"] }, params.domain)


  return (
    <LayoutAdmin>
      <>

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {apiSysCategory && apiSysConstant && apiAccount && <ListAccountsUpdatePage
          params={params}
          apiSysCategory={apiSysCategory}
          apiSysConstant={apiSysConstant}
          apiAccount={apiAccount}
          apiYears={apiYears.results}
        />}

      </>
    </LayoutAdmin>
  )


  // if (apiSysCat && apiSysCat.length < 1) {
  //   return (
  //     <LayoutAdmin>
  //       <>
  //         {searchParams && <NotificationError errorMessage={searchParams} />}
  //         <div className='flex flex-col flex-grow font-medium gap-10 items-center justify-center my-20 text-black text-lg tracking-widest w-full'>
  //           <span>No Account Category Created !!!</span>
  //           {/* <FormModal table="update_account" type="custom" params={params} extra_data={{ form: "create_category_account" }} icon={<FaEdit />} /> */}
  //         </div>
  //       </>
  //     </LayoutAdmin>
  //   )
  // }

  // if (apiSysConst && apiSysConst.length < 1) {
  //   return (
  //     <LayoutAdmin>
  //       <>
  //         {searchParams && <NotificationError errorMessage={searchParams} />}
  //         <div className='flex flex-col flex-grow font-medium gap-10 items-center justify-center my-20 text-black text-lg tracking-widest w-full'>
  //           <span>No Account Value Found !!!</span>
  //           <FormModal
  //             table="update_account"
  //             type="custom"
  //             params={params}
  //             data={apiSysCat[0]}
  //             extra_data={{ form: "create_account_constants", sysCat: apiSysCat[0] }}
  //             icon={<FaPlus />}
  //             buttonTitle='Create'
  //             customClassName='rounded cursor-pointer bg-green-600 px-4 py-2 border-2 border-green-200 text-white font-semibold tracking-wide'
  //           />
  //         </div>
  //       </>
  //     </LayoutAdmin>
  //   )
  // }

  // if (apiAccount && apiAccount.length < 1) {
  //   return (
  //     <LayoutAdmin>
  //       <>
  //         {searchParams && <NotificationError errorMessage={searchParams} />}
  //         <div className='flex flex-col flex-grow font-medium gap-10 items-center justify-center my-20 text-black text-lg tracking-widest w-full'>
  //           <span>No Account Value Found !!!</span>
  //           <FormModal
  //             table="update_account"
  //             type="custom"
  //             params={params}
  //             extra_data={{ form: "create_account" }}
  //             icon={<FaPlus />}
  //             buttonTitle='Create'
  //             customClassName='rounded cursor-pointer bg-green-600 px-4 py-2 border-2 border-green-200 text-white font-semibold tracking-wide'
  //           />
  //         </div>
  //       </>
  //     </LayoutAdmin>
  //   )
  // }

  // return (
  //   <LayoutAdmin>
  //     <div className='item-center justify-center w-full'>
  //       {searchParams && <NotificationError errorMessage={searchParams} />}
  //       <div className='flex flex-col flex-grow font-medium gap-10 items-center justify-center my-20 text-black text-lg tracking-widest w-full'>
  //         <span>Update Accounts !!!</span>
  //         <FormModal
  //           table="update_account"
  //           type="custom" params={params}
  //           buttonTitle='Update'
  //           data={apiSysCat[0]}
  //           extra_data={{ form: "update_account_constants", sysCat: apiSysCat[0] }}
  //           icon={<FaEdit />}
  //           customClassName='rounded cursor-pointer bg-blue-600 px-4 py-2 border-2 border-blue-200 text-white font-semibold tracking-wide'
  //         />
  //       </div>
  //     </div>
  //   </LayoutAdmin>
  // )
}

export default page

export const metadata: Metadata = {
  title: "Admin-Accounts",
  description: "This is Admin-Account Page",
};


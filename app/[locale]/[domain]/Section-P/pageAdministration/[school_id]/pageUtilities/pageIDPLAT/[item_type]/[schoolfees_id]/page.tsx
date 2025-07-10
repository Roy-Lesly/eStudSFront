import { Metadata } from 'next'
import React from 'react'
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'
import { getData } from '@/functions'
import NotificationError from '@/section-h/common/NotificationError'
import { redirect } from 'next/navigation'
import { GetSchoolFeesUrl, TransactionUrl } from '@/Domain/Utils-H/feesControl/feesConfig'
import { collectMoney } from '@/payment'
import { ActionCreate } from '@/serverActions/actionGeneral'
import { protocol } from '@/config'
import { SchemaTransactionCreate } from '@/Domain/schemas/schemas'
import ServerError from '@/components/ServerError'

const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params;
  const sp = await searchParams;

  const apiMyProfile: any = await getData(protocol + "api" + p.domain + GetSchoolFeesUrl, { id: p.schoolfees_id, platform_paid: false}, p.domain);

  return (
    
      <>
        <Breadcrumb
          pageName="Account Activation " 
          pageName1="Dashboard" 
          link1={`/Section-H/${p.domain}/Section-H/pageAdministration/${p.school_id}`}
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}
        {apiMyProfile == "ECONNREFUSED" && <ServerError type='network' />}
        {apiMyProfile && apiMyProfile.unauthorized && redirect(`/pageAuthentication/pageSessionExpired`)}
        {apiMyProfile.count && apiMyProfile != "ECONNREFUSED" && <List apiData={apiMyProfile.results[0]} p={p} />}

      </>
    
  )
}

export default page

export const metadata: Metadata = {
  title: "Account Activation",
  description: "This is Account Activation Page",
};



const List = ( {apiData, p}: any ) => {

  const onActivate = async (formData: FormData) => {
    "use server"

    var payer = formData.get("payer");
    var operator = formData.get("operator");

    const data = {
      schoolfees_id: p.schoolfees_id,
      telephone: payer,
      operator: operator,
      payment_method: operator,
      amount: apiData.platform_charges,
      reason: "PLATFORM CHARGES",
      status: "completed",
    }

    var pay: { operation: boolean, transaction: boolean } | any = await collectMoney({ amount: data.amount, service: data.operator, payer: payer});

    console.log(pay, 83)
    if (!pay.operation && pay.transaction == "could-not-perform-transaction"){
      redirect(`/${p.domain}/Section-H/pageAdministration/${p.school_id}/pageUtilities/pagePlatformActivation/${p.schoolfees_id}?error=Transaction Cancelled by User`)
    }
    if (!pay.operation && pay.transaction == "low-balance-payer"){
      redirect(`/${p.domain}/Section-H/pageAdministration/${p.school_id}/pageUtilities/pagePlatformActivation/${p.schoolfees_id}?error=Not Enough Funds`)
    }
    if (!pay.operation && pay.transaction == "ENOTFOUND"){
      redirect(`/${p.domain}/Section-H/pageAdministration/${p.school_id}/pageUtilities/pagePlatformActivation/${p.schoolfees_id}?error=Transaction Error`)
    }

    if (pay.operation) {
      const response = await ActionCreate(data, SchemaTransactionCreate, protocol + "api" + p.domain + TransactionUrl, `/Section-H/${p.domain}/Section-H/pageAdministration/${p.school_id}/pageUtilities/pagePlatformActivation`)
      console.log(response)
  
      if (response.error) {
        redirect(`/${p.domain}/Section-H/pageAdministration/${p.school_id}/pageUtilities/pagePlatformActivation/${p.schoolfees_id}?error=${JSON.stringify(response.error).replaceAll(" ", "-")}`)
      }
      if (response?.errors) {
        redirect(`/${p.domain}/Section-H/pageAdministration/${p.school_id}/pageUtilities/pagePlatformActivation/${p.schoolfees_id}?error=${JSON.stringify(response.errors).replaceAll(" ", "-")}`)
      }
      if (response?.detail) {
        redirect(`/${p.domain}/Section-H/pageAdministration/${p.school_id}/pageUtilities/pagePlatformActivation/${p.schoolfees_id}?error=${JSON.stringify(response.detail).replaceAll(" ", "-")}`)
      }
      if (response?.id) {
        redirect(`/${p.domain}/Section-H/pageAdministration/${p.school_id}/pageUtilities/pagePlatformActivation?updated=Successfully-Activated-${JSON.stringify(response.schoolfees.userprofile.customuser.full_name).replaceAll(" ", "-")}`)
      }
    } else {
      redirect(`/${p.domain}/Section-H/pageAdministration/${p.school_id}/pageUtilities/pagePlatformActivation/${p.schoolfees_id}?error=Transaction Failed`)
    }
  }

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">
      <div className="flex justify-between md:px-6 px-4 py-6 xl:px-7.5">
        <h4 className="dark:text-white font-semibold text-2xl text-black">
          {apiData.userprofile__user__full_name}
        </h4>

      </div>

      <div className="dark:text-white flex flex-col gap-2 md:p-10 md:text-2xl p-2 tracking-widest">
        <div className='flex gap-4 md:gap-10'><span className='md:w-24 w-10'>Class</span>: <span className='font-semibold'>{apiData.userprofile__specialty__main_specialty__specialty_name}</span></div>
        <div className='flex gap-4 md:gap-10'><span className='md:w-24 w-10'>Year</span>: <span className='font-semibold'>{apiData.userprofile__specialty__academic_year}</span></div>
        <div className='flex gap-4 md:gap-10'><span className='md:w-24 w-10'>Level</span>: <span className='font-semibold'>{apiData.userprofile__specialty__level__level}</span></div>
      </div>

      <form action={onActivate} className='flex flex-col gap-10 items-center justi justify-center mb-10 md:flex-row md:text-lg'>
          <select name="operator" required={true} className='border-2 px-10 py-2 rounded'>
            <option value={""}>--------------</option>
            <option value={"MTN"}>MTN</option>
            <option value={"ORANGE"}>ORANGE</option>
          </select>
          <input
            className='border-2 px-6 py-1 rounded w-60'
            placeholder='Payer Number'
            name="payer"
            type='number'
            max={699999999}
            min={600000000}
            required={true}
          />

          <button type='submit' className='bg-green-600 font-semibold px-6 py-2 rounded text-lg text-white tracking-wide'>Pay {apiData.platform_charges}F</button>

        </form>

    </div>
  )
}



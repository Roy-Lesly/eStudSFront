import { Metadata } from 'next'
import React from 'react'
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'
import MyPagination from '@/section-h/common/Pagination/MyPagination'
import MyButtonCustom from '@/section-h/common/MyButtonCustom'
import { GetPaymentMethodInter } from '@/Domain/Utils-H/feesControl/feesInter'
import { protocol } from '@/config'
import { PaymentMethodUrl } from '@/Domain/Utils-H/feesControl/feesConfig'
import { getData } from '@/functions'
import NotificationError from '@/section-h/common/NotificationError'
import { redirect } from 'next/navigation'
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
  const apiData: GetPaymentMethodInter[] | any = await getData(protocol  + "api" + p.domain + PaymentMethodUrl, {...sp}, p.domain);
  
  return (
    
      <>
        <Breadcrumb
          pageName="Payment Methods" 
          pageName1="Dashboard" 
          pageName2="Settings" 
          link1={`/Section-H/pageAdministration/${p.school_id}`}
          link2={`/Section-H/pageAdministration/${p.school_id}/pageSettings`}
        />

        {sp && <NotificationError errorMessage={sp} />}
        {apiData == "ECONNREFUSED" && <ServerError type='network' />}
        {apiData && apiData.unauthorized && redirect(`/pageAuthentication/pageSessionExpired`)}
        {apiData != "ECONNREFUSED" && <List apiData={apiData} params={p} />}

      </>
    
  )
}

export default page

export const metadata: Metadata = {
  title: "Programs",
  description: "This is Programs Page",
};


const List = ( {apiData, params}: any ) => {

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">
      <div className="flex justify-between md:px-6 px-4 py-6 xl:px-7.5">
        <h4 className="dark:text-white font-semibold text-black text-xl">
          Program-List ({apiData.count})
        </h4>
        <MyButtonCustom
          title="Add Program"
          href={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pagePrograms/create`} 
        />
      </div>

      <div></div>

      <div className="bg-bluedark border-stroke border-t dark:border-strokedark font-medium grid grid-cols-2 md:grid-cols-4 md:px-6 px-4 py-2 text-lg text-white">
        <div className="hidden items-center sm:flex">
          <p className="font-medium">No</p>
        </div>
        <div className="flex items-center">
          <p className="font-medium">Payment Method</p>
        </div>
        <div className="hidden items-center md:flex">
          <p className="font-medium">Description</p>
        </div>
        <div className="flex items-center justify-end md:pr-6 pr-4 text-center">
          <span className="font-medium">Action</span>
        </div>
      </div>
      {apiData.results && apiData.results.length > 0 && apiData.results.map((item: GetPaymentMethodInter, key: number) => (
        <div
          className="2xl:px-6.5 border-stroke border-t dark:border-strokedark grid grid-cols-2 md:grid-cols-4 md:px-6 px-4 py-2"
          key={key}
        >
          <div className="hidden items-center sm:flex">
            <p className="dark:text-white text-black">
              {key + 1}
            </p>
          </div>
          <div className="flex items-center">
            <p className="dark:text-white text-black">
              {item.name}
            </p>
          </div>
          <div className="hidden items-center md:flex">
            <p className="dark:text-white text-black">
              {item.description}
            </p>
          </div>
          <div className="flex gap-2 items-center justify-end px-2 w-full">
            <MyButtonCustom
              type='edit'
              title="View"
              href={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pagePrograms/details/${item.id}`}
            />
          </div>
        </div>
      ))}

      <MyPagination
        prevLink={apiData.previous}
        nextLink={apiData.next}
        count={apiData.count}
        thisUrl={"/Section-H/pageAdministration/pageSettings/pagePrograms"}
      />
    
    </div>
  )
}
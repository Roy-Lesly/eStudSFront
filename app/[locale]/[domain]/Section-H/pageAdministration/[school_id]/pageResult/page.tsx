import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'
import Filter from './Filter'
import { getData } from '@/functions'
import MyPagination from '@/section-h/common/Pagination/MyPagination'
import { GetResultUrl } from '@/Domain/Utils-H/appControl/appConfig'
import { ResultInter } from '@/Domain/Utils-H/appControl/appInter'
import { protocol } from '@/config'

const page = async ({
  params,
  searchParams,
}: {
  params: { id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: ResultInter[] | any = await getData(
    protocol + "api" + params.domain + GetResultUrl, {...searchParams}, params.domain
  );
  
  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Results" 
          pageName1="Main Dashboard" 
          link1="/pageAdministration" 
        />

        <Filter />

        {/* <ResultList apiData={apiData} /> */}

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title:
    "Result",
  description: "This is Result Page",
};


const ResultList = ( {apiData}: any ) => {

  console.log(58, apiData)

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">
      <div className="flex gap-2 justify-between md:px-6 px-4 py-6 xl:px-7.5">
        <h4 className="dark:text-white font-semibold text-black text-xl">
          Result List ({apiData?.count})
        </h4>
        {/* <MyButtonAdd
          href={"/pageAdministration/pageSettings/pageDomains/create"} 
        /> */}
      </div>

      <div></div>

      <div className="2xl:px-6.5 border-stroke border-t dark:border-strokedark grid grid-cols-4 md:px-6 px-4 py-4 sm:grid-cols-4 sm:text-lg">
        <div className="flex items-center">
          <p className="font-medium w-full">Full Name</p>
        </div>
        <div className="flex items-center w-32">
          <p className="font-medium">CA</p>
        </div>
        <div className="flex items-center w-32">
          <p className="font-medium">Exam</p>
        </div>
        <div className="items-center sm:flex w-32">
          <p className="font-medium">Resit</p>
        </div>
        {/* <div className="hidden items-center justify-center md:flex text-center">
          <p className="font-medium">Action</p>
        </div> */}
      </div>
      {apiData && apiData.results.length > 0 && apiData.results.map((item: ResultInter, key: number) => (
        <div
          className="2xl:px-6.5 border-stroke border-t dark:border-strokedark grid grid-cols-4 md:px-6 px-4 py-2 sm:grid-cols-4 sm:text-lg"
          key={key}
        >
          <div className="flex font-medium items-center tracking-wider w-full">
            <p className="dark:text-white italic text-black text-sm">
              {item.student.user.first_name} {item.student.user.last_name}
            </p>
          </div>
          <div className="flex items-center w-32">
            <p className="dark:text-white text-black text-sm">
              {item.ca}
            </p>
          </div>
          <div className="flex items-center w-32">
            <p className="dark:text-white text-black text-sm">
              {item.exam}
            </p>
          </div>
          <div className="flex items-center w-32">
            <p className="dark:text-white text-black text-sm">
              {item.resit}
            </p>
          </div>
        </div>
      ))}

      {
        apiData && <MyPagination
            prevLink={apiData.previous}
            nextLink={apiData.next}
            count={apiData.count}
            thisUrl={"/pageAdministration/pageSettings/pageDomains"}
          />
      }
    
    </div>
  )
}
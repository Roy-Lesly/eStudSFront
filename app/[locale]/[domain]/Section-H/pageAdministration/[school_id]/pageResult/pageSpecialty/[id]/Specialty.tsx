import MyButtonView from '@/section-h/common/MyButtons/MyButtonView';
import MyPagination from '@/section-h/common/Pagination/MyPagination';
import { getData } from '@/functions';
import React, { FC } from 'react'
import { SpecialtyUrl } from '@/Domain/Utils-H/appControl/appConfig';
import { SpecialtyInter } from '@/Domain/Utils-H/appControl/appInter';
import { protocol } from '@/config';

const Specialty = async ({ params }: any) => {

  const apiData: SpecialtyInter[] | any = await getData(protocol + "api" + params.domain + SpecialtyUrl, { main_specialty__field__domain_id: params.id }, params.domain);

    return (
        <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">
        <div className="flex justify-between px-4 py-4 xl:px-7.5">
          <h4 className="dark:text-white font-semibold text-black text-xl">
            Select Specialty ({apiData.count})
          </h4>
          {/* <button className="bg-black dark:bg-blue-800 font-semibold md:px-6 md:py-2 md:text-xl px-3 py-1 rounded-sm text-secondary">
            <Link href={"/pageProcurement/pageInventory/category/create"}>
              Add Domain
            </Link>
          </button> */}
        </div>
  
        <div></div>
  
        <div className="2xl:px-6.5 border-stroke border-t dark:border-strokedark font-semibold grid grid-cols-2 md:px-6 md:text-lg px-4 py-4 sm:grid-cols-4">
          <div className="hidden items-center sm:flex">
            <p className="font-medium">#</p>
          </div>
          <div className="flex items-center">
            <p className="font-medium">Specialty Name</p>
          </div>
          <div className="hidden md:flex">
            <p className="font-medium">Field</p>
          </div>
          <div className="flex items-center justify-center text-center">
            <p className="font-medium">Action</p>
          </div>
        </div>
        {apiData.results && apiData.results.length > 0 && apiData.results.map((item: SpecialtyInter, key: number) => (
            <Item key={key} data={item} number={key}/>
        ))}

      <MyPagination
        prevLink={apiData.previous}
        nextLink={apiData.next}
        count={apiData.count}
        thisUrl={`/pageAdministration/pageResult/pageSpecialty/?main_specialty__field__domain_id=${params.id}`}
      />
      
      </div>
    )
}

export default Specialty

interface Props {
    data: SpecialtyInter
    number: number
}

const Item:FC<Props> = ({ data, number }) => {

  return (
    <div
        className="2xl:px-6.5 border-stroke border-t dark:border-strokedark grid grid-cols-2 md:px-6 px-4 py-2 sm:grid-cols-4"
    >
      <div className="hidden items-center sm:flex">
        <p className="dark:text-white text-black text-lg">
            {number + 1}
        </p>
        </div>

        <p className="dark:text-white flex items-center text-black text-lg">
            {data.main_specialty.specialty_name}
        </p>
        <p className="dark:text-white hidden md:flex text-black text-lg">
            {data.academic_year}
        </p>

      <div className="flex gap-2 items-center justify-center md:gap-6 md:text-md px-2 text-lg w-full">
          <MyButtonView link={`pageAdministration/pageResult/Results/${data.id}`} />
      </div>
    </div>
  )
}
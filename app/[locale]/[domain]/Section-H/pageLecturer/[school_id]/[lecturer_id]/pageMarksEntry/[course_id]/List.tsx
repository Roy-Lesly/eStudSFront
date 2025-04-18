'use client';

import React, { FC, useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { getMenuAdministration } from '@/section-h/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import { gql } from '@apollo/client';
import { Metadata } from 'next';
import ServerError from '@/ServerError';
import DefaultLayout from '@/DefaultLayout';
import Link from 'next/link';
import FillMarksAll from './FillMarksAll';
import { EdgePublish } from '@/Domain/schemas/interfaceGraphql';
import { getMenuLecturer } from '@/section-h/Sidebar/MenuLecturer';


export const metadata: Metadata = {
  title: "Main-Subject Page",
  description: "This is Main-Subject Page Admin Settings",
};

const List = ({ params, data, searchParams }: { params: any; data: any, searchParams: any }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<{ id: number, title: string, pageType: "ca" | "exam" | "resit" } | null>(null)

  return (
    <DefaultLayout
      domain={params.domain}
      sidebar={
        <Sidebar
          params={params}
          menuGroups={getMenuLecturer(params)}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      }
      headerbar={
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          searchComponent={
            <></>
          }
        />
      }
    >
      <Breadcrumb
        department="Select"
        subRoute="List"
        pageName="Select"
        mainLink={`${params.domain}/Section-H/pageLecturer/${params.school_id}/Students/${params.profile_id}`}
        subLink={`${params.domain}/Section-H/pageLecturer/${params.school_id}/Students/${params.profile_id}`}
      />

      <div className="bg-gray-50 flex flex-col items-center justify-center">


        <div className="bg-white mt-2 mx-auto rounded shadow w-full">
          {data ?
            data.allPublishes ?
              !selectedType ?
                <Select setSelectedType={setSelectedType} searchParams={searchParams} publishData={data.allPublishes?.edges[0]} />
                :
                data.allResults && data.allResults.edges.length ?
                  data.allSchoolInfos.edges.length ?
                    <FillMarksAll 
                      values={selectedType} 
                      data={data.allResults.edges} 
                      params={params} 
                      searchParams={searchParams} 
                      schoolInfo={data.allSchoolInfos.edges[0]} 
                    />
                    :
                    <ServerError type='notFound' item='SchoolInfo' />
                  :
                  <ServerError type='notFound' item='Results' />
              :
              <ServerError type='notFound' item='Publish' />
            :
            <ServerError type='network' item='' />}
        </div>

      </div>
    </DefaultLayout>
  );
};

export default List;

const LinkOne: any = [
  { id: 1, title: "Semester I CA", pageType: "ca" },
  { id: 2, title: "Semester I Exam", pageType: "exam" },
  { id: 3, title: "Semester I Resit", pageType: "resit" },
]
const LinkTwo: any = [
  { id: 1, title: "Semester II CA", pageType: "ca" },
  { id: 2, title: "Semester II Exam", pageType: "exam" },
  { id: 3, title: "Semester II Resit", pageType: "resit" },
]


const Select = ({ setSelectedType, searchParams, publishData }: { searchParams: { sem: "I" | "II" }, setSelectedType: any, publishData: EdgePublish }) => {

  console.log(publishData, 99)

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark flex flex-col justify-center md:px-20 px-4 rounded-sm shadow-default">

      <div className="flex flex-col font-bold justify-between md:flex-row md:mt-4 md:text-xl py-4 text-lg tracking-widest">
        <span>Class: {publishData.node.specialty.mainSpecialty?.specialtyName}</span>
        <span>Year: {publishData.node.specialty?.academicYear}</span>
        <span>Level: {publishData.node.specialty?.level.level}</span>
      </div>

      {searchParams.sem == "I" && <div className='flex flex-col gap-10 items-center justify-center md:flex-row py-16'>
        {LinkOne.map((item: any) => (
          <button
            className={`${(item.pageType === "ca" && publishData.node.portalCa) ? "flex" : (item.pageType === "exam" && publishData.node.portalExam) ? "flex" : (item.pageType === "resit" && publishData.node.portalResit) ? "flex" : "hidden"} bg-blue-900 font-semibold h-20 items-center justify-center px-10 rounded text-center text-white text-xl tracking-wide w-full`}
            key={item.id}
            onClick={() => setSelectedType(item)}
          >
            {item.title}
          </button>
        ))}
      </div>}

      {searchParams.sem == "II" && <div className='flex flex-col gap-10 items-center justify-center md:flex-row py-16'>
        {LinkTwo.map((item: any) => (
          <button
            className={`${(item.pageType === "ca" && publishData.node.portalCa) ? "flex" : (item.pageType === "exam" && publishData.node.portalExam) ? "flex" : (item.pageType === "resit" && publishData.node.portalResit) ? "flex" : "hidden"} bg-blue-900 font-semibold h-20 items-center justify-center px-10 rounded text-center text-white text-xl tracking-wide w-full`}
            key={item.id}
            onClick={() => setSelectedType(item)}
          >
            {item.title}
          </button>
        ))}
      </div>}

    </div>
  )
}


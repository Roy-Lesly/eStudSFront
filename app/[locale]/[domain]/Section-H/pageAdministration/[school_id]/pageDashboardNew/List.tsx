'use client';

import React, { FC, useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { getMenuAdministration } from '@/section-h/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import { Metadata } from 'next';
import DefaultLayout from '@/DefaultLayout';
import SpecialtyCountAndLevelChart from "@/componentsTwo/SpecialtyCountAndLevelChart";
import CountChart from "@/componentsTwo/CountChart";
import UserCard from "@/componentsTwo/UserCard";
import { protocol } from "@/config";
import { GetDashCustomUserSexChartUrl } from "@/Domain/Utils-H/dashControl/dashConfig";
import { getData } from "@/functions";



export const metadata: Metadata = {
  title: "Dashboard Page",
  description: "This is Dashboard Page Admin Settings",
};

const List = (
  { params, apiLevels, profileSexChartData, userCardData, searchParams, specialtyLevelCountChartData, sortedAcadYears }
    :
    { params: any; searchParams: any, apiLevels: any, userCardData: any, profileSexChartData: any, specialtyLevelCountChartData: any, sortedAcadYears: any }
) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <DefaultLayout
      pageType='admin'
      domain={params.domain}
      sidebar={
        <Sidebar
          params={params}
          menuGroups={getMenuAdministration(params)}
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
        department="Dashboard"
        subRoute="List"
        pageName="Dashboard"
        mainLink={`${params.domain}/Section-H/pageAdministration/${params.school_id}/pageDashboard`}
      />

      <div className="bg-gray-50 flex flex-col items-center justify-center">


        <div className="bg-white mt-2 mx-auto rounded shadow w-full">
          f
          {/* {specialtyLevelCountChartData && specialtyLevelCountChartData.length > 0 ? <AdminPage
            params={params} searchParams={searchParams} sortedAcadYears={sortedAcadYears} apiLevels={apiLevels}
            userCardData={userCardData} profileSexChartData={profileSexChartData}
            specialtyLevelCountChartData={specialtyLevelCountChartData}
          />
            :
            <div className="flex flex-col gap-20 items-center rounded w-full">
              {sortedAcadYears && sortedAcadYears.length > 0 ? <div className="flex flex-col p-10 text-xl tracking-widest w-full">
                <Search params={params} searchParams={searchParams} sortedAcadYears={sortedAcadYears} />
                <div className="flex font-medium items-center justify-center mt-40 w-full">
                  <div className="bg-white flex flex-col gap-4 items-center justify-center p-6 rounded w-[350px]">
                    <span>The Selected Year</span>
                    <span>Has No Data Yet !</span>
                  </div>
                </div>
              </div>
                :
                <div className="bg-white flex font-medium mt-40 p-10 text-xl tracking-widest">No Campus Data Generated Yet !</div>
              }
            </div>
          } */}
        </div>

      </div>
    </DefaultLayout>
  );
};

export default List;



const AdminPage = async (
  { params, searchParams, sortedAcadYears, apiLevels, profileSexChartData, userCardData, specialtyLevelCountChartData }
    :
    {
      params: any, searchParams: any, sortedAcadYears: string[], apiLevels: any, profileSexChartData: any,
      userCardData: { students: number, lecturers: number, admins: number, inactive: number, academic_year: string },
      specialtyLevelCountChartData: any
    }) => {

  console.log(apiLevels)
  console.log(profileSexChartData)
  console.log(userCardData)
  console.log(searchParams)
  console.log(specialtyLevelCountChartData)
  console.log(sortedAcadYears)

  const UserSexAdminChartData = sortedAcadYears && await getData(protocol + "api" + params.domain + GetDashCustomUserSexChartUrl, {
    role: "admin",
    school: params.school_id
  }, params.domain)
  const UserSexLectChartData = sortedAcadYears && await getData(protocol + "api" + params.domain + GetDashCustomUserSexChartUrl, {
    role: "teacher",
    school: params.school_id
  }, params.domain)

  return (
    <div className="bg-slate-300 dark:bg-[#074545] flex flex-col gap-2 p-4 rounded-lg">

      <Search params={params} searchParams={searchParams} sortedAcadYears={sortedAcadYears} />

      <div className="flex flex-col gap-4 w-full">
        {/* USER CARDS */}
        <div className="flex flex-col gap-4 justify-between md:flex-row">
          <UserCard data={{ id: 1, type: "Admins", count: userCardData.admins, date: userCardData.academic_year, icon: "/images/dash/parent.png" }} />
          <UserCard data={{ id: 2, type: "Lecturers", count: userCardData.lecturers, date: userCardData.academic_year, icon: "/images/dash/student.png" }} />
          <UserCard data={{ id: 3, type: "Students", count: userCardData.students, date: userCardData.academic_year, icon: "/images/dash/maleFemale.png" }} />
          <UserCard data={{ id: 4, type: "Not Active", count: userCardData.inactive, date: userCardData.academic_year, icon: "/images/dash/moreDark.png" }} />
        </div>

        {/* COUNT CHART */}
        <div className="flex flex-col gap-4 md:flex-row md:h-[350px] w-full">
          <div className="h-[350px] md:w-1/3 w-full">
            <CountChart data={UserSexAdminChartData} title={"Admins"} />
          </div>
          <div className="h-[350px] md:w-1/3 w-full">
            <CountChart data={profileSexChartData} title={"Students"} />
          </div>
          <div className="h-[350px] md:w-1/3 w-full">
            <CountChart data={UserSexLectChartData} title={"Lecturers"} />
          </div>
        </div>


        {/* ATTENDANCE CHART */}

        {/* </div> */}
        <div className="h-[450px] w-full">
          <SpecialtyCountAndLevelChart data={specialtyLevelCountChartData} levels={apiLevels} />
        </div>
      </div>
    </div>
  );
};


const Search = ({ params, searchParams, sortedAcadYears }: any) => {

  const LoadStatsByYear = async (formData: FormData) => {
    // 'use server'
    // var academic_year = formData.get("academic_year")
    // var period = formData.get("period")

    // if (academic_year && academic_year.toString().length == 9 && period) {
    //   var one = academic_year.slice(0, 4)
    //   redirect(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageDashboard?academic_year=${academic_year}&this_year=${one}&period=${period}`)
    // }
    // if (academic_year && academic_year.toString().length > 1) {
    // }

  }

  return (
    <div className="flex flex-col gap-2 items-center justify-between md:flex-row text-black w-full">
      {searchParams && searchParams.period == "ac_year" ?
        <div className="bg-white flex gap-2 items-center px-4 py-1 rounded-lg"><span className="text-lg tracking-widest">Academic Year :</span><span className="font-semibold italic text-lg tracking-widest">{searchParams.academic_year}</span></div>
        :
        <div className="bg-white flex gap-2 items-center px-4 py-1 rounded-lg"><span className="text-lg tracking-widest">Annual Year :</span><span className="font-semibold italic text-lg tracking-widest">{searchParams.this_year ? searchParams.this_year : new Date().getFullYear()}</span></div>
      }
      <form action={LoadStatsByYear} className="flex gap-2 items-center justify-center py-2">
        <select name="academic_year" defaultValue={searchParams && searchParams.academic_year ? searchParams.academic_year : `${parseInt(sortedAcadYears[0].slice(5, 9)) - 1}/${sortedAcadYears[0].slice(5, 9)}`} className="border px-2 py-1 rounded">
          <option value={`${sortedAcadYears[0].slice(5, 9)}/${parseInt(sortedAcadYears[0].slice(5, 9)) + 1}`}>{sortedAcadYears[0].slice(5, 9)}</option>
          {sortedAcadYears && sortedAcadYears.map((item: string) => <option value={item} key={item}>{item.slice(0, 4)}</option>)}
        </select>
        <select name="period" defaultValue={searchParams.period} className="border px-2 py-1 rounded w-full">
          <option value="an_year">Show Annual Year</option>
          <option value="ac_year">Show Academic Year</option>
        </select>
        <button type="submit" className="bg-bluedark border px-2 py-1 rounded text-white tracking-wide">Load</button>
      </form>

    </div>
  )
}



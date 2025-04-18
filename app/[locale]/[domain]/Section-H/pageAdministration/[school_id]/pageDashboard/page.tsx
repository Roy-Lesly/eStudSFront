import SpecialtyCountAndLevelChart from "@/componentsTwo/SpecialtyCountAndLevelChart";
import CountChart from "@/componentsTwo/CountChart";
import UserCard from "@/componentsTwo/UserCard";
import { protocol } from "@/config";
import { AcademicYearUrl, GetLevelUrl } from "@/Domain/Utils-H/appControl/appConfig";
import { GetDashCustomUserSexChartUrl, GetDashProfileSexChartUrl, GetDashSpecialtyLevelCountChartUrl, GetDashUserCardUrl } from "@/Domain/Utils-H/dashControl/dashConfig";
import { getData } from "@/functions";
import NotificationError from "@/section-h/common/NotificationError";
import LayoutAdmin from "@/section-h/compAdministration/LayoutAdmin";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import List from "./List";


const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const today = new Date()
  const acadYears: any = await getData(protocol + "api" + params.domain + AcademicYearUrl, { school: params.school_id }, params.domain)
  const apiLevels = await getData(protocol + "api" + params.domain + GetLevelUrl, { nopage: true }, params.domain)
  const sortedAcadYears = await acadYears?.results && acadYears?.results.sort((a: string, b: string) => a[3] < b[3] ? 1 : a[3] > b[3] ? -1 : 0)

  const userCardData = sortedAcadYears && await getData(protocol + "api" + params.domain + GetDashUserCardUrl, {
    academic_year: searchParams && Object.keys(searchParams).includes("academic_year") ? searchParams.academic_year : sortedAcadYears[0],
    this_year: searchParams && Object.keys(searchParams).includes("this_year") ? searchParams.this_year : today.getFullYear(),
    school: params.school_id
  }, params.domain)
  const profileSexChartData = sortedAcadYears && await getData(protocol + "api" + params.domain + GetDashProfileSexChartUrl, {
    academic_year: searchParams && Object.keys(searchParams).includes("academic_year") ? searchParams.academic_year : sortedAcadYears[0],
    this_year: searchParams && Object.keys(searchParams).includes("this_year") ? searchParams.this_year : today.getFullYear(),
    school: params.school_id
  }, params.domain)
  const specialtyLevelCountChartData = sortedAcadYears && await getData(protocol + "api" + params.domain + GetDashSpecialtyLevelCountChartUrl, {
    academic_year: searchParams && Object.keys(searchParams).includes("academic_year") ? searchParams.academic_year : sortedAcadYears[0],
    this_year: searchParams && Object.keys(searchParams).includes("this_year") ? searchParams.this_year : today.getFullYear(),
    school: params.school_id
  }, params.domain)

  return (
    <List
      params={params}
      searchParams={searchParams}
    >
      <>
        {searchParams && <NotificationError errorMessage={searchParams} />}

        {specialtyLevelCountChartData && specialtyLevelCountChartData.length > 0 ? <AdminPage
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
        }

      </>
    </List>
  )
}

export default page

export const metadata: Metadata = {
  title: "Acc-Dash",
  description: "This is Acc Dash",
};


const AdminPage = async (
  { params, searchParams, sortedAcadYears, apiLevels, profileSexChartData, userCardData, specialtyLevelCountChartData }
    :
    {
      params: any, searchParams: any, sortedAcadYears: string[], apiLevels: any, profileSexChartData: any,
      userCardData: { students: number, lecturers: number, admins: number, inactive: number, academic_year: string },
      specialtyLevelCountChartData: any
    }) => {

  const UserSexAdminChartData = sortedAcadYears && await getData(protocol + "api" + params.domain + GetDashCustomUserSexChartUrl, {
    role: "admin",
    school: params.school_id
  }, params.domain)
  const UserSexLectChartData = sortedAcadYears && await getData(protocol + "api" + params.domain + GetDashCustomUserSexChartUrl, {
    role: "teacher",
    school: params.school_id
  }, params.domain)


  const results = specialtyLevelCountChartData || [];
  const chunkSize = results.length > 15 ? 15 : results.length > 10 ? 10 : results.length;
  const chunks: any[][] = [];

  for (let i = 0; i < results.length; i += chunkSize) {
    chunks.push(results.slice(i, i + chunkSize));
  }


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


        {/* SPECIALTY CHART */}
        <div className="flex flex-col gap-4 h-full w-full">
          {chunks.map((chunk, index) => (
            <div className="h-[370px] w-full">
            <SpecialtyCountAndLevelChart data={chunk} levels={apiLevels} />
            </div>
          ))}
        </div>
    
      </div>
    </div>
  );
};



const Search = ({ params, searchParams, sortedAcadYears }: any) => {

  const LoadStatsByYear = async (formData: FormData) => {
    'use server'
    var academic_year = formData.get("academic_year")
    var period = formData.get("period")

    if (academic_year && academic_year.toString().length == 9 && period) {
      var one = academic_year.slice(0, 4)
      redirect(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageDashboard?academic_year=${academic_year}&this_year=${one}&period=${period}`)
    }
    if (academic_year && academic_year.toString().length > 1) {
    }

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


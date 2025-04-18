import FinanceChart from "@/componentsTwo/FinanceChart";
import SpecialtyLevelIncountChart from "@/componentsTwo/SpecialtyLevelIncomeChart";
import UserCard from "@/componentsTwo/UserCard";
import { protocol } from "@/config";
import { AcademicYearUrl, GetLevelUrl } from "@/Domain/Utils-H/appControl/appConfig";
import { GetDashFinanceChartUrl, GetDashSpecialtyLevelIncomeChartUrl, GetDashUserCardUrl } from "@/Domain/Utils-H/dashControl/dashConfig";
import { getData } from "@/functions";
import NotificationError from "@/section-h/common/NotificationError";
import LayoutAccounting from "@/section-h/compAccounting/LayoutAccounting";
import { Metadata } from "next";
import { redirect } from "next/navigation";


const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const today = new Date()
  const apiLevels = await getData(protocol + "api" + params.domain + GetLevelUrl, { nopage: true }, params.domain)
  const acadYears: any = await getData(protocol + "api" + params.domain + AcademicYearUrl, { school: params.school_id }, params.domain)
  const sortedAcadYears = await acadYears?.results?.sort((a: string, b: string) => a[3] < b[3] ? 1 : a[3] > b[3] ? -1 : 0)
  const userCardData = sortedAcadYears && await getData(protocol + "api" + params.domain + GetDashUserCardUrl, {
    academic_year: searchParams && Object.keys(searchParams).includes("academic_year") ? searchParams.academic_year : sortedAcadYears[0],
    this_year: searchParams && Object.keys(searchParams).includes("this_year") ? searchParams.this_year : today.getFullYear(),
    school: params.school_id
  }, params.domain)
  const financeChartData = sortedAcadYears && await getData(protocol + "api" + params.domain + GetDashFinanceChartUrl, {
    academic_year: searchParams && Object.keys(searchParams).includes("academic_year") ? searchParams.academic_year : sortedAcadYears[0],
    this_year: searchParams && Object.keys(searchParams).includes("this_year") ? searchParams.this_year : today.getFullYear(),
    period: searchParams && Object.keys(searchParams).includes("period") ? searchParams.period : "an_year",
    school: params.school_id
  }, params.domain)
  const specialtyLevelCountChartData = sortedAcadYears && await getData(protocol + "api" + params.domain + GetDashSpecialtyLevelIncomeChartUrl, {
    academic_year: searchParams && Object.keys(searchParams).includes("academic_year") ? searchParams.academic_year : sortedAcadYears[0],
    this_year: searchParams && Object.keys(searchParams).includes("this_year") ? searchParams.this_year : today.getFullYear(),
    school: params.school_id
  }, params.domain)

  return (
    <LayoutAccounting>
      <>
        {searchParams && <NotificationError errorMessage={searchParams} />}

        {specialtyLevelCountChartData && specialtyLevelCountChartData.length > 0 && financeChartData ? <AdminPage
          params={params} searchParams={searchParams} sortedAcadYears={sortedAcadYears} apiLevels={apiLevels}
          userCardData={userCardData} financeChartData={financeChartData}
          specialtyLevelCountChartData={specialtyLevelCountChartData}
        />
          :
          <div>
            <SearchComp params={params} searchParams={searchParams} sortedAcadYears={sortedAcadYears} />
            <div className="flex flex-col items-center justify-center mt-40 rounded">
              <div className="bg-white flex font-medium p-10 text-xl tracking-widest">No Campus Data Generated Yet !</div>
            </div>

          </div>
        }

      </>
    </LayoutAccounting>
  )
}

export default page

export const metadata: Metadata = {
  title: "Acc-Dash",
  description: "This is Acc Dash",
};


const AdminPage = (
  { params, searchParams, sortedAcadYears, apiLevels, financeChartData, userCardData, specialtyLevelCountChartData }
    :
    { params: any, searchParams: any, apiLevels: any, sortedAcadYears: string[], financeChartData: any, userCardData: { students: number, lecturers: number, admins: number, inactive: number, academic_year: string }, specialtyLevelCountChartData: any }) => {

  const results = specialtyLevelCountChartData || [];
  const chunkSize = results.length > 15 ? 15 : results.length > 10 ? 10 : results.length;
  const chunks: any[][] = [];

  for (let i = 0; i < results.length; i += chunkSize) {
    chunks.push(results.slice(i, i + chunkSize));
  }


  return (
    <div className="bg-slate-400 dark:bg-teal-800 flex flex-col gap-4 p-4 rounded-lg">

      <SearchComp params={params} searchParams={searchParams} sortedAcadYears={sortedAcadYears} />

      <div className="flex flex-col gap-4 w-full">
        {/* USER CARDS */}
        <div className="flex flex-col gap-4 justify-between md:flex-row">
          <UserCard data={{ id: 1, type: "Admins", count: userCardData.admins, date: userCardData.academic_year, icon: "/images/dash/parent.png" }} />
          <UserCard data={{ id: 2, type: "Lecturers", count: userCardData.lecturers, date: userCardData.academic_year, icon: "/images/dash/student.png" }} />
          <UserCard data={{ id: 3, type: "Students", count: userCardData.students, date: userCardData.academic_year, icon: "/images/dash/maleFemale.png" }} />
          <UserCard data={{ id: 4, type: "Not Active", count: userCardData.inactive, date: userCardData.academic_year, icon: "/images/dash/moreDark.png" }} />
        </div>

        <div className="h-[500px] text-black w-full">
          <FinanceChart data={financeChartData} />
        </div>

        {/* SPECIALTY CHART */}
        <div className="flex flex-col gap-4 h-full w-full">
          {chunks.map((chunk, index) => (
            <div className="h-[370px] w-full">
              <SpecialtyLevelIncountChart data={chunk} levels={apiLevels} />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

const SearchComp = ({ params, searchParams, sortedAcadYears }: any) => {

  const LoadStatsByYear = async (formData: FormData) => {
    'use server'
    var academic_year = formData.get("academic_year")
    var period = formData.get("period")

    if (academic_year && academic_year.toString().length == 9 && period) {
      var one = academic_year.slice(0, 4)
      redirect(`/${params.domain}/Section-H/pageAccounting/${params.school_id}/pageDashboard?academic_year=${academic_year}&this_year=${one}&period=${period}`)
    }
    if (academic_year && academic_year.toString().length > 1) {
    }

  }

  return <div className="flex flex-col gap-2 items-center justify-between md:flex-row rounded text-black">
    {searchParams && searchParams.period == "ac_year" ?
      <div className="bg-white flex gap-2 items-center px-4 py-1 rounded"><span className="font-semibold text-lg tracking-widest">Academic Year :</span><span>{searchParams.academic_year}</span></div>
      :
      <div className="bg-white flex gap-2 items-center px-4 py-1 rounded"><span className="font-bold italic text-lg tracking-widest">Annual Year :</span><span>{searchParams.this_year ? searchParams.this_year : new Date().getFullYear()}</span></div>
    }

    <form action={LoadStatsByYear} className="flex gap-2 items-center justify-center">
      <select name="academic_year" defaultValue={searchParams && searchParams.academic_year ? searchParams.academic_year : `${parseInt(sortedAcadYears[0].slice(5, 9)) - 1}/${sortedAcadYears[0].slice(5, 9)}`} className="border px-4 py-1 rounded w-60">
        <option value={`${sortedAcadYears[0].slice(5, 9)}/${parseInt(sortedAcadYears[0].slice(5, 9)) + 1}`}>{sortedAcadYears[0].slice(5, 9)}</option>
        {sortedAcadYears && sortedAcadYears.map((item: string) => <option value={item} key={item}>{item.slice(0, 4)}</option>)}
      </select>
      <select name="period" defaultValue={searchParams.period} className="border px-2 py-1 rounded w-40">
        <option value="an_year">Show Annual Year</option>
        <option value="ac_year">Show Academic Year</option>
      </select>
      <button type="submit" className="bg-bluedark border p-1 px-2 rounded text-white tracking-widest">Load</button>
    </form>

  </div>
}
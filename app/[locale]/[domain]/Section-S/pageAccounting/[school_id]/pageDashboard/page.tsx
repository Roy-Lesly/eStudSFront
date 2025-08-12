import { protocol } from "@/config";
import { GetLevelUrl } from "@/Domain/Utils-H/appControl/appConfig";
import { GetDashFinanceChartUrl, GetDashSpecialtyLevelIncomeChartUrl, GetDashUserCardUrl } from "@/Domain/Utils-H/dashControl/dashConfig";
import { getData } from "@/functions";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import List from "./List";
import { gql } from "@apollo/client";
import Wrapper from "./Wrapper";
import getApolloClient, { errorLog } from "@/utils/graphql/GetAppolloClient";


const page = async ({
  params,
  searchParams,
}: {
  params: any,
  searchParams?: any
}) => {

  const p = await params;
  const sp = await searchParams;

  const client = getApolloClient(p.domain);
  let apiAcademicYears;
  try {
    const result = await client.query<any>({
      query: GET_ACADEMIC_YEARS,
      variables: {
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    apiAcademicYears = result.data;
  } catch (error: any) {
    errorLog(error);
    apiAcademicYears = null;
  }

  const today = new Date()
  const apiLevels = await getData(protocol + "api" + p.domain + GetLevelUrl, { nopage: true }, p.domain)
  const sortedAcadYears = await apiAcademicYears?.allAcademicYears?.sort((a: string, b: string) => a[3] < b[3] ? 1 : a[3] > b[3] ? -1 : 0)
  const userCardData = sortedAcadYears && await getData(protocol + "api" + p.domain + GetDashUserCardUrl, {
    academic_year: sp && Object.keys(sp).includes("academic_year") ? sp.academic_year : sortedAcadYears[0],
    this_year: sp && Object.keys(sp).includes("this_year") ? sp.this_year : today.getFullYear(),
    school: p.school_id
  }, p.domain)
  const financeChartData = sortedAcadYears && await getData(protocol + "api" + p.domain + GetDashFinanceChartUrl, {
    academic_year: sp && Object.keys(sp).includes("academic_year") ? sp.academic_year : sortedAcadYears[0],
    this_year: sp && Object.keys(sp).includes("this_year") ? sp.this_year : today.getFullYear(),
    period: sp && Object.keys(sp).includes("period") ? sp.period : "an_year",
    school: p.school_id
  }, p.domain)
  const specialtyLevelCountChartData = sortedAcadYears && await getData(protocol + "api" + p.domain + GetDashSpecialtyLevelIncomeChartUrl, {
    academic_year: sp && Object.keys(sp).includes("academic_year") ? sp.academic_year : sortedAcadYears[0],
    this_year: sp && Object.keys(sp).includes("this_year") ? sp.this_year : today.getFullYear(),
    school: p.school_id
  }, p.domain)

  return (
    <Wrapper
      params={p}
      searchParams={sp}
    >
      <List
        userCardData={userCardData}
        financeChartData={financeChartData}
        specialtyLevelCountChartData={specialtyLevelCountChartData}
        apiLevels={apiLevels}
        sortedAcadYears={sortedAcadYears}
        p={p}
        sp={sp}
      />
    </Wrapper>
  )
}

export default page

export const metadata: Metadata = {
  title: "Acc-Dash",
  description: "e-conneq School System. Acc Dash",
};




const GET_ACADEMIC_YEARS = gql`
  query GetAcadYears{
    allAcademicYears
  }
`;
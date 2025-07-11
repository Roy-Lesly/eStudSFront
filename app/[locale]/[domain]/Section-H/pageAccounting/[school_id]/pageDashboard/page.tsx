import { protocol } from "@/config";
import { GetLevelUrl } from "@/Domain/Utils-H/appControl/appConfig";
import { GetDashFinanceChartUrl, GetDashSpecialtyLevelIncomeChartUrl, GetDashUserCardUrl } from "@/Domain/Utils-H/dashControl/dashConfig";
import List from "./List";
import { gql } from "@apollo/client";
import Wrapper from "./Wrapper";
import { queryServerGraphQL } from "@/utils/graphql/queryServerGraphQL";
import { getData } from "@/utils/functions";
import { Metadata } from "next";


const page = async ({
  params,
  searchParams,
}: {
  params: any,
  searchParams?: any
}) => {

  const p = await params;
  const sp = await searchParams;

  const data = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA,
    variables: {
      schoolId: parseInt(p.school_id),
    },
  });

  // const today = new Date()
  // const userCardData = sortedAcadYears && await getData(protocol + "api" + p.domain + GetDashUserCardUrl, {
  //   academic_year: sp && Object.keys(sp).includes("academic_year") ? sp.academic_year : sortedAcadYears[0],
  //   this_year: sp && Object.keys(sp).includes("this_year") ? sp.this_year : today.getFullYear(),
  //   school: p.school_id
  // }, p.domain)
  // const financeChartData = sortedAcadYears && await getData(protocol + "api" + p.domain + GetDashFinanceChartUrl, {
  //   academic_year: sp && Object.keys(sp).includes("academic_year") ? sp.academic_year : sortedAcadYears[0],
  //   this_year: sp && Object.keys(sp).includes("this_year") ? sp.this_year : today.getFullYear(),
  //   period: sp && Object.keys(sp).includes("period") ? sp.period : "an_year",
  //   school: p.school_id
  // }, p.domain)
  // const specialtyLevelCountChartData = sortedAcadYears && await getData(protocol + "api" + p.domain + GetDashSpecialtyLevelIncomeChartUrl, {
  //   academic_year: sp && Object.keys(sp).includes("academic_year") ? sp.academic_year : sortedAcadYears[0],
  //   this_year: sp && Object.keys(sp).includes("this_year") ? sp.this_year : today.getFullYear(),
  //   school: p.school_id
  // }, p.domain)

  return (
    <Wrapper
      params={p}
      searchParams={sp}
    >
      <></>
      {/* <List
        userCardData={userCardData}
        financeChartData={financeChartData}
        specialtyLevelCountChartData={specialtyLevelCountChartData}
        apiLevels={apiLevels}
        sortedAcadYears={sortedAcadYears}
        p={p}
        sp={sp}
      /> */}
    </Wrapper>
  )
}

export default page

export const metadata: Metadata = {
  title: "Acc-Dash",
  description: "This is Acc Dash",
};




const GET_DATA = gql`
  query GetAcadYears{
    allAcademicYears
    allLevels { 
      edges {
        node {
          id level
        }
      }
    }
  }
`;
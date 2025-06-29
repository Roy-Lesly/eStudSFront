import { Metadata } from 'next';
import React, { FC } from 'react'
import getApolloClient, { decodeUrlID, getData } from '@/functions';
import { gql } from '@apollo/client';
import CountChart from "@/componentsTwo/CountChart";
import { protocol } from "@/config";
import { AcademicYearUrl, GetLevelUrl } from "@/Domain/Utils-H/appControl/appConfig";
import { GetDashCustomUserSexChartUrl, GetDashProfileSexChartUrl, GetDashSpecialtyLevelCountChartUrl, GetDashUserCardUrl } from "@/Domain/Utils-H/dashControl/dashConfig";
import List from './List';

const EditPage = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params;
  const sp = await searchParams;

  const today = new Date()
  const acadYears: any = await getData(protocol + "api" + p.domain + AcademicYearUrl, { school: p.school_id }, p.domain )
  const apiLevels = await getData(protocol + "api" + p.domain + GetLevelUrl, { nopage: true }, p.domain )
  const sortedAcadYears = await acadYears?.results && acadYears?.results.sort((a: string, b: string) => a[3] < b[3] ? 1 : a[3] > b[3] ? -1 : 0)

  const userCardData = sortedAcadYears && await getData(protocol + "api" + p.domain + GetDashUserCardUrl, {
    academic_year: sp && Object.keys(sp).includes("academic_year") ? sp.academic_year : sortedAcadYears[0],
    this_year: searchParams && Object.keys(sp).includes("this_year") ? sp.this_year : today.getFullYear(),
    school: p.school_id
  }, p.domain )
  const profileSexChartData = sortedAcadYears && await getData(protocol + "api" + p.domain + GetDashProfileSexChartUrl, {
    academic_year: sp && Object.keys(sp).includes("academic_year") ? sp.academic_year : sortedAcadYears[0],
    this_year: sp && Object.keys(sp).includes("this_year") ? sp.this_year : today.getFullYear(),
    school: p.school_id
  }, p.domain )
  const specialtyLevelCountChartData = sortedAcadYears && await getData(protocol + "api" + params.domain + GetDashSpecialtyLevelCountChartUrl, {
    academic_year: sp && Object.keys(sp).includes("academic_year") ? sp.academic_year : sortedAcadYears[0],
    this_year: sp && Object.keys(sp).includes("this_year") ? sp.this_year : today.getFullYear(),
    school: p.school_id
  }, p.domain )


  return (
    <div>
    <List
      params={params}
      searchParams={sp} 
      apiLevels={apiLevels}
      userCardData={userCardData}
      profileSexChartData={profileSexChartData}
      specialtyLevelCountChartData={specialtyLevelCountChartData}
      sortedAcadYears={sortedAcadYears}
    />
  </div>
  )
}

export default EditPage



export const metadata: Metadata = {
  title:
    "Dashboard",
  description: "This is Dashboard Page",
};




const GET_DATA = gql`
 query GetAllData(
  $schoolId: ID
  $courseId: Decimal
  $specialtyId: Decimal!
  $semester: String!
) {
  allResults(
    courseId: $courseId
  ){
    edges {
      node {
        id 
        ca exam resit info
        course { mainCourse { courseName} assignedTo { fullName}}
        student { user { fullName} specialty { level { level} mainSpecialty { specialtyName} academicYear}}
      }
    }
  }
  allPublishes(
    specialtyId: $specialtyId
    semester: $semester
  ) {
    edges {
      node {
        id 
        semester
        ca
        exam
        resit
        portalCa
        portalExam
        portalResit
        specialty {
          id
          academicYear
          level { level}
          mainSpecialty {
            specialtyName
          }
        }
      }
    }
  }
  allSchoolInfos(
    id: $schoolId
  ) {
    edges {
      node {
        id schoolfeesControl caLimit examLimit resitLimit
      }
    }
  }
}
`;

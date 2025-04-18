import { Metadata } from 'next';
import React, { FC } from 'react'
import getApolloClient, { decodeUrlID, getData } from '@/functions';
import { gql } from '@apollo/client';
import CountChart from "@/componentsTwo/CountChart";
import { protocol } from "@/config";
import { AcademicYearUrl, GetLevelUrl } from "@/Domain/Utils-H/appControl/appConfig";
import { GetDashCustomUserSexChartUrl, GetDashProfileSexChartUrl, GetDashSpecialtyLevelCountChartUrl, GetDashUserCardUrl } from "@/Domain/Utils-H/dashControl/dashConfig";
import LayoutAdmin from "@/section-h/compAdministration/LayoutAdmin";
import List from './List';

const EditPage = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, lecturer_id: string, course_id: string, domain: string };
  searchParams?: any
}) => {





  const today = new Date()
  const acadYears: any = await getData(protocol + "api" + params.domain + AcademicYearUrl, { school: params.school_id }, params.domain )
  const apiLevels = await getData(protocol + "api" + params.domain + GetLevelUrl, { nopage: true }, params.domain )
  const sortedAcadYears = await acadYears?.results && acadYears?.results.sort((a: string, b: string) => a[3] < b[3] ? 1 : a[3] > b[3] ? -1 : 0)

  const userCardData = sortedAcadYears && await getData(protocol + "api" + params.domain + GetDashUserCardUrl, {
    academic_year: searchParams && Object.keys(searchParams).includes("academic_year") ? searchParams.academic_year : sortedAcadYears[0],
    this_year: searchParams && Object.keys(searchParams).includes("this_year") ? searchParams.this_year : today.getFullYear(),
    school: params.school_id
  }, params.domain )
  const profileSexChartData = sortedAcadYears && await getData(protocol + "api" + params.domain + GetDashProfileSexChartUrl, {
    academic_year: searchParams && Object.keys(searchParams).includes("academic_year") ? searchParams.academic_year : sortedAcadYears[0],
    this_year: searchParams && Object.keys(searchParams).includes("this_year") ? searchParams.this_year : today.getFullYear(),
    school: params.school_id
  }, params.domain )
  const specialtyLevelCountChartData = sortedAcadYears && await getData(protocol + "api" + params.domain + GetDashSpecialtyLevelCountChartUrl, {
    academic_year: searchParams && Object.keys(searchParams).includes("academic_year") ? searchParams.academic_year : sortedAcadYears[0],
    this_year: searchParams && Object.keys(searchParams).includes("this_year") ? searchParams.this_year : today.getFullYear(),
    school: params.school_id
  }, params.domain )



    // const client = getApolloClient(params.domain);
    // let data;
    // try {
    //   if (searchParams?.spec && params.course_id){
    //     const result = await client.query<any>({
    //       query: GET_DATA,
    //       variables: {
    //         courseId: parseInt(decodeUrlID(params.course_id)),
    //         specialtyId: parseInt(decodeUrlID(searchParams.spec)),
    //         semester: searchParams.sem,
    //         schoolId: params.school_id,
    //         timestamp: new Date().getTime()
    //       },
    //       fetchPolicy: 'no-cache'
    //     });
    //     data = result.data;
    //   }
    // } catch (error: any) {
    //   console.log(error)
    //   if (error.networkError && error.networkError.result) {
    //     console.error('GraphQL Error Details:', error.networkError.result.errors);
    //   }
    //   data = null;
    // }



  return (
    <div>
    <List
      params={params} 
      // data={data} 
      searchParams={searchParams} 
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

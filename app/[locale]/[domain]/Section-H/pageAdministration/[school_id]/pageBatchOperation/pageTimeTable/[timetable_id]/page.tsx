import { Metadata } from 'next'
import React from 'react'
import getApolloClient, { decodeUrlID } from '@/functions'
import { gql } from '@apollo/client'
import List from './List'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string, timetable_id: string };
  searchParams?: { spec: string };
}) => {

  // const t = removeEmptyFields(paginationParams)
  const client = getApolloClient(params.domain);
  let dataAllTimeTables;

  try {
    console.log(searchParams)
    let q: any = {
      id: parseInt(decodeUrlID(params.timetable_id)),
      schoolId: parseInt(params.school_id),
      specialtyId: parseInt(decodeUrlID(searchParams?.spec || "")),
      timestamp: new Date().getTime()
    }
    console.log(q)
    const result = await client.query<any>({
      query: GET_TIMETABLES,
      variables: q,
      fetchPolicy: 'no-cache'
    });
    dataAllTimeTables = result.data;
  } catch (error: any) {
    console.log(error, 81)
    if (error.networkError && error.networkError.result) {
      console.error('GraphQL Error Details:', error.networkError.result.errors);
    }
    dataAllTimeTables = null;
  }

  return (
    <div>
      <List 
        params={params} 
        dataAllTimeTables={dataAllTimeTables?.allTimeTables?.edges}
        apiCourses={dataAllTimeTables?.allCourses?.edges} 
        apiHalls={dataAllTimeTables?.allHalls?.edges} 
        searchParams={searchParams} 
      />
    </div>
  )
}

export default page

export const metadata: Metadata = {
  title: "TimeTable",
  description: "This is TimeTable Page",
};


const GET_TIMETABLES = gql`
  query GetTimeTables (
    $schoolId: Decimal!,
    $specialtyId: Decimal!,
    $id: ID!,
  ) {
    allTimeTables(
      schoolId: $schoolId,
      id: $id,
      last: 10
    ) {
      edges {
        node {
          id year monthName
          specialty { id academicYear level { level} mainSpecialty { specialtyName}}
          period {
            date
            slots {
              assignedToId assignedToName start end hours courseId courseName session hall
              byId byName loginTime logoutTime duration hallUsed status remarks
            }
          }
        }
      }
    }
    allHalls(
      schoolId: $schoolId,
      last: 500
    ) {
      edges {
        node {
          id name
        }
      }
    }
    allCourses(
      schoolId: $schoolId,
      specialtyId: $specialtyId,
      last: 1000
    ) {
      edges {
        node {
          id 
          mainCourse { courseName }
          assignedTo { id fullName }
        }
      }
    }
  }
`;

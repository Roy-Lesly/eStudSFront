import { Metadata } from 'next'
import React from 'react'
import getApolloClient, { decodeUrlID, errorLog } from '@/functions'
import { gql } from '@apollo/client'
import List from './List'

const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams?: any;
}) => {

  const p = await params;
  const sp = await searchParams;

  const client = getApolloClient(p.domain);
  let dataAllTimeTables;

  try {
    let q: any = {
      id: parseInt(decodeUrlID(p.timetable_id)),
      schoolId: parseInt(p.school_id),
      specialtyId: parseInt(decodeUrlID(sp?.spec || "")),
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
    errorLog(error);
    
    dataAllTimeTables = null;
  }

  return (
    <div>
      <List 
        params={p} 
        dataAllTimeTables={dataAllTimeTables?.allTimeTables?.edges}
        apiCourses={dataAllTimeTables?.allCourses?.edges} 
        apiHalls={dataAllTimeTables?.allHalls?.edges} 
        searchParams={sp} 
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

import { Metadata } from 'next'
import React from 'react'
import getApolloClient, { errorLog, getData, removeEmptyFields } from '@/functions'
import { gql } from '@apollo/client'
import List from './List'

const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params;
  const sp = await searchParams;
  
  const client = getApolloClient(p.domain);
  let dataAllTimeTables;

  try {
    let q: any = {
      schoolId: parseInt(p.school_id),
      timestamp: new Date().getTime()
    }
    if (sp?.specialtyName) { q = { ...q, specialtyName: sp.specialtyName}}
    if (sp?.year) { q = { ...q, year: parseInt(sp?.year || "")}}
    if (sp?.month) { q = { ...q, month: parseInt(sp?.month || "")}}
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
      <List params={p} dataAllTimeTables={dataAllTimeTables?.allTimeTables?.edges} searchParams={sp} />
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
    $specialtyName: String,
    $year: Decimal,
    $month: Decimal,
  ) {
    allTimeTables(
      schoolId: $schoolId,
      specialtyName: $specialtyName,
      year: $year,
      month: $month,
      last: 100
    ) {
      edges {
        node {
          id
          year
          monthName
          specialty { id academicYear level { level} mainSpecialty { specialtyName}}
          period {
            date
            slots {
              assignedToId
              assignedToName
              start
              end
              hours
              courseId
              courseName
              session
              hall
            }
          }
        }
      }
    }
  }
`;

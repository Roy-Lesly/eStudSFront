import { Metadata } from 'next'
import React from 'react'
import getApolloClient, { getData, removeEmptyFields } from '@/functions'
import { gql } from '@apollo/client'
import List from './List'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams?: any;
}) => {

  // const t = removeEmptyFields(paginationParams)
  const client = getApolloClient(params.domain);
  let dataAllTimeTables;

  try {
    console.log(searchParams)
    let q: any = {
      schoolId: parseInt(params.school_id),
      timestamp: new Date().getTime()
    }
    if (searchParams?.specialtyName) { q = { ...q, specialtyName: searchParams.specialtyName}}
    if (searchParams?.year) { q = { ...q, year: parseInt(searchParams?.year || "")}}
    if (searchParams?.month) { q = { ...q, month: parseInt(searchParams?.month || "")}}
    const result = await client.query<any>({
      query: GET_TIMETABLES,
      variables: q,
      fetchPolicy: 'no-cache'
    });
    dataAllTimeTables = result.data;
  } catch (error: any) {
    console.log(error, 81)
    
    dataAllTimeTables = null;
  }

  console.log(dataAllTimeTables?.allTimeTables?.edges)


  return (
    <div>
      <List params={params} dataAllTimeTables={dataAllTimeTables?.allTimeTables?.edges} searchParams={searchParams} />
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

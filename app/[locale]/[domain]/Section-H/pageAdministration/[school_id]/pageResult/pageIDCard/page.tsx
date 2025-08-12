import { Metadata } from 'next'
import React from 'react'
import { removeEmptyFields } from '@/functions'
import { gql } from '@apollo/client'
import List from './List'
import getApolloClient, { errorLog } from '@/utils/graphql/GetAppolloClient'


const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params;
  const sp = await searchParams;

  const paginationParams: Record<string, any> = {};

  paginationParams.specialtyName = sp?.specialtyName
  paginationParams.academicYear = sp?.academicYear
  paginationParams.level = parseInt(sp?.level || "")
  paginationParams.schoolId = parseInt(p.school_id)

  const client = getApolloClient(p.domain);
  let data;
  let dataExtra;
  if (sp?.academicYear && sp?.level) {
    try {
      const result = await client.query<any>({
        query: GET_DATA,
        variables: {
          ...removeEmptyFields(paginationParams),
          timestamp: new Date().getTime()
        },
        fetchPolicy: 'no-cache'
      });
      data = result.data;
    } catch (error: any) {
      errorLog(error);
      data = null;
    }
  }
  try {
    const result = await client.query<any>({
      query: GET_DATA_EXTRA,
      fetchPolicy: 'no-cache'
    });
    dataExtra = result.data;
  } catch (error: any) {
    errorLog(error)
    dataExtra = null;
  }

  return (
    <div>
      <List params={p} data={data} dataExtra={dataExtra} searchParams={sp} />
    </div>
  )
}

export default page

export const metadata: Metadata = {
  title: "ID Card",
  description: "e-conneq School System. ID Card Page",
};




const GET_DATA_EXTRA = gql`
 query GetData {
    allAcademicYears
    allLevels {
      edges {
        node {
          id level
        }
      }
    }
 }
 `
const GET_DATA = gql`
 query GetData (
  $schoolId: Decimal!
  $level: Decimal!
  $specialtyName: String
  $academicYear: String
 ) {
  allSpecialties (
    schoolId: $schoolId
    specialtyName: $specialtyName
    academicYear: $academicYear
    levelId: $level
  ) {
    edges {
      node {
        id 
        academicYear
        level { level}
        school { campus}
        mainSpecialty { specialtyName }
      }
    }
  }
}
`;
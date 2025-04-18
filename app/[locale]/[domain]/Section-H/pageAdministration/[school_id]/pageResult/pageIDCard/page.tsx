import { Metadata } from 'next'
import React from 'react'
import getApolloClient, { removeEmptyFields } from '@/functions'
import { gql } from '@apollo/client'
import { AllUserProfilesResponse } from '@/Domain/schemas/interfaceGraphql'
import List from './List'


const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams?: { [key: string]: string | undefined };
}) => {

  const paginationParams: Record<string, any> = { };
  
  paginationParams.specialtyName = searchParams?.specialtyName
  paginationParams.academicYear = searchParams?.academicYear
  paginationParams.level = parseInt(searchParams?.level || "")
  paginationParams.schoolId = parseInt(params.school_id)

  const client = getApolloClient(params.domain);
  let data;
  let dataExtra;
  if (searchParams?.academicYear && searchParams?.level ) {
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
      console.log(error, 39)
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
    dataExtra = null;
  }

  return (
    <div>
      <List params={params} data={data} dataExtra={dataExtra} searchParams={searchParams} />
    </div>
  )
}

export default page

export const metadata: Metadata = {
  title: "ID Card",
  description: "This is ID Card Page",
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
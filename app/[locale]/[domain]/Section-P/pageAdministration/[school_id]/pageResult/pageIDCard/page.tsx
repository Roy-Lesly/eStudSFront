import { Metadata } from 'next'
import React from 'react'
import { gql } from '@apollo/client'
import List from './List'
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL'
import { removeEmptyFields } from '@/utils/functions'


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

  let data;

  if (sp?.academicYear && sp?.level) {
    data = await queryServerGraphQL({
      domain: p?.domain,
      query: GET_DATA,
      variables: {
        ...removeEmptyFields(paginationParams),
      },
    });
  }

  const dataExtra = await queryServerGraphQL({
    domain: p?.domain,
    query: GET_DATA_EXTRA,
    variables: {
      ...removeEmptyFields(paginationParams),
      admissionStatus: false,
    },
  });

  return (
    <div>
      <List params={p} data={data} dataExtra={dataExtra} searchParams={sp} />
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
import React from 'react'
import List from './List'
import { Metadata } from 'next';
import { gql } from '@apollo/client';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';

const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params;
  const sp = await searchParams;

   const data = await queryServerGraphQL({
      domain: p?.domain,
      query: GET_DATA_RESULT,
      variables: {
        fullName: sp?.fullName || "",
        courseName: sp?.courseName || "",
        semester: sp?.semester || "",
        academicYear: sp?.academicYear || "",
      },
    });


  return (
    <List
      params={p}
      dataResults={data?.allResults?.edges}
      sp={sp}
    />
  )
}

export default page


export const metadata: Metadata = {
  title: "Management",
  description: "This is Manangement Page Settings",
};


const GET_DATA_RESULT = gql`
  query GetAllData  (
    $schoolId: Decimal,
    $fullName: String,
    $courseName: String,
    $semester: String,
    $specialty: String,
    $academicYear: String
  ) {
    allResults (
      fullName: $fullName,
      courseName: $courseName,
      semester: $semester,
      specialtyName: $specialty,
      academicYear: $academicYear,
      schoolId: $schoolId,
      ordering: "-updated_at",
      last: 100
    ) {
      edges {
        node {
          id
          createdAt
          updatedAt
          logs
          course { mainCourse { courseName}}
          student {
            user { fullName }
            specialty { academicYear}
          }
        }
      }
    }
  }
`;




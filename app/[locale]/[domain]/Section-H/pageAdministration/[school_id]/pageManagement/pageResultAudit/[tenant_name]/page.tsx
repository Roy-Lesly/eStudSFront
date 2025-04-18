import React from 'react'
import List from './List'
import { Metadata } from 'next';
import { gql } from '@apollo/client';
import getApolloClient from '@/functions';

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string, tenant_name: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const client = getApolloClient(`${params.tenant_name}`, true);
  let data;

  try {
    const result = await client.query<any>({
      query: GET_DATA_RESULT,
      variables: {
        // schoolId: parseInt(params.school_id),
        fullName: searchParams?.fullName || "",
        courseName: searchParams?.courseName || "",
        semester: searchParams?.semester || "",
        academicYear: searchParams?.academicYear || "",
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    data = result.data;
  } catch (error: any) {
    console.log(error, 81)
    data = null;
  }

  console.log(data, 65)

  return (
    <List
      params={params}
      dataResults={data?.allResults?.edges}
      sp={searchParams}
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




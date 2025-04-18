import { Metadata } from 'next'
import React from 'react'
import getApolloClient, { removeEmptyFields } from '@/functions'
import { gql } from '@apollo/client'
import List from './List'


const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const paginationParams: Record<string, any> = { };

  const date =  new Date().getFullYear()
  
  paginationParams.after = searchParams?.after
  paginationParams.before = searchParams?.before
  paginationParams.fullName = searchParams?.fullName
  paginationParams.sex = searchParams?.sex
  paginationParams.matricle = searchParams?.matricle
  paginationParams.academicYear = searchParams?.academicYear
  paginationParams.session = searchParams?.session
  paginationParams.specialtyName = searchParams?.specialtyName
  paginationParams.schoolId = parseInt(params.school_id)
  paginationParams.level = parseInt(searchParams?.level ? Array.isArray(searchParams.level) ? searchParams.level[0] : searchParams.level : "")
  paginationParams.academicYear = searchParams?.academicYear

  const client = getApolloClient(params.domain);
  let data;
  try {
    const result = await client.query<any>({
      query: GET_DATA,
      variables: {
        ...removeEmptyFields(paginationParams),
        role: "STUDENT",
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    data = result.data;
  } catch (error: any) {
    console.log(error)
    data = null;
  }

  console.log("Student => View")

  return (
    <div>
      <List params={params} data={data} searchParams={searchParams} />
    </div>
  )
}

export default page

export const metadata: Metadata = {
  title: "Student Settings",
  description: "This is Student Settings Page",
};




const GET_DATA = gql`
 query GetUserProfiles(
  $after: String,
  $before: String,
  $fullName: String,
  $sex: String,
  $matricle: String,
  $academicYear: String,
  $session: String,
  $specialtyName: String,
  $schoolId: Decimal!
  $level: Decimal
) {
  allAcademicYears
  allLevels {
    edges {
      node {
        id level
      }
    }
  }
  allUserProfiles(
    last: 150,
    after: $after,
    before: $before,
    fullName: $fullName,
    sex: $sex,
    matricle: $matricle,
    academicYear: $academicYear,
    session: $session,
    specialtyName: $specialtyName,   
    schoolId: $schoolId,   
    level: $level,
    isActive: true,
    isStaff: false,
    ordering: "full_name", 
  ) {
    edges {
      node {
        id session
        user {
          id fullName, matricle sex telephone dob pob email address parent parentTelephone 
          nationality highestCertificate yearObtained regionOfOrigin
        }
        specialty { 
          academicYear, 
          level { level } 
          school { campus } 
          mainSpecialty { specialtyName } 
        }
        program { name }
        info
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      endCursor
    }
  }
}
`;


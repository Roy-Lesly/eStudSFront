import { Metadata } from 'next'
import React from 'react'
import { gql } from '@apollo/client'
import List from './List'
import { removeEmptyFields } from '@/utils/functions'
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL'


export const revalidate = 60;

const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams?: any;
}) => {

  const p = await params;
  const sp = await searchParams;
  const { domain } = await params;

  const paginationParams: Record<string, any> = {};

  paginationParams.fullName = sp?.fullName
  paginationParams.sex = sp?.sex
  paginationParams.matricle = sp?.matricle
  paginationParams.academicYear = sp?.academicYear
  paginationParams.schoolId = parseInt(p.school_id)
  paginationParams.level = sp?.level
  paginationParams.academicYear = sp?.academicYear


  const data = await queryServerGraphQL({
    domain,
    query: GET_DATA,
    variables: {
      ...removeEmptyFields(paginationParams),
      role: "STUDENT",
      timestamp: new Date().getTime()
    },
  });


  return (
    <div>
      <List
        p={p}
        data={data}
        sp={sp}
      />
    </div>
  )
}

export default page



export const metadata: Metadata = {
  title: "Student Settings",
  description: "e-conneq School System. Student Settings Page",
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
  $level: String,
  $schoolId: Decimal!
) {
  allUserprofilesSec(
    last: 100,
    after: $after,
    before: $before,
    fullName: $fullName,
    sex: $sex,
    matricle: $matricle,
    academicYear: $academicYear,
    session: $session,  
    level: $level,  
    schoolId: $schoolId,
    isActive: true,
    isStaff: false,
    ordering: "full_name", 
  ) {
    edges {
      node {
        id session
        customuser {
          id fullName, matricle sex telephone dob pob email address 
          nationality regionOfOrigin
          fatherName motherName fatherTelephone motherTelephone parentAddress
        }
        classroomsec { academicYear level stream classType }
        programsec
      }
    }
  }
}
`;


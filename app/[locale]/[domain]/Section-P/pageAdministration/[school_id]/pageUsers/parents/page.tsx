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
  paginationParams.level = sp?.level
  paginationParams.matricle = sp?.matricle
  paginationParams.academicYear = sp?.academicYear
  paginationParams.session = sp?.session
  paginationParams.schoolId = parseInt(p.school_id)
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
      <List params={p} data={data} searchParams={sp} />
    </div>
  )
}

export default page



export const metadata: Metadata = {
  title: "Parent Settings",
  description: "e-conneq School System. Parent Settings Page",
};




const GET_DATA = gql`
 query GetData(
  $fullName: String,
  $sex: String,
  $level: String,
  $matricle: String,
  $academicYear: String,
  $schoolId: Decimal!
) {
  allUserprofilesPrim(
    last: 100,
    fullName: $fullName,
    sex: $sex,
    level: $level,
    matricle: $matricle,
    academicYear: $academicYear,
    schoolId: $schoolId,
    isActive: true,
    isStaff: false,
    ordering: "full_name", 
  ) {
    edges {
      node {
        id
        customuser {
          id firstName, lastName, matricle sex telephone
          fatherName motherName
          fatherTelephone motherTelephone
          parentAddress
        }
        classroomprim { academicYear level }
        programprim
      }
    }
  }
}
`;


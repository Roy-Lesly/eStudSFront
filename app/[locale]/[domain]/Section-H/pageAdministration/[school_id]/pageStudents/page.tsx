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

  paginationParams.after = sp?.after
  paginationParams.before = sp?.before
  paginationParams.fullName = sp?.fullName
  paginationParams.sex = sp?.sex
  paginationParams.matricle = sp?.matricle
  paginationParams.academicYear = sp?.academicYear
  paginationParams.session = sp?.session
  paginationParams.specialtyName = sp?.specialtyName
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
 query GetData(
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
    last: 100,
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
        customuser {
          id fullName, matricle sex telephone dob pob email address 
          fatherName fatherTelephone motherName motherTelephone parentAddress 
          nationality highestCertificate yearObtained regionOfOrigin
        }
        specialty { 
          academicYear, 
          level { level } 
          school { campus } 
          mainSpecialty { specialtyName } 
        }
        program { name }
        infoData
      }
    }
  }
}
`;


import { Metadata } from 'next'
import React from 'react'
import { gql } from '@apollo/client'
import List from './List'
import { platform } from 'os'
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

  let searchP: any = {
    fullName: sp?.fullName,
    specialtyName: sp?.specialtyName,
    level: sp?.level,
    academicYear: sp?.academicYear,
  }

  if (p?.item_type === "ID") {
    searchP.idPaid = false;
  } else {
    searchP.platformPaid = false;
  }

  console.log(searchP);
  const data = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA,
    variables: {
      ...removeEmptyFields(searchP),
      schoolId: parseInt(p.school_id),
      schoolId2: parseInt(p.school_id),
      status: "Pending"
    },
  });

  return (
    <List
      data={data?.allSchoolFees?.edges}
      school={data?.allSchoolInfos?.edges[0]}
      p={p}
      sp={sp}
    />
  )
}

export default page

export const metadata: Metadata = {
  title: "Pending Account Settings",
  description: "e-conneq School System. Pending Account Settings Page",
};



const GET_DATA = gql`
  query GetAllData(
      $schoolId: Decimal!
      $schoolId2: ID!
      $fullName: String
      $idPaid: Boolean
      $platformPaid: Boolean
      $academicYear: String
      $level: Decimal
      $specialtyName: String
    ) {
      allSchoolInfos (
        id: $schoolId2
        last: 2
      ) {
        edges {
          node {
            id schoolName campus colors 
            schoolIdentification { logo platformCharges idCharges } 
            schoolfeesControl 
          }
        }
      }
      allSchoolFees (
        schoolId: $schoolId
        fullName: $fullName
        idPaid: $idPaid
        platformPaid: $platformPaid
        academicYear: $academicYear
        level: $level
        specialtyName: $specialtyName
        last: 100
      ) {
        edges {
          node {
            id
            platformPaid
            idPaid
            userprofile {
              id
              session
              customuser { 
                id matricle fullName
              }
              specialty { 
                id
                academicYear
                mainSpecialty { specialtyName }
                level { level }
                tuition
                school { schoolIdentification { idCharges platformCharges }}
              }
            }
          }
        }
      }
    }`;
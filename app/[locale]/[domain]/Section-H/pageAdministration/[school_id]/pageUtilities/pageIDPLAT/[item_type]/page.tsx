import { Metadata } from 'next'
import React from 'react'
import { removeEmptyFields } from '@/functions'
import { gql } from '@apollo/client'
import List from './List'
import { platform } from 'os'
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL'


const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params;
  const sp = await searchParams;

  const paginationParams: any = {
    fullName: sp?.fullName,
    specialtyName: sp?.specialtyName,
    level: sp?.level,
    academicYear: sp?.academicYear,
  }
  paginationParams.fullName = sp?.fullName ? sp.fullName : ""
  paginationParams.telephone = sp?.telephone ? sp.telephone : ""
  paginationParams.idPaid = p?.item_type === "ID" ? false : undefined
  paginationParams.platformPaid = p?.item_type === "PLATFORM" ? false : undefined

  const data = await queryServerGraphQL({
    domain: p?.domain,
    query: GET_DATA,
    variables: {
      ...removeEmptyFields(paginationParams),
      reason: p?.item_type,
      schoolId: parseInt(p.school_id),
      schoolId2: parseInt(p.school_id)
    },
  });

  return (
    <List
      data={data?.allTransactions?.edges}
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
      $reason: String!
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
      allTransactions (
        schoolId: $schoolId
        reason: $reason
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
            amount
            createdAt
            updatedAt
            reason
            schoolfees {
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
                }
              }
            }
          }
        }
      }
    }`;
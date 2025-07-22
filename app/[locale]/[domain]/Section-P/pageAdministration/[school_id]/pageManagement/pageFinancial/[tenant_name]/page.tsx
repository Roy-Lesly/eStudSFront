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

  const dataPlatformPaid = await queryServerGraphQL({
    domain: p?.domain,
    query: GET_DATA_PLATFORM_PAID,
    variables: {
      // schoolId: (params.school_id),
      specialtyName: sp?.specialty,
      fullName: sp?.fullName,
      level: sp?.level,
      academicYear: sp?.academicYear,
    },
  });

  const dataPlatformPending = await queryServerGraphQL({
    domain: p?.domain,
    query: GET_DATA_PLATFORM_PENDING,
    variables: {
      specialtyName: sp?.specialty,
      fullName: sp?.fullName,
      level: sp?.level,
      academicYear: sp?.academicYear,
    },
  });

  const dataTransactions = await queryServerGraphQL({
    domain: p?.domain,
    query: GET_LAST_PLATFORM_TRANSACTIONS,
    variables: {
      specialtyName: sp?.specialty,
      fullName: sp?.fullName,
      level: sp?.level,
      academicYear: sp?.academicYear,
    },
  });

  return (
    <List
      params={params}
      dataPlatformPaid={dataPlatformPaid?.allSchoolFees?.edges}
      dataPlatformPending={dataPlatformPending?.allSchoolFees?.edges}
      dataTransactions={dataTransactions?.allTransactions?.edges}
      sp={searchParams}
    />
  )
}

export default page


export const metadata: Metadata = {
  title: "Management",
  description: "This is Manangement Page Settings",
};


const GET_DATA_PLATFORM_PAID = gql`
  query GetAllData  (
    $schoolId: Decimal,
    $specialtyName: String,
    $fullName: String,
    $level: Decimal,
    $academicYear: String
  ) {
    allSchoolFees (
      schoolId: $schoolId,
      specialtyName: $specialtyName,
      fullName: $fullName,
      level: $level,
      academicYear: $academicYear,
      platformPaid: true,
      last: 200
    ) {
      edges {
        node {
          id userprofile { 
            specialty { academicYear level { level} mainSpecialty { specialtyName}} 
            user { fullName sex matricle sex}
          }
        }
      }
    }
  }
`;


const GET_DATA_PLATFORM_PENDING = gql`
  query GetAllData (
    $schoolId: Decimal,
    $specialtyName: String,
    $fullName: String,
    $level: Decimal,
    $academicYear: String
  ) {
    allSchoolFees (
      schoolId: $schoolId,
      specialtyName: $specialtyName,
      fullName: $fullName,
      level: $level,
      academicYear: $academicYear,
      platformPaid: false,
      last: 200
    ) {
      edges {
        node {
          id 
          userprofile { 
            specialty { academicYear level { level} mainSpecialty { specialtyName}} 
            user { fullName sex matricle sex}
          }
        }
      }
    }
  }
`;


const GET_LAST_PLATFORM_TRANSACTIONS = gql`
  query GetAllData (
    $schoolId: Decimal,
    $specialtyName: String,
    $fullName: String,
    $level: Decimal,
    $academicYear: String
  ) {
    allTransactions (
      schoolId: $schoolId,
      specialtyName: $specialtyName,
      fullName: $fullName,
      level: $level,
      academicYear: $academicYear,
      reason: "platform",
      last: 200
    ) {
      edges {
        node {
          id
          createdAt
          schoolfees {
            userprofile { 
              specialty { academicYear level { level} mainSpecialty { specialtyName}} 
              user { fullName sex matricle sex}
            }
          }
        }
      }
    }
  }
`;

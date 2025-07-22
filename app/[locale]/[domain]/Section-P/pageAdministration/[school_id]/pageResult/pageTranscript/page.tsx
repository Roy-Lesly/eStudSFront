import { Metadata } from 'next'
import React from 'react'
import { removeEmptyFields } from '@/functions'
import { gql } from '@apollo/client'
import List from './List'
import getApolloClient from '@/utils/graphql/GetAppolloClient'
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

  const paginationParams: Record<string, any> = {};

  const date = new Date().getFullYear()

  paginationParams.fullName = sp?.fullName
  paginationParams.academicYear = sp?.academicYear
  paginationParams.schoolId = parseInt(p.school_id)

  const client = getApolloClient(p.domain);

  const dataPending = await queryServerGraphQL({
    domain: p?.domain,
    query: GET_DATA_PENDING,
    variables: {
      ...removeEmptyFields(paginationParams),
    },
  });

  const dataApproved = await queryServerGraphQL({
    domain: p?.domain,
    query: GET_DATA_APPROVED,
    variables: {
      ...removeEmptyFields(paginationParams),
    },
  });

  const dataPrinted = await queryServerGraphQL({
    domain: p?.domain,
    query: GET_DATA_PRINTED,
    variables: {
      ...removeEmptyFields(paginationParams),
    },
  });

  return (
    <div>
      <List params={p} dataPending={dataPending} dataApproved={dataApproved} dataPrinted={dataPrinted} searchParams={sp} />
    </div>
  )
}

export default page

export const metadata: Metadata = {
  title: "Transcript",
  description: "This is Transcript Page",
};




const GET_DATA_PENDING = gql`
 query GetData(
  $fullName: String,
  $schoolId: Decimal!
) {
  allAcademicYears
  allLevels {
    edges {
      node {
        id level
      }
    }
  }
  allTranscriptApplications(
    status: "PENDING"
    schoolId: $schoolId
    fullName: $fullName
    active: true
  ) {
    edges {
      node {
        id 
        status 
        userprofile { id 
          specialty { academicYear 
          level { level} 
          mainSpecialty { specialtyName}} 
          customuser { fullName matricle sex telephone}
          schoolfees { id }
        }
        createdAt
        createdBy { fullName}  
      }
    }
  }
}
`;

const GET_DATA_APPROVED = gql`
 query GetData(
  $fullName: String,
  $schoolId: Decimal!
) {
  allTranscriptApplications(
    status: "APPROVED"
    schoolId: $schoolId
    fullName: $fullName
    active: true
  ) {
    edges {
      node {
        id 
        status userprofile { specialty { academicYear level { level} mainSpecialty { specialtyName}} customuser { fullName matricle sex telephone}}
        approvedAt
        approvedBy { fullName}
      }
    }
  }
}
`;

const GET_DATA_PRINTED = gql`
 query GetData(
  $fullName: String,
  $schoolId: Decimal!
) {
  allTranscriptApplications(
    status: "PRINTED"
    schoolId: $schoolId
    fullName: $fullName
    active: true
  ) {
    edges {
      node {
        id 
        status userprofile { specialty { academicYear level { level} mainSpecialty { specialtyName}} customuser { fullName matricle sex telephone}} printedAt
        printedAt
        printedBy { fullName}
      }
    }
  }
}
`;


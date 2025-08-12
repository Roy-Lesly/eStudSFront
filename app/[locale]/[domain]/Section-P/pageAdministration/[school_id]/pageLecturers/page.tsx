import { Metadata } from 'next'
import React from 'react'
import { removeEmptyFields } from '@/functions'
import { gql } from '@apollo/client'
import List from './List'
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL'

const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams?: any;
}) => {

  const p = await params;
  const sp = await searchParams;
  const paginationParams: Record<string, any> = {};

  paginationParams.fullName = sp?.fullName
  paginationParams.telephone = sp?.telephone
  paginationParams.sex = sp?.sex

  const t = removeEmptyFields(paginationParams)

  const dataAdmins = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA,
    variables: {
      ...t,
      role: "admin",
      schoolId: parseInt(p.school_id),
    },
  });

  const dataLects = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA,
    variables: {
      ...t,
      role: "teacher",
      schoolId: parseInt(p.school_id),
    },
  });

  return (
    <div>
      <List
        params={p}
        data={{ "admins": dataAdmins, "lects": dataLects }}
        searchParams={sp}
      />
    </div>
  )
}

export default page

export const metadata: Metadata = {
  title: "Teacher Management",
  description: "e-conneq School System. Assign Teacher Page",
};


const GET_DATA = gql`
 query GetAllData(
  $fullName: String,
  $telephone: String,
  $sex: String,
  $role: String!,
  $schoolId: Decimal!,
) {
  allDepartments {
    edges {
      node {
        id name
      }
    }
  }
  allCustomusers(
    isActive: true
    last: 250
    fullName: $fullName
    telephone: $telephone
    sex: $sex
    role: $role,
    isSuperuser: false
    schoolId: $schoolId
  ) {
    edges {
      node {
        id matricle firstName lastName fullName 
        username sex dob pob address telephone
        email lastLogin title nationality
        highestCertificate regionOfOrigin yearObtained 
      }
    }
  }
}
`;


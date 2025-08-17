import { Metadata } from 'next'
import React from 'react'
import { removeEmptyFields } from '@/functions'
import { gql } from '@apollo/client'
import List from './List'
import getApolloClient, { errorLog } from '@/utils/graphql/GetAppolloClient'
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

  paginationParams.fullName = sp?.fullName ? sp.fullName : ""
  paginationParams.telephone = sp?.telephone ? sp.telephone : ""
  paginationParams.sex = sp?.sex ? sp.sex : ""

  const t = removeEmptyFields(paginationParams);


  const dataAdmins = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA_ADMIN,
    variables: {
      ...t,
      schoolId: parseInt(p.school_id),
    },
  });

  const dataLects = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA_LECTURERS,
    variables: {
      ...t,
      schoolId: parseInt(p.school_id),
    },
  });

  return (
    <div>
      <List
        params={p}
        data={{ "admins": dataAdmins, "lects": dataLects }}
        sp={sp}
      />
    </div>
  )
}

export default page

export const metadata: Metadata = {
  title: "Lecturer",
  description: "e-conneq School System. Lecturer Page",
};


const GET_DATA_LECTURERS = gql`
 query GetAllData(
  $schoolId: Decimal!,
  $fullName: String,
  $telephone: String,
  $sex: String,
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
    schoolId: $schoolId
    last: 250
    fullName: $fullName
    telephone: $telephone
    sex: $sex
    role: "teacher",
    isSuperuser: false
  ) {
    edges {
      node {
        id firstName lastName fullName 
        username sex dob pob address telephone
        email lastLogin title nationality
        highestCertificate regionOfOrigin yearObtained 
      }
    }
  }
}
`;
const GET_DATA_ADMIN = gql`
 query GetAllData(
  $schoolId: Decimal!,
  $fullName: String,
  $telephone: String,
  $sex: String,
) {
  allCustomusers(
    isActive: true
    schoolId: $schoolId
    last: 250
    fullName: $fullName
    telephone: $telephone
    sex: $sex
    role: "admin",
    isSuperuser: false
  ) {
    edges {
      node {
        id firstName lastName fullName 
        username sex dob pob address telephone
        email lastLogin title 
        nationality highestCertificate regionOfOrigin yearObtained 
      }
    }
  }
}
`;


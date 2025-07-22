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

  paginationParams.fullName = sp?.fullName ? sp.fullName : ""
  paginationParams.telephone = sp?.telephone ? sp.telephone : ""
  paginationParams.sex = sp?.sex ? sp.sex : ""
  paginationParams.isActive = sp?.fullName ? "" : true

  const removed = removeEmptyFields(paginationParams)
 
   const dataAdmins = await queryServerGraphQL({
      domain: p.domain,
      query: GET_DATA_ADMIN,
      variables: {
        ...removed,
        schoolId: parseInt(p.school_id),
      },
    });


   const dataLects = await queryServerGraphQL({
      domain: p.domain,
      query: GET_DATA_LECTURERS,
      variables: {
        ...removed,
        schoolId: parseInt(p.school_id),
      },
    });


   const dataStuds = await queryServerGraphQL({
      domain: p.domain,
      query: GET_DATA_STUDENTS,
      variables: {
        ...removed,
        orRole: ["admin", "teacher"],
        schoolId: parseInt(p.school_id),
      },
    });

  return (
    <div>
      <List params={p} data={ {"admins": dataAdmins, studs: dataStuds, lects: dataLects} } searchParams={sp} />
    </div>
  )
}

export default page

export const metadata: Metadata = {
  title: "Users",
  description: "This is Users Page",
};


const GET_DATA_STUDENTS = gql`
 query GetAllData(
  $schoolId: Decimal!,
  $fullName: String,
  $telephone: String,
  $sex: String,
  $isActive: Boolean,
) {
  allCustomUsers(
    isActive: $isActive
    schoolId: $schoolId
    last: 150
    fullName: $fullName
    telephone: $telephone
    sex: $sex
    role: "student"
  ) {
    edges {
      node {
        id fullName matricle sex dob pob address telephone email lastLogin isActive
      }
    }
  }
}
`;

const GET_DATA_LECTURERS = gql`
 query GetAllData(
  $schoolId: Decimal!,
  $fullName: String,
  $telephone: String,
  $sex: String,
  $isActive: Boolean,
) {
  allCustomUsers(
    schoolId: $schoolId
    last: 300
    fullName: $fullName
    telephone: $telephone
    sex: $sex
    role: "teacher"
    isActive: $isActive
  ) {
    edges {
      node {
        id matricle fullName username sex dob pob address telephone email lastLogin isActive
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
  $isActive: Boolean,
) {
  allCustomUsers(
    isActive: $isActive
    schoolId: $schoolId
    last: 100
    fullName: $fullName
    telephone: $telephone
    sex: $sex
    role: "admin"
    isStaff: false
  ) {
    edges {
      node {
        id matricle fullName username sex dob pob address telephone email lastLogin isActive
      }
    }
  }
}
`;

import { Metadata } from 'next'
import React from 'react'
import { decodeUrlID, getAcademicYear, removeEmptyFields } from '@/functions'
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

  const dataUsers = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA,
    variables: {
      academicYear: getAcademicYear(),
      id: parseInt(decodeUrlID(p.customuser_id)),
      schoolId: parseInt(p.school_id),
    },
  });

  return (
    <div>
      <List
        params={p}
        data={dataUsers}
        searchParams={sp}
      />
    </div>
  )
}

export default page

export const metadata: Metadata = {
  title: "Teacher Management",
  description: "e-conneq School System. Teacher Page",
};


const GET_DATA = gql`
 query GetAllData(
  $id: Decimal!,
  $schoolId: Decimal!,
  $academicYear: String!,
) {
  allClassroomsPrim (
    academicYear: $academicYear
  ) {
    edges {
      node {
        id level academicYear
      }
    }
  }
  allCustomusers(
    id: $id,
    schoolId: $schoolId
  ) {
    edges {
      node {
        id matricle firstName lastName fullName 
        username sex dob pob address telephone
        email title
        classroomprim { id level academicYear }
      }
    }
  }
}
`;


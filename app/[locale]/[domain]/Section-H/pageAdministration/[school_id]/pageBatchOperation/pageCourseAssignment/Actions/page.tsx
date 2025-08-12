import { Metadata } from 'next'
import React from 'react'
import { gql } from '@apollo/client'
import List from './List'
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL'


export const revalidate = 60;

const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params;
  const { domain } = await params;
  const sp = await searchParams;


  const dataMainCourses = await queryServerGraphQL({
    domain,
    query: GET_DATA_MAINCOURSES,
    variables: { courseName: sp?.courseName || "" },
  });

  const dataSpecialty = await queryServerGraphQL({
    domain,
    query: GET_SPECIALTY,
    variables: { id: sp?.specialty_id || "" },
  });

  const dataAdmins = await queryServerGraphQL({
    domain,
    query: GET_DATA_CUSTOMUSER,
    variables: {
      schoolId: parseInt(p.school_id),
      role: "admin"
    },
  });

  const dataLects = await queryServerGraphQL({
    domain,
    query: GET_DATA_CUSTOMUSER,
    variables: {
      schoolId: parseInt(p.school_id),
      role: "teacher"
    },
  });


  return (
    <List
      params={p}
      searchParams={sp}
      apiMainCourses={dataMainCourses?.allMainCourses?.edges}
      apiSpecialty={dataSpecialty?.allSpecialties?.edges[0]}
      apiAdmins={dataAdmins?.allCustomusers?.edges}
      apiLects={dataLects?.allCustomusers?.edges}
    />

  )
}

export default page;

export const metadata: Metadata = {
  title:
    "Course Assignment",
};

const GET_SPECIALTY = gql`
 query GetAllData (
  $id: ID!
 ) {
  allSpecialties (
    id: $id
    last: 2
  ) {
    edges {
      node {
        id academicYear 
        level { level }
        mainSpecialty { specialtyName }
      }
    }
  }
}
`;


const GET_DATA_MAINCOURSES = gql`
 query GetAllData (
  $courseName: String
 ) {
  allMainCourses (
    courseName: $courseName
  ) {
    edges {
      node {
        id courseName
      }
    }
  }
}
`;

const GET_DATA_CUSTOMUSER = gql`
 query GetAllData(
  $schoolId: Decimal!,
  $role: String!,
) {
  allCustomusers(
    schoolId: $schoolId
    role: $role,
    isActive: true,
    isStaff: false
  ) {
    edges {
      node {
        id fullName username sex dob pob address telephone email lastLogin
      }
    }
  }
}
`;

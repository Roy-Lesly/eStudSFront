import { Metadata } from 'next'
import React from 'react'
import getApolloClient, { getData, removeEmptyFields } from '@/functions'
import { gql } from '@apollo/client'
import List from './List'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const paginationParams: Record<string, any> = {};

  paginationParams.fullName = searchParams?.fullName ? searchParams.fullName : ""
  paginationParams.telephone = searchParams?.telephone ? searchParams.telephone : ""
  paginationParams.sex = searchParams?.sex ? searchParams.sex : ""

  const t = removeEmptyFields(paginationParams)
  const client = getApolloClient(params.domain);
  let dataAdmins;
  let dataLects;
  let dataStuds;

  try {
    const result = await client.query<any>({
      query: GET_DATA_ADMIN,
      variables: {
        ...t,
        schoolId: parseInt(params.school_id),
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    dataAdmins = result.data;
  } catch (error: any) {
    
    dataAdmins = null;
  }


  try {
    const result = await client.query<any>({
      query: GET_DATA_STUDENTS,
      variables: {
        ...t,
        orRole: ["admin", "teacher"],
        schoolId: parseInt(params.school_id),
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    dataStuds = result.data;
  } catch (error: any) {
    
    dataStuds = null;
  }


  try {
    const result = await client.query<any>({
      query: GET_DATA_LECTURERS,
      variables: {
        ...t,
        schoolId: parseInt(params.school_id),
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    dataLects = result.data;
  } catch (error: any) {
    console.log(error, 81)
    
    dataLects = null;
  }


  return (
    <div>
      <List params={params} data={ {"admins": dataAdmins, studs: dataStuds, lects: dataLects} } searchParams={searchParams} />
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
  $sex: UserControlCustomUserSexChoices,
) {
  allCustomUsers(
    isActive: true
    schoolId: $schoolId
    last: 150
    fullName: $fullName
    telephone: $telephone
    sex: $sex
    role: "student"
  ) {
    edges {
      node {
        id fullName matricle sex dob pob address telephone email lastLogin
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
  $sex: UserControlCustomUserSexChoices,
) {
  allCustomUsers(
    isActive: true
    schoolId: $schoolId
    last: 300
    fullName: $fullName
    telephone: $telephone
    sex: $sex
    role: "teacher"
  ) {
    edges {
      node {
        id matricle fullName username sex dob pob address telephone email lastLogin
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
  $sex: UserControlCustomUserSexChoices,
) {
  allCustomUsers(
    isActive: true
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
        id matricle fullName username sex dob pob address telephone email lastLogin
      }
    }
  }
}
`;

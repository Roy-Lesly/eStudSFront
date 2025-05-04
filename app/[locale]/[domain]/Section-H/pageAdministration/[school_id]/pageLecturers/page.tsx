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

  // GET ADMINS
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


  // GET LECTURERS
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
    console.log(error)
    
    dataLects = null;
  }

  console.log("Lecturers => View")


  return (
    <div>
      <List params={params} data={ {"admins": dataAdmins, lects: dataLects} } searchParams={searchParams} />
    </div>
  )
}

export default page

export const metadata: Metadata = {
  title: "Lecturer",
  description: "This is Lecturer Page",
};


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
    last: 250
    fullName: $fullName
    telephone: $telephone
    sex: $sex
    role: "teacher",
    isSuperuser: false
  ) {
    edges {
      node {
        id firstName lastName fullName username sex dob pob address telephone email lastLogin title 
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
    last: 250
    fullName: $fullName
    telephone: $telephone
    sex: $sex
    role: "admin",
    isSuperuser: false
  ) {
    edges {
      node {
        id firstName lastName fullName username sex dob pob address telephone email lastLogin title 
      }
    }
  }
}
`;


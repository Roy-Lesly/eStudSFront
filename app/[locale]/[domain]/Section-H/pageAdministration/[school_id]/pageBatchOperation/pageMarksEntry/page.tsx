import { Metadata } from 'next'
import React from 'react'
import getApolloClient, { getData, removeEmptyFields } from '@/functions'
import MyButtonCustom from '@/section-h/common/MyButtonCustom'
import MyPagination from '@/section-h/common/Pagination/MyPagination'
import { AcademicYearUrl } from '@/Domain/Utils-H/appControl/appConfig'
import { redirect } from 'next/navigation'
import { GetCustomUserInter } from '@/Domain/Utils-H/userControl/userInter'
import { RiSearch2Fill } from 'react-icons/ri'
import { protocol } from '@/config'
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

  const t = removeEmptyFields(paginationParams)
  const client = getApolloClient(params.domain);
  let data;
  let dataAdmin;


  try {
    const result = await client.query<any>({
      query: GET_DATA,
      variables: {
        ...t,
        orRole: ["admin", "teacher"],
        schoolId: parseInt(params.school_id),
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    data = result.data;
  } catch (error: any) {
    console.log(error, 32)
    if (error.networkError && error.networkError.result) {
      console.error('GraphQL Error Details:', error.networkError.result.errors);
    }
    data = null;
  }
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
    dataAdmin = result.data;
  } catch (error: any) {
    console.log(error, 32)
    if (error.networkError && error.networkError.result) {
      console.error('GraphQL Error Details:', error.networkError.result.errors);
    }
    dataAdmin = null;
  }

  return (
    <div>
      <List params={params} data={data} dataAdmin={dataAdmin} searchParams={searchParams} />
    </div>
  )
}

export default page

export const metadata: Metadata = {
  title: "Marks Entry ",
  description: "This is Marks Entry  Page",
};


const GET_DATA = gql`
 query GetAllData(
  $schoolId: Decimal!,
  $fullName: String,
  $telephone: String,
) {
  allCustomUsers(
    role: "teacher"
    isActive: true
    schoolId: $schoolId
    last: 100
    fullName: $fullName
    telephone: $telephone
    isStaff: false
  ) {
    edges {
      node {
        id 
        fullName
        username
        sex
        dob
        pob
        address
        telephone
      }
    }
  }
}
`;

const GET_DATA_ADMIN = gql`
 query GetAllData(
  $schoolId: Decimal!,
  $fullName: String,
  $telephone: String
) {
  allCustomUsers(
    role: "admin"
    isActive: true
    schoolId: $schoolId
    last: 100
    fullName: $fullName
    telephone: $telephone
    isStaff: false
  ) {
    edges {
      node {
        id 
        fullName
        username
        sex
        dob
        pob
        address
        telephone
      }
    }
  }
}
`;

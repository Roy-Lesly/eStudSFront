import { Metadata } from 'next'
import React from 'react'
import { gql } from '@apollo/client'
import List from './List'
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL'
import { removeEmptyFields } from '@/utils/functions'

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

  const paginationParams: Record<string, any> = {};

  paginationParams.fullName = sp?.fullName ? sp.fullName : ""
  paginationParams.telephone = sp?.telephone ? sp.telephone : ""

  const data = await queryServerGraphQL({
    domain,
    query: GET_DATA,
    variables: {
      ...removeEmptyFields(paginationParams),
      // orRole: ["admin", "teacher"],
      role: "teacher",
      schoolId: parseInt(p.school_id),
    },
  });


  console.log(data);


  return (
    <div>
      <List params={p} data={data} searchParams={sp} />
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
        role
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

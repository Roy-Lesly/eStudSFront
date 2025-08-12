import { Metadata } from 'next'
import React from 'react'
import { gql } from '@apollo/client'
// import List from './List'
import { removeEmptyFields } from '@/utils/functions'
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL'
import List from './List'


export const revalidate = 60;

const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams?: any;
}) => {

  const p = await params;
  const sp = await searchParams;
  const { domain } = await params;

  const paginationParams: Record<string, any> = {};

  paginationParams.fullName = sp?.fullName
  paginationParams.sex = sp?.sex


  const data = await queryServerGraphQL({
    domain,
    query: GET_DATA,
    variables: {
      ...removeEmptyFields(paginationParams),
    },
  });

  return (
    <div>
      <List
        p={p}
        data={data?.allComplainsPrim?.edges}
        apiYears={data?.allAcademicYearsPrim}
        sp={sp}
      />
    </div>
  )
}

export default page



export const metadata: Metadata = {
  title: "Complains",
  description: "e-conneq School System. Complains Page",
};




const GET_DATA = gql`
 query GetData {
  allAcademicYearsPrim
  allComplainsPrim {
    edges {
      node {
        id message complainType status endingAt
      }
    }
  }
}
`;


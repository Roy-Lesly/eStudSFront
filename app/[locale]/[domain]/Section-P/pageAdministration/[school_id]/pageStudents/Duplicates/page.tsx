import { Metadata } from 'next'
import React from 'react'
import { gql } from '@apollo/client'
import List from './List';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';


const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params;
  const sp = await searchParams;

 const data = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA
  });

  return (
    <div>
      <List params={p} data={data?.allCustomUserDuplicates?.edges} searchParams={sp} />
    </div>
  )
}

export default page

export const metadata: Metadata = {
  title: "Users",
  description: "This is Users Page",
};


const GET_DATA = gql`
 query GetAllData {
  allCustomUserDuplicates {
    edges {
      node {
        id fullName matricle sex dob pob address telephone createdAt
      }
    }
  }
}
`;

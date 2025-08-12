import { Metadata } from 'next'
import React from 'react'
import { gql } from '@apollo/client'
import getApolloClient, { errorLog } from '@/utils/graphql/GetAppolloClient';
;
import List from './List';


const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params;
  const sp = await searchParams;

  const client = getApolloClient(p.domain);
  let data;

  try {
    const result = await client.query<any>({
      query: GET_DATA,
      variables: {
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    data = result.data;
  } catch (error: any) {
    errorLog(error)
    data = null;
  }

  return (
    <div>
      <List params={p} data={data?.allCustomUserDuplicates?.edges} searchParams={sp} />
    </div>
  )
}

export default page

export const metadata: Metadata = {
  title: "Users",
  description: "e-conneq School System. Users Page",
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

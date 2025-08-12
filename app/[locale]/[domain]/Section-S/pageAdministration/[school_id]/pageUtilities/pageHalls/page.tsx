import { Metadata } from 'next'
import React from 'react'
import { gql } from '@apollo/client'
import List from './List'
import getApolloClient, { errorLog } from '@/utils/graphql/GetAppolloClient';


const GET_DATA = gql`
  query GetAllData(
      $schoolId: Decimal!
    ) {
      allHalls( 
        schoolId: $schoolId
      ) {
        edges {
          node {
            id
            name
            capacity
            school { id campus}
          }
        }
      }
    }`;

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
        schoolId: p.school_id,
      },
      fetchPolicy: 'no-cache'
    });

    data = result.data;
  } catch (error: any) {
    errorLog(error);
    data = null;
  }

  return (
    <List data={data?.allHalls?.edges} searchParams={sp} params={p} />
  )
}

export default page

export const metadata: Metadata = {
  title: "Halls-Settings",
  description: "e-conneq School System. Halls-Settings Page",
};


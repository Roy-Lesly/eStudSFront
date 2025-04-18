import { Metadata } from 'next'
import React from 'react'
import getApolloClient from '@/functions'
import { gql } from '@apollo/client'
import List from './List'


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
  params: { school_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const client = getApolloClient(params.domain);
  let data;
  try {
    const result = await client.query<any>({
      query: GET_DATA,
      variables: {
        schoolId: params.school_id,
      },
      fetchPolicy: 'no-cache'
    });

    data = result.data;
  } catch (error: any) {
    console.log(error)
    data = null;
  }

  return (
    <List data={data?.allHalls?.edges} searchParams={searchParams} params={params} />
  )
}

export default page

export const metadata: Metadata = {
  title: "Halls-Settings",
  description: "This is Halls-Settings Page",
};


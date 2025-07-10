import React from 'react';
import Display from './Display';
import { gql } from '@apollo/client';
import getApolloClient from '@/utils/graphql/GetAppolloClient';

const page = async ({
  params,
}: {
  params: any;
  searchParams?: any;
}) => {
  const p = await params;

  const client = getApolloClient(p.domain);
  let data = null;

  try {
    const result = await client.query<any>({
      query: GET_DATA,
      variables: {
        timestamp: new Date().getTime(),
      },
      fetchPolicy: "no-cache",
    });
    data = result.data;
  } catch (error: any) {
    console.error(error);
  }

  return (
    <Display
      p={p}
      school={data?.allSchoolInfos?.edges[0]}
    />
  );
}

export default page;

const GET_DATA = gql`
  query GetAllData {
    allSchoolInfos {
      edges {
        node {
          id
          campus
          town
          schoolIdentification { name logo }
        }
      }
    }
  }
`;


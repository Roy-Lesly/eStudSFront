import React from 'react'
import Form from './Form'
import { gql } from '@apollo/client'
import getApolloClient from '@/functions'
import { AllMainSubject } from '@/Domain/schemas/interfaceGraphqlSecondary'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Admission Page",
  description: "This is Admission Page Admin Settings",
};

const page = async ({
  params,
  searchParams,
}: {
  params: any,
  searchParams?: any
}) => {

  const paginationParams: Record<string, any> = {};

  paginationParams.fullName = searchParams?.fullName ? searchParams.fullName : ""
  paginationParams.telephone = searchParams?.telephone ? searchParams.telephone : ""
  const client = getApolloClient(params.domain);
  let data;
  try {
    const result = await client.query<AllMainSubject>({
      query: GET_DATA,
      variables: {
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    data = result.data;
  } catch (error: any) {
    if (error.networkError && error.networkError.result) {
      console.error('GraphQL Error Details:', error.networkError.result.errors);
    }
    data = null;
  }

  return (
    <div>
      <Form params={params} searchParams={searchParams} data={data} />
    </div>
  )
}

export default page


const GET_DATA = gql`
 query GetAllData {
  allDepartments(
    last: 10
  ) {
    edges {
      node {
        id name
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      endCursor
    }
  }
}
`;


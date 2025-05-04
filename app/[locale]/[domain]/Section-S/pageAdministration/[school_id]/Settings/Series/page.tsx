import React from 'react'
import List from './List'
import { gql } from '@apollo/client'
import getApolloClient from '@/functions'
import { AllMainSubject } from '@/Domain/schemas/interfaceGraphqlSecondary'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Series Page",
  description: "This is Series Page Admin Settings",
};
const page = async ({
  params,
  searchParams,
}: {
  params: any,
  searchParams?: any
}) => {

  const paginationParams: Record<string, any> = {};

  paginationParams.name = searchParams?.name ? searchParams.name : ""
  const client = getApolloClient(params.domain);
  let data;
  try {
    const result = await client.query<AllMainSubject>({
      query: GET_DATA,
      variables: {
        ...paginationParams,
        schoolId: params.school_id,
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    data = result.data;
  } catch (error: any) {
    console.log(error, 37)
    
    data = null;
  }


  return (
    <div>
      <List params={params} data={data} />
    </div>
  )
}

export default page


const GET_DATA = gql`
 query GetAllData(
  $name: String,
) {
  allSeries(
    name: $name
    first: 100
  ) {
    edges {
      node {
        id name subjects {  edges { node { id subjectName }}}
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      endCursor
    }
  }
  allMainSubjects(
    first: 100
  ) {
    edges {
      node {
        id subjectName
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


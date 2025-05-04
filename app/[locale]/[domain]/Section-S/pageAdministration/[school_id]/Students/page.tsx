import React from 'react'
import List from './List'
import { gql } from '@apollo/client'
import getApolloClient from '@/functions'
import { AllMainSubject } from '@/Domain/schemas/interfaceGraphqlSecondary'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Students Page",
  description: "This is Students Page Admin Settings",
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
        ...paginationParams,
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    data = result.data;
  } catch (error: any) {

    
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
  $fullName: String,
  $telephone: String,
) {
  allUserprofileSec(
  fullName: $fullName
  telephone: $telephone
  last: 100
  ) {
    edges {
      node {
        id user { matricle fullName sex telephone address email dob pob } classroom { stream academicYear level { level }}
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


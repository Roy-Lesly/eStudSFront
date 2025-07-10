import React from 'react'
// import List from './List'
import { gql } from '@apollo/client'
import getApolloClient, { errorLog } from '@/functions'
import { Metadata } from 'next';
import List from './List';

export const metadata: Metadata = {
  title: "My-Courses Page",
  description: "This is My-Courses Page Admin Settings",
};
const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params

  const client = getApolloClient(p.domain);
  let data;
  try {
    const result = await client.query<any>({
      query: GET_DATA,
      variables: {
        id: p.lecturer_id,
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
      <List params={p} data={data} />
    </div>
  )
}

export default page

const GET_DATA = gql`
  query GetAllData(
    $id: Decimal!
  ) {
  allCustomUsers(
      id: $id
      last: 1
    ) {
      edges {
        node {
          id
          fullName
          firstName
          lastName
          matricle
          role
          sex
          dob
          pob
          address
          telephone
          email
          nationality
          regionOfOrigin
          highestCertificate
          yearObtained
        }
      }
    }
  }
`;


import React from 'react'
// import List from './List'
import { gql } from '@apollo/client'
import { Metadata } from 'next';
import List from './List';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';

export const metadata: Metadata = {
  title: "My-Courses Page",
  description: "e-conneq School System. My-Courses Page Admin Settings",
};
const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params

  const data = await queryServerGraphQL({
    domain: p?.domain,
    query: GET_DATA,
    variables: {
      id: p.lecturer_id,
    },
  });

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
  allCustomusers(
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
          infoData
        }
      }
    }
  }
`;


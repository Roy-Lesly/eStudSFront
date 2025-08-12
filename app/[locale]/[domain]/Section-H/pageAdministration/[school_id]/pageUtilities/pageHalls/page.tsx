import { Metadata } from 'next'
import React from 'react'
import { gql } from '@apollo/client'
import List from './List'
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL'


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

  const data = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA,
    variables: {
      schoolId: parseInt(p.school_id),
    },
  });

  return (
    <List data={data?.allHalls?.edges} searchParams={sp} params={p} />
  )
}

export default page

export const metadata: Metadata = {
  title: "Halls-Settings",
  description: "e-conneq School System. Halls-Settings Page",
};


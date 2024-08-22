import React from 'react'
import List from './List'
import { removeEmptyFields } from '@/utils/functions';
import { gql } from '@apollo/client';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';
import { Metadata } from 'next';

const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams?: any;
}) => {

  const p = await params
  const sp = await searchParams

  const paginationParams: Record<string, any> = {};

  paginationParams.level = sp?.level

  const data = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA,
    variables: {
      ...removeEmptyFields(paginationParams),
      schoolId: p.school_id

    },
  });
  

  return (
    <List
      p={p}
      sp={sp}
      data={data?.allSeries?.edges}
      apiLevel={data?.getLevelsSec}
    />
  )
}

export default page




export const metadata: Metadata = {
  title:
    "Series-Settings",
  description: "e-conneq School System. Series-Settings Page",
};



const GET_DATA = gql`
 query GetData (
  $level: String
 ) {
    getLevelsSec
    allSeries(
      last: 100,
      level: $level
    ) {
      edges {
        node {
          id name level subjectList 
          mainsubjects {
            edges { node { id subjectName subjectCode }}
          }
        }
      }
    }
  }`
;

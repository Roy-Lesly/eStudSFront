import React from 'react'
import List from './List'
import { removeEmptyFields } from '@/utils/functions';
import { gql } from '@apollo/client';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';

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

  console.log(data);


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




const GET_DATA = gql`
 query GetData (
  $level: String
 ) {
    getLevelsSec
    allSeries(
      last: 100,
      classroom: $level
    ) {
      edges {
        node {
          id name classroom subjectList 
          mainsubjects { edges { node { id subjectName}}}
        }
      }
    }
  }`
;

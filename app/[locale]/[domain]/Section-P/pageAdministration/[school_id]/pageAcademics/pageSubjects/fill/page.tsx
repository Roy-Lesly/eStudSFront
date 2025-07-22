import { Metadata } from 'next';
import React from 'react'
import { gql } from '@apollo/client';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';
import List from './List';


const EditPage = async ({
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
    variables: { ids: JSON.parse(sp?.ids) }
  });

  return (
    <div>
      {/* <pre>
        {JSON.stringify(data?.allMainSubjectPrim?.edges, null, 2)}
      </pre> */}
      <List
        params={p}
        data={data?.allMainSubjectPrim?.edges}
        sp={sp}
      />

    </div>
  )
}

export default EditPage



export const metadata: Metadata = {
  title:
    "Subjects-Management",
  description: "This is Subjects-Management Page",
};


const GET_DATA = gql`
 query GetData(
    $ids: [ID!]
  ) {
  allMainSubjectPrim(
    ids: $ids
  ) {
    edges {
      node {
        id
        subjectName
      }
    }
  }
}
`;

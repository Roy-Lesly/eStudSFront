import { Metadata } from 'next';
import React from 'react'
import { gql } from '@apollo/client';
import SelectDept from '../SelectDept';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';

const EditPage = async ({
  params,
}: {
  params: any;
}) => {

  const p = await params

  const data = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA
  });

  return (
    <div>
      <SelectDept params={p} data={data} page="Lecturer" />
    </div>
  )
}

export default EditPage



export const metadata: Metadata = {
  title:
    "Select",
  description: "e-conneq School System. Select Page",
};


const GET_DATA = gql`
 query {
    allSchoolInfos {
      edges {
      node {
        id campus schoolName town schoolType
      }
    }
  }
}`
  ;
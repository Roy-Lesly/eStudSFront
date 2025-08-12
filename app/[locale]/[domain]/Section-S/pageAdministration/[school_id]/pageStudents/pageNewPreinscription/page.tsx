import { Metadata } from 'next';
import React from 'react'
import { decodeUrlID } from '@/functions';
import { gql } from '@apollo/client';
import List from './List';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';



export const metadata: Metadata = {
  title: "Registration Page",
  description: "e-conneq School System. Registration Page Admin Settings",
};


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
    domain: p?.domain,
    query: GET_DATA,
    variables: {
      schoolId: parseInt(p.school_id),
    },
  });

  return (
    <div>
      <List
        params={p}
        data={data}
        searchParams={sp}
      />
    </div>
  )
}

export default page



const GET_DATA = gql`
 query GetData {
    getProgramsSec
    allAcademicYearsSec
    getLevelsSec
    allSchoolInfos {
      edges {
        node {
          id campus address town
        }
      }
    }
    allSeries {
      edges {
        node {
          id classroom name
        }
      }
    }
  }
`;
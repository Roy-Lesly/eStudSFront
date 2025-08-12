import { Metadata } from 'next'
import React from 'react'
import { gql } from '@apollo/client'
import List from './List'
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL'

export const revalidate = 60;

const page = async ({
  params,
  searchParams
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params;
  const { domain } = await params;
  const sp = await searchParams;

  const data = await queryServerGraphQL({
    domain,
    query: GET_DATA,
    variables: {
        orRole: ["admin", "teacher"],
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

export default page;

export const metadata: Metadata = {
  title:
    "Import Subjects",
};


const GET_DATA = gql`
 query GetAllData {
 allAcademicYearsSec
  getLevels
}
`;

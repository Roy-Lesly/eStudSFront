import { Metadata } from 'next';
import React from 'react'
import { gql } from '@apollo/client';
import SelectDept from '../SelectDept';
import getApolloClient, { errorLog } from '@/utils/graphql/GetAppolloClient';

const EditPage = async ({
  params,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params;

  const client = getApolloClient(p.domain);
  let data;
  try {
    const result = await client.query<any>({
      query: GET_DATA,
      variables: {
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    data = result.data;
  } catch (error: any) {
    data = null; errorLog(error);

  }

  return (
    <div>
      <SelectDept params={p} data={data} page="Administration" />
    </div>
  )
}

export default EditPage



export const metadata: Metadata = {
  title: "Select",
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
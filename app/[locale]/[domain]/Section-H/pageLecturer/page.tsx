import { Metadata } from 'next';
import React from 'react'
import getApolloClient, { errorLog } from '@/functions';
import { gql } from '@apollo/client';
import SelectDept from '../SelectDept';

const EditPage = async ({
  params,
}: {
  params: any;
}) => {

  const p = await params

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
      errorLog(error)
      
    }

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
  description: "This is Select Page",
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
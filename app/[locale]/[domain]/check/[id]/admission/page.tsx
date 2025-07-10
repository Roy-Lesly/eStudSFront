import React from 'react';
import StudentProfile from './StudentProfile';
import { gql } from '@apollo/client';
import getApolloClient, { errorLog } from '@/utils/graphql/GetAppolloClient';

const page = async (
  { params }:
  { params: any }
) => {

  const p = await params;
  ;

  const client = getApolloClient(p.domain);
    let data;
    try {
      const result = await client.query<any>({
        query: GET_DATA,
        variables: {
          id: p?.id,
          role: "STUDENT",
          timestamp: new Date().getTime()
        },
        fetchPolicy: 'no-cache'
      });
      data = result.data;
    } catch (error: any) {
      errorLog(error);
      data = null;
    }

  return (
    <StudentProfile
      data={data?.allUserProfiles?.edges[0].node}
      p={p}
    />
  );
}

export default page;




const GET_DATA = gql`
 query GetUserProfiles(
  $id: ID!
) {
  allUserProfiles(
    id: $id
  ) {
    edges {
      node {
        id session
        customuser {
          id photo fullName, matricle sex telephone dob pob email address parent parentTelephone 
          nationality highestCertificate yearObtained regionOfOrigin
        }
        specialty { 
          academicYear, 
          level { level } 
          school { campus } 
          mainSpecialty { specialtyName } 
        }
        program { name }
        
      }
    }
  }
}
`;


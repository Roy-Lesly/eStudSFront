import React from 'react';
import StudentProfile from './StudentProfile';
import { gql } from '@apollo/client';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';

const page = async (
  { params }:
    { params: any }
) => {

  const p = await params;
  const data = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA,
    variables: {
      id: parseInt(p?.id)
    },
  });

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
          id photo fullName, matricle sex telephone dob pob email address
          fatherName motherName fatherTelephone motherTelephone parentAddress 
          nationality highestCertificate yearObtained regionOfOrigin
        }
        specialty { 
          academicYear, 
          level { level } 
          school { 
            id campus schoolName town region email colors address telephone website logoCampus
          } 
          mainSpecialty { specialtyName } 
        }
        program { name }
        infoData
      }
    }
  }
}
`;


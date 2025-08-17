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

  console.log(data);

  return (
    <StudentProfile
      data={data?.allUserprofilesSec?.edges[0].node}
      p={p}
    />
  );
}

export default page;




const GET_DATA = gql`
 query GetUserProfiles(
  $id: ID!
) {
  allUserprofilesSec (
    id: $id
  ) {
    edges {
      node {
        id session
        customuser {
          id photo fullName, matricle sex telephone dob pob email address
          fatherName motherName fatherTelephone motherTelephone parentAddress 
          nationality
        }
        classroomsec { 
          academicYear level classType
          school { 
            id campus schoolName town region email colors address telephone website logoCampus
          }
        }
        programsec
        infoData
      }
    }
  }
}
`;


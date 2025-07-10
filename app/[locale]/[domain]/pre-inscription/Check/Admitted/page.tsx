import React from 'react'
import { Metadata } from 'next';
import { gql } from '@apollo/client';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';
import AdmissionForm from './AdmissionForm';

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
      domain: p.domain,
      query: GET_DATA,
      variables: {
        telephone: sp?.telephone,
      },
    });

  return (
    <AdmissionForm
      p={p}
      data={data?.allUserProfiles?.edges[0]}
    />
  )
}

export default page


export const metadata: Metadata = {
  title: "Admission Form Page",
  description: "Admission Form Page",
};



const GET_DATA = gql`
 query GetData(
  $telephone: String,
  $fullName: String,
) {
    allUserProfiles (
      telephone: $telephone,
      fullName: $fullName
    ) {
        edges {
          node {
            id 
            customuser {
              id fullName address telephone sex dob pob matricle
              email nationality regionOfOrigin highestCertificate
              fatherName fatherTelephone motherName motherTelephone parentAddress
            }
            specialty {
              level { level }
              mainSpecialty { specialtyName }
              school { schoolName campus logoCampus }
              academicYear
            }
          }
        }
      }
  }`;

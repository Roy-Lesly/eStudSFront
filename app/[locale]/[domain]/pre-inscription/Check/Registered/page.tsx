import React from 'react'
import { Metadata } from 'next';
import { gql } from '@apollo/client';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';
import PreInscriptionForm from './PreInscriptionForm';


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
      // academicYear: getAcademicYear(),
    },
  });

  return (
    <PreInscriptionForm
      p={p}
      data={data?.allPreinscriptions?.edges[0]}
      dataMainSpecialties={data?.allMainSpecialties?.edges}
      dataSchool={data?.allSchoolInfos?.edges}
    />
  )
}

export default page


export const metadata: Metadata = {
  title: "Pre-Enrolment Form Page",
  description: "Pre-Enrolment Form Page",
};



const GET_DATA = gql`
 query GetData(
  $telephone: String,
  $fullName: String,
) {
    allPreinscriptions (
      telephone: $telephone,
      fullName: $fullName
    ) {
        edges {
          node {
            id registrationNumber fullName sex dob pob address telephone email
            nationality highestCertificate regionOfOrigin yearObtained specialtyOne specialtyTwo
            academicYear level fatherName motherName fatherTelephone motherTelephone parentAddress
            campus { id campus }
          }
        }
      }
    allMainSpecialties {
      edges {
        node {
          id specialtyName
        }
      }
    }
    allSchoolInfos {
      edges {
        node {
          id campus schoolName logoCampus
        }
      }
    }
  }`;

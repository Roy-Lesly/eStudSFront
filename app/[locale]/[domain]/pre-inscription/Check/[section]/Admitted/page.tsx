import React from 'react'
import { Metadata } from 'next';
import { gql } from '@apollo/client';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';
import AdmissionFormHigher from './AdmissionFormHigher';
import AdmissionFormSecondary from './AdmissionFormSecondary';
import AdmissionFormPrimary from './AdmissionFormPrimary';

const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params;
  const { domain, section } = await params;
  const sp = await searchParams;
  console.log(section);

  const data = await queryServerGraphQL({
    domain,
    query: section === "higher" ? GET_DATA_HIGHER : section === "secondary" ? GET_DATA_SECONDARY : section === "primary" ? GET_DATA_PRIMARY : GET_DATA_VOCATIONAL,
    variables: {
      telephone: sp?.telephone,
    },
  });

  // const dataSecondary = await queryServerGraphQL({
  //   domain,
  //   query: GET_DATA_SECONDARY,
  //   variables: {
  //     telephone: sp?.telephone,
  //   },
  // });

  // const dataPrimary = await queryServerGraphQL({
  //   domain,
  //   query: GET_DATA_PRIMARY,
  //   variables: {
  //     telephone: sp?.telephone,
  //   },
  // });

  // const dataVocational = await queryServerGraphQL({
  //   domain,
  //   query: GET_DATA_VOCATIONAL,
  //   variables: {
  //     telephone: sp?.telephone,
  //   },
  // });

  return (
    <>
      {section === "higher" ? <AdmissionFormHigher p={p} data={data?.allUserProfiles?.edges[0]} /> : null}
      {section === "secondary" ? <AdmissionFormSecondary p={p} data={data?.allUserProfilesSec?.edges[0]} /> : null}
      {section === "primary" ? <AdmissionFormPrimary p={p} data={data?.allUserProfiles?.edges[0]} /> : null}
      {section === "vocational" ? <AdmissionFormHigher p={p} data={data?.allUserProfiles?.edges[0]} /> : null}
    </>
  )
}

export default page


export const metadata: Metadata = {
  title: "Admission Form Page",
  description: "Admission Form Page",
};



const GET_DATA_HIGHER = gql`
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


const GET_DATA_SECONDARY = gql`
 query GetData(
  $telephone: String,
  $fullName: String,
) {
    allUserProfilesSec (
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


const GET_DATA_PRIMARY = gql`
 query GetData(
  $telephone: String,
  $fullName: String,
) {
    allUserProfilesPrim (
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


const GET_DATA_VOCATIONAL = gql`
 query GetData(
  $telephone: String,
  $fullName: String,
) {
    allUserProfilesSec (
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

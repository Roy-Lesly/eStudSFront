import React from 'react'
import { Metadata } from 'next';
import { gql } from '@apollo/client';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';
import PreInscriptionFormHigher from './PreInscriptionFormHigher';
import PreInscriptionFormPrimary from './PreInscriptionFormPrimary';
import PreInscriptionFormSecondary from './PreInscriptionFormSecondary';


const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params;
  const { section, domain } = await params;
  const sp = await searchParams;

  const data = await queryServerGraphQL({
    domain,
    query: GET_DATA,
  });
  const dataHigher = await queryServerGraphQL({
    domain,
    query: GET_DATA_HIGHER,
    variables: {
      telephone: sp?.telephone
    },
  });
  const dataSecondary = await queryServerGraphQL({
    domain,
    query: GET_DATA_SECONDARY,
    variables: {
      telephone: sp?.telephone
    },
  });
  const dataPrimary = await queryServerGraphQL({
    domain,
    query: GET_DATA_PRIMARY,
    variables: {
      telephone: sp?.telephone
    },
  });

  return (
    <>
    
    {section === "higher" ? <PreInscriptionFormHigher
      p={p}
      data={dataHigher?.allPreinscriptions?.edges[0]}
      dataMainSpecialties={data?.allMainSpecialties?.edges}
      dataSchool={data?.allSchoolInfos?.edges}
    /> : null}
    
    {section === "secondary" ? <PreInscriptionFormSecondary
      p={p}
      data={dataSecondary?.allPreinscriptionsSec?.edges[0]}
      dataMainSpecialties={data?.allMainSpecialties?.edges}
      dataSchool={data?.allSchoolInfos?.edges}
    /> : null}
    
    {section === "primary" ? <PreInscriptionFormPrimary
      p={p}
      data={dataPrimary?.allPreinscriptionsPrim?.edges[0]}
      dataMainSpecialties={data?.allMainSpecialties?.edges}
      dataSchool={data?.allSchoolInfos?.edges}
    /> : null}
    
    {section === "vocational" ? <PreInscriptionFormHigher
      p={p}
      data={data?.allPreinscriptions?.edges[0]}
      dataMainSpecialties={data?.allMainSpecialties?.edges}
      dataSchool={data?.allSchoolInfos?.edges}
    /> : null}
    
    </>
  )
}

export default page


export const metadata: Metadata = {
  title: "Pre-Enrolment Form Page",
  description: "Pre-Enrolment Form Page",
};



const GET_DATA_HIGHER = gql`
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
            nationality highestCertificate regionOfOrigin yearObtained
            academicYear level fatherName motherName fatherTelephone motherTelephone parentAddress
            campus { id campus }
            specialtyOne { id specialtyName }
            specialtyTwo { id specialtyName }
          }
        }
      }
  }`;

const GET_DATA_SECONDARY = gql`
 query GetData(
  $telephone: String,
  $fullName: String,
) {
    allPreinscriptionSec (
      telephone: $telephone,
      fullName: $fullName
    ) {
        edges {
          node {
            id registrationNumber fullName sex dob pob address telephone email
            nationality highestCertificate regionOfOrigin yearObtained
            academicYear level fatherName motherName fatherTelephone motherTelephone parentAddress
            campus { id campus }
            specialtyOne { id specialtyName }
            specialtyTwo { id specialtyName }
          }
        }
      }
  }`;
const GET_DATA_PRIMARY = gql`
 query GetData(
  $telephone: String,
  $fullName: String,
) {
    allPreinscriptionPrim (
      telephone: $telephone,
      fullName: $fullName
    ) {
        edges {
          node {
            id registrationNumber fullName sex dob pob address telephone email
            nationality highestCertificate regionOfOrigin yearObtained
            academicYear level fatherName motherName fatherTelephone motherTelephone parentAddress
            campus { id campus }
          }
        }
      }
  }`;


const GET_DATA = gql`
 query GetData {
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

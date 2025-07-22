import React from 'react'
import { Metadata } from 'next';
import NotificationError from '@/section-h/common/NotificationError';
import { gql } from '@apollo/client';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';
import CheckFormHigher from './CheckFormHigher';
import CheckFormSecondary from './CheckFormSecondary';
import CheckFormPrimary from './CheckFormPrimary';

const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams?: any;
}) => {

  const p = await params;
  const { domain, section } = await params;
  const sp = await searchParams;

  const data = await queryServerGraphQL({
    domain,
    query: section === "higher" ? GET_DATA_HIGHER : section === "secondary" ? GET_DATA_SECONDARY : section === "primary" ? GET_DATA_PRIMARY : GET_DATA_VOCATIONAL,
    variables: {
      telephone: sp?.telephone,
      schoolType: "-" + section[0],
    },
  });

  return (
    <>
      {sp && <NotificationError errorMessage={sp} />}

      <div className="flex flex-col gap-4 h-screen md:p-4 p-2 text-slate-900">

        <div className='flex flex-col gap-2 w-full'>
          {section === "higher" ? <CheckFormHigher p={p} sp={sp} data={data?.allPreinscriptions?.edges} />: null}
          {section === "secondary" ? <CheckFormSecondary p={p} sp={sp} data={data?.allPreinscriptionsSec?.edges} />: null}
          {section === "primary" ? <CheckFormPrimary p={p} sp={sp} data={data?.allPreinscriptionsPrim?.edges} />: null}
          {section === "vocational" ? <CheckFormPrimary p={p} sp={sp} data={data?.allPreinscriptionsPrim?.edges} />: null}
        </div>

      </div>

    </>
  )
}

export default page


export const metadata: Metadata = {
  title: "New Pre-Inscription Page",
  description: "New Pre-Inscription Page",
};


const GET_DATA_HIGHER = gql`
 query GetData(
  $fullName: String,
  $telephone: String,
) {
    allPreinscriptions (
      fullName: $fullName,
      telephone: $telephone
    ) {
        edges {
          node {
            id fullName sex dob pob telephone registrationNumber status admissionStatus
            campus { id campus }
          }
        }
      }
  }`;

const GET_DATA_SECONDARY = gql`
 query GetData(
  $fullName: String,
  $telephone: String,
) {
    allPreinscriptionsSec (
      fullName: $fullName,
      telephone: $telephone
    ) {
        edges {
          node {
            id fullName sex dob pob telephone registrationNumber status admissionStatus
            campus { id campus }
          }
        }
      }
  }`;

const GET_DATA_PRIMARY = gql`
 query GetData(
  $fullName: String,
  $telephone: String,
) {
    allPreinscriptionsPrim (
      fullName: $fullName,
      telephone: $telephone
    ) {
        edges {
          node {
            id fullName sex dob pob telephone registrationNumber status admissionStatus
            campus { id campus }
          }
        }
      }
  }`;

const GET_DATA_VOCATIONAL = gql`
 query GetData(
  $fullName: String,
  $telephone: String,
) {
    allPreinscriptionsVoc (
      fullName: $fullName,
      telephone: $telephone
    ) {
        edges {
          node {
            id fullName sex dob pob telephone registrationNumber status admissionStatus
            campus { id campus }
          }
        }
      }
  }`;

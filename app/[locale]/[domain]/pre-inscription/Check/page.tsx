import React from 'react'
import { Metadata } from 'next';
import NotificationError from '@/section-h/common/NotificationError';
import CheckForm from './CheckForm';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';
import { getAcademicYear } from '@/utils/functions';
import { gql } from '@apollo/client';


const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params;
  const sp = await searchParams;

  const { domain } = await params;


  const data = await queryServerGraphQL({
    domain,
    query: GET_DATA,
    variables: {
      fullName: sp?.fullName,
      telephone: sp?.telephone || "No Telephone Number"
    },
  });

  return (
    <>
      <div className='flex flex-col items-center justify-center w-full'>
        <CheckForm
          p={p}
          sp={sp}
          data={data?.allPreinscriptions?.edges}
        />
      </div>
    </>
  )
}

export default page

export const metadata: Metadata = {
  title: "Pre-Inscription Status Page",
  description: "Pre-Inscription Status Page",
};




const GET_DATA = gql`
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

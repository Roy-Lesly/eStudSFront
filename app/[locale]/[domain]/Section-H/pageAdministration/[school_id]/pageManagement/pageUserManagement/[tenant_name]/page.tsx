import React from 'react'
import { Metadata } from 'next';
import { gql } from '@apollo/client';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';
import CampusList from '@/app/[locale]/[domain]/SectionAll/CampusList';

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
  });


  return (
    <CampusList
      section={"H"}
      params={p}
      searchParams={sp}
      data={data}
    />
  )
}

export default page


export const metadata: Metadata = {
  title: "Management - Users",
  description: "e-conneq School System. User Manangement Page Settings",
};


const GET_DATA = gql`
 query GetAllData {
  allLoginGenerals {
    edges {
      node {
         id date countHour totalLogins
      }
    }
  }
  allLoginUsers (
    last: 200
  ) {
    edges {
      node {
        customuser { id fullName}
        countHour totalLogins
        loginGeneral { id date countHour totalLogins}
      }
    }
  }
    allDepartments { edges { node { id name}}}
    allPages { edges { node { id name}}}
    allSchoolInfos { edges { node { id schoolName}}}
}
`;

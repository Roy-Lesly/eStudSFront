import { Metadata } from 'next'
import React from 'react'
import getApolloClient, { errorLog } from '@/utils/graphql/GetAppolloClient';

import { gql } from '@apollo/client'
import List from './List'

const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams?: any
}) => {

  const p = await params;
  const sp = await searchParams;

  const client = getApolloClient(p.domain);
  const thisYear = new Date().getFullYear();
  let apiAcademicYears;
  let apiPublishData;
  try {
    const result = await client.query<any>({
      query: GET_ACADEMIC_YEARS,
      variables: {
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    apiAcademicYears = result.data;
    const resultPub = await client.query<any>({
      query: GET_PUBLISH,
      variables: {
        academicYear: sp?.academicYear ? sp?.academicYear : (apiAcademicYears && apiAcademicYears?.length) ? apiAcademicYears?.allAcademicYears[0] : thisYear.toString(),
        schoolId: parseInt(p?.school_id),
        level: sp?.level ? sp?.level : null,
        specialtyName: sp?.specialtyName ? sp?.specialtyName : null,
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    apiPublishData = resultPub.data;
  } catch (error: any) {
    errorLog(error);
    apiAcademicYears = null;
    apiPublishData = null;
  }

  return (
    <div>
      <List
        sp={sp}
        p={p}
        apiYears={apiAcademicYears?.allAcademicYears}
        apiDataPublish={apiPublishData?.allPublishes?.edges}
      />
    </div>

  )
}

export default page

export const metadata: Metadata = {
  title:
    "Portal-Results",
  description: "e-conneq School System. Portal Page",
};

const GET_ACADEMIC_YEARS = gql`
  query GetAcadYears{
    allAcademicYears
  }
`;

const GET_PUBLISH = gql`
  query (
    $academicYear: String!
    $schoolId: Decimal!
    $level: Decimal
    $specialtyName: String
  ) {
  allPublishes (
    academicYear: $academicYear
    schoolId: $schoolId
    level: $level
    specialtyName: $specialtyName
  ) {
    edges {
      node {
        id semester ca exam resit portalCa portalExam portalResit
        specialty { id academicYear level { level} mainSpecialty { specialtyName}}
      }
    }
  }
}
`;
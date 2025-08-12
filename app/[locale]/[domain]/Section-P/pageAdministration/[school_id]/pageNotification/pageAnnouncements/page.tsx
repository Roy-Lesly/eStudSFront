import { Metadata } from 'next'
import React from 'react'
import { gql } from '@apollo/client'
// import List from './List'
import { getAcademicYear, removeEmptyFields } from '@/utils/functions'
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL'
import List from './List'
import { AcademicYearUrl } from '@/utils/Domain/Utils-H/appControl/appConfig'


export const revalidate = 60;

const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams?: any;
}) => {

  const p = await params;
  const sp = await searchParams;
  const { domain } = await params;

  const paginationParams: Record<string, any> = {};

  paginationParams.fullName = sp?.fullName
  paginationParams.sex = sp?.sex

  const data = await queryServerGraphQL({
    domain,
    query: GET_DATA,
    variables: {
      ...removeEmptyFields(paginationParams),
      academicYear: getAcademicYear()
    },
  });

  return (
    <div>
      {/* <List
        p={p}
        data={data?.allNotificationsPrim?.edges}
        apiYears={data?.allAcademicYearsPrim}
        sp={sp}
      /> */}
    </div>
  )
}

export default page



export const metadata: Metadata = {
  title: "Announcements",
  description: "e-conneq School System. Announcements Page",
};




const GET_DATA = gql`
  query GetData (
    $academicYear: String!
  ) {
    allAcademicYearsPrim
    allClassroomsPrim (
      academicYear: $academicYear
    ) {
      edges {
        node {
          id level academicYear
        }
      }
    }
    allNotificationsPrim {
      edges {
        node {
          id message subject recipients academicYear
          notificationType scheduledFor
        }
      }
    }
  }
`;


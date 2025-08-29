import { Metadata } from 'next'
import React from 'react'
import { gql } from '@apollo/client'
// import List from './List'
import { getAcademicYear, removeEmptyFields } from '@/utils/functions'
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL'
import List from './List'


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

  console.log(data);

  return (
    <div>
      <List
        p={p}
        data={data?.allNotifications?.edges}
        apiYears={data?.allAcademicYears}
        apiTarget={data?.getTargetNamesHig}
        apiLevels={data?.allLevels?.edges}
        sp={sp}
      />
    </div>
  )
}

export default page



export const metadata: Metadata = {
  title: "Announcements",
  description: "e-conneq School System. Announcements Page",
};




const GET_DATA = gql`
  query GetData {
    allAcademicYears
    getTargetNamesHig
    allLevels { edges { node { id level}}}
    allNotifications {
      edges {
        node {
          id target message subject recipients academicYear
          notificationType scheduledFor sent
           specialties {
            edges {
              node {
                id academicYear
                mainSpecialty {
                  id
                  specialtyName
                }
              }
            }
          }
          levels {
            edges {
              node {
                id level
              }
            }
          }
        }
      }
    }
  }
`;


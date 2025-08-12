import { Metadata } from 'next'
import React from 'react'
import { gql } from '@apollo/client'
import List from './List'
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL'


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
      schoolId: parseInt(p.school_id),
    },
  });

  return (
    <div>
      <List
        params={p}
        data={data}
        searchParams={sp}
      />
    </div>
  )
}

export default page

export const metadata: Metadata = {
  title: "Activation-Settings",
  description: "e-conneq School System. Activation-Settings Page",
};



const GET_DATA = gql`
  query GetAllData(
      $schoolId: Decimal!
    ) {
      allSchoolFees(platformPaid: false, schoolId: $schoolId) {
        edges {
          node {
            id
            balance
            platformPaid
            idPaid
            userprofile {
              id
              session
              customuser { 
                id matricle firstName lastName fullName
              }
              specialty { 
                id
                academicYear
                mainSpecialty { specialtyName }
                level { level }
                tuition
                school { schoolIdentification { idCharges platformCharges }}
              }
              program { id name }
            }
          }
        }
      }
    }`;
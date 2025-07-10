import { Metadata } from 'next'
import React from 'react'
import getApolloClient from '@/functions'
import NotificationError from '@/section-h/common/NotificationError'
import { gql } from '@apollo/client'
import { EdgeSchoolFees } from '@/Domain/schemas/interfaceGraphql'
import ListPendingPlatformPage from '@/componentsTwo/ListUtility/ListPendingPlatformPage'
import List from './List'


interface GetDataResponse {
  allSchoolFees: {
    edges: EdgeSchoolFees[];
  };
}

const GET_DATA = gql`
  query GetAllData(
      $schoolId: Decimal!
    ) {
      allSchoolFees(idPaid: false, schoolId: $schoolId) {
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

const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params;
  const sp = await searchParams;

  const client = getApolloClient(p.domain);
  let data;
  try {
    const result = await client.query<GetDataResponse>({
      query: GET_DATA,
      variables: {
        schoolId: p.school_id,
      },
      fetchPolicy: 'no-cache'
    });

    data = result.data;
  } catch (error: any) {
    
    data = null;
  }

    return (
        <div>
            <List params={p} data={data} searchParams={sp} />
        </div>
    )
}

export default page

export const metadata: Metadata = {
  title: "Activation-Settings",
  description: "This is Activation-Settings Page",
};


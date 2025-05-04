import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import getApolloClient from '@/functions'
import NotificationError from '@/section-h/common/NotificationError'
import { gql } from '@apollo/client'
import { EdgeSchoolFees } from '@/Domain/schemas/interfaceGraphql'
import ListPendingPlatformPage from '@/componentsTwo/ListUtility/ListPendingPlatformPage'


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
              user { 
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
  params: { school_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const client = getApolloClient(params.domain);
  let data;
  try {
    const result = await client.query<GetDataResponse>({
      query: GET_DATA,
      variables: {
        schoolId: params.school_id,
      },
      fetchPolicy: 'no-cache'
    });

    data = result.data;
  } catch (error: any) {
    
    data = null;
  }

  return (
    <LayoutAdmin>
      <>

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {data ?
          data.allSchoolFees.edges.length > 0 ?
            <ListPendingPlatformPage params={params} data={data.allSchoolFees.edges} />
            :
            <div>No School Fees</div>
          :
          <div>Error or Network Issues</div>
        }

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title: "Activation-Settings",
  description: "This is Activation-Settings Page",
};


import { Metadata } from 'next'
import React from 'react'
import getApolloClient, { decodeUrlID } from '@/functions'
import { gql } from '@apollo/client'
import List from './List'


const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string, specialty_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const client = getApolloClient(params.domain);
  let data;
  try {
    const result = await client.query<any>({
      query: GET_DATA,
      variables: {
        schoolId: parseInt(params.school_id),
        specialtyId: parseInt(decodeUrlID(params.specialty_id))
      },
      fetchPolicy: 'no-cache'
    });
    data = result.data;
  } catch (error: any) {
    console.log(error)
    data = null;
  }

  return (
    <div>
      <List params={params} data={data?.allSchoolFees?.edges} searchParams={searchParams} />
      </div>
  )
}

export default page

export const metadata: Metadata = {
  title: "ID Card",
  description: "This is ID Card Page",
};


const GET_DATA = gql`
  query GetData(
    $schoolId: Decimal!,
    $specialtyId: Decimal!
  ) {
    allSchoolFees(
      schoolId: $schoolId, 
      specialtyId: $specialtyId
    ) {
      edges {
        node {
          platformPaid
          userprofile {
            code
            user {
              matricle
              fullName
              sex
              dob
              pob
              photo
            }
            specialty {
              academicYear
              level { level}
              school { schoolName schoolIdentification { logo}}
              mainSpecialty { 
                specialtyName
                field {
                  domain {
                    domainName
                  }
                }
              }
            }
          }
        }
    	}
    }
  }
`;
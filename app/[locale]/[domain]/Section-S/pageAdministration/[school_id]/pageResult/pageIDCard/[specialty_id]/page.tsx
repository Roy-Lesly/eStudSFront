import { Metadata } from 'next'
import React from 'react'
import { decodeUrlID } from '@/functions'
import { gql } from '@apollo/client'
import List from './List'
import getApolloClient, { errorLog } from '@/utils/graphql/GetAppolloClient'


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
    const result = await client.query<any>({
      query: GET_DATA,
      variables: {
        schoolId: parseInt(p.school_id),
        specialtyId: parseInt(decodeUrlID(p.specialty_id))
      },
      fetchPolicy: 'no-cache'
    });
    data = result.data;
  } catch (error: any) {
    errorLog(error);
    data = null;
  }

  return (
    <div>
      <List params={p} data={data?.allSchoolFees?.edges} searchParams={sp} />
    </div>
  )
}

export default page

export const metadata: Metadata = {
  title: "ID Card",
  description: "e-conneq School System. ID Card Page",
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
            customuser {
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
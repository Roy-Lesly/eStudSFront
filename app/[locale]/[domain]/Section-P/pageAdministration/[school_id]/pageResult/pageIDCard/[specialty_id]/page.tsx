import { Metadata } from 'next'
import React from 'react'
import { gql } from '@apollo/client'
import List from './List'
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL'
import { decodeUrlID } from '@/utils/functions'


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
    domain: p?.domain,
    query: GET_DATA,
    variables: {
      schoolId: parseInt(p.school_id),
      specialtyId: parseInt(decodeUrlID(p.specialty_id))
    },
  });

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
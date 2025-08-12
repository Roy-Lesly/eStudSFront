import React from 'react'
import List from './List'
import { gql } from '@apollo/client'
import { Metadata } from 'next';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';

export const metadata: Metadata = {
  title: "School Profile Page",
  description: "e-conneq School System. School Profile Page Admin Settings",
};

const page = async ({
  params,
  searchParams,
}: {
  params: any,
  searchParams?: any
}) => {

  const p = await params;
  const sp = await searchParams;

  const data = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA,
    variables: {
      id: p.school_id,
    },
  });

  console.log(data)

  return (
    <div>
      <List
        p={p}
        data={data?.allSchoolInfos?.edges[0]}
        s={sp} />
    </div>
  )
}

export default page



const GET_DATA = gql`
 query GetData(
    $id: ID!,
) {
    allSchoolInfos(
      id: $id, 
      last: 2,
    ) {
      edges {
        node {
          id
          campus schoolName schoolType shortName mainSchool
          country address region town
          email telephone seqLimit examLimit
          emailNotification
          smsNotification
          waNotification
          poBox niu website latitude longitude
          landingMessageMain
          logoCampus registrationSeperateTuition
          schoolfeesControl
          welcomeMessage
          radius
          schoolIdentification {
            id name logo code director platformCharges idCharges
            supportNumberOne supportNumberTwo status messageOne messageTwo
            hasHigher hasSecondary hasPrimary hasVocational frontEnd backEnd
          }
        }
      }
    }
  }
`;


import { Metadata } from 'next';
import React, { Suspense } from 'react'
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';
import { gql } from '@apollo/client';
import DisplayComplains from '../DisplayComplains';


export const metadata: Metadata = {
    title: "Complains Page",
    description: "Student Complains Page",
};

const page = async ({
    params,
    searchParams
}: {
    params: any;
    searchParams: any;
}) => {

    const p = await params
    const sp = await searchParams

    const dataComplains = await queryServerGraphQL({
        domain: p?.domain,
        query: GET_DATA,
        variables: {
            userprofileId: parseInt(p?.userprofile_id),
            userprofileId2: parseInt(p?.userprofile_id),
        },
    });

    console.log(dataComplains);

    return (
        <div>

            <Suspense fallback={<div>Loading ...</div>}>

                <DisplayComplains
                    p={p}
                    dataComplains={dataComplains?.allComplains?.edges}
                    apiComplainNames={dataComplains?.getComplainNames}
                    profile={dataComplains?.allUserProfiles?.edges[0]}
                    // sp={sp}
                />

            </Suspense>
        </div>
    )
}

export default page



const GET_DATA = gql`
 query GetData(
  $userprofileId: Decimal!
  $userprofileId2: ID!
 ) {
    getComplainNames
    allComplains(
      userprofileId: $userprofileId
      last: 20
    ){
      edges {
        node {
            id complainType deleted message status endingAt
            userprofile { 
                id
                customuser { fullName }
                specialty { 
                    mainSpecialty { specialtyName}
                    level { level}
                    school { id }
                }
            }
            deletedBy { id fullName }
            resolvedBy { id fullName }
        }
      }
    }
    allUserProfiles (
        id: $userprofileId2
    ) {
        edges {
            node {
                id
                specialty { school { id}}
            }
        }    
    }
  }
`;


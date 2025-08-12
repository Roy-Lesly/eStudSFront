import { Metadata } from 'next';
import React, { Suspense } from 'react'
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';
import { gql } from '@apollo/client';
import Display from './Display';


export const metadata: Metadata = {
    title: "System Report",
    description: "System Report",
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
    let data: any;

    const dataSchool = await queryServerGraphQL({
        domain: p?.domain,
        query: GET_SCHOOL,
    });

    console.log(!sp.update || sp?.update === "false");
    console.log(sp?.section,);

    if (!sp.update || sp?.update === "false") {
        data = await queryServerGraphQL({
            domain: p?.domain,
            query: GET_DATA,
            variables: {
                section: sp?.section,
            },
        });
    }
    if (sp?.update === "true" && sp?.section && sp?.run === "true") {
        data = await queryServerGraphQL({
            domain: p?.domain,
            query: GET_UPDATED_DATA,
            variables: {
                section: sp?.section,
            },
        })
        sp["run"] = false
    }

    return (
        <div>

            <Suspense fallback={<div>Loading ...</div>}>

                <div className='md:m-10 rounded-xl'>
                    <Display
                        p={p}
                        sp={sp}
                        data={data?.testReport || data?.runSystemTests}
                        schoolIdentification={dataSchool?.allSchoolIdentifications?.edges[0]}
                    />
                </div>

            </Suspense>
        </div>
    )
}

export default page



const GET_DATA = gql`
 query GetData(
  $section: String!
 ) {
    testReport(
      section: $section
    ){
        createdAt
        totalTests
        passed
        apps {
        total
            appName
            passed
            failed
            total
            results {
                name
                type
                status
                detail
            }
        }
    }
  }
`;


const GET_UPDATED_DATA = gql`
    query (
        $section: String!
    ) {
        runSystemTests ( section: $section )
    }
`;


const GET_SCHOOL = gql`
    query {
        allSchoolIdentifications (first: 1) {
            edges {
                node {
                    id hasHigher hasSecondary hasPrimary hasVocational
                }
            }
        }
    }
`;


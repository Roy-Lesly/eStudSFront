import { Metadata } from 'next'
import React from 'react'
import getApolloClient, { getData, removeEmptyFields } from '@/functions'
import { gql } from '@apollo/client'
import List from './List'

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
        console.log(searchParams)
        let q: any = {
            schoolId: parseInt(params.school_id),
            timestamp: new Date().getTime()
        }
        if (searchParams?.specialtyName) { q = { ...q, specialtyName: searchParams.specialtyName } }
        if (searchParams?.academicYear) { q = { ...q, academicYear: searchParams.academicYear } }
        if (searchParams?.level) { q = { ...q, level: searchParams.level } }

        const result = await client.query<any>({
            query: GET_SPECIALTIES,
            variables: q,
            fetchPolicy: 'no-cache'
        });
        data = result.data;
    } catch (error: any) {
        console.log(error, 81)
        if (error.networkError && error.networkError.result) {
            console.error('GraphQL Error Details:', error.networkError.result.errors);
        }
        data = null;
    }

    console.log(data, 42)

    return (
        <div>
            <List 
                params={params} 
                data={data?.allSpecialties?.edges}
            />
        </div>
    )
}

export default page

export const metadata: Metadata = {
    title: "TimeTable",
    description: "This is TimeTable Page",
};



const GET_SPECIALTIES = gql`
  query GetSpecialties (
    $schoolId: Decimal!,
    $specialtyName: String,
    $academicYear: String,
    $level: Decimal,
  ) {
    allSpecialties (
      schoolId: $schoolId,
      specialtyName: $specialtyName,
      academicYear: $academicYear,
      level: $level,
      last: 500
    ) {
      edges {
        node {
          id academicYear
          level { level} 
          mainSpecialty { specialtyName}
        }
      }
    }
  }
`;
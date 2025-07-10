import { Metadata } from 'next'
import React from 'react'
import getApolloClient, { errorLog, getData, removeEmptyFields } from '@/functions'
import { gql } from '@apollo/client'
import List from './List'

const page = async ({
    params,
    searchParams,
}: {
  params: any;
  searchParams?: any;
}) => {

  const p = await params;
  const sp = await searchParams;

    const client = getApolloClient(p.domain);
    let data;

    try {
        let q: any = {
            schoolId: parseInt(p.school_id),
            timestamp: new Date().getTime()
        }
        if (sp?.specialtyName) { q = { ...q, specialtyName: sp.specialtyName } }
        if (sp?.academicYear) { q = { ...q, academicYear: sp.academicYear } }
        if (sp?.level) { q = { ...q, level: sp.level } }

        const result = await client.query<any>({
            query: GET_SPECIALTIES,
            variables: q,
            fetchPolicy: 'no-cache'
        });
        data = result.data;
    } catch (error: any) {
        errorLog(error);
        if (error.networkError && error.networkError.result) {
            console.error('GraphQL Error Details:', error.networkError.result.errors);
        }
        data = null;
    }

    return (
        <div>
            <List 
                params={p} 
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
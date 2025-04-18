import React from 'react'
import List from './List'
import { gql } from '@apollo/client'
import getApolloClient from '@/functions'
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Transactions",
    description: "This is Transactions Admin Settings",
};

const page = async ({
    params,
    searchParams,
}: {
    params: any,
    searchParams?: any
}) => {

    const client = getApolloClient(params.domain);
    let data;
    try {
        let q: any = {
            schoolId: parseInt(params.school_id),
            timestamp: new Date().getTime()
        }
        if (searchParams?.fullName){ q = { ...q, fullName: searchParams?.fullName } } 
        if (searchParams?.specialtyName){ q = { ...q, specialtyName: searchParams?.specialtyName } } 
        if (searchParams?.level){ q = { ...q, level: parseInt(searchParams?.level) } } 
        if (searchParams?.academicYear){ q = { ...q, academicYear: searchParams?.academicYear } } 

        const result = await client.query<any>({
            query: GET_DATA,
            variables: q,
            fetchPolicy: 'no-cache'
        });
        data = result.data;
    } catch (error: any) {
        console.log(error)
        data = null;
    }

    return (
        <div>
            <List params={params} data={data} searchParams={searchParams} />
        </div>
    )
}

export default page


const GET_DATA = gql`
 query GetData(
    $schoolId: Decimal!
    $fullName: String
    $specialtyName: String
    $level: Decimal
    $academicYear: String
) {
    allTransactions(
        schoolId: $schoolId,
        fullName: $fullName,
        specialtyName: $specialtyName,
        level: $level,
        academicYear: $academicYear,
        first: 100
    ) {
        edges {
            node {
                id
                schoolfees { id 
                    userprofile {
                        user { id fullName matricle}
                        specialty { 
                            mainSpecialty { specialtyName}
                            level { level}
                            academicYear
                            school { campus}
                        }
                    }
                }
                amount
                createdAt
                paymentMethod
                reason
                ref
                status
                createdAt
                createdBy { fullName}
            }
        }
    }
}
`;


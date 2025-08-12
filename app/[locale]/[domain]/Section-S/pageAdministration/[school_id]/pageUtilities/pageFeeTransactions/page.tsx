import React from 'react'
import List from './List'
import { gql } from '@apollo/client'
import { Metadata } from 'next';
import getApolloClient, { errorLog } from '@/utils/graphql/GetAppolloClient';

export const metadata: Metadata = {
    title: "Transactions",
    description: "e-conneq School System. Transactions Admin Settings",
};

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
        let q: any = {
            schoolId: parseInt(p.school_id),
            timestamp: new Date().getTime()
        }
        if (sp?.fullName) { q = { ...q, fullName: sp?.fullName } }
        if (sp?.specialtyName) { q = { ...q, specialtyName: sp?.specialtyName } }
        if (sp?.level) { q = { ...q, level: parseInt(sp?.level) } }
        if (sp?.academicYear) { q = { ...q, academicYear: sp?.academicYear } }

        const result = await client.query<any>({
            query: GET_DATA,
            variables: q,
            fetchPolicy: 'no-cache'
        });
        data = result.data;
    } catch (error: any) {
        errorLog(error);
        data = null;
    }

    return (
        <div>
            <List params={p} data={data} searchParams={sp} />
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
                        customuser { id fullName matricle}
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


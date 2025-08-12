import React from 'react'
import List from './List'
import { gql } from '@apollo/client'
import { removeEmptyFields } from '@/functions'
import { Metadata } from 'next';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';

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

    const paginationParams: Record<string, any> = {};

    paginationParams.fullName = sp?.fullName
    paginationParams.academicYear = sp?.academicYear
    paginationParams.level = sp?.level
    paginationParams.specialtyName = sp?.specialtyName

    const data = await queryServerGraphQL({
        domain: p.domain,
        query: GET_DATA,
        variables: {
            ...removeEmptyFields(paginationParams),
            schoolId: parseInt(p.school_id)
        },
    });


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


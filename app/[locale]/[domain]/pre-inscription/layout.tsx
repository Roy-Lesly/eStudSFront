import React from 'react';
import getApolloClient from '@/functions';
import { gql } from '@apollo/client';
import PreInsNavBar from './PreInsNavBar';


const layout = async ({
    params,
    children
}:
    {
        params: any,
        children: React.ReactNode,
    }) => {


    const client = getApolloClient(params.domain);
    let data;

    try {
        const result = await client.query<any>({
            query: GET_DATA,
            variables: {
                timestamp: new Date().getTime()
            },
            fetchPolicy: 'no-cache'
        });
        data = result.data;
    } catch (error: any) {
        console.log(error)
        data = null;
    }


    return (
        <div className="flex flex-col gap-2 md:gap-4 h-screen md:p-4 p-2 text-slate-900">
            <PreInsNavBar params={params} page={1} info={data?.allSchoolInfos?.edges} />

            {children}

        </div>
    )
}

export default layout



const GET_DATA = gql`
 query GetAllData {
    allSchoolInfos  {
        edges {
            node {
                id campus town schoolIdentification { name }
            }
        }
    }
}
`;
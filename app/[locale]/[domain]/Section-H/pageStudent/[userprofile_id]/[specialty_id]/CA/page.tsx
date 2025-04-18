import { Metadata } from 'next';
import React, { Suspense } from 'react'
import NotificationError from '@/section-h/common/NotificationError';
import ResultDisplay from '../ResultDisplay';


export const metadata: Metadata = {
    title: "CA Page",
    description: "Student CA Page",
};

const page = async ({
    params,
    searchParams
}: {
    params: { locale: string, userprofile_id: string, domain: string, specialty_id: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) => {

    return (
        <div>
            {searchParams && <NotificationError errorMessage={searchParams} />}
            
            <Suspense fallback={<div>Loading ...</div>}>

                <ResultDisplay
                    params={params}
                    resultType='ca'
                    title='ca'
                />

            </Suspense>
        </div>
    )
}

export default page
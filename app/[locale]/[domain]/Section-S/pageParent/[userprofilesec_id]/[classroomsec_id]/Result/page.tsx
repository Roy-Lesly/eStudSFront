import { Metadata } from 'next';
import React, { Suspense } from 'react'
import NotificationError from '@/section-h/common/NotificationError';
import ResultDisplaySecondary from '@/app/[locale]/[domain]/SectionAll/ParentStudent/ResultDisplaySecondary';


export const metadata: Metadata = {
    title: "Result Page",
    description: "Student Result Page",
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

    return (
        <div>
            {sp && <NotificationError errorMessage={sp} />}

            <Suspense fallback={<div>Loading ...</div>}>

                <ResultDisplaySecondary
                    params={p}
                    resultType='all'
                    title='Final'
                />

            </Suspense>

        </div>
    )
}

export default page
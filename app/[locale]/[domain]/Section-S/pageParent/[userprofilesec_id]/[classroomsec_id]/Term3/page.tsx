import { Metadata } from 'next';
import React, { Suspense } from 'react'
import ResultDisplaySecondary from '@/app/[locale]/[domain]/SectionAll/ParentStudent/ResultDisplaySecondary';


export const metadata: Metadata = {
    title: "Term Page",
    description: "Student Term Page",
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
            <Suspense fallback={<div>Loading ...</div>}>

                <ResultDisplaySecondary
                    params={p}
                    resultType='Third'
                    title='Third Term'
                />

            </Suspense>
        </div>
    )
}

export default page
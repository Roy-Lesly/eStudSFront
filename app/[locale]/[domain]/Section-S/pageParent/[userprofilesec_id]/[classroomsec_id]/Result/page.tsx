import { Metadata } from 'next';
import React, { Suspense } from 'react'
import NotificationError from '@/section-h/common/NotificationError';
import ResultDisplay from '../ResultDisplay';


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

                <ResultDisplay
                    params={p}
                    resultType='result'
                    title='final'
                />

            </Suspense>

        </div>
    )
}

export default page
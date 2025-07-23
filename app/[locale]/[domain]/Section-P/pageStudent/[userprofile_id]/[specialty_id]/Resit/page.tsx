import { Metadata } from 'next';
import React, { Suspense } from 'react'
import NotificationError from '@/section-h/common/NotificationError';
import ResultDisplay from '../ResultDisplay';


export const metadata: Metadata = {
    title: "RESIT Page",
    description: "Student RESIT Page",
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

                {/* <ResultDisplay
                    params={p}
                    resultType='resit'
                    title='resit'
                /> */}

            </Suspense>

        </div>
    )
}

export default page
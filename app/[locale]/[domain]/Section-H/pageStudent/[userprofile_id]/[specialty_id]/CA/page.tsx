import { Metadata } from 'next';
import React, { Suspense } from 'react'
import ResultDisplay from '../ResultDisplay';


export const metadata: Metadata = {
    title: "CA Page",
    description: "Student CA Page",
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

                <ResultDisplay
                    params={p}
                    resultType='ca'
                    title='ca'
                />

            </Suspense>
        </div>
    )
}

export default page
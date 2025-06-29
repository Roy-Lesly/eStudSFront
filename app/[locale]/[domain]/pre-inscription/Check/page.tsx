import React from 'react'
import { Metadata } from 'next';
import NotificationError from '@/section-h/common/NotificationError';
import CheckForm from './CheckForm';


const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params;
    const sp = await searchParams;

  return (
    <>
      {sp && <NotificationError errorMessage={sp} />}
      
      <div className='flex flex-col items-center justify-center w-full'>
        <CheckForm params={p} />
      </div>
    </>
  )
}

export default page

export const metadata: Metadata = {
  title: "Pre-Inscription Status Page",
  description: "Pre-Inscription Status Page",
};

import React from 'react'
import PreInsNavBar from '../PreInsNavBar';
import { Metadata } from 'next';
import { getDataNotProtected } from '@/functions';
import { protocol } from '@/config';
import { GetSchoolIdentificationUrl } from '@/Domain/Utils-H/appControl/appConfig';
import { GetSchoolIdentificationInter } from '@/Domain/Utils-H/appControl/appInter';
import NotificationError from '@/section-h/common/NotificationError';
import CheckForm from './CheckForm';


const page = async ({
  params,
  searchParams,
}: {
  params: { locale: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  return (
    <>
      {searchParams && <NotificationError errorMessage={searchParams} />}
      
      <div className='flex flex-col items-center justify-center w-full'>
        <CheckForm params={params} />
      </div>
    </>
  )
}

export default page

export const metadata: Metadata = {
  title: "Pre-Inscription Status Page",
  description: "Pre-Inscription Status Page",
};

import React from 'react'
import { getDataNotProtected } from '@/functions';
import { protocol } from '@/config';
import { Metadata } from 'next';
import { GetSchoolIdentificationInter } from '@/Domain/Utils-H/appControl/appInter';
import { GetSchoolIdentificationUrl } from '@/Domain/Utils-H/appControl/appConfig';
import PreInscriptionForm from './PreInscriptionForm';
import NotificationError from '@/section-h/common/NotificationError';
import PreInsNavBar from '../../PreInsNavBar';
import { GetPreInscriptionInter } from '@/Domain/Utils-H/userControl/userInter';
import { OpenGetPreInscriptionUrl } from '@/Domain/Utils-H/userControl/userConfig';

const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params;
  const sp = await searchParams;


  const apiPreInscription: GetPreInscriptionInter[] | any = await getDataNotProtected(protocol + "api" + p.domain + OpenGetPreInscriptionUrl, { 
    nopage: true, name: p.domain, registration_number: p.registration_number 
  }, p.domain)

  return (
    <>
      {sp && <NotificationError errorMessage={sp} />}

        <div className='flex flex-col gap-2 w-full'>
          <h1 className='flex item-center justify-center'>PRE-INSCRIPTION</h1>

          {apiPreInscription && apiPreInscription.length && <PreInscriptionForm params={p} data={apiPreInscription[0]} />}

        </div>
    </>
  )
}

export default page


export const metadata: Metadata = {
  title: "New Pre-Inscription Page",
  description: "New Pre-Inscription Page",
};

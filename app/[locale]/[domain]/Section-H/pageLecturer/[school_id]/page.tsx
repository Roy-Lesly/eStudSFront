// 'use client';

import { Metadata } from 'next';
import React from 'react';
import Image from 'next/image';
import { gql } from '@apollo/client';
import { protocol, RootApi } from '@/config';
import initTranslations from '@/initTranslations';
import Continue from './Continue';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';


const page = async ({ params }: { params: any }) => {
  const p = await params;
  const { t } = await initTranslations(p.locale, ['common']);
  const { domain, school_id } = p;

  const data = await queryServerGraphQL({
    domain,
    query: GET_DATA,
    variables: { id: school_id },
  });

  const schoolInfo = data?.allSchoolInfos?.edges[0]?.node;

  return (
    <>
      {schoolInfo && (
        <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-sky-100 to-slate-100 px-6 py-12">
          <div className="w-full max-w-xl bg-white shadow-lg rounded-xl p-8 flex flex-col items-center gap-8 text-center">
            {/* School Logo */}
            <div className="relative w-32 h-32 md:w-48 md:h-48">
              <Image
                src={`${protocol}api${domain}${RootApi}/media/${schoolInfo.schoolIdentification?.logo}` || '/placeholder-logo.png'}
                alt={`${schoolInfo.schoolName} Logo`}
                fill
                className="object-contain rounded-full border-4 border-white shadow-md"
                priority
              />
            </div>

            {/* Welcome Message */}
            <div className="flex flex-col gap-4">
              <h1 className="text-xl md:text-3xl font-bold tracking-widest text-indigo-800">
                {t('Welcome').toUpperCase()}
              </h1>
              <h2 className="text-2xl md:text-4xl font-semibold text-gray-800 tracking-widest">
                {schoolInfo.schoolName || 'School Name'}
              </h2>
            </div>

            {/* Continue Button */}
            <div className="w-full flex justify-center">
              <Continue params={p} />
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export default page;


export const metadata: Metadata = {
  title: 'Lecturer Page | School Management',
  description: 'Access the administration page for your school management system.',
  keywords: 'school management, admin page, education system, dashboard',
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1.0',
};



const GET_DATA = gql`
  query GetData($id: ID!) {
    allSchoolInfos(id: $id) {
      edges {
        node {
          id
          campus
          address
          schoolName
          schoolIdentification {
            id
            logo
          }
        }
      }
    }
  }
`;

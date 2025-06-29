import { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { protocol, RootApi } from '@/config';
import { gql } from '@apollo/client';
import initTranslations from '@/initTranslations';
import getApolloClient, { errorLog } from '@/utils/graphql/GetAppolloClient';


const Page = async ({
  params
}: {
  params: any;
  searchParams: any;
}) => {

  const p = await params;
  // const sp = await searchParams;

  const { t } = await initTranslations(p.locale, ["common"])
  const { domain, school_id } = p;

  const client = getApolloClient(p.domain);
  let data;
  try {
    const result = await client.query<any>({
      query: GET_DATA,
      variables: {
        id: school_id,
        timestamp: new Date().getTime()
      },
      fetchPolicy: 'no-cache'
    });
    data = result.data;
  } catch (error: any) {
    errorLog(error);
    data = null;
  }


  return (
    <>
      {data && data?.allSchoolInfos?.edges.length === 1 && (
        <main className="flex flex-col gap-20 items-center justify-center min-h-screen px-10 tracking-widest">
          {/* School Logo */}
          <div>
            <Image
              width={200}
              height={200}
              src={`${protocol}api${domain}${RootApi}/media/` + data.allSchoolInfos?.edges[0].node.schoolIdentification?.logo || '/placeholder-logo.png'}
              alt={`${data.allSchoolInfos?.edges[0].node?.schoolName || 'School'} Logo`}
              className="hidden md:block rounded-full"
              priority
            />
            <Image
              width={130}
              height={130}
              src={`${protocol}api${domain}${RootApi}/media/` + data.allSchoolInfos?.edges[0].node.schoolIdentification?.logo || '/placeholder-logo.png'}
              alt={`${data.allSchoolInfos?.edges[0].node?.schoolName || 'School'} Logo`}
              className="block md:hidden rounded-full"
              priority
            />
          </div>

          {/* Welcome Message */}
          <div className="flex flex-col font-bold gap-10 items-center text-center">
            <h1 className="md:text-4xl text-2xl">{t("Welcome").toUpperCase()}</h1>
            <h2 className="md:text-4xl text-2xl">{data.allSchoolInfos?.edges[0].node?.schoolName || 'School Name'}</h2>
          </div>

          {/* Continue Button */}
          <Link
            href={`/${domain}/Section-H/pageAdministration/${school_id}/pageDashboard`}
            className="bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium hover:bg-blue-700 px-10 py-2 rounded-md text-white text-xl transition"
          >
            Continue
          </Link>
        </main>
      )}
    </>
  );
};

export default Page;

export const metadata: Metadata = {
  title: 'Admin Page | School Management',
  description: 'Access the administration page for your school management system.',
  keywords: 'school management, admin page, education system, dashboard',
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1.0',
};


const GET_DATA = gql`
  query GetData (
    $id: ID!
  ) {
    allSchoolInfos (
      id: $id
    ) {
      edges {
        node {
          id campus address schoolName schoolIdentification { id logo }
        }
      }
    }
  }`
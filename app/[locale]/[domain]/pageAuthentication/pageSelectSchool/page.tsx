'use client';

import { gql, useQuery } from '@apollo/client';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { LogOut, School, Building2, BookOpen, ShieldCheck, ArrowLeft } from 'lucide-react';
import Loader from '@/section-h/common/Loader';
import { decodeUrlID } from '@/functions';
import { JwtPayload } from '@/serverActions/interfaces';
import { useTranslation } from 'react-i18next';
import { EdgeSchoolHigherInfo } from '@/utils/Domain/schemas/interfaceGraphql';


const ICONS = {
  "SECTION-H": <Building2 className="w-6 h-6" />,
  "SECTION-S": <School className="w-6 h-6" />,
  "SECTION-V": <BookOpen className="w-6 h-6" />,
  "SECTION-P": <ShieldCheck className="w-6 h-6" />,
};

const COLORS = {
  "SECTION-H": 'bg-blue-900 hover:bg-blue-700',
  "SECTION-S": 'bg-teal-700 hover:bg-teal-500',
  "SECTION-V": 'bg-green-800 hover:bg-green-600',
  "SECTION-P": 'bg-purple-700 hover:bg-purple-600',
};

const LABELS = {
  "SECTION-H": 'Higher Section',
  "SECTION-S": 'Secondary Section',
  "SECTION-V": 'Vocational Section',
  "SECTION-P": 'Primary Section',
};

const SECTION_ORDER = ['SECTION-H', 'SECTION-S', 'SECTION-V', 'SECTION-P'];

const SelectDept = () => {
  const { t } = useTranslation();
  const domain = useParams().domain;
  const router = useRouter();
  const paramsRole = useSearchParams();
  const { data, loading, error } = useQuery(GET_DATA);

  const [user, setUser] = useState<JwtPayload | null>(null);
  const [dept, setDept] = useState<string>('');
  const [schools, setSchools] = useState<EdgeSchoolHigherInfo[]>([]);

  useEffect(() => {
    const access = localStorage.getItem('token');
    const role = paramsRole.get('role');

    if (!access || !role) {
      router.push(`/${domain}/pageAuthentication/Login`);
      return;
    }

    const department =
      role === 'admin' ? 'pageAdministration' :
        role === 'teacher' ? 'pageLecturer' :
          role === 'accounting' ? 'pageAccounting' : null;

    const decoded = jwtDecode(access) as JwtPayload;
    const userSchools = data?.allSchoolInfos?.edges?.filter((item: EdgeSchoolHigherInfo) =>
      decoded.school.includes(parseInt(decodeUrlID(item.node.id)))
    ) || [];

    setUser(decoded);
    setDept(department || '');
    setSchools(userSchools);
  }, [data, paramsRole, domain, router]);

  if (loading) return <Loader />;

  const groupedSchools = SECTION_ORDER.reduce((acc: Record<string, EdgeSchoolHigherInfo[]>, key) => {
    acc[key] = schools.filter((s) => s.node.schoolType.toUpperCase() === key);
    return acc;
  }, {} as Record<string, EdgeSchoolHigherInfo[]>);

  return (
    <section className="min-h-screen px-4 md:px-8 py-10 flex flex-col items-center bg-gray-50">
      {/* Header */}
      <div className="w-full max-w-4xl text-center mb-6 gap-2 font-bold">

        {error ? <p className="text-red flex flex-col">
          {t('error')}: {error?.message}
          <span>{t("Check Network Status")}</span>
        </p> : null}

        <Link href="/pageAuthentication/Logout" aria-label="Logout">
          <LogOut color='white' className="mx-auto border text-red-500 hover:text-red-700 w-12 h-12 my-3 rounded-full p-3 bg-red transition" />
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{t('Select Campus')}</h1>
        <p className="text-gray-500 text-sm mt-1">{t('Choose a campus to log into')}</p>
      </div>

      {/* Grouped Campuses */}
      <div className="w-full max-w-5xl bg-white space-y-10 p-4 rounded-lg shadow-lg">
        {SECTION_ORDER.map((section) => {
          const sectionData = groupedSchools[section];
          if (!sectionData || sectionData.length === 0) return null;

          return (
            <div key={section}>
              <h2 className="text-lg font-semibold text-gray-700 mb-3">
                {LABELS[section as keyof typeof LABELS]}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sectionData?.sort((a: EdgeSchoolHigherInfo, b: EdgeSchoolHigherInfo) => (a.node.campus > b.node.campus) ? 1 : (a.node.campus < b.node.campus) ? -1 : 0).map(({ node }) => (
                  <Link
                    key={node.id}
                    href={`/${domain}/${node.schoolType.replace('SECTION-', 'Section-')}/${dept}/${decodeUrlID(node.id)}?id=${user?.user_id}`}
                    onClick={() => localStorage.setItem('school', decodeUrlID(node.id))}
                    className={`w-full rounded-xl shadow-md text-white border p-4 transition-all flex items-center justify-center gap-4 ${COLORS[node.schoolType.toUpperCase() as keyof typeof COLORS]}`}
                  >
                    {ICONS[node.schoolType as keyof typeof ICONS]}
                    <div className="flex flex-col justify-center text-center w-[75%]">
                      <span className="font-semibold text-lg">{node.schoolName}</span>
                      <div className='flex gap-4 items-center justify-center text-sm'>
                        <span className="text-white/80">{node.town}</span>
                        <span className="text-white/70">{node.address}</span>
                      </div>
                      <span className="text-yellow-300 font-semibold mt-1">{node.campus.replace('_', '-')}</span>

                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <footer className="mt-12">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 bg-slate-700 hover:bg-gray-900 text-white text-sm px-5 py-2 rounded-md shadow-md transition"
        >
          <ArrowLeft className="w-6 h-6" />
          {t('back')}
        </button>
      </footer>
    </section>
  );
};

export default SelectDept;

const GET_DATA = gql`
  query GetAllData {
    allSchoolInfos {
      edges {
        node {
          id
          schoolName
          campus
          town
          address
          schoolType
        }
      }
    }
  }
`;

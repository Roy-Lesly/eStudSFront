'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { ArrowLeft, LogOut, Building2, School, BookOpen, ShieldCheck } from 'lucide-react';

import { decodeUrlID } from '@/functions';
import { JwtPayload } from '@/serverActions/interfaces';
import { EdgeSchoolHigherInfo } from '@/Domain/schemas/interfaceGraphql';

const SECTION_COLORS = {
  SECTION_H: 'bg-blue-800 hover:bg-blue-600',
  SECTION_S: 'bg-teal-700 hover:bg-teal-500',
  SECTION_V: 'bg-green-800 hover:bg-green-600',
  SECTION_P: 'bg-purple-700 hover:bg-purple-600',
};

const SECTION_ICONS = {
  SECTION_H: <Building2 className="w-6 h-6 mb-1" />,
  SECTION_S: <School className="w-6 h-6 mb-1" />,
  SECTION_V: <BookOpen className="w-6 h-6 mb-1" />,
  SECTION_P: <ShieldCheck className="w-6 h-6 mb-1" />,
};

const SECTION_LABELS = {
  SECTION_H: 'Higher Section',
  SECTION_S: 'Secondary Section',
  SECTION_V: 'Vocational Section',
  SECTION_P: 'Primary Section',
};

const SelectDept = ({
  params,
  data,
  page,
}: {
  params: any;
  data: any;
  page: 'Administration' | 'Lecturer' | 'Accounting';
}) => {
  const router = useRouter();
  const { t } = useTranslation('common');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const user: JwtPayload | null = token ? jwtDecode(token) : null;

  const schools: EdgeSchoolHigherInfo[] =
    data?.allSchoolInfos?.edges?.filter((item: EdgeSchoolHigherInfo) =>
      user?.school.includes(parseInt(decodeUrlID(item.node.id)))
    ) || [];

  const grouped = {
    SECTION_H: [] as EdgeSchoolHigherInfo[],
    SECTION_S: [] as EdgeSchoolHigherInfo[],
    SECTION_V: [] as EdgeSchoolHigherInfo[],
    SECTION_P: [] as EdgeSchoolHigherInfo[],
  };

  schools.forEach((school) => {
    grouped[school.node.schoolType as keyof typeof grouped].push(school);
  });

  return (
    <section className="min-h-screen bg-gray-50 px-4 md:px-8 py-10 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-3xl text-center mb-8">
        <Link href="/pageAuthentication/Logout" aria-label="Logout">
          <LogOut className="mx-auto text-red-500 hover:text-red-700 w-6 h-6 mb-2 transition" />
        </Link>
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800">{t("Select Your Campus")}</h1>
        <p className="text-gray-500">{t('Choose the campus you belong to')}</p>
      </div>

      {/* Campuses Layered by Section */}
      <div className="w-full max-w-4xl space-y-10">
        {Object.entries(grouped).map(([sectionKey, items]) =>
          items.length ? (
            <div key={sectionKey}>
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                {SECTION_LABELS[sectionKey as keyof typeof SECTION_LABELS]}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items
                  .sort((a, b) => a.node.campus.localeCompare(b.node.campus))
                  .map((item) => (
                    <Link
                      key={item.node.id}
                      href={`/${params.domain}/${
                        item.node.schoolType === 'SECTION_S'
                          ? 'Section-S'
                          : item.node.schoolType === 'SECTION_P'
                          ? 'Section-P'
                          : item.node.schoolType === 'SECTION_V'
                          ? 'Section-V'
                          : 'Section-H'
                      }/page${page}/${decodeUrlID(item.node.id)}/?id=${user?.user_id}`}
                      onClick={() => localStorage.setItem('school', decodeUrlID(item.node.id))}
                      className={`group rounded-xl shadow-md text-white p-5 transition-all flex items-start gap-3 ${SECTION_COLORS[item.node.schoolType as keyof typeof SECTION_COLORS]}`}
                    >
                      {SECTION_ICONS[item.node.schoolType as keyof typeof SECTION_ICONS]}
                      <div className="flex flex-col">
                        <span className="font-semibold text-lg leading-tight">
                          {item.node.schoolName}
                        </span>
                        <span className="text-sm text-white/80">{item.node.town}</span>
                        <span className="text-yellow-300 font-semibold mt-1">
                          {item.node.campus}
                        </span>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          ) : null
        )}
      </div>

      {/* Footer */}
      <footer className="mt-12">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-900 text-white text-sm px-5 py-2 rounded-md shadow-md transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </footer>
    </section>
  );
};

export default SelectDept;

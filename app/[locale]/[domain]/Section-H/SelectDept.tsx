'use client';

import { jwtDecode } from 'jwt-decode';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { FaPowerOff } from 'react-icons/fa';
import { JwtPayload } from '@/serverActions/interfaces';
import { EdgeSchoolHigherInfo } from '@/Domain/schemas/interfaceGraphql';
import { decodeUrlID } from '@/functions';

const SelectDept = ({ params, data, page }: { params: any; data: any, page: "Administration" | "Lecturer" | "Accounting" }) => {
  const router = useRouter();
  const token = localStorage.getItem('token');
  const user: JwtPayload | null = token ? jwtDecode(token) : null;

  const schools = data?.allSchoolInfos?.edges.filter((item: EdgeSchoolHigherInfo) =>
    user?.school.includes(parseInt(decodeUrlID(item.node.id)))
  );

  return (
    <section className="bg-gray-50 flex flex-col items-center justify-center md:px-8 min-h-screen px-4">
      {/* Header */}
      <header className="text-center w-full">
        <Link href="/pageAuthentication/Logout" aria-label="Logout">
          <FaPowerOff className="duration-300 hover:text-red-600 mb-4 mx-auto text-3xl text-red-500 transition-colors" />
        </Link>
        <h1 className="font-semibold md:text-4xl text-2xl text-gray-800">Select Campus</h1>
      </header>

      {/* Campus Selection */}
      <main className="gap-6 grid grid-cols-1 md:grid-cols-2 md:max-w-3xl mt-8">
        {user && schools ? (
          schools.sort((a: EdgeSchoolHigherInfo, b: EdgeSchoolHigherInfo) => a.node.campus > b.node.campus ? 1 : a.node.campus < b.node.campus ? -1 : 0).map((item: EdgeSchoolHigherInfo) => (
            <Link
              key={item.node.id}
              href={`/${params.domain}/${item.node.schoolType === 'SECTION_H'
                ? 'Section-H'
                : item.node.schoolType === 'SECTION_S'
                  ? 'Section-S'
                  : item.node.schoolType === 'SECTION_P'
                    ? 'Section-P'
                    : 'Section-V'
                }/page${page}/${decodeUrlID(item.node.id)}/?id=${user.user_id}`}
              className="group"
            >
              <div
                className={`${item.node.schoolType === 'SECTION_H'
                  ? 'bg-blue-800 group-hover:bg-blue-500'
                  : item.node.schoolType === 'SECTION_S'
                    ? 'bg-teal-700 group-hover:bg-teal-500'
                    : 'bg-green-800 group-hover:bg-green-500'
                  } transition-all duration-300 rounded-lg shadow-md flex flex-col items-center justify-center p-6 text-white font-semibold text-lg h-36`}
                onClick={() => localStorage.setItem('school', decodeUrlID(item.node.id))}
              >
                <span className="text-center text-lg">{item.node.schoolName}</span>
                <span className="text-slate-300">{item.node.town}</span>
                <span className="text-xl text-yellow-400">{item.node.campus}</span>
              </div>
            </Link>
          ))
        ) : (
          <p className="font-medium text-slate-500">No campuses available.</p>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-10">
        <button
          onClick={() => router.back()}
          className="bg-green-600 duration-300 font-medium hover:bg-green-700 px-6 py-2 rounded-lg shadow-md text-lg text-white transition-all"
        >
          Back
        </button>
      </footer>
    </section>
  );
};

export default SelectDept;

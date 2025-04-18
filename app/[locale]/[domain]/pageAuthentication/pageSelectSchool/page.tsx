'use client';

import { gql, useQuery } from '@apollo/client';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FaPowerOff } from 'react-icons/fa6';
import Loader from '@/section-h/common/Loader';
import { JwtPayload } from '@/serverActions/interfaces';
import { jwtDecode } from 'jwt-decode';
import { decodeUrlID } from '@/functions';
import { EdgeSchoolHigherInfo } from '@/Domain/schemas/interfaceGraphql';
import { useTranslation } from 'react-i18next';


const GET_DATA = gql`
  query GetAllData {
    allSchoolInfos {
      edges {
        node {
          id schoolName
          campus
          town schoolType
        }
      }
    }
  }
`;

const SelectDept = () => {
  const domain = useParams().domain;
  const router = useRouter();
  const paramsRole = useSearchParams();
  const { t } = useTranslation();
  
  const { data, loading, error } = useQuery(GET_DATA);

  const [user, setUser] = useState<JwtPayload | null>(null);
  const [dept, setDept] = useState<string>("");
  const [schools, setSchools] = useState<EdgeSchoolHigherInfo[]>()

  useEffect(() => {
    const initialize = async () => {
      const access = localStorage.getItem('session');

      if (!access || !paramsRole.get('role')) {
        router.push(`/${domain}/pageAuthentication/Login`);
        return;
      }

      const role = paramsRole.get('role');
      const department = role === 'admin' ? 'pageAdministration' : role === 'teacher' ? 'pageLecturer' : null;

      const token: JwtPayload = jwtDecode(access)
      if (department && token?.school?.length) {
        setSchools(data?.allSchoolInfos?.edges?.filter((item: EdgeSchoolHigherInfo) => token.school.includes(parseInt(decodeUrlID(item.node.id)))) )
        setDept(department);
      }

      setUser(token);
    };

    initialize();
  }, [data, domain, paramsRole, router]);


  // Handle Loading & Error States
  if (loading) return <Loader />;
  if (error) return <p className="text-red-500">{t("error")}: {error.message}</p>;

  return (
    <section className="flex flex-col gap-4 items-center justify-center md:px-8 min-h-screen px-4">
      {/* Header Section */}
      <header className="text-center w-full">
        <Link href="/pageAuthentication/Logout" aria-label="Logout">
          <FaPowerOff color="red" size={32} className="mb-4 mx-auto" />
        </Link>
        <h1 className="font-semibold md:text-4xl text-3xl">{t("SelectCampus")}</h1>
      </header>

      {/* Campus Selection */}
      <main className="gap-6 grid grid-cols-1 lg:grid-cols-2 mt-6 sm:grid-cols-2 w-full">
        {schools?.map(({ node }: any) => (
          <Link
            key={node.id}
            href={`/${domain}/${node.schoolType.toLowerCase()
              .split("_")
              .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
              .join("-")}/${dept}/${decodeUrlID(node.id)}?id=${user?.user_id}`}
            className="bg-blue-950 hover:bg-teal-500 hover:text-black transition-all duration-300 border-2 rounded-lg flex flex-col justify-center items-center text-center h-32 md:h-40 text-white font-bold p-4"
            onClick={() => localStorage.setItem('school', decodeUrlID(node.id))}
            aria-label={`Select ${node.campus.replace("_", "-")}`}
          >
            <span className="italic text-yellow-100 tracking-wide">{node.schoolName}</span>
            <span className="md:text-2xl py-2 text-lg">{node.campus.replace("_", "-")}</span>
            <span className="italic text-yellow-100">{node.town}</span>
          </Link>
        ))}
      </main>

      {/* Footer Section */}
      <footer className="mt-6">
        <button
          onClick={() => router.back()}
          className="bg-green-600 duration-300 font-medium hover:bg-green-700 px-6 py-2 rounded-lg text-lg text-white transition-all"
        >
          {t("back")}
        </button>
      </footer>
    </section>
  );
};

export default SelectDept;

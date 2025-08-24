'use client';

import {
  Users,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import CountCard from './CountCard';
import { useEffect, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { JwtPayload } from '@/utils/serverActions/interfaces';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';

const DashboardCount = (
  { data, p, apiYears, source, y }:
    { data: any, y: string, p: any, apiYears: string[], source: "Section-H" | "Section-S" | "Section-P" }
) => {

  const { t } = useTranslation("common");
  const router = useRouter();
  const token = localStorage.getItem("token");
  const user: JwtPayload | null = token ? jwtDecode(token) : null;
  const [refreshed, setRefreshed] = useState<boolean>(false)
  const [count, setCount] = useState(
    data?.node?.countUserCampus ? JSON.parse(data.node.countUserCampus) : null
  );

  const [refreshStatistics, { data: dataStatistics }] = useMutation(
    REFRESH_DATA
  );


  useEffect(() => {
    if (dataStatistics?.createUpdateDeleteStatistics?.statistics) {
      const newCount = JSON.parse(
        dataStatistics.createUpdateDeleteStatistics.statistics.countUserCampus
      );
      setCount(newCount);
    }
  }, [dataStatistics]);

  useEffect(() => {
    const sec = 10
    let diffInSeconds = sec + 1;
    if (data?.node?.updatedAt) {
      diffInSeconds = (Date.now() - new Date(data.node.updatedAt).getTime()) / 1000;
    };

    if (!refreshed && diffInSeconds > sec) {
      refreshStatistics({
        variables: {
          academicYear: y,
          schoolId: p.school_id,
        },
      });
    }
    setRefreshed(true)

  }, [y, data?.node?.updatedAt, refreshStatistics, p.school_id]);

  console.log(apiYears);
  console.log(y);

  return (
    <>
    
      {user?.is_superuser ? <div className='flex justify-between items-center'>
        <span className='font-semibold text-black'>{t("Academic Year")} Summary</span>
        <span className='font-semibold text-black'>{y}</span>
        <select
          className='px-4 py-2 rounded'
          // onChange={(e: any) => { setSelectedYear(e.target.value); setRefreshed(false);}}
          onChange={(e: any) => { 
            setRefreshed(false);
            router.push(`/${p.locale}/${p.domain}/${source}/pageAdministration/${p.school_id}/pageDashboard/?academicYear=${e.target.value}`)
          }}
        >
          {apiYears?.map((item: string) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div> : null}

      {count ? <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CountCard title="Staff" values={count.admin} icon={<Users />} />
        <CountCard title="Lecturers" values={count.lecturer} icon={<UserCheck />} />
        <CountCard title="Students" values={count.student} icon={<UserPlus />} />
      </div>
        :
        <div className='flex py-20 items-center justify-center font-bold tracking-wider text-lg shadow-xl bg-white rounded-xl'>
          {t("No Data Generated Yet")}
        </div>
      }
    </>
  );
};

export default DashboardCount;

const REFRESH_DATA = gql`
  mutation RefreshData($academicYear: String!, $schoolId: ID!) {
    createUpdateDeleteStatistics(
      academicYear: $academicYear
      schoolId: $schoolId
    ) {
      statistics {
        academicYear
        school { id campus }
        countUserCampus
        updatedAt
        updatedBy { id fullName }
      }
    }
  }
`;

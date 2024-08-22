'use client';

import {
  Users,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import CountCard from './CountCard';
import { useEffect, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { getAcademicYear } from '@/utils/functions';
import { useTranslation } from 'react-i18next';

const DashboardCount = (
  { data, p }:
  { data: any; p: any }
) => {

  const { t } = useTranslation("common");
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
      console.log("object", 50);
      refreshStatistics({
        variables: {
          academicYear: getAcademicYear(),
          schoolId: p.school_id,
        },
      });
    }
    setRefreshed(true)

  }, [data?.node?.updatedAt, refreshStatistics, p.school_id]);

  return (
    <>
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

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CombinedResultDataSpecialtyTranscript } from '@/Domain/schemas/interfaceGraphqlKPI';
import { PDFViewer } from '@react-pdf/renderer';
import BatchTransOneYear from '../../../pageResult/pageTranscript/[fees_id]/CompsBatch/BatchTransOneYear';
import { useTranslation } from 'react-i18next';

const Transcript = ({ data, params, searchParams }: { data: CombinedResultDataSpecialtyTranscript | null, params: any, specialty_id: string, searchParams: any }) => {

  const router = useRouter();
  const { t } = useTranslation("common");

  console.log(data);

  return (
    <div className='py-10'>
      {!data || (data && searchParams?.trans !== "true") ? <div className='items-center text-xl flex flex-col gap-6'>
        <h1>{t("Click Below to generate Transcript For this Class")}</h1>
        <button
          onClick={() => router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pageSpecialties/${params.specialty_id}/?tab=4&trans=${true}`)}
          className='cursor-pointer rounded-lg shadow-lg bg-slate-50 px-6 py-2'
        >
          {t("Generate Transcripts")}
        </button>
      </div>
        :
        null
      }

      {data && searchParams?.trans === "true" ?
          <PDFViewer
            style={{
              width: "100%",
              height: "calc(100vh - 100px)",
              maxWidth: "1200px",
            }}
          >
            <BatchTransOneYear
              dataResult={data?.resultDataSpecialtyTranscript?.filter((item: any) => item.platform)}
              params={params}
              dataHeader={data?.specialtyAndSchoolInfo}
            />
          </PDFViewer>
          :
          <div className='py-10 items-center justify-center flex text-xl'>{data ? "" : t("No Data")}</div>
          }
    </div>
  );
};

export default Transcript;



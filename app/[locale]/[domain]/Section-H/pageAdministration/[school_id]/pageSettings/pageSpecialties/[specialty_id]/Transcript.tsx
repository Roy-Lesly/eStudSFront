'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CombinedResultDataSpecialtyTranscript } from '@/Domain/schemas/interfaceGraphqlKPI';
import { BlobProvider, PDFViewer } from '@react-pdf/renderer';
import BatchTransOneYear from '../../../pageResult/pageTranscript/[fees_id]/CompsBatch/BatchTransOneYear';

const Transcript = ({ data, params, searchParams }: { data: CombinedResultDataSpecialtyTranscript | null, params: any, specialty_id: string, searchParams: any }) => {

  const router = useRouter();

  return (
    <div>
      {!data ? <div>
        <h1>CLick Belew to generate Transcript For this Class</h1>
        <button
          onClick={() => router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pageSpecialties/${params.specialty_id}/?trans=${true}`)}
        >
          Generate Transcripts
        </button>
      </div>
        :
        null
      }

      {searchParams.trans == "true" ?
        data == null ?
          <div>Generating ...</div>
          :
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
        <div>None</div>}
    </div>
  );
};

export default Transcript;



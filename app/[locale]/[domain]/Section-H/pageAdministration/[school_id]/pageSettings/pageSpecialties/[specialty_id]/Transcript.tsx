'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CombinedResultDataSpecialtyTranscript, ResultDataSpecialtyTranscript, ResultTranscript, SpecialtyAndSchoolInfo, TransPerSemester } from '@/Domain/schemas/interfaceGraphqlKPI';
import { BlobProvider, PDFViewer } from '@react-pdf/renderer';
import TransOneYear from '../../../pageResult/pageTranscript/[school_fees_id]/Comps/TransOneYear';

const Transcript = ({ data, params, searchParams }: { data: CombinedResultDataSpecialtyTranscript | null, params: any, specialty_id: string, searchParams: any }) => {

  console.log(data?.resultDataSpecialtyTranscript, 1515)
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
            <TransOneYear
              dataResult={data?.resultDataSpecialtyTranscript?.filter((item: any) => item.platform)} 
              params={params} 
              dataHeader={data?.specialtyAndSchoolInfo} 
            />
          </PDFViewer>
          // <BlobProvider
          //   document={<TransOneYear
          //     dataResult={data?.resultDataSpecialtyTranscript?.filter((item: any) => item.platform)} 
          //     params={params} 
          //     dataHeader={data?.specialtyAndSchoolInfo} 
          //   />}
          // >
          //   {({ url, loading }) =>
          //     loading ? <p className='flex items-center justify-center my-24'>Loading Preview...</p> : <iframe src={url || ""} width="100%" height="600px" />
          //   }
          // </BlobProvider>
        :
        <div>None</div>}
    </div>
  );
};

export default Transcript;



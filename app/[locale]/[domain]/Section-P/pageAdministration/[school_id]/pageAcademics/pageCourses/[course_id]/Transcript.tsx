import React from 'react';

const Transcript = () => {
  return (
    <div>
      
    </div>
  );
}

export default Transcript;

// 'use client';

// import React from 'react';
// import { Page, Text, View, Document, StyleSheet, Image, pdf, BlobProvider } from "@react-pdf/renderer";

// import { useRouter } from 'next/navigation';
// import { CombinedResultDataSpecialtyTranscript, ResultDataSpecialtyTranscript, ResultTranscript, SpecialtyAndSchoolInfo, TransPerSemester } from '@/Domain/schemas/interfaceGraphqlKPI';
// import SectionFooter from '../../../pageResult/pageTranscript/[fees_id]/Comps/SectionFooterOne';
// import SectionInfo from '../../../pageResult/pageTranscript/[fees_id]/Comps/SectionInfoOne';
// import SectionBodyOne from '../../../pageResult/pageTranscript/[fees_id]/Comps/SectionBodyOne';
// import SectionHeader from '../../../pageResult/pageTranscript/[fees_id]/Comps/SectionHeaderOne';

// const Transcript = ({ data, params, searchParams }: { data: CombinedResultDataSpecialtyTranscript | null, params: any, specialty_id: string, searchParams: any }) => {

//   const router = useRouter();

//   return (
//     <div>
//       {!data ? <div>
//         <h1>CLick Belew to generate Transcript For this Class</h1>
//         <button
//           onClick={() => router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pageSpecialties/${params.specialty_id}/?trans=${true}`)}
//         >
//           Generate Transcripts
//         </button>
//       </div>
//         :
//         null
//       }

//       {searchParams.trans == "true" ?
//         data == null ?
//           <div>Generating ...</div>
//           :
//           <BlobProvider 
//             document={<TranscriptPDFs 
//               dataResult={data?.resultDataSpecialtyTranscript?.filter((item: any) => item.platform)} 
//               params={params} 
//               dataHeader={data?.specialtyAndSchoolInfo} 
//             />}
//           >
//             {({ url, loading }) =>
//               loading ? <p className='flex items-center justify-center my-24'>Loading Preview...</p> : <iframe src={url || ""} width="100%" height="600px" />
//             }
//           </BlobProvider>
//         :
//         <div>None</div>}
//     </div>
//   );
// };

// export default Transcript;

// const TranscriptPDFs = ({ dataResult, dataHeader, params }: { dataResult: ResultDataSpecialtyTranscript[], params: any, dataHeader: SpecialtyAndSchoolInfo }) => {
//   if (!dataResult || dataResult?.length === 0) {
//     return <Text>No data available</Text>;
//   }


//   return <Document>
//     {dataResult?.map((studentData: ResultDataSpecialtyTranscript, index: number) => (
//        <Page size="A4" style={styles.page} key={studentData.matricle}>
//        <Image
//            src={`https://api${params.domain}.e-conneq.com/media/${dataHeader?.schoolLogo}`}
//            style={styles.watermark}
//        />


//        {/* Header Section */}
//        <View style={styles.header}>

//            {/* Header Info */}
//            <SectionHeader info={dataHeader} params={params} />
//            {/* Document Title */}
//            <View style={[styles.titleContainer, { width: "100%" }]}>
//                <View style={{ width: "20%" }}>
//                    <Text style={styles.documentTitle}></Text>
//                </View>
//                <View style={{ width: "60%" }}>
//                    <Text style={styles.documentTitle}>STUDENT ACADEMIC TRANSCRIPT</Text>
//                </View>
//                <View style={{ justifyContent: "center", alignItems: "center", width: "20%", height: "100%", }}>
//                    <Image
//                        src={`https://api${params.domain}.e-conneq.com/media/${studentData?.profileCode}`}
//                        style={styles.logo}
//                    />
//                </View>
//            </View>

//            {/* Student Info */}
//            <SectionInfo studentInfo={studentData} info={dataHeader} />

//        </View>

//        <View style={{ height: "65.3%", flexDirection: "column", gap: 1 }}>
//            <SectionBodyOne results={studentData?.results?.filter((item: ResultTranscript) => item.semester === "I")} semester="I" />
//            <SectionBodyOne results={studentData?.results?.filter((item: ResultTranscript) => item.semester === "II")} semester="II" />
//        </View>

//        {/* Student Info */}
//        <SectionFooter resultInfo={studentData?.general} schoolInfo={dataHeader} />

//    </Page>
//     ))}
//   </Document>
// }


// const styles = StyleSheet.create({
//   page: {
//       flexDirection: "column",
//       backgroundColor: "#fff",
//       padding: 10,
//   },
//   watermark: {
//       position: "absolute",
//       top: "30%",
//       left: "30%",
//       opacity: 0.1, 
//       width: "50%", 
//       height: "40%",
//       zIndex: -1,
//   },
//   header: {
//       height: "22.2%",
//       flexDirection: "column",
//       justifyContent: "space-between",
//       alignItems: "center",
//       borderBottom: "1px solid #ddd",
//       paddingBottom: 2,
//   },
//   boldText: {
//       fontSize: 12,
//       fontWeight: "bold",
//       textAlign: "center",
//   },
//   headerSubText: {
//       fontSize: 10,
//       textAlign: "center",
//   },
//   titleContainer: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       alignItems: "center",
//       height: "25%"
//   },
//   documentTitle: {
//       fontSize: 14,
//       fontWeight: "bold",
//       textTransform: "uppercase",
//       letterSpacing: 1.5,
//       textAlign: "center",
//   },
//   logo: {
//       width: 40,
//       height: 40,
//       borderRadius: 5,
//   },
// });

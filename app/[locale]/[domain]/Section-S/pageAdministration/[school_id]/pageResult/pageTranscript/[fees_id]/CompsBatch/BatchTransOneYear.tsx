import React, { useEffect, useState } from 'react';
import { Page, Text, View, Document, StyleSheet, Image, pdf, BlobProvider } from "@react-pdf/renderer";
import { ResultDataSpecialtyTranscript, ResultTranscript, SpecialtyAndSchoolInfo } from '@/Domain/schemas/interfaceGraphqlKPI';
import SectionHeaderOne from './BatchSectionHeaderOne';
import SectionBodyOne from './BatchSectionBodyOne';
import SectionInfoOne from './BatchSectionInfoOne';
import SectionFooter from './BatchSectionFooterOne';
import { protocol, RootApi } from '@/utils/config';
import { QrCodeBase64 } from '@/components/QrCodeBase64';



const BatchTransOneYear = (
    { dataResult, dataHeader, params }:
        { dataResult: ResultDataSpecialtyTranscript[], params: any, dataHeader: SpecialtyAndSchoolInfo }
) => {
    if (!dataResult || dataResult?.length === 0) {
        return <Text>No data available</Text>;
    }
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");


    useEffect(() => {
        const url = `${protocol}${params.domain}${RootApi}/check/${dataResult[0].profileId}/transcript/?n=1`;
        QrCodeBase64(url).then(setQrCodeDataUrl);
    }, []);


    return <Document>
        {dataResult?.map((studentData: ResultDataSpecialtyTranscript, index: number) => (
            <Page size="A4" style={styles.page} key={studentData.matricle}>
                <Image
                    src={`https://api${params.domain}.e-conneq.com/media/${dataHeader?.schoolLogo}`}
                    style={styles.watermark}
                />

                <View style={styles.header}>

                    <SectionHeaderOne info={dataHeader} params={params} />

                    <View style={[styles.titleContainer, { width: "100%" }]}>
                        <View style={{ width: "20%" }}>
                            <Text style={styles.documentTitle}></Text>
                        </View>
                        <View style={{ width: "60%" }}>
                            <Text style={styles.documentTitle}>STUDENT ACADEMIC TRANSCRIPT</Text>
                        </View>

                        <View style={{ justifyContent: "center", alignItems: "center", width: "10%", height: "100%", }}>
                            <Image
                                src={qrCodeDataUrl}
                                style={{ width: 50, height: "100%" }}
                            />
                        </View>

                    </View>


                    <SectionInfoOne studentInfo={studentData} info={dataHeader} />

                </View>

                <View style={{ height: "65.3%", flexDirection: "column", gap: 1, paddingHorizontal: 5 }}>
                    <SectionBodyOne results={studentData?.results?.filter((item: ResultTranscript) => item.semester === "I")} semester="I" />
                    <SectionBodyOne results={studentData?.results?.filter((item: ResultTranscript) => item.semester === "II")} semester="II" />
                </View>

                {/* Student Info */}
                <SectionFooter resultInfo={studentData?.general} schoolInfo={dataHeader} />

            </Page>
        ))}
    </Document>
}

export default BatchTransOneYear


const styles = StyleSheet.create({
    page: {
        flexDirection: "column",
        backgroundColor: "#fff",
        padding: 13,
    },
    watermark: {
        position: "absolute",
        top: "30%",
        left: "30%",
        opacity: 0.1,
        width: "50%",
        height: "40%",
        zIndex: -1,
    },
    header: {
        height: "22.2%",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        borderBottomStyle: "solid",
        paddingBottom: 2,
    },
    boldText: {
        fontSize: 12,
        fontWeight: "bold",
        textAlign: "center",
    },
    headerSubText: {
        fontSize: 10,
        textAlign: "center",
    },
    titleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: "27%"
    },
    documentTitle: {
        fontSize: 14,
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: 1.5,
        textAlign: "center",
    },
    logo: {
        width: 50,
        height: 50,
        borderRadius: 3,
    },
});
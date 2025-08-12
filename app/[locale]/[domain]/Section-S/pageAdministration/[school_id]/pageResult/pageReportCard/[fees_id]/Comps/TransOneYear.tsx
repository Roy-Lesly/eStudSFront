import React, { useEffect, useState } from 'react';
import { Page, Text, View, Document, StyleSheet, Image, pdf, BlobProvider } from "@react-pdf/renderer";
import SectionHeaderOne from './SectionHeaderOne';
import SectionBodyOne from './SectionBodyOne';
import SectionInfoOne from './SectionInfoOne';
import SectionFooter from './SectionFooterOne';
import { protocol, RootApi } from '@/utils/config';
import { QrCodeBase64 } from '@/components/QrCodeBase64';
import { TypeProfileResults, TypeTranscriptInfo } from '@/utils/Domain/schemas/interfaceGraphqTranscript';



const TransOneYear = (
    { dataResult, dataInfo, params }:
        { dataResult: TypeProfileResults, params: any, dataInfo: TypeTranscriptInfo }
) => {

    if (!dataResult) {
        return <Text>No data available</Text>;
    }
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");


    useEffect(() => {
        const url = `${protocol}${params.domain}${RootApi}/check/${dataInfo?.studentInfo?.userprofileId}/transcript/?n=1`;
        QrCodeBase64(url).then(setQrCodeDataUrl);
    }, []);


    return <Document>
        {[dataResult]?.map((dataYearResult: TypeProfileResults, index: number) => (
            <Page
                size="A4"
                style={styles.page}
                key={dataYearResult.academicYear}
            >
                <Image
                    src={`https://api${params.domain}.e-conneq.com/media/${dataInfo?.schoolInfo?.schoolLogo}`}
                    style={styles.watermark}
                />

                <View style={styles.header}>

                    <SectionHeaderOne info={dataInfo?.schoolInfo} params={params} />

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


                    <SectionInfoOne
                        studentInfo={dataInfo?.studentInfo}
                    />

                </View>

                <View style={{ height: "65.3%", flexDirection: "column", gap: 1, paddingHorizontal: 5 }}>
                    <SectionBodyOne results={dataYearResult?.semesters[0]} />
                    <SectionBodyOne results={dataYearResult?.semesters[1]} />
                    {/* <SectionBodyOne results={dataYearResult?.results?.filter((item: ResultTranscript) => item.semester === "II")} semester="II" /> */}
                </View>

                {/* Student Info */}
                <SectionFooter
                    resultInfo={dataYearResult}
                    schoolInfo={dataInfo?.schoolInfo}
                />

            </Page>
        ))}
    </Document>
}

export default TransOneYear


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
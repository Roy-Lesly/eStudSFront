import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, pdf, BlobProvider } from "@react-pdf/renderer";
import { ResultDataSpecialtyTranscript, ResultTranscript, SpecialtyAndSchoolInfo } from '@/Domain/schemas/interfaceGraphqlKPI';
import SectionHeader from './SectionHeader';
import SectionBodyOne from './SectionBodyOne';
import SectionInfo from './SectionInfo';
import SectionFooter from './SectionFooter';



const TransOneYear = ({ dataResult, dataHeader, params }: { dataResult: ResultDataSpecialtyTranscript[], params: any, dataHeader: SpecialtyAndSchoolInfo }) => {
    console.log(dataResult, 56)
    if (!dataResult || dataResult?.length === 0) {
        return <Text>No data available</Text>;
    }


    return <Document>
        {dataResult?.map((studentData: ResultDataSpecialtyTranscript, index: number) => (
            <Page size="A4" style={styles.page}>
                <Image
                    src={`https://api${params.domain}.e-conneq.com/media/${dataHeader?.schoolLogo}`}
                    style={styles.watermark}
                />


                {/* Header Section */}
                <View style={styles.header}>

                    {/* Header Info */}
                    <SectionHeader info={dataHeader} params={params} />
                    {/* Document Title */}
                    <View style={[styles.titleContainer, { width: "100%" }]}>
                        <View style={{ width: "20%" }}>
                            <Text style={styles.documentTitle}></Text>
                        </View>
                        <View style={{ width: "60%" }}>
                            <Text style={styles.documentTitle}>STUDENT ACADEMIC TRANSCRIPT</Text>
                        </View>
                        <View style={{ justifyContent: "center", alignItems: "center", width: "20%", height: "100%", }}>
                            <Image
                                src={`https://api${params.domain}.e-conneq.com/media/${studentData?.profileCode}`}
                                style={styles.logo}
                            />
                        </View>
                    </View>

                    {/* Student Info */}
                    <SectionInfo studentInfo={studentData} info={dataHeader} />

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
        borderBottom: "1px solid #ddd",
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
        height: "25%"
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
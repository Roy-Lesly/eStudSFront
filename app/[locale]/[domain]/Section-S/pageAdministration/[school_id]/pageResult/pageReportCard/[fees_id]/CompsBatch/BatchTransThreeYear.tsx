import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, pdf, BlobProvider } from "@react-pdf/renderer";
import { ResultDataSpecialtyTranscript, ResultTranscript, SpecialtyAndSchoolInfo } from '@/Domain/schemas/interfaceGraphqlKPI';
import SectionHeaderThree from './BatchSectionHeaderThree';
import SectionBodyThree from './BatchSectionBodyThree';
import SectionInfoThree from './BatchSectionInfoThree';
import SectionFooterThree from './BatchSectionFooterThree';



const TransThreeYear = ({ dataResult, dataHeader, params }: { dataResult: ResultDataSpecialtyTranscript[], params: any, dataHeader: SpecialtyAndSchoolInfo }) => {
    if (!dataResult || dataResult?.length === 0) {
        return <Text>No data available</Text>;
    }


    return <Document>
        {dataResult?.map((studentData: ResultDataSpecialtyTranscript, index: number) => (
            <Page
                size="A4"
                orientation='landscape'
                style={styles.page} key={studentData.matricle}
            >
                <Image
                    src={`https://api${params.domain}.e-conneq.com/media/${dataHeader?.schoolLogo}`}
                    style={styles.watermark}
                />


                <View style={styles.header}>

                    <SectionHeaderThree info={dataHeader} params={params} />

                    <View style={[styles.titleContainer, { width: "100%" }]}>
                        <View style={{ width: "20%" }}>
                            <Text style={styles.documentTitle}></Text>
                        </View>
                        <View style={{ width: "60%" }}>
                            <Text style={styles.documentTitle}>STUDENT ACADEMIC TRANSCRIPT</Text>
                        </View>
                        <View style={{ width: "20%" }}>
                            <Text style={styles.documentTitle}></Text>
                        </View>
                    </View>

                    <SectionInfoThree
                        studentInfo={studentData}
                        info={dataHeader}
                        params={params}
                        profileCode={studentData.profileCode}
                    />

                </View>

                <View style={{ height: "65.3%", flexDirection: "row", gap: 1, paddingHorizontal: 5 }}>
                    <View style={{ width: "100%", height: "100%", flexDirection: "column", gap: 1, paddingHorizontal: 5 }}>
                        <SectionBodyThree results={studentData?.results?.filter((item: ResultTranscript) => item.semester === "I")} semester="I" />
                        <SectionBodyThree results={studentData?.results?.filter((item: ResultTranscript) => item.semester === "II")} semester="II" />
                    </View>

                    <View style={{ width: "100%", height: "100%", flexDirection: "column", gap: 1, paddingHorizontal: 5 }}>
                        <SectionBodyThree results={studentData?.results?.filter((item: ResultTranscript) => item.semester === "I")} semester="I" />
                        <SectionBodyThree results={studentData?.results?.filter((item: ResultTranscript) => item.semester === "II")} semester="II" />
                    </View>

                    <View style={{ width: "100%", height: "100%", flexDirection: "column", gap: 1, paddingHorizontal: 5 }}>
                        <SectionBodyThree results={studentData?.results?.filter((item: ResultTranscript) => item.semester === "I")} semester="I" />
                        <SectionBodyThree results={studentData?.results?.filter((item: ResultTranscript) => item.semester === "II")} semester="II" />
                    </View>
                </View>


                {/* Student Info */}
                <SectionFooterThree
                    resultInfo={studentData?.general}
                    schoolInfo={dataHeader}
                    params={params}
                    profileCode={studentData.profileCode}
                    profileId={studentData.profileId}
                />

            </Page>
        ))}
    </Document>
}

export default TransThreeYear


const styles = StyleSheet.create({
    page: {
        flexDirection: "column",
        backgroundColor: "#fff",
        padding: 10,
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
        fontSize: 9,
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
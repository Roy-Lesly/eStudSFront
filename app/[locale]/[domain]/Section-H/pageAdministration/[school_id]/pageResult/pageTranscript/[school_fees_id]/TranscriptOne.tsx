
import React from "react";
import { Page, Text, View, Document, StyleSheet, Image, pdf } from "@react-pdf/renderer";
import SectionInfo from "./Comps/SectionInfo";
import SectionHeader from "./Comps/SectionHeader";
import SectionBodyOne from "./Comps/SectionBodyOne";
import SectionFooter from "./Comps/SectionFooter";
import { ResultDataSpecialtyTranscript, ResultTranscript, SpecialtyAndSchoolInfo } from "@/Domain/schemas/interfaceGraphqlKPI";

const TranscriptOne = ({ dataResult, dataHeader, params }: { dataResult: ResultDataSpecialtyTranscript[], params: any, dataHeader: SpecialtyAndSchoolInfo }) => {

    return (
        <>{
            dataResult ? <Document>
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
                                    src={`https://api${params.domain}.e-conneq.com/media/${dataResult[0]?.profileCode}`}
                                    style={styles.logo}
                                />
                            </View>
                        </View>

                        {/* Student Info */}
                        <SectionInfo studentInfo={dataResult[0]} info={dataHeader} />

                    </View>

                    <View style={{ height: "65.3%", flexDirection: "column", gap: 1 }}>
                        <SectionBodyOne results={dataResult[0]?.results?.filter((item: ResultTranscript) => item.semester === "I")} semester="I" />
                        <SectionBodyOne results={dataResult[0]?.results?.filter((item: ResultTranscript) => item.semester === "II")} semester="II" />
                    </View>

                    {/* Student Info */}
                    <SectionFooter resultInfo={dataResult[0]?.general} schoolInfo={dataHeader} />

                </Page>
            </Document>
                : <div>No Data</div>
        }
        </>
    )
};

export default TranscriptOne



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
        width: 40,
        height: 40,
        borderRadius: 5,
    },
});

import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";
import SectionHeaderTwo from './SectionHeaderTwo';
import SectionBodyTwo from './SectionBodyTwo';
import SectionInfoTwo from './SectionInfoTwo';
import SectionFooterTwo from './SectionFooterTwo';
import { TypeProfileResults, TypeTranscriptInfo, TypeTransSchoolInfo } from '@/utils/Domain/schemas/interfaceGraphqTranscript';



const TransTwoYear = (
    { dataResult, dataInfo, params }:
    { dataResult: TypeProfileResults[], params: any, dataInfo: TypeTranscriptInfo }
) => {

    if (!dataResult || dataResult?.length === 0) {
        return <Text>No data available</Text>;
    }

    return <Document>
        <Page
            size="A4"
            orientation='landscape'
            style={styles.page} 
            key={dataInfo?.studentInfo.matricle}
        >
            <Image
                src={`https://api${params.domain}.e-conneq.com/media/${dataInfo?.schoolInfo?.schoolLogo}`}
                style={styles.watermark}
            />


            <View style={styles.header}>

                <SectionHeaderTwo info={dataInfo?.schoolInfo} params={params} />

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

                <SectionInfoTwo
                    info={dataInfo}
                />

            </View>

            <View style={{ height: "32.6%", flexDirection: "row", gap: 1, paddingHorizontal: 5 }}>
                <SectionBodyTwo results={dataResult[0]?.semesters[0]} />
                <SectionBodyTwo results={dataResult[1]?.semesters[0]} />
            </View>

            <View style={{ height: "32.7%", flexDirection: "row", gap: 1, paddingHorizontal: 5 }}>
                <SectionBodyTwo results={dataResult[0]?.semesters[1]} />
                <SectionBodyTwo results={dataResult[1]?.semesters[1]} />
            </View>

            {/* Student Info */}
            <SectionFooterTwo
                resultInfo={dataResult}
                info={dataInfo}
                params={params}
            />

        </Page>
    </Document>
}

export default TransTwoYear


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
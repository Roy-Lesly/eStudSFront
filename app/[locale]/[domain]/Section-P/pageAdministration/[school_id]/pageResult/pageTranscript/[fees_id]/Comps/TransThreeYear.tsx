import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, pdf, BlobProvider } from "@react-pdf/renderer";
import { ResultDataSpecialtyTranscript, ResultTranscript, SpecialtyAndSchoolInfo } from '@/Domain/schemas/interfaceGraphqlKPI';
import SectionHeaderThree from './SectionHeaderThree';
import SectionBodyThree from './SectionBodyThree';
import SectionInfoThree from './SectionInfoThree';
import SectionFooterThree from './SectionFooterThree';
import { TypeProfileResults, TypeTranscriptInfo } from '@/utils/Domain/schemas/interfaceGraphqTranscript';



const TransThreeYear = (
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

                <SectionHeaderThree info={dataInfo?.schoolInfo} params={params} />

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
                    info={dataInfo}
                />

            </View>

            <View style={{ height: "65.3%", flexDirection: "row", gap: 1, paddingHorizontal: 5 }}>
                <View style={{ width: "100%", height: "100%", flexDirection: "column", gap: 1, paddingHorizontal: 5 }}>
                <SectionBodyThree results={dataResult[0]?.semesters[0]} />
                <SectionBodyThree results={dataResult[0]?.semesters[1]} />
                </View>

                <View style={{ width: "100%", height: "100%", flexDirection: "column", gap: 1, paddingHorizontal: 5 }}>
                <SectionBodyThree results={dataResult[1]?.semesters[0]} />
                <SectionBodyThree results={dataResult[1]?.semesters[1]} />
                </View>

                <View style={{ width: "100%", height: "100%", flexDirection: "column", gap: 1, paddingHorizontal: 5 }}>
                <SectionBodyThree results={dataResult[2]?.semesters[0]} />
                <SectionBodyThree results={dataResult[2]?.semesters[1]} />
                </View>
            </View>


            {/* Student Info */}
            <SectionFooterThree
                resultInfo={dataResult}
                info={dataInfo}
                params={params}
            />

        </Page>
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
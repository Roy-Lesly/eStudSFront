"use client";

import React, { useEffect, useState } from "react";
import {
    Document,
    Page,
    Text,
    StyleSheet,
    Image,
    View,
} from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { pdf } from "@react-pdf/renderer";
import { FiDownload } from "react-icons/fi";
import { EdgeResult, NodeSchoolFees } from "@/Domain/schemas/interfaceGraphql";
import { calcTotalandGrade, decodeUrlID } from "@/functions";
import { QrCodeBase64 } from "@/components/QrCodeBase64";
import { protocol, RootApi } from "@/utils/config";
import { useParams } from "next/navigation";


const MyPDF = (
    { p, results, schoolFees, semester, qrCodeDataUrl, resitPublished }:
        { p: any, results: EdgeResult[]; schoolFees: NodeSchoolFees, semester: "I" | "II", qrCodeDataUrl: string, resitPublished: boolean }
) => {
    const schoolInfo = schoolFees?.userprofile?.specialty?.school;
    const profileInfo = schoolFees?.userprofile;
    const logoUrl = schoolFees?.userprofile?.specialty?.school?.logoCampus;

    return (
        <Document>
            <Page size={{ width: 595, height: 420 }} style={styles.page}>
                {logoUrl && (
                    <View style={styles.imageWrapper}>
                        <Image
                            style={styles.backgroundImage}
                            src={`${protocol}api${p.domain}${RootApi}/media/${logoUrl}`}
                        />
                    </View>
                )}

                {/* Header */}
                <View style={styles.header}>
                    {logoUrl && (
                        <Image style={styles.logo} src={`${protocol}api${p.domain}${RootApi}/media/${logoUrl}`} />
                    )}

                    {/* Centered School Info */}
                    <View style={styles.schoolInfo}>
                        <Text style={styles.schoolName}>{schoolInfo?.schoolName}</Text>

                        <View style={styles.schoolLine}>
                            <Text style={styles.schoolDetails}>Town: {schoolInfo?.town}</Text>
                            <Text style={styles.schoolDetails}> | </Text>
                            <Text style={styles.schoolDetails}>Campus: {schoolInfo?.campus}</Text>
                        </View>

                        <View style={styles.schoolLine}>
                            <Text style={styles.schoolDetails}>Address: {schoolInfo?.address}</Text>
                        </View>

                        <View style={styles.schoolLine}>
                            <Text style={styles.schoolDetails}>Tel: {schoolInfo?.telephone}</Text>
                        </View>
                    </View>

                    {logoUrl && <Image
                        src={qrCodeDataUrl}
                        style={styles.logo}
                    />}
                </View>

                <View style={styles.studentInfo}>
                    <Text style={styles.studentLine}>
                        {profileInfo?.customuser?.fullName}
                    </Text>
                    <View style={styles.studentLineRow}>
                        <Text style={styles.studentLine}>Specialty: {profileInfo?.specialty?.mainSpecialty?.specialtyName}</Text>
                        <Text style={styles.studentLine}>| Level: {profileInfo?.specialty?.level?.level}</Text>
                        <Text style={styles.studentLine}>| Academic Year: {profileInfo?.specialty?.academicYear}</Text>
                    </View>
                </View>

                <Text style={styles.title}>Semester {semester}  -  Result Slip</Text>

                {/* Table Header */}
                <View style={[styles.tableRow, styles.tableHeader]}>
                    <Text style={styles.courseNameCell}>Course Name</Text>
                    <Text style={styles.otherCell}>CA</Text>
                    <Text style={styles.otherCell}>Exam</Text>
                    <Text style={styles.otherCell}>Resit</Text>
                    <Text style={styles.otherCell}>Total</Text>
                    <Text style={styles.lastCell}>Grade</Text>
                </View>

                {/* Table Rows */}
                {results.map(({ node }, index) => {
                    const courseName = node.course?.mainCourse?.courseName || "-";
                    const info = node.infoData ? JSON.parse(node.infoData) : {};

                    return (
                        <View key={index} style={[styles.tableRow, { fontSize: 9 }]}>
                            <Text style={[styles.courseNameCell, { paddingHorizontal: 3 }]}>
                                {node.course.mainCourse.courseName}
                            </Text>
                            <Text style={[styles.otherCell, info.ca < (schoolInfo.caLimit / 2) ? styles.redText : {}]}>
                                {info.ca ?? "-"}
                            </Text>
                            <Text style={[styles.otherCell, info.exam < (schoolInfo.examLimit / 2) ? styles.redText : {}]}>
                                {info.exam ?? "-"}
                            </Text>
                            <Text style={[styles.otherCell, info.resit < (schoolInfo.resitLimit / 2) ? styles.redText : {}]}>
                                {resitPublished ? info.resit ?? "-" : ""}
                            </Text>
                            <Text style={[styles.otherCell, info.average < 50 ? styles.redText : {}]}>
                                {resitPublished ? info.average ? calcTotalandGrade(info.ca, info.exam, info.resit).mark : "-" : (calcTotalandGrade(info.ca, info.exam, null).mark)}
                            </Text>
                            <Text style={[styles.lastCell, info.average < 50 ? styles.redText : {}]}>
                                {resitPublished ? info.average ? calcTotalandGrade(info.ca, info.exam, info.resit).grade : "-" : (calcTotalandGrade(info.ca, info.exam, null).grade)}
                            </Text>
                        </View>
                    );
                })}
            </Page>
        </Document>
    );
};

const ResultSlip = ({
    data,
    schoolFees,
    semester,
    resitPublished,
    fileName = `result-slip Semester-${semester}.pdf`,
}: {
    data: EdgeResult[];
    schoolFees: NodeSchoolFees;
    semester: "I" | "II" | any;
    resitPublished: boolean;
    fileName?: string;
}) => {

    const params = useParams();

    const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");

    useEffect(() => {
        const url = `${protocol}${params.domain}${RootApi}/check/${decodeUrlID(schoolFees?.userprofile.id)}/H/resultslip/?n=1`;
        QrCodeBase64(url).then(setQrCodeDataUrl);
    }, []);

    const handleDownload = async () => {
        const blob = await pdf(
            <MyPDF
                p={params}
                results={data}
                schoolFees={schoolFees}
                semester={semester}
                resitPublished={resitPublished}
                qrCodeDataUrl={qrCodeDataUrl}
            />
        ).toBlob();
        saveAs(blob, fileName);
    };

    return (
        <div className="flex w-full justify-center items-center m-4 py-2">
            <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md"
            >
                <FiDownload className="w-5 h-5" />
                Download
            </button>
        </div>
    );
};

export default ResultSlip;




const styles = StyleSheet.create({
    page: {
        borderWidth: 2,
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 10,
        width: 420,
        height: 595,
        position: "relative",
    },
    imageWrapper: {
        position: "absolute",
        width: "90%",
        height: "80%",
        top: 89,
        left: "10%", // centers horizontally
        alignItems: "center",
        justifyContent: "center",
        opacity: 0.25,
    },
    backgroundImage: {
        width: "100%", // this will maintain aspect ratio
        objectFit: "contain",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 3,
        paddingHorizontal: 4,
    },
    logo: {
        width: 55,
        height: 55,
    },
    schoolInfo: {
        flex: 1,
        textAlign: "center",
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderColor: "#999",
        paddingBottom: 2,
    },
    schoolName: {
        fontSize: 14,
        fontWeight: "bold",
        textTransform: "uppercase",
        marginBottom: 1.8,
        letterSpacing: 1,
    },
    schoolLine: {
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap",
        marginBottom: 0.8,
    },
    schoolDetails: {
        fontSize: 9,
        color: "#333",
        marginBottom: 1,
        letterSpacing: 0.5,
    },






    // Title for result slip
    title: {
        fontSize: 9,
        textAlign: "center",
        marginBottom: 2,
        fontWeight: "bold",
        textTransform: "uppercase",
        borderBottomWidth: 1,
        borderColor: "#ccc",
        paddingBottom: 2,
    },





    studentInfo: {
        marginTop: 1,
        marginBottom: 2,
        paddingHorizontal: 10,
        paddingVertical: 2,
        width: "100%",
        backgroundColor: "#f5f5f5",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#aaa",
        alignSelf: "center",
        textAlign: "center",
        gap: 3
    },
    studentLineRow: {
        flexDirection: "row",
        justifyContent: "center",
        columnGap: 50,
    },
    studentLine: {
        fontSize: 9,
        color: "#222",
        letterSpacing: 0.8,
        lineHeight: 1,
        textAlign: "center",
        gap: 4
    },





    table: {
        display: "flex",
        width: "100%",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#000",
        marginTop: 1.5,
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: "#000",
        height: 16,
    },
    courseNameCell: {
        width: "50%",
        padding: 1.9,
        borderRightWidth: 1,
        borderColor: "#000",
    },
    otherCell: {
        width: "10%", // adjust as needed for 2 or 3 other columns
        padding: 1.9,
        borderRightWidth: 1,
        borderColor: "#000",
    },
    lastCell: {
        width: "10%",
        padding: 1.9,
    },
    tableHeader: {
        backgroundColor: "#f0f0f0",
        fontWeight: "bold",
    },





    redText: {
        color: 'red',
    },

});
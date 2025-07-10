import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "@react-pdf/renderer";
import { TransGeneral } from "@/Domain/schemas/interfaceGraphqlKPI";
import { protocol, RootApi } from "@/utils/config";
import { QrCodeBase64 } from "@/components/QrCodeBase64";

const SectionFooterTwo = (
  { resultInfo, schoolInfo, params, profileCode, profileId }:
    { resultInfo: TransGeneral, schoolInfo: any, params: any, profileCode: string, profileId: number }
) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");

  const gpaRanges = resultInfo?.gradeSystem === "GPA_5"
    ? [
      "4.5-5.00",
      "3.8-4.49",
      "3.1-3.79",
      "2.5-3.09",
      "2.0-2.49",
      "UD =",
      "LD =",
    ]
    : resultInfo?.gradeSystem === "GPA_20" ? [
      "3.60-4.00",
      "3.00-3.59",
      "2.50-2.99",
      "2.25-2.49",
      "2.00-2.24",
      "UD =",
      "LD =",
    ] : [
      "3.60-4.00",
      "3.00-3.59",
      "2.50-2.99",
      "2.25-2.49",
      "2.00-2.24",
      "UD =",
      "LD =",
    ]

  const gpRanges = resultInfo?.gradeSystem === "GPA_5"
    ? [
      "5.0",
      "4.4",
      "3.8",
      "3.1",
      "2.4",
      "1.7",
      "1.0",
      "0.0",
    ]
    : resultInfo?.gradeSystem === "GPA_20" ? [
      "5.0",
      "4.4",
      "3.8",
      "3.1",
      "2.4",
      "1.7",
      "1.0",
      "0.0",
    ] : [
      "4.0",
      "3.5",
      "3.0",
      "2.5",
      "2.0",
      "1.5",
      "1.0",
      "0.0",
    ]

  useEffect(() => {
    const url = `${protocol}${params.domain}${RootApi}/check/${profileId}/transcript/?n=2`;
    QrCodeBase64(url).then(setQrCodeDataUrl);
  }, []);

  return (
    <View style={[styles.footerContainer, styles.border]}>
      {/* GPA Table */}
      <View style={[styles.gpaSection, styles.textSmall]}>

        <View style={[styles.row, styles.bold, styles.italic]}>
          <Text style={[styles.col, styles.col1, { width: "100%" }]}>Grade</Text>
          <Text style={[styles.col, styles.col1, { width: "100%" }]}>Mark</Text>
          <Text style={[styles.col, styles.col1, { width: "100%" }]}>GP</Text>
          <Text style={[styles.col, styles.col2, { width: "100%" }]}>GPA</Text>
          <Text style={[styles.col, styles.col3, { width: "100%" }]}>Class of Degree</Text>
          <Text style={[styles.col, styles.col1, { width: "100%" }]}>Key</Text>
          <Text style={[styles.col, styles.col3, { width: "100%" }]}></Text>
        </View>
        <View style={styles.row}>
          <View style={[styles.col, styles.col1]}>
            {["A", "B+", "B", "C+", "C", "D+", "D", "F"].map((grade, idx) => (
              <Text key={idx} style={styles.cell}>
                {grade}
              </Text>
            ))}
          </View>
          <View style={[styles.col, styles.col1]}>
            {[
              ">80",
              "70-79",
              "60-69",
              "55-59",
              "50-54",
              "45-49",
              "40-44",
              "<40",
            ].map((mark, idx) => (
              <Text key={idx} style={styles.cell}>
                {mark}
              </Text>
            ))}
          </View>
          <View style={[styles.col, styles.col1]}>
            {gpRanges.map(
              (gp, idx) => (
                <Text key={idx} style={styles.cell}>
                  {gp}
                </Text>
              )
            )}
          </View>
          <View style={[styles.col, styles.col2]}>
            {gpaRanges.map((range, idx) => (
              <Text key={idx} style={styles.cell}>
                {range}
              </Text>
            ))}
          </View>
          <View style={[styles.col, styles.col3]}>
            {[
              "First Class",
              "Second Class - UD",
              "Second Class - LD",
              "Third Class",
              "Passed",
              "Upper Division",
              "Lower Division",
            ].map((degree, idx) => (
              <Text key={idx} style={styles.cell}>
                {degree}
              </Text>
            ))}
          </View>
          <View style={[styles.col, styles.col1]}>
            {[
              "*",
              "I",
              "CV",
              "GP",
              "GPA",
              "WP",
              "GD",
            ].map((degree, idx) => (
              <Text key={idx} style={styles.cell}>
                {degree}
              </Text>
            ))}
          </View>
          <View style={[styles.col, styles.col3]}>
            {[
              "Obtained after Resit",
              "Incomplete",
              "Credit Value",
              "Graded Point",
              "Grade Point Average",
              "Weighted Point",
              "Grade",
            ].map((degree, idx) => (
              <Text key={idx} style={styles.cell}>
                {degree}
              </Text>
            ))}
          </View>
        </View>
      </View>

      <View style={{ justifyContent: "center", alignItems: "center", width: "10%", height: "100%", }}>
        <Image
          src={qrCodeDataUrl}
          style={{ width: 67, height: "100%" }}
        />
      </View>

      {/* Student Info */}
      <View style={[styles.infoSection, { padding: 1 }]}>
        <View style={{ flexDirection: "column", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 4 }}>
            {/* <Text style={{ textAlign: "left", gap: 2, width: "60%" }}>Level 1 - {resultInfo?.totalAttempted}</Text> */}
            <Text style={{ textAlign: "left", gap: 2, width: "60%" }}>Level 100 - 2.76</Text>
            {/* <Text style={{ textAlign: "left", gap: 2, width: "100%" }}>The Director - {resultInfo?.totalAttempted}</Text> */}
            <Text style={{ textAlign: "left", gap: 2, width: "100%" }}>The Director - Dr. Animbom Camron J.</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 4 }}>
            {/* <Text style={{ textAlign: "left", gap: 2, width: "100%" }}>Level 200 - {resultInfo?.totalAttempted}</Text> */}
            <Text style={{ textAlign: "left", gap: 2, width: "100%" }}>Level 200 - 2.98</Text>
          </View>
          <Text style={[styles.bold, { fontSize: 10, paddingTop: 1 }]}>
            {/* Average. GPA - {resultInfo?.GPA} / {resultInfo?.gpaTotal} */}
            Average. GPA - 2.65 / 4
          </Text>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ textAlign: "left", width: "60%" }}>
            {/* Done in <Text style={styles.italic}>{schoolInfo?.town}</Text> */}
            Done in <Text style={styles.italic}>Douala</Text>
          </Text>
          <Text style={{ textAlign: "left", width: "100%" }}>
            Date: <Text style={styles.italic}>{new Date().toUTCString().slice(5, 16)}</Text>
          </Text>
        </View>

      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  border: {
    height: "12.5%",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#000",
    paddingTop: 2,
    paddingHorizontal: 1
  },
  borderedBox: {
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
    borderRadius: 5,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginHorizontal: 4,
    marginBottom: 4,
    paddingVertical: 0.7
  },
  gpaSection: {
    flex: 7,
    marginHorizontal: 1.5,
    fontSize: 8,
    paddingHorizontal: 1.5,
    paddingVertical: 1,
    justifyContent: "center",
    height: "100%",
  },
  infoSection: {
    flex: 6,
    fontSize: 10,
    height: "100%",
    justifyContent: "space-between"
  },
  row: {
    flexDirection: "row",
  },
  col: {
    flex: 1,
    alignItems: "center",
    textAlign: "center"
  },
  col1: { flex: 1 },
  col2: { flex: 2 },
  col3: { flex: 3 },
  cell: {
    fontSize: 8,
    textAlign: "center",
  },
  bold: {
    fontWeight: "bold",
  },
  italic: {
    fontStyle: "italic",
  },
  textXSmall: {
    fontSize: 8,
  },
  textSmall: {
    fontSize: 8,
  },
  textLarge: {
    fontSize: 14,
  },
  emptySignature: {
    height: 30,
    borderBottomWidth: 1,
    borderColor: "#000",
    marginBottom: 5,
  },
});

export default SectionFooterTwo;

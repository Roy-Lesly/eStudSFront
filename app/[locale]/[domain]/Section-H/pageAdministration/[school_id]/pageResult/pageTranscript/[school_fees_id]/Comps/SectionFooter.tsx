import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { TransGeneral } from "@/Domain/schemas/interfaceGraphqlKPI";

const SectionFooter = ({ resultInfo, schoolInfo }: { resultInfo: TransGeneral, schoolInfo: any}) => {

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

      {/* Student Info */}
      <View style={[styles.infoSection, { padding: 1 }]}>
        <View style={{ flexDirection: "column", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 4 }}>
            <Text style={{ textAlign: "left", gap: 2, width: "100%" }}>Attempted - {resultInfo?.totalAttempted}</Text>
            <Text style={{ textAlign: "left", gap: 2, width: "100%" }}>Earned - {resultInfo?.totalEarned}</Text>
          </View>
          <Text style={[styles.bold, {fontSize: 12, paddingTop: 1 }]}>
            GPA - {resultInfo?.GPA} / {resultInfo?.gpaTotal}
          </Text>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between"}}>
          <Text style={{ textAlign: "left", width: "100%"}}>The Director</Text>
          <Text style={{ textAlign: "left", width: "100%"}}></Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between"}}>
          <Text style={{ textAlign: "left", width: "100%"}}>Done in {schoolInfo?.town}</Text>
          <Text style={{ textAlign: "left", width: "100%"}}>
            Date: <Text style={styles.italic}>{new Date().toUTCString().slice(5, 16)}</Text>
            {/* Date:  */}
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
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginHorizontal: 5,
    marginBottom: 4,
    paddingVertical: 1
  },
  gpaSection: {
    flex: 7,
    marginHorizontal: 2,
    fontSize: 9,
    paddingHorizontal: 2,
    paddingVertical: 2,
    justifyContent: "center",
    height: "100%",
  },
  infoSection: {
    flex: 5,
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
    fontSize: 10,
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

export default SectionFooter;

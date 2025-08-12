import { SemesterResults } from "@/utils/Domain/schemas/interfaceGraphqTranscript";
import { View, Text, StyleSheet } from "@react-pdf/renderer";

const SectionBodyOne = ({ results }: { results: SemesterResults }) => {

  return (
    <View style={[styles.body, styles.borderedBox, { borderRadius: 5, width: "100%" }]}>
      <Text style={styles.semester}>Semester {results?.semester}   Credit: {results?.semesterCreditEarned}/{results?.semesterCreditAttempted}, GPA: {results?.semesterGPA} </Text>

      {/* Table Header */}
      <View style={[styles.row, styles.header]}>
        <Text style={styles.cell}>CODE</Text>
        <Text style={[styles.cell, styles.courseName]}>COURSE NAME</Text>
        {/* <Text style={styles.cell}>Marks</Text> */}
        <Text style={styles.cell}>CA</Text>
        <Text style={styles.cell}>Exams</Text>
        <Text style={styles.cell}>Resit</Text>
        <Text style={styles.cell}>CV</Text>
        <Text style={styles.cell}>GP</Text>
        <Text style={styles.cell}>WP</Text>
        <Text style={styles.cell}>GD</Text>
      </View>

      {/* Table Data */}
      {results?.courses?.map((result, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.cell}>{result?.courseCode}</Text>
          <Text style={[styles.cell, styles.courseName]}>{result?.courseName.slice(0, 36)}</Text>
          {/* <Text style={styles.cell}>{result?.average || "-"}</Text> */}
          <Text style={styles.cell}>{result?.ca || "-"}</Text>
          <Text style={styles.cell}>{result?.exam || "-"}</Text>
          <Text style={styles.cell}>{result?.resit || "-"}</Text>
          <Text style={styles.cell}>{result?.CV || "-"}</Text>
          <Text style={styles.cell}>{result?.GP == 0 ? 0 : result?.GP ? result?.GP : "-"}</Text>
          <Text style={styles.cell}>{result?.WP == 0 ? 0 : result?.WP ? result?.WP : "-"}</Text>
          <Text style={styles.cell}>
            {result?.GD || "-"}
            {result?.hasResit && <Text style={styles.redStar}> *</Text>}
          </Text>        
          </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    padding: 1,
    height: "32.65%",
    fontSize: 10,
  },
  borderedBox: {
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
    borderRadius: 5,
    width: "100%",
  },
  semester: {
    fontSize: 12,
    marginBottom: 1,
    textAlign: "center",
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    alignItems: "center",
  },
  header: {
    paddingVertical: 0.7,
    backgroundColor: "#0F766E",
    fontWeight: "bold",
    color: "white"
  },
  cell: {
    flex: 1,
    textAlign: "center",
    padding: 1,
  },
  courseName: {
    flex: 6,
    textAlign: "left",
    paddingLeft: 4,
  },
  redStar: {
    color: "red",
    fontWeight: "bold",
    fontSize: 12,
  },
});

export default SectionBodyOne;

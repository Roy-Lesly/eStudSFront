import { ResultTranscript } from "@/Domain/schemas/interfaceGraphqlKPI";
import { View, Text, StyleSheet } from "@react-pdf/renderer";

const SectionBodyOne = ({ results, semester }: { results: ResultTranscript[], semester: "I" | "II" }) => {

  return (
    <View style={[styles.body, { border: 1, borderRadius: 5, width: "100%" }]}>
      <Text style={styles.semester}>Semester {semester}</Text>

      {/* Table Header */}
      <View style={[styles.row, styles.header]}>
        <Text style={styles.cell}>CODE</Text>
        <Text style={[styles.cell, styles.courseName]}>COURSE NAME</Text>
        <Text style={styles.cell}>Marks</Text>
        <Text style={styles.cell}>CV</Text>
        <Text style={styles.cell}>GP</Text>
        <Text style={styles.cell}>WP</Text>
        <Text style={styles.cell}>GD</Text>
      </View>

      {/* Table Data */}
      {results?.map((result, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.cell}>{result?.courseCode}</Text>
          <Text style={[styles.cell, styles.courseName]}>{result?.courseName}</Text>
          <Text style={styles.cell}>{result?.average || "-"}</Text>
          <Text style={styles.cell}>{result?.courseCredit || "-"}</Text>
          <Text style={styles.cell}>{result?.GP == 0 ? 0 : result?.GP ? result?.GP : "-"}</Text>
          <Text style={styles.cell}>{result?.WP == 0 ? 0 : result?.GP ? result?.GP : "-"}</Text>
          <Text style={styles.cell}>
            {result?.GD || "-"}
            {result?.resit && <Text style={styles.redStar}> *</Text>}
          </Text>        
          </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 1,
    paddingVertical: 3,
    height: "32.65%",
    fontSize: 10,
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
    padding: 2,
  },
  courseName: {
    flex: 5,
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

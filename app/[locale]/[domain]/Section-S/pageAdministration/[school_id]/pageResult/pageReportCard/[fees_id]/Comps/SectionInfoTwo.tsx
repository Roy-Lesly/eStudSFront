import { TypeTranscriptInfo } from "@/utils/Domain/schemas/interfaceGraphqTranscript";
import { View, Text, StyleSheet, Image } from "@react-pdf/renderer";

const SectionInfoTwo = (
  { info }:
    { info: TypeTranscriptInfo }) => {


  return (
    <View style={[styles.infoContainer, { width: "100%", fontWeight: "medium" }]}>
      {/* First Row */}
      <View style={[styles.row, { padding: 2, gap: 10 }]}>
        {/* Left Column */}
        <View style={[styles.column]}>

          <View style={[styles.gridRow]}>
            <Text style={{ flex: 1.5, fontSize: 10 }}>Matricule:</Text>
            <Text style={[styles.bold, { flex: 2.5, fontSize: 10 }]}>{info?.studentInfo?.matricle}</Text>
            <Text style={[{ flex: 1.5, fontSize: 10 }]}>Name:</Text>
            <Text style={[{ flex: 5.5, fontSize: 10 }, styles.bold]}>{info?.studentInfo?.fullName}</Text>
          </View>

          <View style={[styles.gridRow]}>
            <Text style={{ flex: 3.2, fontSize: 10 }}>Date and Place of Birth:</Text>
            <Text style={[styles.bold, { flex: 6, fontSize: 10 }]}>{info?.studentInfo?.dob} at {info?.studentInfo?.pob.slice(0, 14)}</Text>
            <Text style={[{ flex: 1.3, fontSize: 10 }]}>Program:</Text>
            <Text style={[{ flex: 1.5, fontSize: 10 }, styles.bold]}>{info?.studentInfo?.program}</Text>
          </View>

        </View>


        <View style={[styles.column]}>
          {/* Domain */}
          <View style={[styles.gridRow]}>
            <Text style={{ flex: 1.5, fontSize: 10 }}>Domain:</Text>
            <Text style={[styles.bold, { flex: 4.5, fontSize: 10 }]}>{info?.studentInfo?.domain.slice(0, 23)}</Text>
            <Text style={[styles.col1]}>Field:</Text>
            <Text style={[styles.col5, styles.bold]}>{info?.studentInfo?.field.slice(0, 26)}</Text>
          </View>

          <View style={[styles.gridRow]}>
            <Text style={{ flex: 1.5, fontSize: 10 }}>Specialty:</Text>
            <Text style={[styles.bold, { flex: 4.5, fontSize: 10 }]}>{info?.studentInfo?.specialtyName.slice(0, 26)}</Text>
          </View>
        </View>
      </View>
    </View>

  );
};

const styles = StyleSheet.create({
  infoContainer: {
    paddingHorizontal: 4,
    paddingVertical: 1,
    flexDirection: "column",
    gap: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  column: {
    flex: 1,
    flexDirection: "column",
    gap: 4,
  },
  gridRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 2,
    width: "100%",
    padding: 1
  },
  col1: {
    flex: 1,
    fontSize: 10,
  },
  col2: {
    flex: 2,
    fontSize: 10,
  },
  col3: {
    flex: 3,
    fontSize: 10,
  },
  col4: {
    flex: 4,
    fontSize: 10,
  },
  col5: {
    flex: 5,
    fontSize: 10,
  },
  col8: {
    flex: 8,
    fontSize: 10,
  },
  col7: {
    flex: 7,
    fontSize: 10,
  },
  col9: {
    flex: 9,
    fontSize: 10,
  },
  col10: {
    flex: 10,
    fontSize: 10,
  },
  italic: {
    fontStyle: "italic",
    fontWeight: "medium",
    textAlign: "right",
  },
  bold: {
    fontWeight: "bold",
    fontStyle: "italic", // Optional, if you want the bold text to retain italic formatting
    textAlign: "right",
  },
});

export default SectionInfoTwo;

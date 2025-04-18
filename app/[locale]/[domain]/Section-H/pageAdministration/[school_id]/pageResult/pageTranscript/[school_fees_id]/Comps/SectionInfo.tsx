import { ResultDataSpecialtyTranscript, SpecialtyAndSchoolInfo } from "@/Domain/schemas/interfaceGraphqlKPI";
import { View, Text, StyleSheet } from "@react-pdf/renderer";

const SectionInfo = ({ studentInfo, info }: { studentInfo: ResultDataSpecialtyTranscript, info: SpecialtyAndSchoolInfo }) => {


  return (
<View style={[styles.infoContainer, { width: "100%", fontWeight: "medium" }]}>
  {/* First Row */}
  <View style={[styles.row, { padding: 2, gap: 10 }]}>
    {/* Left Column */}
    <View style={[styles.column]}>
      {/* Matricule & Program */}
      <View style={[styles.gridRow, { gap: 4 }]}>
        <Text style={[styles.col2]}>Matricule:</Text>
        <Text style={[styles.col5, styles.bold]}>{studentInfo?.matricle}</Text>
        <Text style={[styles.col2]}>Program:</Text>
        <Text style={[styles.col3, styles.bold]}>{studentInfo?.program}</Text>
      </View>

      {/* Name */}
      <View style={[styles.gridRow]}>
        <Text style={[styles.col1]}>Name:</Text>
        <Text style={[styles.col9, styles.bold]}>{studentInfo?.fullName}</Text>
      </View>

      {/* Date of Birth */}
      <View style={[styles.gridRow]}>
        <Text style={[styles.col1]}>Date Of Birth:</Text>
        <Text style={[styles.col2, styles.bold]}>{studentInfo?.dob}</Text>
      </View>

      {/* Place of Birth */}
      <View style={[styles.gridRow]}>
        <Text style={[styles.col1]}>Place Of Birth:</Text>
        <Text style={[styles.col2, styles.bold]}>{studentInfo?.pob}</Text>
      </View>
    </View>

    {/* Right Column */}
    <View style={[styles.column]}>
      {/* Domain */}
      <View style={[styles.gridRow]}>
        <Text style={[styles.col1]}>Domain:</Text>
        <Text style={[styles.col2, styles.bold]}>{info?.domainName}</Text>
      </View>

      {/* Field */}
      <View style={[styles.gridRow]}>
        <Text style={[styles.col2]}>Field:</Text>
        <Text style={[styles.col10, styles.bold]}>{info?.fieldName}</Text>
      </View>

      {/* Specialty */}
      <View style={[styles.gridRow]}>
        <Text style={[styles.col2]}>Specialty:</Text>
        <Text style={[styles.col8, styles.bold]}>{info?.specialtyName}</Text>
      </View>

      {/* Academic Year & Level */}
      <View style={[styles.gridRow]}>
        <Text style={[styles.col2]}>Academic Year:</Text>
        <Text style={[styles.col2, styles.bold]}>{info?.specialtyAcademicYear}</Text>
        <Text style={[styles.col1]}>Level:</Text>
        <Text style={[styles.col1, styles.bold]}>{info?.specialtyLevel}</Text>
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
    gap: 4,
    width: "100%",
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

export default SectionInfo;

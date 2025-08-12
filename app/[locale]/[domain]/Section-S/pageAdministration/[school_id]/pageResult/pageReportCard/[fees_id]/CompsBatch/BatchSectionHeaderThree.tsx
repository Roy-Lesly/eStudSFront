import { SpecialtyAndSchoolInfo } from "@/Domain/schemas/interfaceGraphqlKPI";
import { View, Text, StyleSheet, Image } from "@react-pdf/renderer";

const SectionHeaderThree = ({ info, params }: { info: SpecialtyAndSchoolInfo, params: any }) => {

  return (
    <View style={{ height: "41.67%", flexDirection: "row", width: "100%",  }}>
      {/* Left Section */}
      <View style={[styles.headerLeft, { width: "43%", gap: 3 }]}>
        <Text style={styles.schoolName}>
          {info?.schoolName}
        </Text>
        <Text style={styles.schoolInfo}>No: {info?.schoolNiu}</Text>
        <Text style={styles.schoolInfo}>
          PO Box: {info?.schoolPoBox}, {info?.schoolRegion} - {info?.schoolCountry}
        </Text>
        <Text style={styles.schoolInfo}>
          Email: <Text style={styles.email}>{info?.schoolEmail}</Text>
        </Text>
      </View>

      {/* Center Logo Section */}
      <View style={[styles.logoContainer]}>
        <Image
          src={`https://api${params.domain}.e-conneq.com/media/${info?.schoolLogo}`}
          style={{}}
        />
      </View>

      {/* Right Section */}
      <View style={[styles.headerRight, { width: "41%", gap: 4 }]}>
        <Text style={styles.boldText}>REPUBLIC OF CAMEROON</Text>
        <Text style={styles.headerSubText}>Peace - Work - Fatherland</Text>
        <Text style={styles.headerSubText}>Ministry of Higher Education</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerLeft: {
    width: "35%",
    padding: 1,
    justifyContent: "center",
  },
  schoolName: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  schoolInfo: {
    fontSize: 10,
    textAlign: "center",
  },
  email: {
    fontStyle: "italic",
    color: "#1E90FF",
  },
  logoContainer: {
    width: "25%",
    // height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  headerRight: {
    width: "33%",
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
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
});

export default SectionHeaderThree;

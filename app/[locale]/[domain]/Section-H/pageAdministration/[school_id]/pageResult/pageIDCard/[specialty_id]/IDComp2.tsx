'use client';

import React, { useEffect, useState } from 'react';
import { Page, Text, View, Document, StyleSheet, Image, BlobProvider } from "@react-pdf/renderer";

import { EdgeSchoolFees } from '@/Domain/schemas/interfaceGraphql';

const IDComp2 = (
  { data, params, qrCodeDataUrl }:
    { data: EdgeSchoolFees[], params: any, searchParams: any, qrCodeDataUrl: string }) => {

  const [fetchedData, setFetchedData] = useState<EdgeSchoolFees[] | null>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const fetchImagesSequentially = async () => {
      const updatedData: EdgeSchoolFees[] = [];

      for (const studentData of data) {
        try {
          const logoUrl = `https://api${params.domain}.e-conneq.com/media/${studentData?.node.userprofile?.specialty?.school?.schoolIdentification?.logo}`;
          const profilePicUrl = studentData?.node.userprofile?.customuser?.photo
            ? `https://api${params.domain}.e-conneq.com/media/${studentData.node.userprofile.customuser.photo}`
            : "https://dummyimage.com/300x300/cccccc/000000?text=?";
          const codePicUrl = studentData?.node.userprofile?.code
            ? `https://api${params.domain}.e-conneq.com/media/${studentData.node.userprofile.code}`
            : "https://dummyimage.com/300x300/cccccc/000000?text=?";

          // Ensure all images are preloaded or at least checked for availability
          await Promise.all([fetch(logoUrl), fetch(profilePicUrl), fetch(codePicUrl)]);

          updatedData.push(studentData);
        } catch (error: any) {
          console.error("Error loading image", error);
        }
      }

      setFetchedData(updatedData);
    };

    fetchImagesSequentially();
  }, [data, params]);

  return (
    <div>
      {!fetchedData ? (
        <div>Generating ...</div>
      ) : (
        <BlobProvider
          document={<IDPDFs
            fetchedData={fetchedData}
            params={params}
            qrCodeDataUrl={qrCodeDataUrl}
          />}
        >
          {({ url, loading }) => (
            loading
              ? <p className='flex items-center justify-center my-24'>Loading Preview...</p>
              : <iframe src={url || ""} width="100%" height="600px" />
          )}
        </BlobProvider>
      )}
    </div>
  );
};

export default IDComp2;


const IDPDFs = (
  { fetchedData, params, qrCodeDataUrl }:
    { fetchedData: EdgeSchoolFees[] | null, params: any, qrCodeDataUrl: string }
) => {

  if (!fetchedData || fetchedData?.length === 0) {
    return <Text>No data available</Text>;
  }


  return <Document>
    <Page
      size={fetchedData?.length > 1 ? "A4" : { width: 241, height: 153 }}
      style={fetchedData?.length > 1 ? styles.page : styles.single}
    >
      {fetchedData?.length > 1 && fetchedData?.map((studentData: EdgeSchoolFees, index: number) => (
        <RenderCard
          key={index}
          studentData={studentData}
          params={params}
          isMultiple={true}
          qrCodeDataUrl={qrCodeDataUrl}
        />
      ))}

      {fetchedData?.length === 1 && fetchedData?.map((studentData: EdgeSchoolFees, index: number) => (
        <RenderCard
          key={index}
          studentData={studentData}
          params={params}
          isMultiple={false}
          qrCodeDataUrl={qrCodeDataUrl}
        />
      ))}

    </Page>



  </Document>
}


const RenderCard = (
  { studentData, params, isMultiple, qrCodeDataUrl }:
    { studentData: EdgeSchoolFees, params: any, isMultiple: boolean, qrCodeDataUrl: string }
) => {

  const data = {
    fullName: studentData.node.userprofile.customuser.fullName,
    specialtyName: studentData.node.userprofile.specialty.mainSpecialty.specialtyName,
    level: studentData.node.userprofile.specialty.level.level,
    academicYear: studentData.node.userprofile.specialty.academicYear
  }

  return (
    <View
      style={isMultiple ? [styles.container, { width: "49%" }] : [styles.containerSin, { width: "100%" }]}
    >
      <View style={[styles.backgroundImage]}>
        <Image
          src="/images/idcards/id-background.png"
          style={{ height: "100%", width: "100%" }}
        />
      </View>

      <View style={[styles.mainSin,]}>

        <View style={{ height: "22%", color: "#1e40af", flexDirection: "row", gap: 2, justifyContent: "space-between", alignItems: "center", alignContent: "center", width: "100%", borderTopRightRadius: 5, borderTopLeftRadius: 5 }}>

          <View style={[styles.header, { width: "7%", alignItems: "center", justifyContent: "center", textAlign: "center" }]}>
          </View>

          <View
            style={{
              borderWidth: 0.1,
              width: "75%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontStyle: "italic",
                fontWeight: "semibold",
                fontSize: 10,
                textAlign: "center",
                width: "100%",
              }}
            >
              {studentData.node.userprofile.specialty?.school?.schoolName}
            </Text>
          </View>

          <View style={{ width: "18%", alignItems: "center", justifyContent: "center" }}>
            <Image
              src={`https://api${params.domain}.e-conneq.com/media/${studentData?.node.userprofile?.specialty?.school?.schoolIdentification?.logo}`}
              style={styles.logo}
            />
          </View>
        </View>


        <View style={[styles.body, { height: "78%", paddingLeft: 4 }]}>
          <View style={[styles.left]}>
            <View style={[styles.picture]}>
              <Image
                src={studentData?.node.userprofile?.customuser?.photo
                  ? `https://api${params.domain}.e-conneq.com/media/${studentData.node.userprofile.customuser.photo}`
                  : "https://dummyimage.com/300x300/cccccc/000000?text=?"}
                style={{ height: "100%" }}
              />
            </View>

            <View style={[styles.code]}>
              <Image
                src={qrCodeDataUrl}
                style={{ height: "100%" }}
              />
              {/* <Image
                src={studentData?.node.userprofile?.code
                  ? `https://api${params.domain}.e-conneq.com/media/${studentData?.node.userprofile.code}`
                  : "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"}
                style={{ height: "100%" }}
              /> */}
            </View>
          </View>
          <View style={[styles.right, { paddingTop: 3, gap: 4.5 }]}>


            <View style={[styles.info, { marginVertical: 0.5 }]}>
              <Text style={[{ fontSize: 10, fontWeight: "heavy", paddingLeft: 60, textAlign: "left", width: "100%" }]}>{studentData.node.userprofile.customuser.matricle}</Text>
            </View>

            <View style={[styles.info, {}]}>
              <Text
                style={[
                  styles.subBodyText,
                  {
                    fontSize: data.fullName.length < 31 ? 9 : 8,
                    marginTop: data.fullName.length < 31 ? 6 : 0,
                    paddingLeft: 60,
                    textAlign: "left",
                    width: "100%"
                  }
                ]}
              >
                {data.fullName}
              </Text>
            </View>

            <View style={[styles.info, {}]}>
              <Text style={[{ fontSize: 8, fontWeight: "bold", marginTop: 4, paddingLeft: 60, textAlign: "left", width: "100%", }]}
              >
                {studentData.node.userprofile.customuser.dob} - {studentData.node.userprofile.customuser.pob}
              </Text>
            </View>

            <View style={[styles.info]}>
              <Text
                style={[
                  {
                    fontSize: data.specialtyName.length < 19 ? 9 : 8,
                    fontWeight: "bold",
                    marginTop: data.specialtyName.length < 19 ? 4 : 0,
                    marginLeft: 60,
                    textAlign: "left",
                    width: "100%",
                    alignContent: "center",
                  },
                ]}
              >
                {data.specialtyName}
              </Text>
            </View>

            <View style={[styles.info, {}]}>
              <Text
                style={[{
                  fontSize: 9,
                  fontWeight: "semibold",
                  marginTop: data.specialtyName.length < 19 ? 4 : 0,
                  paddingLeft: 60, textAlign: "left", width: "100%", alignContent: "center"
                }]}
              >
                {data.academicYear}
              </Text>
            </View>

            <View style={[styles.info, {}]}>
              <Text
                style={[{
                  fontSize: 9,
                  fontWeight: "medium",
                  marginTop: data.specialtyName.length < 19 ? 4 : 0,
                  marginLeft: 60, textAlign: "left", width: "100%", alignContent: "center"
                }]}
              >
                {data.level}
              </Text>
            </View>

          </View>

        </View>
      </View>

    </View>
  )
}


const styles = StyleSheet.create({
  single: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    flex: "wrap",
    backgroundColor: "#fff",
  },
  containerSin: {
    padding: 0.5,
  },
  mainSin: {
    height: "100%",
    width: "100%",
    borderWidth: 0.1,
    borderRadius: 6,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },



  page: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    flex: "wrap",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 20,
    margin: 4
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: 1,
    zIndex: -1,
  },
  container: {
    margin: 2,
    height: "20%",
    padding: 2,
  },
  main: {
    height: "99.5%",
    width: "88.29%",
    borderWidth: 0.7,
    borderRadius: 6,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    // padding: 0.1,
  },
  boldText: {
    fontWeight: "bold",
    textAlign: "left",
  },
  info: {
    flexDirection: "row",
    gap: 0.5,
    justifyContent: "flex-start",
    alignItems: "center"
  },
  bodyText: {
    fontSize: 9,
    fontWeight: "medium"
  },
  subBodyText: {
    fontSize: 8,
    fontWeight: "bold",
    maxWidth: "100%",
    // wordWrap: "break-word",
  },
  textWrap: {
    fontSize: 9,
    maxWidth: '100%', // or a specific px value if needed
    flexWrap: 'wrap',
    whiteSpace: 'normal', // not officially supported but safe to include
    overflowWrap: 'break-word',
    textAlign: 'center',
  },
  logo: {
    height: 30, width: 30, borderWidth: 0.5, borderRadius: 5
  },
  header: {
    fontSize: 10,
    height: "100%",
    maxWidth: "100%", // Adjust as needed
    fontWeight: "bold"
  },
  body: {
    flexDirection: "row",
    width: "100%",
    gap: 2
  },
  left: {
    width: "27%",
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  right: {
    width: "73%",
  },
  picture: {
    borderWidth: 0.5,
    width: 60,
    height: 60,
    borderRadius: 3,
    justifyContent: "center",
    alignContent: "center",
    alignSelf: "center"
  },
  code: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignContent: "center",
    alignSelf: "center"
  },
});

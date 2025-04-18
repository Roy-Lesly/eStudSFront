'use client';

import React, { useEffect, useState } from 'react';
import { Page, Text, View, Document, StyleSheet, Image, BlobProvider } from "@react-pdf/renderer";

import { EdgeSchoolFees } from '@/Domain/schemas/interfaceGraphql';

const IDComp = ({ data, params, searchParams }: { data: EdgeSchoolFees[], params: any, searchParams: any }) => {

  return (
    <div>

      {data == null ?
        <div>Generating ...</div>
        :
        <BlobProvider
          document={<IDPDFs
            data={data}
            params={params}
          />}
        >
          {({ url, loading }) =>
            loading ? <p className='flex items-center justify-center my-24'>Loading Preview...</p> : <iframe src={url || ""} width="100%" height="600px" />
          }
        </BlobProvider>
      }

    </div>
  );
};

export default IDComp;

const IDPDFs = ({ data, params }: { data: EdgeSchoolFees[], params: any }) => {
  if (!data || data?.length === 0) {
    return <Text>No data available</Text>;
  }

  const [fetchedData, setFetchedData] = useState<EdgeSchoolFees[] | null>(null);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    const fetchImagesSequentially = async () => {
      const updatedData = [];
      for (const studentData of data) {
        const logoUrl = `https://api${params.domain}.e-conneq.com/media/${studentData?.node.userprofile?.specialty?.school?.schoolIdentification?.logo}`;
        const profilePicUrl = studentData?.node.userprofile?.user?.photo
          ? `https://api${params.domain}.e-conneq.com/media/${studentData.node.userprofile.user.photo}`
          : "https://dummyimage.com/300x300/cccccc/000000?text=?";
        const codePicUrl = studentData?.node.userprofile?.code
          ? `https://api${params.domain}.e-conneq.com/media/${studentData.node.userprofile.code}`
          : "https://dummyimage.com/300x300/cccccc/000000?text=?";

        try {
          await fetch(logoUrl); // Ensure the logo is fetched before proceeding
          await fetch(profilePicUrl); // Ensure profile pic is fetched before proceeding
          await fetch(codePicUrl); // Ensure profile pic is fetched before proceeding
          await delay(300); // 500ms delay, adjust as needed
        } catch (error) {
          console.error("Image fetch failed:", error);
        }

        updatedData.push(studentData);
      }

      setFetchedData(updatedData);
    };

    fetchImagesSequentially();
  }, [data, params]);

  if (!fetchedData) {
    return <div className='flex flex-col items-center justify-center my-20'>
      <span className='font-bold italic py-10 text-lg'>Loading ID...</span>
    </div>;
  }

  return <Document>
    <Page
      size={fetchedData?.length > 1 ? "A4" : { width: 241, height: 153 }}
      style={fetchedData?.length > 1 ? styles.page : styles.single}
    >
      {fetchedData?.length > 1 && fetchedData?.map((studentData: EdgeSchoolFees, index: number) => (
        <View style={[styles.container, { width: "50%" }]}>
          <View style={[styles.backgroundImage, { paddingTop: 40, paddingLeft: 110, paddingRight: 30 }]}>
            <Image
              src={`https://api${params.domain}.e-conneq.com/media/${studentData?.node.userprofile?.specialty?.school?.schoolIdentification?.logo}`}
              style={{ height: 120, width: 120 }}
            />
          </View>

          <View style={[styles.main,]}>

            <View style={{ height: "22%", backgroundColor: "#1e40af", color: "#fff", paddingVertical: 1.5, flexDirection: "row", gap: 4, justifyContent: "space-between", alignItems: "center", alignContent: "center", width: "100%", borderTopRightRadius: 5, borderTopLeftRadius: 5 }}>
              <View style={{ width: "18%", alignItems: "center", justifyContent: "center" }}>
                <Image
                  src={`https://api${params.domain}.e-conneq.com/media/${studentData?.node.userprofile?.specialty?.school?.schoolIdentification?.logo}`}
                  style={styles.logo}
                />
              </View>

              <View style={[styles.header, { width: "82%", alignItems: "center", justifyContent: "center", textAlign: "center", paddingLeft: 0.2, paddingRight: 1 }]}>
                <Text>{studentData.node.userprofile.specialty?.school?.schoolName}</Text>
              </View>
            </View>

            <View style={[styles.body, { height: "78%", paddingTop: 1.5 }]}>
              <View style={[styles.left]}>
                <View style={[styles.picture]}>
                  <Image
                    src={studentData?.node.userprofile?.user?.photo
                      ? `https://api${params.domain}.e-conneq.com/media/${studentData.node.userprofile.user.photo}`
                      : "https://dummyimage.com/300x300/cccccc/000000?text=?"}
                    style={{ height: "100%" }}
                  />
                </View>

                <View style={[styles.code]}>
                  <Image
                    src={studentData?.node.userprofile?.code
                      ? `https://api${params.domain}.e-conneq.com/media/${studentData?.node.userprofile.code}`
                      : "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"}
                    style={{ height: "100%" }}
                  />
                </View>
              </View>
              <View style={[styles.right, { paddingTop: 3, gap: 3.5, paddingHorizontal: 0.7 }]}>

                <View style={[styles.info, {}]}>
                  <View style={{ width: "32%" }}>
                    <Text style={[{ fontStyle: "italic", fontSize: 7, fontWeight: "bold", textAlign: "left" }]}>Full Name:</Text>
                    <Text style={[{ fontStyle: "italic", fontSize: 6, fontWeight: "bold", textAlign: "left" }]}>Nom et Prenom:</Text>
                  </View>
                  <Text style={[styles.subBodyText, { textAlign: "center", width: "68%", fontSize: 9 }]}>{studentData.node.userprofile.user.fullName}</Text>
                </View>

                <View style={[styles.info, { marginVertical: 0.5 }]}>
                  <View style={{ width: "33%" }}>
                    <Text style={[{ fontStyle: "italic", fontSize: 7, fontWeight: "bold", textAlign: "left" }]}>Matricle:</Text>
                  </View>
                  <Text style={[{ fontSize: 10, fontWeight: "heavy", textAlign: "center", width: "67%" }]}>{studentData.node.userprofile.user.matricle}</Text>
                </View>

                <View style={[styles.info, {}]}>
                  <View style={[styles.bodyText]}>
                    <Text style={[{ fontStyle: "italic", fontSize: 6, fontWeight: "bold", textAlign: "left" }]}>Date/Place of Birth:</Text>
                    <Text style={[{ fontStyle: "italic", fontSize: 6, fontWeight: "bold", textAlign: "left" }]}>Date/Lieu de N</Text>
                  </View>
                  <Text style={[{ fontSize: 8, fontWeight: "bold", textAlign: "center", width: "60%", }]}>{studentData.node.userprofile.user.dob} - {studentData.node.userprofile.user.pob}</Text>
                </View>

                <View style={[styles.info,]}>
                  <View style={{ width: "30%" }}>
                    <Text style={[{ fontStyle: "italic", fontSize: 7, fontWeight: "bold", textAlign: "left" }]}>Specialty:</Text>
                    <Text style={[{ fontStyle: "italic", fontSize: 6, fontWeight: "bold", textAlign: "left" }]}>Filiere:</Text>
                  </View>
                  <Text style={[{ fontSize: 9, fontWeight: "bold", textAlign: "center", width: "70%", alignContent: "center" }]}>{studentData.node.userprofile.specialty.mainSpecialty.specialtyName}</Text>
                </View>

                <View style={[styles.info, {}]}>
                  <View style={{ width: "30%" }}>
                    <Text style={[{ fontStyle: "italic", fontSize: 7, fontWeight: "bold", textAlign: "left" }]}>Year:</Text>
                    <Text style={[{ fontStyle: "italic", fontSize: 6, fontWeight: "bold", textAlign: "left" }]}>Annee:</Text>
                  </View>
                  <Text style={[{ fontSize: 9, fontWeight: "bold", textAlign: "center", width: "70%", alignContent: "center" }]}>{studentData.node.userprofile.specialty.academicYear}</Text>
                </View>

                <View style={[styles.info, {}]}>
                  <View style={{ width: "30%" }}>
                    <Text style={[{ fontStyle: "italic", fontSize: 7, fontWeight: "bold", textAlign: "left" }]}>Level:</Text>
                    <Text style={[{ fontStyle: "italic", fontSize: 6, fontWeight: "bold", textAlign: "left" }]}>Niveau:</Text>
                  </View>
                  <Text style={[{ fontSize: 9, fontWeight: "bold", textAlign: "center", width: "70%", alignContent: "center" }]}>{studentData.node.userprofile.specialty.level.level}</Text>
                </View>

              </View>

            </View>
          </View>

        </View>
      ))}

      {fetchedData?.length === 1 && fetchedData?.map((studentData: EdgeSchoolFees, index: number) => (
        <View style={[styles.containerSin, { width: "100%" }]}>
          <View style={[styles.backgroundImage, { paddingTop: 38, paddingLeft: 100, paddingRight: 1 }]}>
            <Image
              src={`https://api${params.domain}.e-conneq.com/media/${studentData?.node.userprofile?.specialty?.school?.schoolIdentification?.logo}`}
              style={{ height: 120, width: 120 }}
            />
          </View>

          <View style={[styles.mainSin,]}>

            <View style={{ height: "22%", backgroundColor: "#1e40af", color: "#fff", paddingVertical: 1.5, flexDirection: "row", gap: 4, justifyContent: "space-between", alignItems: "center", alignContent: "center", width: "100%", borderTopRightRadius: 5, borderTopLeftRadius: 5 }}>
              <View style={{ width: "18%", alignItems: "center", justifyContent: "center" }}>
                <Image
                  src={`https://api${params.domain}.e-conneq.com/media/${studentData?.node.userprofile?.specialty?.school?.schoolIdentification?.logo}`}
                  style={styles.logo}
                />
              </View>

              <View style={[styles.header, { width: "82%", alignItems: "center", justifyContent: "center", textAlign: "center", paddingLeft: 0.2, paddingRight: 1 }]}>
                <Text>{studentData.node.userprofile.specialty?.school?.schoolName}</Text>
              </View>
            </View>

            <View style={[styles.body, { height: "78%", paddingTop: 1.5 }]}>
              <View style={[styles.left]}>
                <View style={[styles.picture]}>
                  <Image
                    src={studentData?.node.userprofile?.user?.photo
                      ? `https://api${params.domain}.e-conneq.com/media/${studentData.node.userprofile.user.photo}`
                      : "https://dummyimage.com/300x300/cccccc/000000?text=?"}
                    style={{ height: "100%" }}
                  />
                </View>

                <View style={[styles.code]}>
                  <Image
                    src={studentData?.node.userprofile?.code
                      ? `https://api${params.domain}.e-conneq.com/media/${studentData?.node.userprofile.code}`
                      : "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"}
                    style={{ height: "100%" }}
                  />
                </View>
              </View>
              <View style={[styles.right, { paddingTop: 3, gap: 3.5, paddingHorizontal: 0.7 }]}>

                <View style={[styles.info, {}]}>
                  <View style={{ width: "32%" }}>
                    <Text style={[{ fontStyle: "italic", fontSize: 7, fontWeight: "bold", textAlign: "left" }]}>Full Name:</Text>
                    <Text style={[{ fontStyle: "italic", fontSize: 6, fontWeight: "bold", textAlign: "left" }]}>Nom et Prenom:</Text>
                  </View>
                  <Text style={[styles.subBodyText, { textAlign: "center", width: "68%", fontSize: 9 }]}>{studentData.node.userprofile.user.fullName}</Text>
                </View>

                <View style={[styles.info, { marginVertical: 0.5 }]}>
                  <View style={{ width: "33%" }}>
                    <Text style={[{ fontStyle: "italic", fontSize: 7, fontWeight: "bold", textAlign: "left" }]}>Matricle:</Text>
                  </View>
                  <Text style={[{ fontSize: 10, fontWeight: "heavy", textAlign: "center", width: "67%" }]}>{studentData.node.userprofile.user.matricle}</Text>
                </View>

                <View style={[styles.info, {}]}>
                  <View style={[styles.bodyText]}>
                    <Text style={[{ fontStyle: "italic", fontSize: 6, fontWeight: "bold", textAlign: "left" }]}>Date/Place of Birth:</Text>
                    <Text style={[{ fontStyle: "italic", fontSize: 6, fontWeight: "bold", textAlign: "left" }]}>Date/Lieu de N</Text>
                  </View>
                  <Text style={[{ fontSize: 8, fontWeight: "bold", textAlign: "center", width: "60%", }]}>{studentData.node.userprofile.user.dob} - {studentData.node.userprofile.user.pob}</Text>
                </View>

                <View style={[styles.info,]}>
                  <View style={{ width: "30%" }}>
                    <Text style={[{ fontStyle: "italic", fontSize: 7, fontWeight: "bold", textAlign: "left" }]}>Specialty:</Text>
                    <Text style={[{ fontStyle: "italic", fontSize: 6, fontWeight: "bold", textAlign: "left" }]}>Filiere:</Text>
                  </View>
                  <Text style={[{ fontSize: 9, fontWeight: "bold", textAlign: "center", width: "70%", alignContent: "center" }]}>{studentData.node.userprofile.specialty.mainSpecialty.specialtyName}</Text>
                </View>

                <View style={[styles.info, {}]}>
                  <View style={{ width: "30%" }}>
                    <Text style={[{ fontStyle: "italic", fontSize: 7, fontWeight: "bold", textAlign: "left" }]}>Year:</Text>
                    <Text style={[{ fontStyle: "italic", fontSize: 6, fontWeight: "bold", textAlign: "left" }]}>Annee:</Text>
                  </View>
                  <Text style={[{ fontSize: 9, fontWeight: "bold", textAlign: "center", width: "70%", alignContent: "center" }]}>{studentData.node.userprofile.specialty.academicYear}</Text>
                </View>

                <View style={[styles.info, {}]}>
                  <View style={{ width: "30%" }}>
                    <Text style={[{ fontStyle: "italic", fontSize: 7, fontWeight: "bold", textAlign: "left" }]}>Level:</Text>
                    <Text style={[{ fontStyle: "italic", fontSize: 6, fontWeight: "bold", textAlign: "left" }]}>Niveau:</Text>
                  </View>
                  <Text style={[{ fontSize: 9, fontWeight: "bold", textAlign: "center", width: "70%", alignContent: "center" }]}>{studentData.node.userprofile.specialty.level.level}</Text>
                </View>

              </View>

            </View>
          </View>

        </View>
      ))}

    </Page>



  </Document>
}


const styles = StyleSheet.create({
  single: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    flex: "wrap",
    backgroundColor: "#fff",
    // padding: 0.1,
  },
  containerSin: {
    // height: "20%",
    padding: 0.5,
  },
  mainSin: {
    height: "100%",
    width: "100%",
    borderWidth: 0.7,
    borderRadius: 6,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    // padding: 0.1,
  },



  page: {
    flexDirection: "row", // Arrange children in a row
    flexWrap: "wrap", // Allow wrapping into multiple lines
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
    opacity: 0.2,
    zIndex: -1,
  },
  container: {
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
    maxWidth: "100%", // Adjust as needed
    // wordWrap: "break-word",
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
    gap: 2,
    paddingLeft: 2,
    width: "26%",
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  right: {
    width: "74%",
  },
  picture: {
    borderWidth: 0.5,
    width: 50,
    height: 50,
    borderRadius: 4,
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

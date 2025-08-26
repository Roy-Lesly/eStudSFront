'use client';
import { gql } from "@apollo/client";
import { ApiFactory } from "../ApiFactory";


export const mutationCreateUpdatePreInscription = async (
  { section, formData, p, routeToLink, router }:
    { section: "H" | "S" | "P" | "V", formData: any, p: any, routeToLink: string, router: any }
) => {

  const data: any = {
    firstName: formData?.firstName?.toString().toUpperCase(),
    lastName: formData?.lastName?.toString().toUpperCase(),
    sex: formData?.sex.toString().toUpperCase(),
    email: formData?.email?.toString().toLowerCase(),
    telephone: formData?.telephone,
    address: formData?.address?.toString().toUpperCase(),
    pob: formData?.pob?.toString().toUpperCase(),
    dob: formData?.dob,

    nationality: formData?.nationality,
    regionOfOrigin: formData?.regionOfOrigin,
    highestCertificate: formData?.highestCertificate,
    yearObtained: formData?.yearObtained,
    grade: formData?.grade,
    fatherName: formData?.fatherName?.toString().toUpperCase(),
    motherName: formData?.motherName?.toString().toUpperCase(),
    parentAddress: formData?.parentAddress?.toString().toUpperCase(),
    fatherTelephone: formData?.fatherTelephone?.toString().toUpperCase(),
    motherTelephone: formData?.motherTelephone?.toString().toUpperCase(),

    academicYear: formData?.academicYear,
    session: formData?.session,
    level: formData?.level,
    programId: formData?.programId,
    specialtyOne: formData?.specialtyOne,
    specialtyTwo: formData?.specialtyTwo,
    action: formData?.action,
    campusId: formData?.campusId,
    status: formData?.status,
    admissionStatus: formData?.admissionStatus,

    delete: false,
  };


  let dataSec: any = {
    firstName: formData?.firstName?.toString().toUpperCase(),
    lastName: formData?.lastName?.toString().toUpperCase(),
    sex: formData?.sex.toString().toUpperCase(),
    address: formData?.address?.toString().toUpperCase(),
    pob: formData?.pob?.toString().toUpperCase(),
    dob: formData?.dob,

    nationality: formData?.nationality,
    regionOfOrigin: formData?.regionOfOrigin,
    highestCertificate: formData?.highestCertificate,
    yearObtained: formData?.yearObtained,
    grade: formData?.grade,
    fatherName: formData?.fatherName?.toString().toUpperCase(),
    motherName: formData?.motherName?.toString().toUpperCase(),
    parentAddress: formData?.parentAddress?.toString().toUpperCase(),
    fatherTelephone: formData?.fatherTelephone?.toString().toUpperCase(),
    motherTelephone: formData?.motherTelephone?.toString().toUpperCase(),
    email: formData?.email,

    academicYear: formData?.academicYear,
    level: formData?.level,
    program: formData?.program,
    action: formData?.action,
    campusId: formData?.campusId,
    stream: formData?.stream,
    session: formData?.session,
    seriesOneId: formData?.seriesOneId,
    status: formData?.status,
    admissionStatus: formData?.admissionStatus,

    delete: false,
  };

  let dataPrim: any = {
    firstName: formData?.firstName?.toString().toUpperCase(),
    lastName: formData?.lastName?.toString().toUpperCase(),
    sex: formData?.sex.toString().toUpperCase(),
    address: formData?.address?.toString().toUpperCase(),
    pob: formData?.pob?.toString().toUpperCase(),
    dob: formData?.dob,

    nationality: formData?.nationality,
    regionOfOrigin: formData?.regionOfOrigin,
    fatherName: formData?.fatherName?.toString().toUpperCase(),
    motherName: formData?.motherName?.toString().toUpperCase(),
    parentAddress: formData?.parentAddress?.toString().toUpperCase(),
    fatherTelephone: formData?.fatherTelephone?.toString().toUpperCase(),
    motherTelephone: formData?.motherTelephone?.toString().toUpperCase(),
    parentEmail: formData?.parentEmail,

    academicYear: formData?.academicYear,
    level: formData?.level,
    program: formData?.program,
    action: formData?.action,
    campusId: formData?.campusId,
    status: formData?.status,
    admissionStatus: formData?.admissionStatus,

    delete: false,
  };


  const preInscripSuccessFieldData = await ApiFactory({
    newData: section === "H" ?
      data : section === "S" ?
        dataSec : section === "P" ?
          dataPrim :
          data,

    editData: section === "H" ?
      { ...data, id: formData?.id } : section === "S" ?
        { ...dataSec, id: formData?.id } : section === "P" ?
          { ...dataPrim, id: formData?.id } :
          { ...data, id: formData?.id },

    mutationName: section === "H" ?
      "createUpdateDeletePreinscription" : section === "S" ?
        "createUpdateDeletePreinscriptionSec" : section === "P" ?
          "createUpdateDeletePreinscriptionPrim" :
          "createUpdateDeletePreinscription",

    modelName: section === "H" ?
      "preinscription" : section === "S" ?
        "preinscriptionsec" : section === "P" ?
          "preinscriptionprim" :
          "preinscription",

    successField: "id",

    query: section === "H" ?
      queryPreInscription : section === "S" ?
        queryPreInscriptionSec : section === "P" ?
          queryPreInscriptionPrim :
          queryPreInscription,

    router,
    params: p,
    redirect: false,
    reload: false,
    returnResponseField: true,
    redirectPath: ``,
    actionLabel: "creating",
  });

  console.log(preInscripSuccessFieldData);

  if (preInscripSuccessFieldData) {
    if (routeToLink) {
      router.push(routeToLink);
    }
    return preInscripSuccessFieldData
  } else {
    return false
  }
}


const queryPreInscription = gql`
  mutation Create(
    $firstName: String!
    $lastName: String!
    $sex: String!
    $email: String!
    $telephone: String!
    $address: String!
    $pob: String!
    $dob: String!

    $nationality: String!
    $regionOfOrigin: String!
    $highestCertificate: String!
    $yearObtained: String!
    $grade: String!
    $fatherName: String!
    $motherName: String!
    $parentAddress: String!
    $fatherTelephone: String!
    $motherTelephone: String!

    $academicYear: String!
    $session: String!
    $level: String!
    $programId: ID!
    $specialtyOne: ID!
    $specialtyTwo: ID
    $action: String!
    $campusId: ID!
    $status: String!
    $admissionStatus: Boolean!
    $delete: Boolean!
  ) {
    createUpdateDeletePreinscription(
      firstName: $firstName
      lastName: $lastName
      sex: $sex
      address: $address
      email: $email
      telephone: $telephone
      pob: $pob
      dob: $dob

      nationality: $nationality
      highestCertificate: $highestCertificate
      yearObtained: $yearObtained
      grade: $grade
      regionOfOrigin: $regionOfOrigin
      fatherName: $fatherName
      motherName: $motherName
      parentAddress: $parentAddress
      fatherTelephone: $fatherTelephone
      motherTelephone: $motherTelephone

      academicYear: $academicYear
      session: $session
      level: $level
      programId: $programId
      specialtyOneId: $specialtyOne
      specialtyTwoId: $specialtyTwo
      action: $action
      campusId: $campusId
      status: $status
      admissionStatus: $admissionStatus
      delete: $delete
    ) {
      preinscription {
        id firstName
      }
    }
  }
`;


const queryPreInscriptionSec = gql`
  mutation Create(
    $firstName: String!
    $lastName: String!
    $sex: String!
    $address: String!
    $pob: String!
    $dob: String!

    $nationality: String!
    $regionOfOrigin: String!
    $fatherName: String!
    $motherName: String!
    $parentAddress: String!
    $fatherTelephone: String!
    $motherTelephone: String!
    $email: String!

    $academicYear: String!
    $level: String!
    $program: String!
    $action: String!
    $campusId: ID!
    $stream: String!
    $session: String!
    $seriesOneId: ID!
    $status: String!
    $admissionStatus: Boolean!
    $delete: Boolean!
  ) {
    createUpdateDeletePreinscriptionSec (
      firstName: $firstName
      lastName: $lastName
      sex: $sex
      address: $address
      pob: $pob
      dob: $dob

      nationality: $nationality
      regionOfOrigin: $regionOfOrigin
      fatherName: $fatherName
      motherName: $motherName
      parentAddress: $parentAddress
      fatherTelephone: $fatherTelephone
      motherTelephone: $motherTelephone
      email: $email

      academicYear: $academicYear
      level: $level
      program: $program
      action: $action
      campusId: $campusId
      stream: $stream
      session: $session
      seriesOneId: $seriesOneId
      status: $status
      admissionStatus: $admissionStatus
      delete: $delete
    ) {
      preinscriptionsec {
        id
      }  
    }
  }
`;

const queryPreInscriptionPrim = gql`
  mutation Create(
    $firstName: String!
    $lastName: String!
    $sex: String!
    $address: String!
    $pob: String!
    $dob: String!

    $nationality: String!
    $regionOfOrigin: String!
    $fatherName: String!
    $motherName: String!
    $parentAddress: String!
    $fatherTelephone: String!
    $motherTelephone: String!
    $parentEmail: String!

    $academicYear: String!
    $level: String!
    $program: String!
    $action: String!
    $campusId: ID!
    $status: String!
    $admissionStatus: Boolean!
    $delete: Boolean!
  ) {
    createUpdateDeletePreinscriptionPrim (
      firstName: $firstName
      lastName: $lastName
      sex: $sex
      address: $address
      pob: $pob
      dob: $dob

      nationality: $nationality
      regionOfOrigin: $regionOfOrigin
      fatherName: $fatherName
      motherName: $motherName
      parentAddress: $parentAddress
      fatherTelephone: $fatherTelephone
      motherTelephone: $motherTelephone
      parentEmail: $parentEmail

      academicYear: $academicYear
      level: $level
      program: $program
      action: $action
      campusId: $campusId
      status: $status
      admissionStatus: $admissionStatus
      delete: $delete
    ) {
      preinscriptionprim {
        id
      }
    }
  }
`;
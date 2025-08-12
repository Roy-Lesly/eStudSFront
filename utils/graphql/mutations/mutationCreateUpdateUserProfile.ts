'use client';
import { gql } from "@apollo/client";
import { ApiFactory } from "../ApiFactory";
import { capitalizeFirstLetter } from "@/utils/functions";


export const mutationCreateUpdateUserProfile = async (
  { section, formData, p, routeToLink, router }:
    { section: "H" | "S" | "P" | "V", formData: any, p: any, routeToLink: string, router: any }
) => {

  const dataUserprofile = {
    customuserId: formData?.customuserId,
    specialtyId: formData?.specialtyId,
    infoData: formData?.infoData || "{}",
    active: formData?.active,
    programId: formData?.programId,
    session: capitalizeFirstLetter(formData?.session),
    createdById: formData?.createdById,
    updatedById: formData?.updatedById,

    delete: false,
  };

  const dataUserprofilePrim = {
    customuserId: formData?.customuserId,
    classroomprimId: formData?.classroomprimId,
    active: formData?.active,
    programprim: formData?.programprim,
    createdById: formData?.createdById,
    updatedById: formData?.updatedById,

    delete: false,
  };

  const dataUserprofileSec = {
    customuserId: formData?.customuserId,
    classroomsecId: formData?.classroomsecId,
    seriesId: formData?.seriesId,
    additionalSubjectsIds: formData?.additionalSubjectsIds,
    active: formData?.active,
    programsec: formData?.programsec,
    session: capitalizeFirstLetter(formData?.session),
    createdById: formData?.createdById,
    updatedById: formData?.updatedById,

    delete: false,
  };

  const userSuccessFieldData = await ApiFactory({
    newData: section === "H" ?
      dataUserprofile : section === "S" ?
        dataUserprofileSec : section === "P" ?
          dataUserprofilePrim :
          dataUserprofile,

    editData: section === "H" ?
      { ...dataUserprofile, id: formData?.id } : section === "S" ?
        { ...dataUserprofileSec, id: formData?.id } : section === "P" ?
          { ...dataUserprofilePrim, id: formData?.id } :
          { ...dataUserprofile, id: formData?.id },

    mutationName: section === "H" ?
      "createUpdateDeleteUserProfile" : section === "S" ?
        "createUpdateDeleteUserProfileSec" : section === "P" ?
          "createUpdateDeleteUserProfilePrim" :
          "createUpdateDeleteUserProfile",

    modelName: section === "H" ?
      "userprofile" : section === "S" ?
        "userprofilesec" : section === "P" ?
          "userprofileprim" :
          "userprofile",

    successField: "id",

    query: section === "H" ?
      queryUserprofile : section === "S" ?
        queryUserprofileSec : section === "P" ?
          queryUserprofilePrim :
          queryUserprofile,

    router,
    params: p,
    redirect: false,
    reload: false,
    returnResponseField: true,
    redirectPath: ``,
    actionLabel: "creating",
  });

  if (userSuccessFieldData) {
    if (routeToLink) {
      router.push(routeToLink);
    }
    return userSuccessFieldData
  } else {
    return false
  }
}



const queryUserprofile = gql`
  mutation CreateUserProfile(
    $customuserId: ID!
    $specialtyId: ID!
    $programId: ID!
    $session: String!
    $infoData: JSONString!
    $delete: Boolean!
  ) {
    createUpdateDeleteUserProfile(
      customuserId: $customuserId
      specialtyId: $specialtyId
      programId: $programId
      session: $session
      infoData: $infoData
      delete: $delete
    ) {
      userprofile {
        id
      }
    }
  }
`;



const queryUserprofileSec = gql`
  mutation Create(
    $id: ID
    $customuserId: ID!
    $classroomsecId: ID
    $seriesId: ID
    $additionalSubjectsIds: [ID]

    $active: Boolean
    $programsec: String
    $session: String
    $createdById: ID
    $updatedById: ID

    $delete: Boolean!
  ) {
    createUpdateDeleteUserProfileSec(
      id: $id
      customuserId: $customuserId
      classroomsecId: $classroomsecId
      seriesId: $seriesId
      additionalSubjectsIds: $additionalSubjectsIds

      active: $active
      programsec: $programsec
      session: $session
      createdById: $createdById
      updatedById: $updatedById

      delete: $delete
    ) {
      userprofilesec {
        id
      }
    }
  }
`;


const queryUserprofilePrim = gql`
  mutation Create(
    $id: ID
    $customuserId: ID!
    $classroomprimId: ID

    $active: Boolean
    $programprim: String
    $createdById: ID
    $updatedById: ID

    $delete: Boolean!
  ) {
    createUpdateDeleteUserProfilePrim(
      id: $id
      customuserId: $customuserId
      classroomprimId: $classroomprimId

      active: $active
      programprim: $programprim
      createdById: $createdById
      updatedById: $updatedById

      delete: $delete
    ) {
      userprofileprim {
        id
      }
    }
  }
`;


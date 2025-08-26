'use client';
import { gql } from "@apollo/client";
import { ApiFactory } from "../ApiFactory";


export const mutationCreateUpdateSchoolfees = async (
  { section, formData, p, routeToLink, router }:
    { section: "H" | "S" | "P" | "V", formData: any, p: any, routeToLink: string, router: any }
) => {

  let data: any = {
    userprofileId: formData?.userprofileId,
    delete: false,
  };

  let dataSec: any = {
    userprofilesecId: formData?.userprofilesecId,
    delete: false,
  };

  let dataPrim: any = {
    userprofileprimId: formData?.userprofileprimId,
    delete: false,
  };


  const feesSuccessFieldData = await ApiFactory({
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
      "createUpdateDeleteSchoolfees" : section === "S" ?
        "createUpdateDeleteSchoolfeesSec" : section === "P" ?
          "createUpdateDeleteSchoolfeesPrim" :
          "createUpdateDeleteSchoolfees",

    modelName: section === "H" ?
      "schoolfees" : section === "S" ?
        "schoolfeessec" : section === "P" ?
          "schoolfeesprim" :
          "schoolfees",

    successField: "id",

    query: section === "H" ?
      querySchoolFees : section === "S" ?
        querySchoolFeesSec : section === "P" ?
          querySchoolFeesPrim :
          querySchoolFees,

    router,
    params: p,
    redirect: false,
    reload: false,
    returnResponseField: true,
    redirectPath: ``,
    actionLabel: "creating",
  });

  console.log(feesSuccessFieldData);

  if (feesSuccessFieldData) {
    if (routeToLink) {
      router.push(routeToLink);
    }
    return feesSuccessFieldData
  } else {
    return false
  }
}


const querySchoolFees = gql`
  mutation Create(
    $userprofileId: ID!
    $delete: Boolean!
  ) {
    createUpdateDeleteSchoolfees(
      userprofileId: $userprofileId
      delete: $delete
    ) {
      schoolfees {
        id firstName
      }
    }
  }
`;


const querySchoolFeesSec = gql`
  mutation Create(
    $userprofilesecId: ID!
    $delete: Boolean!
  ) {
    createUpdateDeleteSchoolfeesSec(
      userprofilesecId: $userprofilesecId
      delete: $delete
    ) {
      schoolfeessec {
        id
      }
    }
  }
`;


const querySchoolFeesPrim = gql`
  mutation Create(
    $userprofileprimId: ID!
    $delete: Boolean!
  ) {
    createUpdateDeleteSchoolfeesPrim(
      userprofileprimId: $userprofileprimId
      delete: $delete
    ) {
      schoolfeesprim {
        id
      }
    }
  }
`;
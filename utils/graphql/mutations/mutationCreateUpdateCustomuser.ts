'use client';
import { gql } from "@apollo/client";
import { ApiFactory } from "../ApiFactory";
import { capitalizeFirstLetter, removeEmptyFields } from "@/utils/functions";


export const mutationCreateUpdateCustomuser = async (
  { formData, p, routeToLink, router }:
  { formData: any, p: any, routeToLink: string, router: any }
) => {

  console.log(formData);

    let dataCustomuser: any = {
      password: formData?.password?.toString().toUpperCase() || "12345",
      username: formData?.username?.toString().toUpperCase(),
      role: formData?.role,
      passwordSet: formData?.passwordSet || false,
      language: formData?.language || "En",
      schoolIds: formData?.schoolIds,
      deptIds: formData?.schoolIds || [],
      email: formData?.email?.toLowerCase() || formData?.parentEmail.toLowerCase(),
      emailConfirmed: formData?.emailConfirmed || false,

      firstName: formData?.firstName?.toString().toUpperCase(),
      lastName: formData?.lastName?.toString().toUpperCase(),
      about: capitalizeFirstLetter(formData?.about),
      fullName: formData?.firstName?.toString().toUpperCase() + " " + formData?.lastName?.toString().toUpperCase(),
      address: formData?.address?.toString().toUpperCase(),
      sex: formData?.sex?.toUpperCase(),
      telephone: formData?.telephone,
      title: formData?.title?.toString().toUpperCase(),
      pob: formData?.pob?.toString().toUpperCase(),
      dob: formData?.dob,

      fatherName: formData?.fatherName?.toString().toUpperCase(),
      motherName: formData?.motherName?.toString().toUpperCase(),
      fatherTelephone: formData?.fatherTelephone?.toString().toUpperCase(),
      motherTelephone: formData?.motherTelephone?.toString().toUpperCase(),
      parentAddress: formData?.parentAddress?.toString().toUpperCase(),
      parentPassword: formData?.parentPassword,
      
      nationality: formData?.nationality,
      regionOfOrigin: formData?.regionOfOrigin,
      highestCertificate: formData?.highestCertificate,
      yearObtained: formData?.yearObtained,
      isHod: formData?.isHod,

      delete: false,
    };

    if (formData.id) {
      dataCustomuser = { 
        ...dataCustomuser,
        id: formData.id
      }
    }

    const userSuccessFieldData = await ApiFactory({
      newData: dataCustomuser,
      editData: dataCustomuser,
      mutationName: "createUpdateDeleteCustomuser",
      modelName: "customuser",
      successField: "id",
      query: queryCustomUser,
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



const queryCustomUser = gql`
  mutation Create(
    $id: ID
    $password: String
    $username: String
    $role: String
    $passwordSet: Boolean
    $language: String
    $deptIds: [ID]
    $schoolIds: [ID!]!
    $email: String
    $emailConfirmed: Boolean

    $firstName: String
    $lastName: String
    $about: String
    $address: String
    $sex: String
    $telephone: String
    $title: String
    $pob: String
    $dob: String

    $fatherName: String
    $motherName: String
    $fatherTelephone: String
    $motherTelephone: String
    $parentAddress: String
    $parentPassword: String

    $nationality: String
    $regionOfOrigin: String
    $highestCertificate: String
    $yearObtained: String
    $isHod: Boolean
    $prefix: String

    $delete: Boolean!
  ) {
    createUpdateDeleteCustomuser(
      id: $id
      password: $password
      username: $username
      role: $role
      passwordSet: $passwordSet
      language: $language
      deptIds: $deptIds
      schoolIds: $schoolIds
      email: $email
      emailConfirmed: $emailConfirmed

      firstName: $firstName
      lastName: $lastName
      about: $about      
      address: $address
      sex: $sex
      telephone: $telephone
      title: $title
      pob: $pob
      dob: $dob

      fatherName: $fatherName
      motherName: $motherName
      fatherTelephone: $fatherTelephone
      motherTelephone: $motherTelephone
      parentAddress: $parentAddress
      parentPassword: $parentPassword

      nationality: $nationality
      regionOfOrigin: $regionOfOrigin
      highestCertificate: $highestCertificate
      yearObtained: $yearObtained
      isHod: $isHod
      prefix: $prefix

      delete: $delete
    ) {
      customuser {
        id
      }
    }
  }
`;

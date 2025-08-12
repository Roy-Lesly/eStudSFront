'use client';
import { gql } from "@apollo/client";
import { ApiFactory } from "../ApiFactory";
import { capitalizeFirstLetter, removeEmptyFields } from "@/utils/functions";


export const mutationCreateUpdateCustomuser = async (
  { formData, p, routeToLink, router }:
  { formData: any, p: any, routeToLink: string, router: any }
) => {

    let dataCustomuser: any = {
      password: formData?.password,
      username: formData?.username?.toString().toUpperCase(),
      sex: formData?.sex.toString().toUpperCase(),
      role: formData?.role.toLowerCase(),
      passwordSet: formData?.passwordSet,
      language: formData?.language,
      schoolIds: formData?.schoolIds,
      deptIds: formData?.deptIds,
      email: formData?.email ? formData?.email?.toLowerCase() : formData?.parentEmail ? formData?.parentEmail.toLowerCase() : undefined,
      emailConfirmed: formData?.emailConfirmed,

      firstName: formData?.firstName?.toString().toUpperCase(),
      lastName: formData?.lastName?.toString().toUpperCase(),
      about: capitalizeFirstLetter(formData?.about),
      fullName: (formData?.firstName || formData?.lastName) ? (formData?.firstName?.toString().toUpperCase() + " " + formData?.lastName?.toString().toUpperCase()) : undefined,
      address: formData?.address?.toString().toUpperCase(),
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
      infoData: formData?.infoData,
      isHod: formData?.isHod,
      isActive: formData?.isActive,
      isStaff: formData?.isStaff,
      isSuperuser: formData?.isSuperuser,

      delete: false,
    };

    if (formData.id) {
      dataCustomuser = { 
        ...dataCustomuser,
        id: formData.id
      }
    }

    const userSuccessFieldData = await ApiFactory({
      newData: removeEmptyFields(dataCustomuser),
      editData: removeEmptyFields(dataCustomuser),
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
    $schoolIds: [ID]
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
    $infoData: JSONString!
    $prefix: String
    $isActive: Boolean
    $isStaff: Boolean
    $isSuperuser: Boolean

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
      infoData: $infoData
      prefix: $prefix
      isActive: $isActive
      isStaff: $isStaff
      isSuperuser: $isSuperuser

      delete: $delete
    ) {
      customuser {
        id
      }
    }
  }
`;

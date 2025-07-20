'use client';
import { gql } from "@apollo/client";
import { ApiFactory } from "../ApiFactory";


export const mutationCreateUpdateUserProfilePrim = async (
  { formData, p, routeToLink, router }:
    { formData: any, p: any, routeToLink: string, router: any }
) => {

  const dataUserprofilePrim = {
    customuserId: formData?.customuserId,
    classroomprimId: formData?.classroomprimId,
    active: formData?.active,
    programprim: formData?.programprim,
    createdById: formData?.createdById,
    updatedById: formData?.updatedById,

    delete: false,
  };

  console.log(dataUserprofilePrim);
  console.log(dataUserprofilePrim);

  const userSuccessFieldData = await ApiFactory({
    newData: dataUserprofilePrim,
    editData: { ...dataUserprofilePrim, id: formData?.id },
    mutationName: "createUpdateDeleteUserProfilePrim",
    modelName: "userprofileprim",
    successField: "id",
    query: queryUserprofilePrim,
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

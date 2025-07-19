'use client';
import { gql } from "@apollo/client";
import { ApiFactory } from "../ApiFactory";
import { capitalizeFirstLetter } from "@/utils/functions";


export const mutationCreateUpdateUserProfileSec = async (
  { formData, p, routeToLink, router }:
    { formData: any, p: any, routeToLink: string, router: any }
) => {

  const dataUserprofileSec = {
    customuserId: formData?.customuserId,
    classroomsecId: formData?.classroomsecId,
    seriesId: formData?.seriesId,
    additionalSubjectsIds: formData?.additionalSubjectsIds,
    active: formData?.active,
    programsecId: formData?.programsecId,
    session: capitalizeFirstLetter(formData?.session),
    createdById: formData?.createdById,
    updatedById: formData?.updatedById,

    delete: false,
  };

  console.log(dataUserprofileSec);

  const userSuccessFieldData = await ApiFactory({
    newData: dataUserprofileSec,
    editData: { ...dataUserprofileSec, id: formData?.id },
    mutationName: "createUpdateDeleteUserProfileSec",
    modelName: "userprofilesec",
    successField: "id",
    query: queryUserprofileSec,
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



const queryUserprofileSec = gql`
  mutation Create(
    $id: ID
    $customuserId: ID!
    $classroomsecId: ID
    $seriesId: ID
    $additionalSubjectsIds: [ID]

    $active: Boolean
    $programsecId: ID
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
      programsecId: $programsecId
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

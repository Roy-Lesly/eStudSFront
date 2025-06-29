'use client';

import { ApiFactory } from "@/utils/ApiFactory";
import { gql } from "@apollo/client";


export const createCustomUser = async (
  { formData, p, routeToLink, router }:
  { formData: any, p: any, routeToLink: string, router: any }
) => {


    console.log(formData);

    const dataCustomuser = {
      username: formData.username?.toString().toUpperCase(),
      firstName: formData.firstName?.toString().toUpperCase(),
      lastName: formData.lastName?.toString().toUpperCase(),
      fullName: formData.firstName?.toString().toUpperCase() + " " + formData.lastName?.toString().toUpperCase(),
      role: formData.role,
      email: formData.email,
      sex: formData.sex.toUpperCase(),
      telephone: formData.telephone,
      address: formData.address?.toString().toUpperCase(),
      delete: false,
    };

    const userSuccessFieldData = await ApiFactory({
      newData: dataCustomuser,
      editData: {},
      mutationName: "createUpdateDeleteCustomUser",
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
    $username: String!
    $firstName: String!
    $lastName: String!
    $role: String!
    $telephone: String!
    $sex: String!
    $email: String!
    $address: String!
    $delete: Boolean!
  ) {
    createUpdateDeleteCustomUser(
      username: $username
      firstName: $firstName
      lastName: $lastName
      role: $role
      telephone: $telephone
      sex: $sex
      email: $email
      address: $address

      delete: $delete
    ) {
      customuser {
        id
      }
    }
  }
`;


const queryUserprofile = gql`
  mutation Create(
    $customUser: ID!
    $classroom: ID!
    $series: ID!
    $program: ID!
    $session: String!
    $delete: Boolean!
  ) {
    createUpdateDeleteUserProfile(
      customUserId: $customUser
      

      nationality: $nationality
      regionOfOrigin: $regionOfOrigin
      delete: $delete
    ) {
      userprofile {
        id
      }
    }
  }
`;

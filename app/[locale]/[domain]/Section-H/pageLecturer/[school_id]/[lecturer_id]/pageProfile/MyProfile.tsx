'use client';

import MyInputField from '@/components/MyInputField';
import { JwtPayload } from '@/serverActions/interfaces';
import { CertificateOptions, RegionList } from '@/utils/constants';
import { decodeUrlID } from '@/utils/functions';
import { errorLog } from '@/utils/graphql/GetAppolloClient';
import { mutationCreateUpdateCustomuser } from '@/utils/graphql/mutations/mutationCreateUpdateCustomuser';
import { gql } from '@apollo/client';
import { jwtDecode } from 'jwt-decode';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const MyProfile = ({ userInfo, p }: { userInfo: any, p: any }) => {

  const { t } = useTranslation("common");
  const token = localStorage.getItem("token")
  const user: JwtPayload | null = token ? jwtDecode(token) : null;

  const [updated, setUpdated] = useState(false)
  const [formData, setFormData] = useState({
    id: decodeUrlID(userInfo?.id),
    firstName: userInfo?.firstName || '',
    lastName: userInfo?.lastName || '',
    matricle: userInfo?.matricle || '',
    role: userInfo?.role || '',
    email: userInfo?.email || '',
    telephone: userInfo?.telephone || '',
    nationality: userInfo?.nationality || '',
    sex: userInfo?.sex || '',
    pob: userInfo?.pob || '',
    dob: userInfo?.dob || '',
    address: userInfo?.address || '',
    regionOfOrigin: userInfo?.regionOfOrigin || '',
    highestCertificate: userInfo?.highestCertificate || '',
    yearObtained: userInfo?.yearObtained || '',
    infoData: userInfo?.infoData || "{}"
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setUpdated(true)
  };

  const handleSave = async () => {

    const submitData = {
      ...userInfo,
      ...formData,
    }

    if ([submitData].length > 0 && submitData && submitData?.id) {
      for (let index = 0; index < [formData].length; index++) {
        const res = [submitData][index];
        try {
          const resUserId = await mutationCreateUpdateCustomuser({
            formData: res,
            p,
            router: null,
            routeToLink: "",
          })

          if (resUserId.length > 5) {
            alert(t("Operation Successful") + " " + `✅`)
            window.location.reload();
          }
        } catch (error) {
          errorLog(error);
        }
      }
    }
  };

  const last20Years = Array.from({ length: 20 }, (_, i) => (new Date().getFullYear() - (i + 1)).toString());
  return (
    <div className="w-full max-w-4xl p-6 bg-white rounded-2xl shadow-lg space-y-6">
      <h2 className="text-xl font-semibold text-gray-700">{t("My Profile")}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label={t("Username")} name="matricle" readOnly={true} value={formData.matricle} onChange={handleChange} />
        <Input label={t("First Name")} name="firstName" value={formData.firstName} onChange={handleChange} />
        <Input label={t("Last Name")} name="lastName" value={formData.lastName} onChange={handleChange} />
        <Select label={t("Sex")} name="sex" value={formData.sex} onChange={handleChange} options={['MALE', 'FEMALE']} />
        <Input label={t("Place of Birth")} name="pob" value={formData.pob} onChange={handleChange} />
        <Input label={t("Date of Birth")} name="dob" value={formData.dob} onChange={handleChange} type="date" />
        <Input label={t("Email")} name="email" value={formData.email} onChange={handleChange} type="email" />
        <Input label={t("Telephone")} name="telephone" value={formData.telephone} onChange={handleChange} />
        <Input label={t("Nationality")} name="nationality" value={formData.nationality} onChange={handleChange} />
        <Input label={t("Address")} name="address" value={formData.address} onChange={handleChange} />
        <MyInputField
          id="regionOfOrigin"
          name="regionOfOrigin"
          value={formData?.regionOfOrigin}
          onChange={handleChange}
          label="Region Of Origin"
          placeholder={t("regionOfOrigin")}
          type='select'
          options={RegionList}
          required
        />
        <MyInputField
          id="highestCertificate"
          name="highestCertificate"
          value={formData?.highestCertificate}
          onChange={handleChange}
          label={t("Highest Level")}
          placeholder="highestCertificate"
          type='select'
          options={CertificateOptions}
          required
        />
        <MyInputField
          id="yearObtained"
          name="yearObtained"
          value={formData?.yearObtained?.toString()}
          onChange={handleChange}
          label={t("Year Obtained")}
          placeholder="yearObtained"
          type='select'
          options={last20Years}
        />
      </div>

      <div className="flex justify-center">
        {updated ? <button
          onClick={handleSave}
          className="flex mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 tracking-wider text-semibold text-lg"
        >
          {t("Update Info")}
        </button> : null}
      </div>
    </div>
  );
};

export default MyProfile;


const Input = ({ label, name, value, onChange, type = 'text', readOnly = false }: any) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-600">{label}</label>
    <input
      type={type}
      name={name}
      value={value || ''}
      onChange={onChange}
      className="mt-1 p-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
      readOnly={readOnly}
    />
  </div>
);

// Reusable select component
const Select = ({ label, name, value, onChange, options = [] }: any) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-600">{label}</label>
    <select
      name={name}
      value={value || ''}
      onChange={onChange}
      className="mt-1 p-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      <option value="">-- Select --</option>
      {options.map((opt: string) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);



const UPDATE_DELETE_CUSTOM_USER = gql`
  mutation UpdateDelete(
    $id: ID!
    $prefix: String
    $role: String!
    $photo: String
    $firstName: String!
    $lastName: String!
    $sex: String!
    $address: String!
    $telephone: String!
    $pob: String
    $dob: String
    $email: String
    $parent: String
    $parentTelephone: String
    $highestCertificate: String!
    $yearObtained: String
    $nationality: String
    $regionOfOrigin: String
    $deptNames: [String]
    $schoolIds: [ID]
    $delete: Boolean!
    $updatedById: ID!
  ) {
    createUpdateDeleteCustomUser(
      id: $id, 
      prefix: $prefix
      role: $role
      photo: $photo
      firstName: $firstName
      lastName: $lastName
      sex: $sex
      address: $address
      telephone: $telephone
      pob: $pob
      dob: $dob
      email: $email
      parent: $parent
      parentTelephone: $parentTelephone
      highestCertificate: $highestCertificate
      yearObtained: $yearObtained
      nationality: $nationality
      regionOfOrigin: $regionOfOrigin
      deptNames: $deptNames
      schoolIds: $schoolIds
      delete: $delete
      updatedById: $updatedById
    ) {
      customuser {
        id 
        firstName
      }
    }
  }
`;
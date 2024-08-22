"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { EdgeSchoolHigherInfo, NodeSchoolHigherInfo } from "@/Domain/schemas/interfaceGraphql";
import { capitalizeFirstLetter, decodeUrlID } from "@/functions";
import { useTranslation } from "react-i18next";
import { ApiFactory } from "@/utils/graphql/ApiFactory";
import { JwtPayload } from "@/utils/serverActions/interfaces";
import { jwtDecode } from "jwt-decode";
import { gql } from "@apollo/client";
import MyInputField from "@/components/MyInputField";


const TabSchoolInfo = (
  { data, params, section }:
  { data: EdgeSchoolHigherInfo, params: any, section: "H" | "S" | "P" | "V" }
) => {
  
    const { t } = useTranslation();
  const token = localStorage.getItem('token');
  const user: JwtPayload = jwtDecode(token ? token : "");

  const [school, setSchool] = useState<NodeSchoolHigherInfo>({
    id: decodeUrlID(data?.node?.id) || '',
    campus: data?.node?.campus || '',
    prefix: data?.node?.prefix || '',
    moratoireDeadline: data?.node?.moratoireDeadline || '',
    method: data?.node?.method || 0,
    schoolName: data?.node?.schoolName.toUpperCase() || '',
    schoolType: data?.node?.schoolType || '',
    shortName: data?.node?.shortName.toUpperCase() || '',
    mainSchool: data?.node?.mainSchool || false,
    country: capitalizeFirstLetter(data?.node?.country) || '',
    address: data?.node?.address.toUpperCase() || '',
    region: data?.node?.region.toUpperCase() || '',
    town: data?.node?.town.toUpperCase() || '',
    email: data?.node?.email?.toLowerCase() || '',
    telephone: data?.node?.telephone || '',
    seqLimit: data?.node?.seqLimit || 0,
    examLimit: data?.node?.examLimit || 0,
    examSecLimit: data?.node?.examSecLimit || 0,
    caLimit: data?.node?.caLimit || 0,
    resitLimit: data?.node?.resitLimit || 0,
    emailNotification: data?.node?.emailNotification || false,
    smsNotification: data?.node?.smsNotification || false,
    waNotification: data?.node?.waNotification || false,
    poBox: data?.node?.poBox || '',
    niu: data?.node?.niu.toUpperCase() || '',
    website: data?.node?.website?.toLowerCase() || '',
    latitude: data?.node?.latitude || 0,
    longitude: data?.node?.longitude || 0,
    landingMessageMain: data?.node?.landingMessageMain.toUpperCase() || '',
    logoCampus: data?.node?.logoCampus || '',
    registrationSeperateTuition: data?.node?.registrationSeperateTuition || false,
    schoolfeesControl: data?.node?.schoolfeesControl || '',
    welcomeMessage: data?.node?.welcomeMessage?.toUpperCase() || '',
    welcome_message: data?.node?.welcome_message?.toUpperCase() || '',
    radius: data?.node?.radius || 0,
    bgLogoSlip: data?.node?.bgLogoSlip || '',
    bgLogoTranscript: data?.node?.bgLogoTranscript || '',
    colors: data?.node?.colors || '',
    schoolIdentification: data?.node?.schoolIdentification || { id: '' },
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    const { name, type } = target;

    const value =
      type === "checkbox"
        ? (target as HTMLInputElement).checked
        : target.value;
    setSchool((prev) => ({ ...prev, [name]: value }));
  };

  const limits: (keyof NodeSchoolHigherInfo)[] = section === "H" ? 
  ["caLimit", "examSecLimit", "resitLimit"]
  :
  ["seqLimit", "examSecLimit"];

  const notificationKeys: (keyof NodeSchoolHigherInfo)[] = [
    "emailNotification",
    "smsNotification",
    "waNotification",
  ];

  console.log(school);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let newData: any = {
      ...school,
      schoolIdentificationId: parseInt(decodeUrlID(school.schoolIdentification.id)),
      seqLimit: parseInt(school?.seqLimit.toString()),
      examSecLimit: parseInt(school?.examSecLimit.toString()),
      caLimit: parseInt(school?.caLimit.toString()),
      resitLimit: parseInt(school?.resitLimit.toString()),
      radius: parseInt(school?.radius.toString()),
      updatedById: user.user_id,
      delete: false
    }

    const res = await ApiFactory({
      newData,
      editData: newData,
      mutationName: "createUpdateDeleteSchoolInfo",
      modelName: "schoolinfohigher",
      successField: "id",
      query,
      router: null,
      params,
      redirect: false,
      reload: true,
      returnResponseField: false,
      redirectPath: ``,
      actionLabel: "processing",
    });
  };

  return (
    <motion.form
      className="space-y-8 p-8 bg-white rounded-2xl shadow-xl"
    >
      <h2 className="text-2xl font-bold text-slate-800">{t("School General Information")}</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="text-slate-700 block mb-1">{t("School Name")}</label>
          <input
            name="schoolName"
            value={school.schoolName}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-md font-bold text-lg"
          />
        </div>
        <div>
          <label className="text-slate-700 block mb-1">{t("Short Name")}</label>
          <input
            name="shortName"
            value={school.shortName}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-md font-bold text-lg"
          />
        </div>
        {/* <div className='flex flex-row gap-2 justify-between'>
          <MyInputField
            id="schoolType"
            name="schoolType"
            label={t("School Type")}
            type="select"
            placeholder={t("Select School Type")}
            value={school.schoolType}
            options={["Section-H", "Section-S", "Section-P", "Section-V"].map((item: string) => item)}
            onChange={handleChange}
          />
        </div> */}
        <div>
          <label className="text-slate-700 block mb-1">{t("Town")}</label>
          <input
            name="town"
            value={school.town}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-md font-bold text-lg"
          />
        </div>
        <div className='flex flex-row gap-2 justify-between'>
          <MyInputField
            id="region"
            name="region"
            label={t("School region")}
            type="select"
            placeholder={t("Select School region")}
            value={school.region}
            options={["CENTER", "LITTORAL", "WEST", "NORTH WEST", "SOUTH WEST", "NORTH", "ADAMAWA", "FAR NORTH", "EST"].map((item: string) => item)}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="text-slate-700 block mb-1">{t("Country")}</label>
          <input
            name="country"
            value={school.country}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-md font-bold text-lg"
          />
        </div>
        <div>
          <label className="text-slate-700 block mb-1">{t("Email")}</label>
          <input
            name="email"
            type="email"
            value={school.email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-md font-bold text-lg"
          />
        </div>
        <div>
          <label className="text-slate-700 block mb-1">{t("Telephone")}</label>
          <input
            name="telephone"
            type="tel"
            value={school.telephone}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-md font-bold text-lg"
          />
        </div>
        <div>
          <label className="text-slate-700 block mb-1">{t("Website")}</label>
          <input
            name="website"
            value={school.website}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-md font-bold text-lg"
          />
        </div>
         <div>
          <label className="text-slate-700 block mb-1">{t("Moratorium Deadline")}</label>
          <input
            name="moratoireDeadline"
            type="date"
            value={school.moratoireDeadline}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-md font-bold text-lg"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {limits.map((limit) => (
          <div key={limit}>
            <label className="text-slate-700 block mb-1">
              {String(limit).replace("Limit", " Limit").toUpperCase()}
            </label>
            <input
              type="number"
              name={limit}
              value={school[limit].toString() ?? 0}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-md font-bold text-lg"
            />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-6 mt-6">
        {notificationKeys.map((name) => (
          <label key={name} className="inline-flex items-center space-x-3">
            <input
              type="checkbox"
              name={name}
              checked={Boolean(school[name])}
              onChange={(e) =>
                setSchool((prev) => ({
                  ...prev,
                  [name]: e.target.checked,
                }))
              }
              className="accent-blue-600 w-5 h-5"
            />
            <span className="text-lg text-slate-700">{name.replace("Notification", " Notification")}</span>
          </label>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="px-6 py-3 rounded-md bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition"
          onClick={handleSubmit}
        >
          {t("Save Changes")}
        </button>
      </div>
    </motion.form>
  );


};

export default TabSchoolInfo;



export const query = gql`
  mutation CreateUpdateDelete (
    $id: ID
    $moratoireDeadline: String
    $campus: String
    $schoolName: String!
    $schoolType: String
    $shortName: String
    $mainSchool: Boolean
    $country: String
    $address: String
    $region: String
    $town: String
    $email: String
    $telephone: String
    $caLimit: Int
    $examSecLimit: Int
    $seqLimit: Int
    $resitLimit: Int
    $emailNotification: Boolean
    $smsNotification: Boolean
    $waNotification: Boolean
    $poBox: String
    $niu: String
    $website: String
    $latitude: String
    $longitude: String
    $landingMessageMain: String
    $logoCampus: String
    $registrationSeperateTuition: Boolean
    $schoolfeesControl: String
    $welcomeMessage: String
    $radius: Int
    $schoolIdentificationId: ID
    $bgLogoTranscript: String
    $bgLogoSlip: String
    $colors: String
    $delete: Boolean!
  ) {
    createUpdateDeleteSchoolInfo (
      id: $id
      campus: $campus
      moratoireDeadline: $moratoireDeadline
      schoolName: $schoolName
      schoolType: $schoolType
      shortName: $shortName
      mainSchool: $mainSchool
      country: $country
      address: $address
      region: $region
      town: $town
      email: $email
      telephone: $telephone
      caLimit: $caLimit
      examSecLimit: $examSecLimit
      seqLimit: $seqLimit
      resitLimit: $resitLimit
      emailNotification: $emailNotification
      smsNotification: $smsNotification
      waNotification: $waNotification
      poBox: $poBox
      niu: $niu
      website: $website
      latitude: $latitude
      longitude: $longitude
      landingMessageMain: $landingMessageMain
      logoCampus: $logoCampus
      registrationSeperateTuition: $registrationSeperateTuition
      schoolfeesControl: $schoolfeesControl
      welcomeMessage: $welcomeMessage
      radius: $radius
      schoolIdentificationId: $schoolIdentificationId
      bgLogoTranscript: $bgLogoTranscript
      bgLogoSlip: $bgLogoSlip
      colors: $colors
      delete: $delete
    ) {
      schoolinfohigher {
        id
        schoolName
      }
    }
  }
`;




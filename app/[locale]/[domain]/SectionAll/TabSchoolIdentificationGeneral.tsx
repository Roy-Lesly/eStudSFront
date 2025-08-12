"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { EdgeSchoolIdentification, NodeSchoolIdentification } from "@/Domain/schemas/interfaceGraphql";
import { decodeUrlID } from "@/functions";
import { useTranslation } from "react-i18next";
import { ApiFactory } from "@/utils/graphql/ApiFactory";
import { JwtPayload } from "@/utils/serverActions/interfaces";
import { jwtDecode } from "jwt-decode";
import { gql } from "@apollo/client";


const TabSchoolIdentification = ({ data, params }: { data: EdgeSchoolIdentification, params: any }) => {
  const { t } = useTranslation();
  const token = localStorage.getItem('token');
  const user: JwtPayload = jwtDecode(token ? token : "");

  console.log(data);

  const [school, setSchool] = useState<NodeSchoolIdentification>({
    id: decodeUrlID(data?.node?.id) || '',
    code: data?.node?.code,
    version: data?.node?.version,
    director: data?.node?.director,
    platformCharges: data?.node?.platformCharges,
    idCharges: data?.node?.idCharges,
    name: data?.node?.name,
    supportNumberOne: data?.node?.supportNumberOne,
    supportNumberTwo: data?.node?.supportNumberTwo,
    status: data?.node?.status,
    messageOne: data?.node?.messageOne,
    messageTwo: data?.node?.messageTwo,
    backEnd: data?.node?.backEnd,
    frontEnd: data?.node?.frontEnd,
    hasHigher: data?.node?.hasHigher,
    hasSecondary: data?.node?.hasSecondary,
    hasPrimary: data?.node?.hasPrimary,
    hasVocational: data?.node?.hasVocational,
    logo: data?.node?.logo,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let newData: any = {
      ...school,
      updatedById: user.user_id,
      delete: false
    }

    const res = await ApiFactory({
      newData,
      editData: newData,
      mutationName: "createUpdateDeleteSchoolIdentification",
      modelName: "schoolidentificationhigher",
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
      <h2 className="text-2xl font-bold text-slate-800">{t("This Campus Information")}</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="text-slate-700 block mb-1">{t("School Name")}</label>
          <input
            name="name"
            value={school.name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-md font-bold text-lg"
          />
        </div>
        <div>
          <label className="text-slate-700 block mb-1">{t("Short Name")}</label>
          <input
            name="code"
            value={school.code}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-md font-bold text-lg"
          />
        </div>
        <div>
          <label className="text-slate-700 block mb-1">{t("Display Message 1")}</label>
          <input
            name="messageOne"
            value={school.messageOne}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-md font-bold text-lg"
          />
        </div>
        <div>
          <label className="text-slate-700 block mb-1">{t("Display Message 2")}</label>
          <input
            name="messageTwo"
            value={school.messageTwo}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-md font-bold text-lg"
          />
        </div>
        <div>
          <label className="text-slate-700 block mb-1">{t("School Director")}</label>
          <input
            name="director"
            value={school.director}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-md font-bold text-lg"
          />
        </div>
        {/* <div className='flex flex-row gap-2 justify-between'>
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
        </div> */}
        <div>
          <label className="text-slate-700 block mb-1">{t("Support Number 1")}</label>
          <input
            name="supportNumberOne"
            type="number"
            value={school.supportNumberOne}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-md font-bold text-lg"
          />
        </div>
        <div>
          <label className="text-slate-700 block mb-1">{t("Support Number 2")}</label>
          <input
            name="supportNumberTwo"
            type="number"
            value={school.supportNumberTwo}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-md font-bold text-lg"
          />
        </div>

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

export default TabSchoolIdentification;



export const query = gql`
  mutation createUpdateDeleteSchoolIdentification(
    $id: ID
    $code: String
    $director: String
    $name: String
    $supportNumberOne: String
    $supportNumberTwo: String
    $status: Boolean
    $messageOne: String
    $messageTwo: String
    $backEnd: String
    $frontEnd: String
    $delete: Boolean!
  ) {
    createUpdateDeleteSchoolIdentification(
      id: $id
      code: $code
      director: $director
      name: $name
      supportNumberOne: $supportNumberOne
      supportNumberTwo: $supportNumberTwo
      status: $status
      messageOne: $messageOne
      messageTwo: $messageTwo
      backEnd: $backEnd
      frontEnd: $frontEnd
      delete: $delete
    ) {
      schoolidentificationhigher {
        id
      }
    }
  }
`;




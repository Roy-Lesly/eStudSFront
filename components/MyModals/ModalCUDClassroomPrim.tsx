import { capitalizeFirstLetter, decodeUrlID, getAcademicYearList } from '@/functions';
import MyInputField from '@/MyInputField';
import { JwtPayload } from '@/serverActions/interfaces';
import { gql } from '@apollo/client';
import { jwtDecode } from 'jwt-decode';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';
import { ApiFactory } from '@/utils/graphql/ApiFactory';
import { EdgeClassRoomPrim } from '@/utils/Domain/schemas/interfaceGraphqlPrimary';


interface FormData {
  schoolId: number
  level: string
  language: string
  academicYear: string
  registration: string
  tuition: string
  paymentOne: string
  paymentTwo: string
  paymentThree: string
  delete: boolean
}

const ModalCUDClassroomPrim = (
  { params, setOpenModal, selectedItem, actionType, apiLevels }
    :
    {
      apiLevels: string[], apiYears: string[], params: { school_id: string, locale: string }, setOpenModal: any, selectedItem: EdgeClassRoomPrim | null, actionType: "create" | "update" | "delete" | string
    }
) => {
  const { t } = useTranslation();
  const token = localStorage.getItem('token');
  const user: JwtPayload = jwtDecode(token ? token : "");
  const [optionsLevel, setOptionsLevel] = useState<string[]>(params?.locale === "fr" ? apiLevels.slice(9, 18) : apiLevels.slice(0, 9))

  const [formData, setFormData] = useState<FormData>({
    schoolId: parseInt(params.school_id),
    academicYear: selectedItem ? selectedItem.node.academicYear.toString() : "",
    language: params?.locale === "fr" ? "FRENCH" : "ENGLISH",
    level: selectedItem ? selectedItem.node.level.toString() : "",
    registration: selectedItem ? selectedItem.node.registration.toString() : "0",
    tuition: selectedItem ? selectedItem.node.tuition.toString() : "0",
    paymentOne: selectedItem ? selectedItem.node.paymentOne.toString() : "0",
    paymentTwo: selectedItem ? selectedItem.node.paymentTwo.toString() : "0",
    paymentThree: selectedItem ? selectedItem.node.paymentThree.toString() : "0",
    delete: selectedItem && actionType === "delete" ? true : false,
  });

  useEffect(() => {
    setOptionsLevel(optionsLevel)
  }, [ formData.language ])

  const handleChange = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: typeof value === 'string'
        ? /^[a-zA-Z]+$/.test(value) || /^[IVXLCDM]+$/i.test(value) // Check if purely alphabetic or Roman numeral
          ? value.toUpperCase() // Keep as uppercase string
          : /^[0-9]+$/.test(value) // Check if numeric
            ? parseInt(value, 10) // Convert to number
            : value // Leave other strings as-is
        : typeof value === 'boolean'
          ? value // Leave booleans unchanged
          : value,
    }));
    if (field == "language"){
      setOptionsLevel(value === "French" ? apiLevels.slice(9, 18) : apiLevels.slice(0, 9))
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const confirmCreate = window.confirm(`Are you sure you want to proceed?`);
    if (!confirmCreate) {
      return;
    }
    let dataToSubmit: any = {
      ...formData,
      registration: parseInt(formData.registration),
      tuition: parseInt(formData.tuition),
      paymentOne: parseInt(formData.paymentOne),
      paymentTwo: parseInt(formData.paymentTwo),
      paymentThree: parseInt(formData.paymentThree),
    }

    if ((actionType === "update" || actionType === "delete") && selectedItem) {
      dataToSubmit = {
        ...dataToSubmit,
        id: parseInt(decodeUrlID(selectedItem.node.id)),
        updatedById: user.user_id,
        delete: actionType === "delete",
      }
    }

    const res = await ApiFactory({
      newData: dataToSubmit,
      editData: dataToSubmit,
      mutationName: "createUpdateDeleteClassroomPrim",
      modelName: "classroomprim",
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: true ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity ${true ? 'visible' : 'invisible'}`}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: true ? 1 : 0.9 }}
        transition={{ duration: 0.3 }}
        className="bg-white max-w-lg p-6 rounded-lg shadow-lg w-full"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-2xl">{t(actionType)?.toUpperCase()}</h2>
          <button onClick={() => { setOpenModal(false) }} className="font-bold text-xl"><FaTimes color='red' /></button>
        </div>


        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className='flex flex-row gap-2 justify-between'>
            <MyInputField
              id="language"
              name="language"
              label={t("language")}
              type="select"
              placeholder={t("Select language")}
              value={formData.language}
              onChange={(e) => handleChange('language', (e.target.value))}
              options={[ "FRENCH", "ENGLISH" ]}
            />
          </div>

          <div className='flex flex-row gap-2 justify-between'>
            <MyInputField
              id="level"
              name="level"
              label={t("Level")}
              type="select"
              placeholder={t("Select Level")}
              value={formData.level}
              onChange={(e) => handleChange('level', (e.target.value))}
              options={selectedItem ? [...optionsLevel, formData.level] : optionsLevel}
            />
            <MyInputField
              id="academicYear"
              name="academicYear"
              label={t("Academic Year")}
              type="select"
              placeholder={t("Select Academic Year")}
              value={formData.academicYear}
              onChange={(e) => handleChange('academicYear', (e.target.value))}
              options={getAcademicYearList()}
            />
          </div>

          <div className='flex flex-row gap-2 justify-between'>
            <MyInputField
              id="registration"
              name="registration"
              label={t("Registration")}
              type="number"
              placeholder={t("Registration Amount")}
              value={formData.registration}
              onChange={(e) => handleChange('registration', (e.target.value))}
            />
            <MyInputField
              id="tuition"
              name="tuition"
              label={t("Tuition")}
              type="number"
              placeholder={t("Tuition Amount")}
              value={formData.tuition}
              onChange={(e) => handleChange('tuition', (e.target.value))}
            />
          </div>

          <div className='flex flex-row gap-2 justify-between'>
            <MyInputField
              id="paymentOne"
              name="paymentOne"
              label={t("1st Insallment")}
              type="number"
              placeholder={t("1st Installment")}
              value={formData.paymentOne}
              onChange={(e) => handleChange('paymentOne', (e.target.value))}
            />
          </div>

          <div className='flex flex-row gap-2 justify-between'>
            <MyInputField
              id="paymentTwo"
              name="paymentTwo"
              label={t("2nd Insallment")}
              type="number"
              placeholder={t("2nd Installment")}
              value={formData.paymentTwo}
              onChange={(e) => handleChange('paymentTwo', (e.target.value))}
            />
          </div>

          <div className='flex flex-row gap-2 justify-between'>
            <MyInputField
              id="paymentThree"
              name="paymentThree"
              label={t("3rd Insallment")}
              type="number"
              placeholder={t("3rd Installment")}
              value={formData.paymentThree}
              onChange={(e) => handleChange('paymentThree', (e.target.value))}
            />
          </div>


          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className={`${actionType === "update" ? "bg-blue-600" : "bg-green-600"} font-bold hover:bg-blue-700 mt-6 px-6 py-2 rounded-md shadow-md text-lg text-white tracking-wide transition w-full`}
          >
            {t("Confirm")} & {t(capitalizeFirstLetter(actionType))}
          </motion.button>
        </form>

      </motion.div>
    </motion.div>
  )
}

export default ModalCUDClassroomPrim




const query = gql`
  mutation Function(
    $id: ID,
    $academicYear: String!,
    $level: String!,
    $registration: Int!,
    $tuition: Int!,
    $paymentOne: Int!,
    $paymentTwo: Int!,
    $paymentThree: Int!,
    $delete: Boolean!,
    $schoolId: ID!,
    $createdById: ID,
    $updatedById: ID
  ) {
    createUpdateDeleteClassroomPrim(
      id: $id,
      academicYear: $academicYear,
      level: $level,
      registration: $registration,
      tuition: $tuition,
      paymentOne: $paymentOne,
      paymentTwo: $paymentTwo,
      paymentThree: $paymentThree,
      delete: $delete,
      schoolId: $schoolId,
      createdById: $createdById,
      updatedById: $updatedById
    ) {
      classroomprim {
        id level
      }
    }
  }
`;

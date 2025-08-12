import { EdgeField, EdgeMainSpecialty, EdgeProgram } from '@/Domain/schemas/interfaceGraphql';
import { capitalizeFirstLetter, decodeUrlID } from '@/functions';
import MyInputField from '@/MyInputField';
import { JwtPayload } from '@/serverActions/interfaces';
import { gql } from '@apollo/client';
import { jwtDecode } from 'jwt-decode';
import { motion } from 'framer-motion';
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';
import { ApiFactory } from '@/utils/graphql/ApiFactory';


interface FormData {
  fieldId: number
  specialtyName: string
  specialtyNameShort: string
  delete: boolean
}

const ModalCUDSpecialty = (
  { params, setOpenModal, selectedItem, actionType, extraData }
    :
    {
      params: { school_id: string }, setOpenModal: any, selectedItem: EdgeMainSpecialty, actionType: "create" | "update" | "delete" | string,
      extraData: { fields: EdgeField[] }
    }
) => {

  const { t } = useTranslation();
  const token = localStorage.getItem('token');
  const user: JwtPayload = jwtDecode(token ? token : "");

  const [formData, setFormData] = useState<FormData>({
    fieldId: selectedItem ? parseInt(decodeUrlID(selectedItem.node?.field?.id)) : 0,
    specialtyName: selectedItem ? selectedItem.node.specialtyName : "",
    specialtyNameShort: selectedItem ? selectedItem.node.specialtyNameShort : "",
    delete: selectedItem && actionType === "delete" ? true : false,
  });
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const confirmCreate = window.confirm(`Are you sure you want to proceed?`);
    if (!confirmCreate) {
      return;
    }
    if (formData.specialtyNameShort.length != 3) {
      alert(`${t("3 Letters Expected for Specialty Short Name")}`)
      return;
    }
    let dataToSubmit: any = formData
    if (actionType === "create") {
      dataToSubmit = {
        ...formData,
        createdById: user.user_id,
      }
    }
    if ((actionType === "update" || actionType === "delete") && selectedItem) {
      dataToSubmit = {
        ...formData,
        id: parseInt(decodeUrlID(selectedItem.node.id)),
        updatedById: user.user_id,
      }
    }

    const res = await ApiFactory({
      newData: { ...dataToSubmit, delete: actionType === "delete" },
      editData: { ...dataToSubmit, delete: actionType === "delete" },
      mutationName: "createUpdateDeleteMainSpecialty",
      modelName: "mainspecialty",
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
              id="specialtyName"
              name="specialtyName"
              label={t("Specialty Name")}
              type="text"
              placeholder={t("Enter Specialty Name")}
              value={formData.specialtyName}
              onChange={(e) => handleChange('specialtyName', (e.target.value))}
            />
          </div>

          <div className='flex flex-row gap-2 justify-between'>
            <MyInputField
              id="specialtyNameShort"
              name="specialtyNameShort"
              label={t("Specialty Short Name")}
              type="text"
              placeholder={t("Enter Specialty Short")}
              value={formData.specialtyNameShort}
              onChange={(e) => handleChange('specialtyNameShort', (e.target.value))}
            />
          </div>


          <div className='flex flex-row gap-2 justify-between'>
            <MyInputField
              id="fieldId"
              name="fieldId"
              label={t("Field")}
              type="select"
              placeholder={t("Select Field")}
              value={formData.fieldId?.toString()}
              options={extraData?.fields?.map((item: EdgeField) => { return { id: decodeUrlID(item.node.id.toString()), name: item.node.fieldName } })}
              onChange={(e) => handleChange('fieldId', parseInt(e.target.value))}
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

export default ModalCUDSpecialty




const query = gql`
  mutation Function(
    $id: ID,
    $specialtyName: String!,
    $specialtyNameShort: String!,
    $fieldId: ID!,
    $delete: Boolean!,
    $createdById: ID,
    $updatedById: ID
  ) {
    createUpdateDeleteMainSpecialty(
      id: $id,
      specialtyName: $specialtyName,
      specialtyNameShort: $specialtyNameShort,
      fieldId: $fieldId,
      delete: $delete,
      createdById: $createdById,
      updatedById: $updatedById
    ) {
      mainspecialty {
        id specialtyName specialtyNameShort
      }
    }
  }
`;

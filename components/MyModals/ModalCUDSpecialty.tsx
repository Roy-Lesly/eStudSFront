import { EdgeCustomUser, EdgeLevel, EdgeMainSpecialty, EdgeSpecialty } from '@/Domain/schemas/interfaceGraphql';
import { capitalizeFirstLetter, decodeUrlID } from '@/functions';
import MyInputField from '@/MyInputField';
import { JwtPayload } from '@/serverActions/interfaces';
import { gql, useMutation } from '@apollo/client';
import { jwtDecode } from 'jwt-decode';
import { motion } from 'framer-motion';
import React, { useState } from 'react'


interface FormData {
  schoolId: number
  mainSpecialtyId: number
  levelId: number
  academicYear: string
  resultType: string
  registration: number
  tuition: number
  paymentOne: number
  paymentTwo: number
  paymentThree: number
  delete: boolean
}

const ModalCUDSpecialty = (
  { params, setOpenModal, selectedItem, actionType, extraData }
    :
    {
      params: { school_id: string}, setOpenModal: any, selectedItem: EdgeSpecialty, actionType: "create" | "update" | "delete" | string,
      extraData: { levels?: EdgeLevel[], mainSpecialties?: EdgeMainSpecialty[], teachers?: EdgeCustomUser[] }
    }
) => {

  
  const currentYear = new Date().getFullYear();
  const token = localStorage.getItem('token');
  const user: JwtPayload = jwtDecode(token ? token : "");

  const [formData, setFormData] = useState<FormData>({
    schoolId: selectedItem ? parseInt(decodeUrlID(selectedItem.node.school.id)) : parseInt(params.school_id),
    mainSpecialtyId: selectedItem ? parseInt(decodeUrlID(selectedItem.node.mainSpecialty.id)) : 0,
    levelId: selectedItem ? parseInt(decodeUrlID(selectedItem.node.level.id)) : 0,
    academicYear: selectedItem ? selectedItem.node.academicYear : "",
    resultType: selectedItem ? selectedItem.node.resultType : "GPA_4",
    registration: selectedItem ? selectedItem.node.registration : 0,
    tuition: selectedItem ? selectedItem.node.tuition : 0,
    paymentOne: selectedItem ? selectedItem.node.paymentOne : 0,
    paymentTwo: selectedItem ? selectedItem.node.paymentTwo : 0,
    paymentThree: selectedItem ? selectedItem.node.paymentThree : 0,
    delete: selectedItem && actionType === "delete" ? true : false,
  });
  console.log(formData)
  console.log(params)

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

  const [createUpdateDeleteSpecialty] = useMutation(CREATE_UPDATE_DELETE_SPECIALTY);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const confirmCreate = window.confirm(`Are you sure you want to proceed?`);
    if (!confirmCreate) {
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

    try {

      const result = await createUpdateDeleteSpecialty({
        variables: { 
          ...dataToSubmit,
         }
      });
      if (
        (actionType !== "delete" && result.data.createUpdateDeleteSpecialty.specialty.id) ||
        (actionType === "delete" && result.data.createUpdateDeleteSpecialty)
      ) {
        setOpenModal(false);
        window.location.reload()
      };
    } catch (err) {
      alert(`error domain:, ${err}`)
    }
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
          <h2 className="font-semibold text-2xl">{actionType?.toUpperCase()}</h2>
          <button onClick={() => { setOpenModal(false) }} className="font-bold text-xl">X</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <MyInputField
            id="mainSpecialtyId"
            name="mainSpecialtyId"
            label="Main Specialty"
            type="select"
            placeholder="Select Specialty"
            value={formData.mainSpecialtyId?.toString()}
            options={extraData?.mainSpecialties?.map((item: EdgeMainSpecialty) => { return { id: decodeUrlID(item.node.id.toString()), name: item.node.specialtyName } })}
            onChange={(e) => handleChange('mainSpecialtyId', parseInt(e.target.value))}
          />

          <div className='flex flex-row gap-2 justify-between'>
            <MyInputField
              id="academicYear"
              name="academicYear"
              label="academicYear"
              type="select"
              placeholder="Enter Academic Year"
              value={formData.academicYear}
              onChange={(e) => handleChange('academicYear', (e.target.value))}
              options={[`${currentYear - 1}/${currentYear}`, `${currentYear}/${currentYear + 1}`]}
            />
            <MyInputField
              id="levelId"
              name="levelId"
              label="level"
              type="select"
              placeholder="Enter level"
              value={formData.levelId?.toString()}
              onChange={(e) => handleChange('levelId', parseInt(e.target.value))}
              options={extraData?.levels?.map((item: EdgeLevel) => { return { id: decodeUrlID(item.node.id.toString()), name: item.node.level } })}
            />
          </div>

          <div className='flex flex-row gap-2 justify-between'>
            <MyInputField
              id="registration"
              name="registration"
              label="Registration"
              type="number"
              placeholder="Enter Registration"
              value={formData.registration?.toString()}
              onChange={(e) => handleChange('registration', parseInt(e.target.value))}
            />
            <MyInputField
              id="tuition"
              name="tuition"
              label="Tuition"
              type="number"
              placeholder="Enter Tuition (total)"
              value={formData.tuition?.toString()}
              onChange={(e) => handleChange('tuition', parseInt(e.target.value))}
            />
          </div>
          
          <div className='flex flex-row gap-2 justify-between'>
            <MyInputField
              id="paymentOne"
              name="paymentOne"
              label="Payment One"
              type="number"
              placeholder="Enter paymentOne"
              value={formData.paymentOne?.toString()}
              onChange={(e) => handleChange('paymentOne', parseInt(e.target.value))}
            />
            <MyInputField
              id="paymentTwo"
              name="paymentTwo"
              label="Payment Two"
              type="number"
              placeholder="Enter paymentTwo"
              value={formData.paymentTwo?.toString()}
              onChange={(e) => handleChange('paymentTwo', parseInt(e.target.value))}
            />
            <MyInputField
              id="paymentTwo"
              name="paymentTwo"
              label="Payment Two"
              type="number"
              placeholder="Enter paymentThree"
              value={formData.paymentThree?.toString()}
              onChange={(e) => handleChange('paymentThree', parseInt(e.target.value))}
            />
          </div>

          <div className='flex flex-row gap-2 justify-between'>
            <MyInputField
              id="resultType"
              name="resultType"
              label="Result Type"
              type="select"
              placeholder="Select GPA System"
              value={formData.resultType?.toString()}
              onChange={(e) => handleChange('resultType', (e.target.value))}
              options={[{ id: "GPA_4", name: "GPA 4" }, { id: "GPA_5", name: "GPA 5" }]}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className={`${actionType === "update" ? "bg-blue-600" : "bg-green-600"} font-bold hover:bg-blue-700 mt-6 px-6 py-2 rounded-md shadow-md text-lg text-white tracking-wide transition w-full`}
          >
            Confirm & {capitalizeFirstLetter(actionType)}
          </motion.button>
        </form>

      </motion.div>
    </motion.div>
  )
}

export default ModalCUDSpecialty




const CREATE_UPDATE_DELETE_SPECIALTY = gql`
  mutation Function(
    $id: ID,
    $schoolId: ID!,
    $mainSpecialtyId: ID!,
    $levelId: ID!,
    $academicYear: String!,
    $resultType: String,
    $registration: Int!,
    $tuition: Int!,
    $paymentOne: Int!,
    $paymentTwo: Int!,
    $paymentThree: Int,
    $delete: Boolean!,
    $createdById: ID,
    $updatedById: ID
  ) {
    createUpdateDeleteSpecialty(
      id: $id,
      schoolId: $schoolId,
      mainSpecialtyId: $mainSpecialtyId,
      levelId: $levelId,
      academicYear: $academicYear,
      resultType: $resultType,
      registration: $registration,
      tuition: $tuition,
      paymentOne: $paymentOne,
      paymentTwo: $paymentTwo,
      paymentThree: $paymentThree,
      delete: $delete,
      createdById: $createdById,
      updatedById: $updatedById
    ) {
      specialty {
        id 
      }
    }
  }
`;

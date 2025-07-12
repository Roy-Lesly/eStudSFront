import { EdgeField } from '@/Domain/schemas/interfaceGraphql';
import { capitalizeFirstLetter, decodeUrlID, getAcademicYear } from '@/functions';
import MyInputField from '@/MyInputField';
import { JwtPayload } from '@/serverActions/interfaces';
import { gql } from '@apollo/client';
import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';
import { ApiFactory } from '@/utils/graphql/ApiFactory';
import { CYCLE_CHOICES, SECONDARY_LEVEL_OBJECT_ENGLISH, SECONDARY_LEVEL_OBJECT_FRENCH } from '@/utils/dataSource';
import { EdgeClassRoomSec } from '@/utils/Domain/schemas/interfaceGraphqlSecondary';
import { jwtDecode } from 'jwt-decode';

interface FormData {
  schoolId: number;
  stream: string;
  system: string;
  level: string;
  cycle: string;
  select: string;
  academicYear: string;
  registration: number;
  tuition: number;
  paymentOne: number;
  paymentTwo: number;
  paymentThree: number;
  delete: boolean;
}

const ModalCUDClassroomSec = (
  { params, setOpenModal, selectedItem, actionType, extraData }
    :
    {
      params: { school_id: string, locale: string },
      setOpenModal: any,
      selectedItem: EdgeClassRoomSec | null,
      actionType: 'create' | 'update' | 'delete' | string,
      extraData: { fields: EdgeField[] }
    }
) => {
  const { t } = useTranslation();
  const token = localStorage.getItem('token');
  const user: JwtPayload = jwtDecode(token ?? '');

  const [system, setSystem] = useState<string>(params.locale === "fr" ? "FRENCH" : 'ENGLISH');
  const [levelOptions, setLevelOptions] = useState<any[]>([]);

  const [formData, setFormData] = useState<FormData>({
    schoolId: selectedItem ? parseInt(decodeUrlID(selectedItem.node.school.id)) : parseInt(params.school_id),
    stream: selectedItem?.node.stream || '',
    system: 'ENGLISH',
    cycle: selectedItem?.node.cycle || 'FIRST',
    select: selectedItem ? selectedItem.node.select.toString().toUpperCase() : 'FALSE',
    level: selectedItem ? selectedItem.node.level.replace(" ", "") : '',
    academicYear: selectedItem?.node.academicYear || getAcademicYear(),
    registration: selectedItem?.node.registration || 0,
    tuition: selectedItem?.node.tuition || 0,
    paymentOne: selectedItem?.node.paymentOne || 0,
    paymentTwo: selectedItem?.node.paymentTwo || 0,
    paymentThree: selectedItem?.node.paymentThree || 0,
    delete: selectedItem != null && actionType === 'delete'
  });

  useEffect(() => {
    if (!formData.cycle) return;
    const source = system === 'ENGLISH' ? SECONDARY_LEVEL_OBJECT_ENGLISH : SECONDARY_LEVEL_OBJECT_FRENCH;
    let filtered = source.filter(item => item.cycle === formData.cycle);
    if (formData.select) {
      const sel = formData.select.toString().toUpperCase();
      filtered = filtered.filter(item => item.select.toString().toUpperCase() === sel);
    }
    setLevelOptions(filtered?.map((item: any) => item.level));
  }, [formData.cycle, formData.select, system]);

  const handleChange = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (field === 'system') {
      setSystem(value as string);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!window.confirm(t('Are you sure you want to proceed?'))) return;
    if (formData.level.length <= 3) {
      alert(t('3 Letters Expected for Class'));
      return;
    }

    let dataToSubmit: any = {
      ...formData,
      select: formData.select === 'TRUE',
      level: formData.level.toUpperCase(),
    };
    if (actionType === 'create') {
      dataToSubmit = {
        ...dataToSubmit,
        createdById: user.user_id,
        updatedById: user.user_id
      };
    }
    if ((actionType === 'update' || actionType === 'delete') && selectedItem) {
      dataToSubmit = {
        ...dataToSubmit,
        id: parseInt(decodeUrlID(selectedItem.node.id)),
        updatedById: user.user_id
      };
    }

    await ApiFactory({
      newData: dataToSubmit,
      editData: dataToSubmit,
      mutationName: 'createUpdateDeleteClassroomSec',
      modelName: 'classroomsec',
      successField: 'id',
      query,
      router: null,
      params,
      redirect: false,
      reload: true,
      returnResponseField: false,
      redirectPath: '',
      actionLabel: 'processing'
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
          <button onClick={() => { setOpenModal(false) }} className="font-bold text-xl">
            <FaTimes color='red' />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">

          <div className='flex flex-row gap-2 justify-between'>
            <MyInputField
              id="Cycle"
              name="Cycle"
              label={t("Cycle")}
              type="select"
              placeholder={t("Select Cycle")}
              value={formData.cycle?.toString()}
              options={CYCLE_CHOICES.map((item: any) => ({ id: item.value, name: item.name }))}
              onChange={(e) => handleChange('cycle', e.target.value)}
            />
            <MyInputField
              id="system"
              name="system"
              label={t("System")}
              type="select"
              placeholder={t("Select System")}
              value={system}
              options={["ENGLISH", "FRENCH"].map((item: string) => ({ id: item, name: `${t(item)}` }))}
              onChange={(e) => handleChange('system', e.target.value)}
            />
          </div>

          <div className='flex flex-row gap-2 justify-between'>
            <MyInputField
              id="stream"
              name="stream"
              label={t("Section")}
              type="select"
              placeholder={t("Select Section")}
              value={formData.stream}
              options={["GENERAL", "TECHNICAL", "COMMERCIAL"].map((item: string) => ({ id: item, name: `${t(item)}` }))}
              onChange={(e) => handleChange('stream', e.target.value)}
            />
            <MyInputField
              id="select"
              name="select"
              label={t("Do Students Select Subjects?")}
              type="select"
              placeholder={t("Select select")}
              value={formData.select}
              options={["TRUE", "FALSE"].map((item: string) => ({ id: item, name: item === "TRUE" ? `${t("Yes")}` : `${t("No")}` }))}
              onChange={(e) => handleChange("select", e.target.value)}
            />
          </div>

          <div className='flex flex-row gap-2 justify-between'>
            <MyInputField
              id="Level"
              name="level"
              label={t("Level")}
              type="select"
              placeholder={t("Select Level")}
              value={formData.level}
              options={levelOptions}
              onChange={(e) => handleChange('level', e.target.value)}
            />
          </div>

          <div className='flex flex-row gap-2 justify-between'>
            <MyInputField
              id="academicYear"
              name="academicYear"
              label={t("Select Academic Year")}
              type="select"
              placeholder={t("Select academicYear")}
              value={formData.academicYear}
              options={[getAcademicYear()].map((item: string) => ({ id: item, name: item }))}
              onChange={(e) => handleChange('academicYear', e.target.value)}
            />
          </div>

          <div className='flex flex-row gap-2 justify-between'>
            <MyInputField
              id="registration"
              name="registration"
              label={t("Registration")}
              type="number"
              placeholder={t("Enter Registration")}
              value={formData.registration.toString()}
              onChange={(e) => handleChange('registration', parseInt(e.target.value))}
            />
            <MyInputField
              id="tuition"
              name="tuition"
              label={t("Tuition")}
              type="number"
              placeholder={t("Enter Tuition")}
              value={formData.tuition.toString()}
              onChange={(e) => handleChange('tuition', parseInt(e.target.value))}
            />
          </div>

          <div className='flex flex-row gap-2 justify-between'>
            <MyInputField
              id="paymentOne"
              name="paymentOne"
              label={t("1st Installment")}
              type="number"
              placeholder={t("Enter 1st Installment")}
              value={formData.paymentOne.toString()}
              onChange={(e) => handleChange('paymentOne', parseInt(e.target.value))}
            />
            <MyInputField
              id="paymentTwo"
              name="paymentTwo"
              label={t("2nd Installment")}
              type="number"
              placeholder={t("Enter 2nd Installment")}
              value={formData.paymentTwo.toString()}
              onChange={(e) => handleChange('paymentTwo', parseInt(e.target.value))}
            />
            <MyInputField
              id="paymentThree"
              name="paymentThree"
              label={t("3rd Installment")}
              type="number"
              placeholder={t("Enter 3rd Installment")}
              value={formData.paymentThree.toString()}
              onChange={(e) => handleChange('paymentThree', parseInt(e.target.value))}
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

export default ModalCUDClassroomSec


const query = gql`
  mutation Function(
    $id: ID,
    $schoolId: ID!,
    $stream: String!,
    $cycle: String!,
    $level: String!,
    $select: Boolean!,
    $academicYear: String!,
    $registration: Int!,
    $tuition: Int!,
    $paymentOne: Int!,
    $paymentTwo: Int!,
    $paymentThree: Int!,
    $delete: Boolean!,
    $createdById: ID,
    $updatedById: ID
  ) {
    createUpdateDeleteClassroomSec(
      id: $id,
      schoolId: $schoolId,
      stream: $stream,
      cycle: $cycle,
      level: $level,
      select: $select,
      academicYear: $academicYear,
      registration: $registration,
      tuition: $tuition,
      paymentOne: $paymentOne,
      paymentTwo: $paymentTwo,
      paymentThree: $paymentThree,
      delete: $delete,
      createdById: $createdById,
      updatedById: $updatedById
    ) {
      classroomsec {
        id
      }
    }
  }
`;




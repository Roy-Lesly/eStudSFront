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
import { CYCLE_CHOICES } from '@/utils/dataSource';
import { EdgeClassRoomSec } from '@/utils/Domain/schemas/interfaceGraphqlSecondary';
import { jwtDecode } from 'jwt-decode';
import MySelectField from '../MySelectField';
import { MultiValue, SingleValue } from 'react-select';
import { EdgeSeries } from '@/utils/Domain/schemas/interfaceGraphqlPrimary';


type OptionType = { value: string | number; label: string };


interface FormData {
  schoolId: number;
  seriesId: number;
  stream: string;
  system: string;
  level: string;
  classType: string | null;
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
  { params, setOpenModal, selectedItem, actionType, apiLevel, apiClassType, apiSeries }
    :
    {
      params: { school_id: string, locale: string },
      setOpenModal: any,
      selectedItem: EdgeClassRoomSec | null,
      actionType: 'create' | 'update' | 'delete' | string,
      apiLevel: string[],
      apiClassType: string[],
      apiSeries: EdgeSeries[]
    }
) => {

  const { t } = useTranslation();
  const token = localStorage.getItem('token');
  const user: JwtPayload = jwtDecode(token ?? '');

  const system = params.locale === "fr" ? "FRENCH" : 'ENGLISH';
  const [levelOptions, setLevelOptions] = useState<any[]>([]);
  const [seriesOptions, setSeriesOptions] = useState<any[]>([]);
  const [classType, setClassType] = useState<MultiValue<OptionType>>([]);
  const [seriesList, setSeriesList] = useState<MultiValue<OptionType>>([]);

  const [formData, setFormData] = useState<FormData>({
    schoolId: selectedItem ? parseInt(decodeUrlID(selectedItem.node.school.id)) : parseInt(params.school_id),
    seriesId: selectedItem ? parseInt(decodeUrlID(selectedItem.node.series.id)) : 0,
    stream: selectedItem?.node.stream || '',
    system: params.locale === "fr" ? "FRENCH" : 'ENGLISH',
    cycle: selectedItem?.node.cycle || 'FIRST',
    select: selectedItem ? selectedItem.node.select.toString().toUpperCase() : 'FALSE',
    level: selectedItem ? selectedItem.node.level : '',
    classType: selectedItem ? selectedItem.node?.classType : null,
    academicYear: selectedItem?.node.academicYear || getAcademicYear(),
    registration: selectedItem?.node.registration || 0,
    tuition: selectedItem?.node.tuition || 0,
    paymentOne: selectedItem?.node.paymentOne || 0,
    paymentTwo: selectedItem?.node.paymentTwo || 0,
    paymentThree: selectedItem?.node.paymentThree || 0,
    delete: selectedItem != null && actionType === 'delete'
  });

  useEffect(() => {
    if (formData.system === "ENGLISH") {
      if (formData.cycle === "FIRST") {
        setLevelOptions(apiLevel.slice(0, 5));
        setFormData({ ...formData, select: "FALSE" });
      }
      else if (formData.cycle === "SECOND") {
        setLevelOptions(apiLevel.slice(5, 7));
        setFormData({ ...formData, select: "TRUE" });
      }
    }
    else if (formData.system === "FRENCH") {
      if (formData.cycle === "FIRST") {
        setLevelOptions(apiLevel.slice(7, 12));
        setFormData({ ...formData, select: "FALSE" });
      }
      else if (formData.cycle === "SECOND") {
        setLevelOptions(apiLevel.slice(12, 14));
        setFormData({ ...formData, select: "TRUE" });
      }
    }
    if (formData.level.length > 1) {
      const fil = apiSeries?.filter((item: EdgeSeries) => item.node.level === formData.level)
      setSeriesOptions(fil);
      if (!fil.length) {
        setFormData({ ...formData, seriesId: 0 })
      }
    }
  }, [formData.system, formData.cycle, formData.level])


  const handleChange = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClassType = (value: SingleValue<OptionType> | MultiValue<OptionType>) => {
    setClassType(value as MultiValue<OptionType>);
  };

  const handleSeriesList = (value: SingleValue<OptionType> | MultiValue<OptionType>) => {
    setSeriesList(value as MultiValue<OptionType>);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!window.confirm(t('Are you sure you want to proceed?'))) return;
    if (formData.level.length <= 3) {
      alert(t('3 Letters Expected for Class'));
      return;
    }

    let baseData: any = {
      ...formData,
      select: formData.select === 'TRUE',
      level: formData.level.toUpperCase(),
    };


    let dataToSubmit: any[] = [];

    if (actionType === 'create') {
      if (classType.length > 0) {
        classType.forEach((c: any) => {
          if (seriesList.length > 0) {
            // combine classType × seriesList
            seriesList.forEach((s: any) => {
              dataToSubmit.push({
                ...baseData,
                classType: c.value,
                seriesId: parseInt(s.value),
                createdById: user.user_id,
                updatedById: user.user_id,
              });
            });
          } else {
            // only classType
            dataToSubmit.push({
              ...baseData,
              classType: c.value,
              seriesId: 0,
              createdById: user.user_id,
              updatedById: user.user_id,
            });
          }
        });
      } else if (seriesList.length > 0) {
        // only seriesList
        seriesList.forEach((s: any) => {
          dataToSubmit.push({
            ...baseData,
            seriesId: parseInt(s.value),
            createdById: user.user_id,
            updatedById: user.user_id,
          });
        });
      }
    }

    if ((actionType === 'update' || actionType === 'delete') && selectedItem) {
      dataToSubmit = [{
        ...baseData,
        id: parseInt(decodeUrlID(selectedItem.node.id)),
        updatedById: user.user_id
      }];
    }

    console.log(dataToSubmit);

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

  const returnClassType: any = () => {
    return [{ value: formData?.classType, label: formData?.classType }]
  }

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

          <div className='flex flex-row gap-2 justify-between items-center'>
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
            {seriesOptions?.length > 0 && formData?.stream && formData?.cycle && system ? <MySelectField
              isMulti='select-multiple'
              id="series"
              name="series"
              label={t("Series")}
              placeholder={t("Select series")}
              // value={returnSeries()}
              value={seriesList}
              options={seriesOptions?.map((item: EdgeSeries) => ({ value: decodeUrlID(item.node.id), label: `${t(item?.node?.name)} - ${t(item?.node?.level)}` }))}
              // onChange={(e: any) => handleChange('seriesId', e.value)}
              onChange={(e) => handleSeriesList(e)}
            /> : <span className='text-red font-medium w-1/2 items-center mx-2'>{t("No Series Found")}</span>}
          </div>

          <div className='flex flex-row gap-2 justify-between'>
            {selectedItem ? <MySelectField
              isMulti='select-single'
              id="classType"
              name="classType"
              label={t("Class Type")}
              placeholder={t("Select Class Type")}
              value={returnClassType()}
              options={apiClassType.map((item: string) => ({ value: item, label: `${t(item)}` }))}
              onChange={(e: any) => handleChange('classType', e.value)}
            />
              :
              <MySelectField
                isMulti='select-multiple'
                id="classType"
                name="classType"
                label={t("Class Type")}
                placeholder={t("Select Class Type")}
                value={classType}
                options={apiClassType.map((item: string) => ({ value: item, label: `${t(item)}` }))}
                onChange={(e) => handleClassType(e)}
              />
            }
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

          {seriesList?.length > 0 && formData.academicYear ? <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className={`${actionType === "update" ? "bg-blue-600" : "bg-green-600"} font-bold hover:bg-blue-700 mt-6 px-6 py-2 rounded-md shadow-md text-lg text-white tracking-wide transition w-full`}
          >
            {t("Confirm")} & {t(capitalizeFirstLetter(actionType))}
          </motion.button> : null}
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
    $seriesId: ID!,
    $stream: String!,
    $cycle: String!,
    $level: String!,
    $classType: String,
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
      seriesId: $seriesId,
      stream: $stream,
      cycle: $cycle,
      level: $level,
      classType: $classType,
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




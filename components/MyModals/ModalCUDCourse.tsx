import { EdgeCourse, EdgeCustomUser, EdgeMainCourse, EdgeSpecialty } from '@/Domain/schemas/interfaceGraphql';
import { capitalizeFirstLetter, decodeUrlID } from '@/functions';
import MyInputField from '@/MyInputField';
import { JwtPayload } from '@/serverActions/interfaces';
import { gql, useMutation } from '@apollo/client';
import { jwtDecode } from 'jwt-decode';
import { motion } from 'framer-motion';
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';
import { ApiFactory } from '@/utils/graphql/ApiFactory';


interface FormData {
  mainCourseId: number
  specialtyId: number
  courseCode: string
  courseCredit: number
  courseType: string
  semester: string
  hours: number
  hoursLeft: string
  assigned: boolean
  assignedToId: string | any
  delete: boolean
}

const ModalCUDCourse = (
  { setOpenModal, selectedItem, actionType, extraData, params }
    :
    {
      params: any, setOpenModal: any, selectedItem: EdgeCourse, actionType: "create" | "update" | "delete" | string,
      extraData: { specialties?: EdgeSpecialty[], mainCourses?: EdgeMainCourse[], teachers?: EdgeCustomUser[] }
    }
) => {

  const { t } = useTranslation();
  const token = localStorage.getItem('token');
  const user: JwtPayload = jwtDecode(token ? token : "");

  const [formData, setFormData] = useState<FormData>({
    mainCourseId: selectedItem ? parseInt(decodeUrlID(selectedItem.node.mainCourse.id)) : 0,
    specialtyId: selectedItem ? parseInt(decodeUrlID(selectedItem.node.specialty.id)) : 0,
    courseCode: selectedItem ? selectedItem.node.courseCode : "",
    courseCredit: selectedItem ? selectedItem.node.courseCredit : 0,
    courseType: selectedItem ? selectedItem.node.courseType : "",
    semester: selectedItem ? selectedItem.node.semester : "",
    hours: selectedItem ? selectedItem.node.hours : 0,
    hoursLeft: selectedItem?.node?.hoursLeft.toString(),
    assigned: selectedItem ? selectedItem.node.assigned : false,
    assignedToId: selectedItem ? decodeUrlID(selectedItem.node?.assignedTo?.id) : undefined,
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
    let dataToSubmit: any = formData
    if (actionType === "create" && selectedItem) {
      dataToSubmit = {
        ...formData,
        hoursLeft: formData?.hoursLeft || formData.hours.toString(),
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
      newData: { ...dataToSubmit, hoursLeft: formData?.hoursLeft || formData.hours.toString(), delete: actionType === "delete" },
      editData: { ...dataToSubmit, hoursLeft: formData?.hoursLeft || formData.hours.toString(), delete: actionType === "delete" },
      mutationName: "createUpdateDeleteCourse",
      modelName: "course",
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
            <MyInputField
              id="mainCourseId"
              name="mainCourseId"
              label={t("Main Course")}
              type="select"
              placeholder={t("Select Main Course")}
              value={formData.mainCourseId.toString()}
              options={extraData?.mainCourses?.map((item: EdgeMainCourse) => { return { id: decodeUrlID(item.node.id), name: item.node.courseName } })}
              onChange={(e) => handleChange('mainCourseId', parseInt(e.target.value))}
            />
            <MyInputField
              id="specialtyId"
              name="specialtyId"
              label={t("Specialty")}
              type="select"
              placeholder={t("Select Specialty")}
              value={formData.specialtyId.toString()}
              options={extraData?.specialties?.sort((a: EdgeSpecialty, b: EdgeSpecialty) => a.node.academicYear < b.node.academicYear ? 1 : a.node.academicYear > b.node.academicYear ? -1 : 0).map((item: EdgeSpecialty) => {
                return { id: decodeUrlID(item.node.id.toString()), name: `${item.node?.mainSpecialty?.specialtyName}-${item.node?.level?.level}-${item.node?.academicYear}` }
              })}
              onChange={(e) => handleChange('specialtyId', parseInt(e.target.value))}
            />

            <div className='flex flex-row gap-2 justify-between'>
              <MyInputField
                id="hours"
                name="hours"
                label={t("Hours")}
                type="number"
                placeholder={t("Enter Hours")}
                value={formData.hours.toString()}
                onChange={(e) => handleChange('hours', parseInt(e.target.value))}
              />
              <MyInputField
                id="semester"
                name="semester"
                label={t("Semester")}
                type="select"
                placeholder={t("Select Semester")}
                value={formData.semester}
                options={["I", "II"]}
                onChange={(e) => handleChange('semester', e.target.value)}
              />
              <MyInputField
                id="courseCredit"
                name="courseCredit"
                label={t("Course Credit")}
                type="number"
                placeholder={t("Enter Course Credit")}
                value={formData.courseCredit.toString()}
                onChange={(e) => handleChange('courseCredit', parseInt(e.target.value))}
              />
            </div>
            <div className='flex flex-row gap-2 justify-between'>
              <MyInputField
                id="courseCode"
                name="courseCode"
                label={t("Course Code")}
                type="text"
                placeholder={t("Enter course Code")}
                value={formData.courseCode}
                onChange={(e) => handleChange('courseCode', e.target.value)}
              />
              <MyInputField
                id="courseType"
                name="courseType"
                label={t("Course Type")}
                type="select"
                placeholder={t("Enter Course Type")}
                value={capitalizeFirstLetter(formData.courseType)}
                options={["Fundamental", "Transversal", "Professional"]}
                onChange={(e) => handleChange('courseType', e.target.value)}
              />
            </div>

            <MyInputField
              id="assignedToId"
              name="assignedToId"
              label={t("Lecturer")}
              type="select"
              placeholder={t("Select Lecturer")}
              value={formData.assignedToId}
              options={extraData?.teachers?.map((item: EdgeCustomUser) => { return { id: decodeUrlID(item.node.id.toString()), name: item.node.fullName } })}
              onChange={(e) => handleChange('assignedToId', e.target.value)}
            />

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

  export default ModalCUDCourse




  const query = gql`
  mutation Update(
    $id: ID,
    $mainCourseId: ID!,
    $specialtyId: ID!,
    $courseCode: String!,
    $courseCredit: Int!,
    $courseType: String!,
    $semester: String!,
    $hours: Int!,
    $hoursLeft: String,
    $assigned: Boolean,
    $assignedToId: ID,
    $delete: Boolean!,
    $createdById: ID,
    $updatedById: ID

  ) {
    createUpdateDeleteCourse(
      id: $id
      mainCourseId: $mainCourseId
      specialtyId: $specialtyId
      courseCode: $courseCode
      courseCredit: $courseCredit
      courseType: $courseType
      semester: $semester
      hours: $hours
      hoursLeft: $hoursLeft
      assigned: $assigned
      assignedToId: $assignedToId
      delete: $delete
      createdById: $createdById
      updatedById: $updatedById
    ) {
      course {
        id 
      }
    }
  }
`;

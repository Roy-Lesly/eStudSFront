'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '@/serverActions/interfaces';
import { capitalizeFirstLetter, decodeUrlID } from '@/functions';
import { gql } from '@apollo/client';
import MyInputField from '@/MyInputField';
import { EdgeLevel, EdgeMainSpecialty, EdgePreInscription, EdgeProgram, EdgeSpecialty, NodeSchoolHigherInfo, NodeSpecialty } from '@/Domain/schemas/interfaceGraphql';
import { useRouter } from 'next/navigation';
import { CertificateOptions, RegionList } from '@/constants';
import countryList from "react-select-country-list";
import Select from "react-select";
import { useTranslation } from 'react-i18next';
import FinalPage from './FinalPage';
import { ApiFactory } from '@/utils/graphql/ApiFactory';
import { errorLog } from '@/utils/graphql/GetAppolloClient';


const CountryList = countryList().getData();

type FormData = {
  personalInfo: {
    firstName: string;
    lastName: string;
    sex: string;
    address: string;
    dob: string;
    pob: string;
    telephone: string;
    email: string;
    fatherName: string;
    motherName: string;
    fatherTelephone: string;
    motherTelephone: string;
    parentAddress: string;
    password: string;
  };
  medicalHistory: {
    role: string;
    deptNames: string[];
    allergies: string;
    medicalHistory: string;
    nationality: string;
    highestCertificate: string;
    highestCertificateOther: string;
    yearObtained: string;
    regionOfOrigin: string;
    regionOfOriginOther: string;
  };
  classAssignment: {
    specialtyId: string;
    programId: string;
    session: string;
  };
};


const AdmissionForm = (
  { data, dataSpecialties, params, dataSchoolInfo, dataPrograms, dataLevels, specialtyOne, sp }:
    { data: EdgePreInscription, dataSpecialties: EdgeSpecialty[], params: { domain: string, school_id: string }, dataSchoolInfo: NodeSchoolHigherInfo, dataPrograms: EdgeProgram[], dataLevels: EdgeLevel[], dataMainSpecialties: EdgeMainSpecialty[], specialtyOne?: NodeSpecialty, sp?: any }
) => {
  const { t } = useTranslation();
  const steps = [
    `${t("Personal Info")}`,
    `${t("Role / Dept")}`,
    `${t("Class Assignment")}`,
    `${t("Confirmation")}`
  ];

  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(2);
  const [optionsSpecialties, setOptionsSpecialties] = useState<{ id: string, name: string }[]>();
  const [optionsPrograms, setOptionsPrograms] = useState<{ id: string, name: string }[]>();
  const [optionsLevels, setOptionsLevels] = useState<{ id: string, name: string }[]>();
  const [selectedLevel, setSelectedLevel] = useState<string>();


  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: data?.node?.firstName,
      lastName: data?.node?.lastName,
      sex: capitalizeFirstLetter(data?.node?.sex),
      address: data?.node?.address,
      dob: data?.node?.dob,
      pob: data?.node?.pob,
      telephone: data?.node?.telephone,
      email: data?.node?.email,
      fatherName: data?.node?.fatherName,
      motherName: data?.node?.motherName,
      fatherTelephone: data?.node?.fatherTelephone,
      motherTelephone: data?.node?.motherTelephone,
      parentAddress: data?.node?.parentAddress,
      password: '',
      prefix: dataSchoolInfo?.prefix,
      method: dataSchoolInfo?.method,
    },
    medicalHistory: {
      role: 'student',
      deptNames: 'Student',
      allergies: '',
      medicalHistory: '',
      nationality: data?.node?.nationality,
      highestCertificate: data?.node?.highestCertificate,
      highestCertificateOther: data?.node?.highestCertificate,
      yearObtained: data?.node?.yearObtained,
      regionOfOrigin: data?.node?.regionOfOrigin,
      regionOfOriginOther: data?.node?.regionOfOrigin,
    },
    classAssignment: {
      specialtyId: decodeUrlID(specialtyOne?.id || ""),
      programId: data?.node?.program.id,
      session: data?.node?.session,
    },
  });

  const [stepValidation, setStepValidation] = useState<boolean[]>(
    new Array(steps.length).fill(false)
  );

  const validateStep = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0: {
        const { firstName, lastName, sex, address, dob, pob, telephone, email, motherName, fatherTelephone } = formData.personalInfo;
        return [firstName, lastName, sex, address, dob, pob, telephone, email, motherName, fatherTelephone].every(
          (field) => field !== undefined && String(field).trim() !== ''
        );
      }
      case 1: {
        const { role, deptNames } = formData.medicalHistory;
        return [role, deptNames].every(
          (field) => field !== undefined && String(field).trim() !== ''
        );
      }
      case 2: {
        const { specialtyId, programId, session } = formData.classAssignment;
        return [specialtyId, programId, session].every(
          (field) =>
            field !== undefined &&
            String(field).trim() !== '' &&
            (Array.isArray(field) ? field.every((item) => item !== undefined && String(item).trim() !== '') : true)
        );
      }
      default:
        return true;
    }
  };

  useEffect(() => {
    if (data && dataSpecialties) {
      setSelectedLevel(data.node?.level.replace("A_", ""));
      setFormData((prev) => {
        const preinscription = data?.node;

        if (!preinscription || !dataPrograms) return prev; // Prevent errors if data is missing

        let specialty = dataSpecialties?.find((item: EdgeSpecialty) => {
          return (
            decodeUrlID(item.node.mainSpecialty.id) === decodeUrlID(preinscription.specialtyOne.id) &&
            item.node.academicYear === preinscription.academicYear &&
            item.node.level.level.toString() === preinscription.level.replace("A_", "")
          );
        });

        if (!specialty) {
          specialty = dataSpecialties?.find((item: EdgeSpecialty) => {
            return (
              decodeUrlID(item.node.mainSpecialty.id) === decodeUrlID(preinscription.specialtyTwo.id) &&
              item.node.academicYear === preinscription.academicYear &&
              item.node.level.level.toString() === preinscription.level.replace("A_", "")
            );
          });
        }

        const program = dataPrograms?.find(
          (item: EdgeProgram) => decodeUrlID(item.node.id) === decodeUrlID(preinscription.program.id)
        );

        return {
          ...prev,
          classAssignment: {
            ...prev.classAssignment,
            specialtyId: decodeUrlID(specialty?.node.id || ""),
            programId: decodeUrlID(program?.node?.id || ""),
          },
        };
      });
      const f = dataSpecialties.sort((a: EdgeSpecialty, b: EdgeSpecialty) =>
        a.node.mainSpecialty.specialtyName > b.node.mainSpecialty.specialtyName ? 1 : a.node.mainSpecialty.specialtyName < b.node.mainSpecialty.specialtyName ? -1 : 0)
        .map((item: EdgeSpecialty) => {
          return { "id": decodeUrlID(item.node.id), "name": `${item.node.mainSpecialty.specialtyName} - ${item.node.level.level} - ${item.node.academicYear}` }
        })
      if (f) {
        if (f && sp?.level) { setOptionsSpecialties(f.filter((item: any) => item.name.includes(sp.level))) }
        else { setOptionsSpecialties(f) }
      }
    }
    if (data && dataPrograms) {
      const f = dataPrograms?.sort((a: EdgeProgram, b: EdgeProgram) => a.node.name > b.node.name ? 1 : a.node.name < b.node.name ? -1 : 0).map((item: EdgeProgram) => {
        return { "id": decodeUrlID(item.node.id), "name": `${item.node.name}` }
      })
      if (f) { setOptionsPrograms(f) }
    }
    if (data && dataLevels) {
      const f = dataLevels?.sort((a: EdgeLevel, b: EdgeLevel) => a.node.level > b.node.level ? 1 : a.node.level < b.node.level ? -1 : 0).map((item: EdgeLevel) => {
        return { "id": item.node.level, "name": `${item.node.level}` }
      })
      if (f) {
        setOptionsLevels(f)
      }
    }
  }, [data])

  useEffect(() => {
    if (!formData?.classAssignment?.specialtyId && optionsSpecialties && optionsSpecialties?.length) {
        alert(t("1st Choice Specialty Not Found For this Year - Create for this Year and Level"))      
    }
  } , [formData, optionsSpecialties])


  const handleNext = () => {
    const isValid = validateStep(currentStep);
    const updatedValidation = [...stepValidation];
    updatedValidation[currentStep] = isValid;
    setStepValidation(updatedValidation);

    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (!isValid) {
      alert(t("Please fill in all required fields"));
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleChange = <K extends keyof FormData>(
    section: K,
    field: keyof FormData[K],
    value: string | string[] // Update the type to accept both string and string[]
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value // Ensure it is always an array
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const user: JwtPayload = jwtDecode(token || "");

      // Validate all steps before proceeding
      const finalValidation = steps.slice(0, 3).map((_, index) => validateStep(index));
      if (!finalValidation.every(Boolean)) {
        alert("Please complete all steps before submitting.");
        setStepValidation(finalValidation);
        return;
      }

      const preinscription = data?.node;

      const newFormData = {
        ...formData.personalInfo,
        ...formData.medicalHistory,
        highestCertificate: formData.medicalHistory.highestCertificate === "Other" ? formData.medicalHistory.highestCertificateOther : formData.medicalHistory.highestCertificate,
        regionOfOrigin: formData.medicalHistory.regionOfOriginOther === "Other" ? formData.medicalHistory.regionOfOriginOther : formData.medicalHistory.regionOfOrigin,
        role: formData.medicalHistory.role,
        email: formData.personalInfo.email.toLowerCase(),
        dept: [2],
        schoolIds: [parseInt(params.school_id)],
        prefix: (formData.personalInfo.method + formData.personalInfo.prefix) || "",
        method: formData.personalInfo.method,
        infoData: JSON.stringify([]),
        delete: false,
      };


      const userSuccessFieldData = await ApiFactory({
        newData: newFormData,
        editData: {},
        mutationName: "createUpdateDeleteCustomUser",
        modelName: "customuser",
        successField: "id",
        query,
        router,
        params,
        redirect: false,
        reload: false,
        returnResponseField: true,
        redirectPath: ``,
        actionLabel: "creating",
      });

      if (!userSuccessFieldData) {
        errorLog("Failed to create user")
        return;
      }

      console.log(305, userSuccessFieldData);

      const customuserId = parseInt(decodeUrlID(userSuccessFieldData));

      const dataUserProfile = {
        customuserId,
        specialtyId: parseInt(formData.classAssignment.specialtyId),
        programId: parseInt(formData.classAssignment.programId),
        session: capitalizeFirstLetter(formData.classAssignment.session.toLowerCase()),
        infoData: JSON.stringify({ status: "N/A" }),
        delete: false,
        createdById: user.user_id,
      };

      console.log(319, dataUserProfile);

      const userprofileprofileSuccessFieldData = await ApiFactory({
        newData: { ...dataUserProfile, customUser: decodeUrlID(userSuccessFieldData) },
        editData: {},
        mutationName: "createUpdateDeleteUserProfile",
        modelName: "userprofile",
        successField: "id",
        query: queryUserprofile,
        router,
        params,
        redirect: false,
        reload: false,
        returnResponseField: true,
        // redirectPath: `/${params.locale}/${params.domain}/Section-S/${params.language}/PageAdministration/${params.school_id}/PageStudents/`,
        redirectPath: ``,
        actionLabel: "creating",
      });

      console.log(338, userprofileprofileSuccessFieldData);


      if (!userprofileprofileSuccessFieldData) {
        errorLog("Failed to create profille");
        return
      }

      alert(`Success Admitted: ${preinscription?.firstName} ✅`,);

      router.push(
        `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/${userprofileprofileSuccessFieldData}/?user=${userSuccessFieldData}`
      );
    } catch (error: any) {
      errorLog(error);
      alert(`Error creating: ${error.message || error}`);
    }
  };


  const filterSpeciaties = (lev: any) => {
    setOptionsSpecialties(dataSpecialties?.filter((spec: EdgeSpecialty) =>
      spec.node.level.level == lev).map((item: EdgeSpecialty) => { return { "id": decodeUrlID(item.node.id), "name": `${item.node.mainSpecialty.specialtyName} - ${item.node.level.level} - ${item.node.academicYear}` } })
    )
    setSelectedLevel(lev)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-bold text-xl">{t("Personal Information")}</h2>

            <div className="mb-10 space-y-2">

              <div className='flex flex-col gap-2 md:flex-row md:gap-4'>
                <MyInputField
                  id="firstName"
                  name="firstName"
                  label={t("First Name")}
                  type="text"
                  placeholder={t("First Name")}
                  value={formData.personalInfo.firstName}
                  onChange={(e) => handleChange('personalInfo', 'firstName', e.target.value)}
                />
                <MyInputField
                  id="lastName"
                  name="lastName"
                  label={t("Last Name")}
                  type="text"
                  placeholder={t("Last Name")}
                  value={formData.personalInfo.lastName}
                  onChange={(e) => handleChange('personalInfo', 'lastName', e.target.value)}
                />
              </div>

              <div className='flex flex-col gap-2 md:flex-row md:gap-4'>
                <MyInputField
                  id="sex"
                  name="sex"
                  label="Gender"
                  type="select"
                  placeholder="Gender"
                  options={["Male", "Female"]}
                  value={formData.personalInfo.sex}
                  onChange={(e) => handleChange('personalInfo', 'sex', e.target.value)}
                />
                <MyInputField
                  id="address"
                  name="address"
                  label={t("Address")}
                  type="text"
                  placeholder={t("Address")}
                  value={formData.personalInfo.address}
                  onChange={(e) => handleChange('personalInfo', 'address', e.target.value)}
                />
              </div>

              <div className='flex flex-col gap-4 md:flex-row'>
                <MyInputField
                  id="dob"
                  name="dob"
                  label={t("Date of Birth")}
                  type="date"
                  placeholder={t("Date of Birth")}
                  value={formData.personalInfo.dob}
                  onChange={(e) => handleChange('personalInfo', 'dob', e.target.value)}
                />
                <MyInputField
                  id="pob"
                  name="pob"
                  label={t("Place of Birth")}
                  type="text"
                  placeholder={t("Place of Birth")}
                  value={formData.personalInfo.pob}
                  onChange={(e) => handleChange('personalInfo', 'pob', e.target.value)}
                />
              </div>

            </div>

            <h2 className="font-bold text-xl">{t("Contact Information")}</h2>

            <div className='flex flex-col gap-2 md:flex-row md:gap-4'>
              <MyInputField
                id="telephone"
                name="telephone"
                label="Telephone"
                type="number"
                placeholder="Telephone"
                value={formData.personalInfo.telephone}
                onChange={(e) => handleChange('personalInfo', 'telephone', e.target.value)}
              />
              <MyInputField
                id="email"
                name="email"
                label="Email"
                type="email"
                placeholder="Email"
                value={formData.personalInfo.email}
                onChange={(e) => handleChange('personalInfo', 'email', e.target.value)}
              />
            </div>

            <div className='flex flex-col gap-2 md:flex-row md:gap-4'>
              <MyInputField
                id="fatherName"
                name="fatherName"
                label={t("Father Name")}
                type="text"
                placeholder={t("Father Name")}
                value={formData.personalInfo.fatherName}
                onChange={(e) => handleChange('personalInfo', 'fatherName', e.target.value)}
              />
              <MyInputField
                id="motherName"
                name="motherName"
                label={t("Mother's Name")}
                type="text"
                placeholder={t("Mother's Name")}
                value={formData.personalInfo.motherName}
                onChange={(e) => handleChange('personalInfo', 'motherName', e.target.value)}
              />
            </div>
            <div className='flex flex-col gap-2 md:flex-row md:gap-4'>
              <MyInputField
                id="fatherTelephone"
                name="fatherTelephone"
                label={t("Father's Telephone")}
                type="number"
                placeholder={t("Father's Telephone")}
                value={formData.personalInfo.fatherTelephone}
                onChange={(e) => handleChange('personalInfo', 'fatherTelephone', e.target.value)}
              />
              <MyInputField
                id="motherTelephone"
                name="motherTelephone"
                label={t("Mother's Telephone")}
                type="number"
                placeholder={t("Mother's Telephone")}
                value={formData.personalInfo.motherTelephone}
                onChange={(e) => handleChange('personalInfo', 'motherTelephone', e.target.value)}
              />
            </div>
            <div className='flex flex-col gap-2 md:flex-row md:gap-4'>
              <MyInputField
                id="parentAddress"
                name="parentAddress"
                label={t("Parent's Address")}
                type="text"
                placeholder={t("Parent's Address")}
                value={formData.personalInfo.parentAddress}
                onChange={(e) => handleChange('personalInfo', 'parentAddress', e.target.value)}
              />
            </div>


          </motion.div>
        );
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-bold text-xl">{t("Role and Department")}</h2>
            <div className="space-y-2">
              <div className='flex flex-col gap-4 md:flex-row'>

                <MyInputField
                  id="role"
                  name="role"
                  label="Role"
                  type="text"
                  placeholder="Role"
                  value={formData.medicalHistory.role}
                  onChange={(e) => handleChange('medicalHistory', 'role', e.target.value)}
                  readOnly={true}
                />
                <MyInputField
                  id="deptNames"
                  name="deptNames"
                  label="Departments"
                  type="text"
                  placeholder="Departments"
                  value={formData.medicalHistory.deptNames}
                  onChange={(e) => handleChange('medicalHistory', 'deptNames', e.target.value)}
                  readOnly={true}
                />
              </div>

              <div className='flex flex-col gap-4 md:flex-row'>
                <Select
                  className='flex items-center justify-center w-full'
                  name="nationality"
                  options={CountryList}
                  value={CountryList.find((country: { value: string, label: string }) => country.label === formData.medicalHistory.nationality)}
                  onChange={(e) => handleChange('medicalHistory', 'nationality', e?.label || "")}
                  placeholder="Select a Country"
                  isSearchable
                />

                <MyInputField
                  id="regionOfOrigin"
                  name="regionOfOrigin"
                  label={t("Region Of Origin")}
                  type="select"
                  options={RegionList}
                  placeholder={t("Region Of Origin")}
                  value={formData.medicalHistory.regionOfOrigin}
                  onChange={(e) => handleChange('medicalHistory', 'regionOfOrigin', e.target.value)}
                />
                {formData.medicalHistory.regionOfOrigin === "Other" ? <MyInputField
                  id="regionOfOriginOther"
                  name="regionOfOriginOther"
                  label={t("Region Of Origin")}
                  type="text"
                  placeholder={t("Region Of Origin")}
                  value={formData.medicalHistory.regionOfOriginOther}
                  onChange={(e) => handleChange('medicalHistory', 'regionOfOriginOther', e.target.value)}
                /> : null}
              </div>

              <div className='flex flex-col gap-4 md:flex-row'>
                <MyInputField
                  id="highestCertificate"
                  name="highestCertificate"
                  label={t("Highest Certificate")}
                  type="select"
                  placeholder={t("Highest Certificate")}
                  value={formData.medicalHistory.highestCertificate}
                  onChange={(e) => handleChange('medicalHistory', 'highestCertificate', e.target.value)}
                  options={CertificateOptions}
                />
                {formData.medicalHistory.regionOfOrigin === "Other" ? <MyInputField
                  id="highestCertificateOther"
                  name="highestCertificateOther"
                  label={t("Other Certificate")}
                  type="text"
                  placeholder={t("Other Certificate / Diploma")}
                  value={formData.medicalHistory.highestCertificateOther}
                  onChange={(e) => handleChange('medicalHistory', 'highestCertificateOther', e.target.value)}
                /> : null}

                <MyInputField
                  id="yearObtained"
                  name="yearObtained"
                  label={t("Year Obtained")}
                  type="text"
                  placeholder={t("Year Obtained")}
                  value={formData.medicalHistory.yearObtained}
                  onChange={(e) => handleChange('medicalHistory', 'yearObtained', e.target.value)}
                />
              </div>

              <br />
              <h2 className="font-bold text-xl">{t("Medical History")}</h2>
              <MyInputField
                id="allergies"
                name="allergies"
                label={t("Allergies")}
                type="textArea"
                placeholder={t("Allergies")}
                value={formData.medicalHistory.allergies}
                onChange={(e) => handleChange('medicalHistory', 'allergies', e.target.value)}
              />
              <MyInputField
                id="medicalHistory"
                name="medicalHistory"
                label={t("Medical History")}
                type="textArea"
                placeholder={t("Medical History")}
                value={formData.medicalHistory.medicalHistory}
                onChange={(e) => handleChange('medicalHistory', 'medicalHistory', e.target.value)}
              />
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-bold mb-4 text-xl">{t("Class Assigment")}</h2>

            <div className='flex flex-row justify-between text-black'>
              <div className="flex gap-2">
                <span>{t("Choice 1")}:</span>
                <span className='font-medium italic'>{data?.node.specialtyOne?.specialtyName}</span>
              </div>
              <div className="flex gap-2">
                <span>{t("Choice 2")}:</span>
                <span className='font-medium italic'>{data?.node.specialtyTwo?.specialtyName}</span>
              </div>
            </div>

            <div className="space-y-4">
              <MyInputField
                id="specialtyId"
                name="specialtyId"
                label={t("Specialty")}
                type="select"
                placeholder={t("Specialty")}
                value={formData.classAssignment.specialtyId}
                onChange={(e) => { handleChange('classAssignment', 'specialtyId', e.target.value); }}
                options={optionsSpecialties}
              />
              <MyInputField
                id="level"
                name="level"
                label={t("Level")}
                type="select"
                placeholder={t("Level")}
                value={selectedLevel ? selectedLevel : ""}
                onChange={(e) => { filterSpeciaties(e.target.value) }}
                options={optionsLevels}
              />
              <MyInputField
                id="programId"
                name="programId"
                label={t("Program")}
                type="select"
                placeholder={t("Program")}
                value={formData.classAssignment.programId}
                onChange={(e) => { handleChange('classAssignment', 'programId', e.target.value); }}
                options={optionsPrograms}
              />
              <MyInputField
                id="session"
                name="session"
                label={t("Session")}
                type="select"
                placeholder={t("Session")}
                value={capitalizeFirstLetter(formData.classAssignment.session)}
                onChange={(e) => handleChange('classAssignment', 'session', e.target.value)}
                options={["Morning", "Evening"]}
              />
              <MyInputField
                id="password"
                name="password"
                label={t("Password (Optional)")}
                type="password"
                placeholder={t("password")}
                value={formData.personalInfo.password}
                onChange={(e) => handleChange('personalInfo', 'password', e.target.value)}
              />
            </div>
          </motion.div>
        );
      case 3:
        return (
          <FinalPage setCurrentStep={setCurrentStep} currentStep={currentStep} formData={formData} t={t}
            optionsSpecialties={optionsSpecialties}
            optionsPrograms={optionsPrograms}
          />

        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white mx-auto p-6 rounded shadow">
      {/* Stepper */}
      <div className="flex items-center justify-between mb-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex-1 text-center ${index <= currentStep ? 'font-bold' : 'text-gray-400'
              } ${stepValidation[index]
                ? 'text-green-600'
                : index < currentStep && !stepValidation[index]
                  ? 'text-red-600'
                  : ''
              }`}
          >
            <div
              className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${stepValidation[index]
                ? 'bg-green-600 text-white'
                : index < currentStep && !stepValidation[index]
                  ? 'bg-red-600 text-white'
                  : index <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300'
                }`}
            >
              {index + 1}
            </div>
            <p>{step}</p>
          </div>
        ))}
      </div>

      {/* Step Content */}
      {renderStepContent()}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-10">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="bg-red disabled:opacity-50 font-medium hover:bg-slate-500 px-4 py-2 rounded text-white"
        >
          {t("Previous")}
        </button>
        {currentStep === steps.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
          >
            {t("Confirm and Submit")}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
          >
            {t("Next")}
          </button>
        )}
      </div>
    </div>
  );
};

export default AdmissionForm;




const query = gql`
    mutation CreateCustomUser(
      $prefix: String!
      $sex: String!
      $role: String!
      $email: String!
      $address: String!
      $password: String!
      $firstName: String!
      $lastName: String!
      $dob: String!
      $pob: String!
      $telephone: String!
      $fatherName: String!
      $motherName: String!
      $fatherTelephone: String!
      $motherTelephone: String!
      $parentAddress: String!
      $nationality: String!
      $regionOfOrigin: String!
      $highestCertificate: String!
      $yearObtained: String!
      $deptIds: [ID]
      $schoolIds: [ID!]!
      $infoData: JSONString!
      $delete: Boolean!
    ) {
      createUpdateDeleteCustomUser(
        prefix: $prefix
        sex: $sex
        role: $role
        email: $email
        address: $address
        password: $password
        firstName: $firstName
        lastName: $lastName
        dob: $dob
        pob: $pob
        telephone: $telephone
        fatherName: $fatherName
        motherName: $motherName
        fatherTelephone: $fatherTelephone
        motherTelephone: $motherTelephone
        parentAddress: $parentAddress
        nationality: $nationality
        regionOfOrigin: $regionOfOrigin
        highestCertificate: $highestCertificate
        yearObtained: $yearObtained
        deptIds: $deptIds
        schoolIds: $schoolIds
        infoData: $infoData
        delete: $delete
      ) {
        customuser {
          id
        }
      }
    }
  `;


const queryUserprofile = gql`
  mutation CreateUserProfile(
    $customuserId: ID!
    $specialtyId: ID!
    $programId: ID!
    $session: String!
    $infoData: JSONString!
    $delete: Boolean!
  ) {
    createUpdateDeleteUserProfile(
      customuserId: $customuserId
      specialtyId: $specialtyId
      programId: $programId
      session: $session
      infoData: $infoData
      delete: $delete
    ) {
      userprofile {
        id
      }
    }
  }
`;

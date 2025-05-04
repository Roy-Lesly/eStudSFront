'use client';
import { motion } from 'framer-motion';
import { capitalizeFirstLetter, decodeUrlID } from '@/functions';
import MyInputField from '@/MyInputField';
import React, { useEffect, useState } from 'react'
import { EdgeLevel, EdgeMainSpecialty, EdgeProgram, EdgeSchoolHigherInfo } from '@/Domain/schemas/interfaceGraphql';
import Select from "react-select";
import countryList from "react-select-country-list";
import { CertificateOptions, RegionList } from '@/constants';
import { gql, useMutation } from '@apollo/client';




const steps = ['Personal Info', 'Role / Dept', 'Specialty', 'Confirmation'];
const CountryList = countryList().getData();

type FormData = {
  personalInfo: {
    first_name: string;
    last_name: string;
    sex: string;
    email: string;
    telephone: string;
    address: string;
    pob: string;
    dob: string;
  };
  medicalHistory: {
    nationality: string;
    highest_certificate: string;
    highest_certificate_other: string;
    year_obtained: string;
    region_of_origin: string;
    region_of_origin_other: string;

    emergency_name: string;
    emergency_town: string;
    emergency_telephone: string;
    campus: string;
  };
  classAssignment: {
    academic_year: string;
    program: string;
    level: string;
    session: string;
    specialty_one: string;
    specialty_two: string;
    status: "PENDING";
    admission_status: false;
  };
};

const PreForm = ({ data, source, params, link }: { params: any, source: "admin" | "student", data?: any, link: string }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const currentYear = new Date().getFullYear();
  const [count, setCount] = useState<number>(0);
  const [optionsSpecialties, setOptionsSpecialties] = useState<{ id: number, name: string }[]>();
  const [optionsCampuses, setOptionsCampuses] = useState<{ id: number, name: string }[]>();
  const [optionsPrograms, setOptionsPrograms] = useState<{ id: number, name: string }[]>();
  const [optionsYears, setOptionsYears] = useState<{ id: string, name: string }[]>();
  const [optionsLevels, setOptionsLevels] = useState<{ id: number, name: string }[]>();

  const [formData, setFormData] = useState({
    personalInfo: {
      first_name: '',
      last_name: '',
      sex: '',
      email: '',
      telephone: '',
      address: '',
      pob: '',
      dob: '',
    },
    medicalHistory: {
      nationality: '',
      highest_certificate: '',
      highest_certificate_other: '',
      year_obtained: '',
      region_of_origin: '',
      region_of_origin_other: '',
      emergency_name: '',
      emergency_town: '',
      emergency_telephone: '',
      campus: source === "admin" ? parseInt(localStorage.getItem("school") || "") : "",
    },
    classAssignment: {
      academic_year: '',
      program: '',
      level: '',
      session: '',
      specialty_one: '',
      specialty_two: '',
      status: 'PENDING',
      admission_status: false,
    },
  });

  const [stepValidation, setStepValidation] = useState<boolean[]>(
    new Array(steps.length).fill(false)
  );

  const validateStep = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0:
        const { first_name, last_name, sex, address, dob, pob, telephone, email, } = formData.personalInfo;
        return [first_name, last_name, sex, address, dob, pob, telephone, email,].every((field) => String(field).trim() !== '');
      case 1:
        const { campus, nationality, highest_certificate, year_obtained, region_of_origin } = formData.medicalHistory;
        return [nationality, highest_certificate, year_obtained, region_of_origin, campus.toString()].every((field) => String(field.trim()) !== '');
      case 2:
        const { academic_year, program, level, session, specialty_one } = formData.classAssignment;
        return [academic_year, program, level, session, specialty_one].every((field) => String(field).trim() !== '' && (Array.isArray(field) ? field.every(item => String(item).trim() !== '') : true));

      default:
        return true;
    }
  };

  useEffect(() => {
    if (count === 0) {
      if (data && data.allMainSpecialties?.edges) {
        const f = data.allMainSpecialties.edges.sort((a: EdgeMainSpecialty, b: EdgeMainSpecialty) => a.node.specialtyName > b.node.specialtyName ? 1 : a.node.specialtyName < b.node.specialtyName ? -1 : 0).map((item: EdgeMainSpecialty) => {
          // return { "id": item.node.specialtyName, "name": `${item.node.specialtyName}` }
          return { "id": decodeUrlID(item.node.id), "name": `${item.node.specialtyName}` }
        })
        if (f) { setOptionsSpecialties(f) }
      }
      if (data && data.allAcademicYears) {
        const f = data.allAcademicYears.slice(0, 2).map((item: string) => ({
          id: item,
          name: `${item}`
        }));
        if (f.length > 0) {
          setOptionsYears(f);
        }
      }
      if (data && data.allPrograms?.edges) {
        const f = data.allPrograms.edges.map((item: EdgeProgram) => {
          return { "id": decodeUrlID(item.node.id), "name": `${item.node.name}` }
        })
        if (f) { setOptionsPrograms(f) }
      }
      if (data && data?.allSchoolInfos?.edges.length) {
        console.log(data.allSchoolInfos, 146)
        const f = data.allSchoolInfos.edges.map((item: EdgeSchoolHigherInfo) => {
          return { "id": decodeUrlID(item.node.id), "name": `${item.node.campus.replace("_", "-")}` }
        })
        console.log(f, 150)

        if (f) { setOptionsCampuses(f) }
      }
      if (data && data.allLevels?.edges) {
        const f = data.allLevels.edges.sort((a: EdgeLevel, b: EdgeLevel) => a.node.level > b.node.level ? 1 : a.node.level < b.node.level ? -1 : 0).map((item: EdgeLevel) => {
          return { "id": item.node.level, "name": `${item.node.level}` }
        })
        if (f) { setOptionsLevels(f) }
      }
      setCount(1)
    }
  }, [data])


  const handleNext = () => {
    const isValid = validateStep(currentStep);
    const updatedValidation = [...stepValidation];
    updatedValidation[currentStep] = isValid;
    setStepValidation(updatedValidation);

    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (!isValid) {
      alert('Please fill in all required fields.');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleChange = <K extends keyof FormData>(
    section: K,
    field: keyof FormData[K],
    value: string | string[]
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value
      },
    }));
  };

  const [createUpdateDeletePreInsription] = useMutation(CREATE_PREINSCRIPTION);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const newData = {
      registrationNumber: formData.personalInfo.first_name?.toString().toUpperCase(),
      firstName: formData.personalInfo.first_name?.toString().toUpperCase(),
      lastName: formData.personalInfo.last_name?.toString().toUpperCase(),
      fullName: formData.personalInfo.first_name?.toString().toUpperCase() + " " + formData.personalInfo.last_name?.toString().toUpperCase(),
      sex: formData.personalInfo.sex,
      email: formData.personalInfo.email?.toString().toLowerCase(),
      telephone: formData.personalInfo.telephone,
      address: formData.personalInfo.address?.toString().toUpperCase(),
      pob: formData.personalInfo.pob,
      dob: formData.personalInfo.dob,

      emergencyName: formData.medicalHistory.emergency_name ? formData.medicalHistory.emergency_name?.toString().toUpperCase() : "None",
      emergencyTown: formData.medicalHistory.emergency_town ? formData.medicalHistory.emergency_town?.toString().toUpperCase() : "None",
      emergencyTelephone: formData.medicalHistory.emergency_telephone,
      campus: formData.medicalHistory.campus.toString(),

      nationality: formData.medicalHistory?.nationality,
      regionOfOrigin: formData.medicalHistory.region_of_origin === "Other" ? capitalizeFirstLetter(formData.medicalHistory.region_of_origin_other.toLowerCase()) : formData.medicalHistory.region_of_origin,
      highestCertificate: formData.medicalHistory.highest_certificate === "Other" ? capitalizeFirstLetter(formData.medicalHistory.highest_certificate_other.toLowerCase()) : formData.medicalHistory.highest_certificate,
      yearObtained: formData.medicalHistory.year_obtained,

      academicYear: formData.classAssignment.academic_year,
      program: formData.classAssignment.program,
      level: formData.classAssignment.level,
      session: formData.classAssignment.session,
      specialtyOne: formData.classAssignment.specialty_one,
      specialtyTwo: formData.classAssignment.specialty_two,
      status: "PENDING",
      admissionStatus: false,
      action: "CREATING",
      delete: false,
    }
    setCount(10)

    if ([newData].length > 0) {
      const successMessages: string[] = [];
      const errorMessages: string[] = [];
      for (let index = 0; index < [newData].length; index++) {
        const res = [newData][index];
        try {
          const result = await createUpdateDeletePreInsription({
            variables: {
              ...res,
              // id: parseInt(decodeUrlID(data.node.userprofile.user.id)),
              sex: capitalizeFirstLetter(newData.sex),
              email: newData.email.toLowerCase(),
            }
          });

          if (result.data.createUpdateDeletePreinscription.preinscription.id) {
            successMessages.push(
              `${result.data.createUpdateDeletePreinscription.preinscription.firstName}`
            );
          }
        } catch (err: any) {
          errorMessages.push(`Error updating ${newData.firstName}: ${err.message}`);
        }
      }

      let alertMessage = "";
      if (successMessages.length > 0) {
        alertMessage += `✅ Successfully Submitted`;
        window.location.reload();
      }
      if (errorMessages.length > 0) {
        alertMessage += `❌ Errors occurred:\n${errorMessages.join("\n")}`;
      }
      alert(alertMessage);
      setCount(9)
    }
  };

  const last_20_years = Array.from({ length: 25 }, (_, i) => (currentYear - i).toString());

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-bold text-xl">Personal Information</h2>

            <div className="mb-10 space-y-2">

              <div className='flex flex-col gap-2 md:flex-row md:gap-4'>
                <MyInputField
                  id="first_name"
                  name="first_name"
                  label="First Name"
                  type="text"
                  placeholder="First Name"
                  value={formData.personalInfo.first_name}
                  onChange={(e) => handleChange('personalInfo', 'first_name', e.target.value)}
                />
                <MyInputField
                  id="last_name"
                  name="last_name"
                  label="Last Name"
                  type="text"
                  placeholder="Last Name"
                  value={formData.personalInfo.last_name}
                  onChange={(e) => handleChange('personalInfo', 'last_name', e.target.value)}
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
                  label="Address"
                  type="text"
                  placeholder="Address"
                  value={formData.personalInfo.address}
                  onChange={(e) => handleChange('personalInfo', 'address', e.target.value)}
                />
              </div>

              <div className='flex flex-col gap-4 md:flex-row'>
                <MyInputField
                  id="dob"
                  name="dob"
                  label="Date of Birth"
                  type="date"
                  placeholder="Date of Birth"
                  value={formData.personalInfo.dob}
                  onChange={(e) => handleChange('personalInfo', 'dob', e.target.value)}
                />
                <MyInputField
                  id="pob"
                  name="pob"
                  label="Place of Birth"
                  type="text"
                  placeholder="Place of Birth"
                  value={formData.personalInfo.pob}
                  onChange={(e) => handleChange('personalInfo', 'pob', e.target.value)}
                />
              </div>

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
            <h2 className="font-bold mb-2 text-center text-xl">Other Information</h2>

            <div className='flex flex-col gap-2 md:flex-col md:gap-4'>
              <div className='flex flex-col gap-2 md:flex-row md:gap-4'>

                {source === "student" ? <MyInputField
                  id="campus"
                  name="campus"
                  label="Campus"
                  type="select"
                  placeholder="Select Campus"
                  value={formData.medicalHistory.campus.toString()}
                  onChange={(e) => handleChange('medicalHistory', 'campus', e.target.value)}
                  options={optionsCampuses}
                /> : null}

                <Select
                  className='flex items-center justify-center w-full'
                  name="nationality"
                  options={CountryList}
                  onChange={(e) => handleChange('medicalHistory', 'nationality', e?.label || "")}
                  placeholder="Select a country"
                  isSearchable
                />

                <MyInputField
                  id="region_of_origin"
                  name="region_of_origin"
                  label="Region Of Origin"
                  type="select"
                  placeholder="Region Of Origin"
                  value={formData.medicalHistory.region_of_origin}
                  onChange={(e) => handleChange('medicalHistory', 'region_of_origin', e.target.value)}
                  options={RegionList}
                />

                {formData.medicalHistory.region_of_origin === "Other" ? <MyInputField
                  id="region_of_origin_other"
                  name="region_of_origin_other"
                  label="Other Region"
                  type="text"
                  placeholder="Other Origin"
                  value={formData.medicalHistory.region_of_origin_other}
                  onChange={(e) => handleChange('medicalHistory', 'region_of_origin_other', e.target.value)}
                /> : null}


              </div>

              <div className='flex flex-col gap-2 md:flex-row md:gap-4'>
                <MyInputField
                  id="highest_certificate"
                  name="highest_certificate"
                  label="Highest Certificate"
                  type="select"
                  placeholder="Highest Certificate"
                  value={formData.medicalHistory.highest_certificate}
                  onChange={(e) => handleChange('medicalHistory', 'highest_certificate', e.target.value)}
                  options={CertificateOptions}
                />

                {formData.medicalHistory.highest_certificate === "Other" ? <MyInputField
                  id="highest_certificate_other"
                  name="highest_certificate_other"
                  label="Other Certificate"
                  type="text"
                  placeholder="Other Certificate / Diplome"
                  value={formData.medicalHistory.highest_certificate_other}
                  onChange={(e) => handleChange('medicalHistory', 'highest_certificate_other', e.target.value)}
                /> : null}
                <MyInputField
                  id="year_obtained"
                  name="year_obtained"
                  label="Year Obtained"
                  type="select"
                  placeholder="Select Year"
                  value={formData.medicalHistory.year_obtained}
                  onChange={(e) => handleChange('medicalHistory', 'year_obtained', e.target.value)}
                  options={last_20_years}
                />
              </div>

              <div className='flex flex-col gap-2 md:flex-row'>
                <MyInputField
                  id="emergency_name"
                  name="emergency_name"
                  label="Parent Name"
                  type="text"
                  placeholder="optional"
                  value={formData.medicalHistory.emergency_name}
                  onChange={(e) => handleChange('medicalHistory', 'emergency_name', e.target.value)}
                />
                <MyInputField
                  id="emergency_telephone"
                  name="emergency_telephone"
                  label="Parent Telephone"
                  type="number"
                  placeholder="Emergency Telephone"
                  value={formData.medicalHistory.emergency_telephone}
                  onChange={(e) => handleChange('medicalHistory', 'emergency_telephone', e.target.value)}
                />
              </div>

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
            <h2 className="font-bold mb-4 text-xl">Class Assigment</h2>
            <div className="space-y-4">

              <MyInputField
                id="specialty_one"
                name="specialty_one"
                label="Specialty - 1st Choice"
                type="select"
                placeholder="1st Choice Specialty"
                value={formData.classAssignment.specialty_one}
                onChange={(e) => handleChange('classAssignment', 'specialty_one', e.target.value)}
                options={optionsSpecialties}
              />

              <MyInputField
                id="specialty_two"
                name="specialty_two"
                label="Specialty - 2nd Choice"
                type="select"
                placeholder="1st Choice Specialty"
                value={formData.classAssignment.specialty_two}
                onChange={(e) => handleChange('classAssignment', 'specialty_two', e.target.value)}
                options={optionsSpecialties}
              />

              <MyInputField
                id="academic_year"
                name="academic_year"
                label="Academic Year"
                type="select"
                placeholder="Academic Year"
                value={formData.classAssignment.academic_year}
                onChange={(e) => handleChange('classAssignment', 'academic_year', e.target.value)}
                options={optionsYears}
              />

              <MyInputField
                id="program"
                name="program"
                label="Program"
                type="select"
                placeholder="Program"
                value={formData.classAssignment.program}
                onChange={(e) => handleChange('classAssignment', 'program', e.target.value)}
                options={optionsPrograms}
              />

              <MyInputField
                id="level"
                name="level"
                label="Level"
                type="select"
                placeholder="level"
                value={formData.classAssignment.level}
                onChange={(e) => handleChange('classAssignment', 'level', e.target.value)}
                options={optionsLevels}
              />

              <MyInputField
                id="session"
                name="session"
                label="Session"
                type="select"
                placeholder="Session"
                value={formData.classAssignment.session}
                onChange={(e) => handleChange('classAssignment', 'session', e.target.value)}
                options={["Morning", "Evening"]}
              />

            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-bold mb-2 md:mb-6 text-2xl text-blue-600 text-center">
              Confirm Your Information
            </h2>
            <div className="bg-gray-100 md:p-6 md:pace-y-4 md:sp-2 p-2 rounded-lg shadow-lg space-y-2">
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-700 text-lg">Personal Information</h3>
                <p><strong>First Name:</strong> {formData.personalInfo.first_name || 'N/A'}</p>
                <p><strong>Last Name:</strong> {formData.personalInfo.last_name || 'N/A'}</p>
                <p><strong>Sex:</strong> {formData.personalInfo.sex || 'N/A'}</p>
                <p><strong>Address:</strong> {formData.personalInfo.address || 'N/A'}</p>
                <p><strong>Date of Birth:</strong> {formData.personalInfo.dob || 'N/A'}</p>
                <p><strong>Place of Birth:</strong> {formData.personalInfo.pob || 'N/A'}</p>
              </div>
              {/* <hr className="border-gray" /> */}
              <br />

              <div className="space-y-2">
                <h3 className="font-semibold text-gray-700 text-lg">Contact Information</h3>
                <p><strong>Telephone:</strong> {formData.personalInfo.telephone || 'N/A'}</p>
                <div className='flex items-center justify-between'>
                  <p><strong>Email:</strong> {formData.personalInfo.email || 'N/A'}</p>
                  <p className='flex items-center justify-between'>
                    <span>
                      <button
                        onClick={() => setCurrentStep(currentStep - 3)}
                        className="bg-gray border hover:bg-gray-400 md:px-6 ml-4 my-0 p-2 py-2 rounded-lg shadow-md text-gray-800"
                      >
                        Edit Information
                      </button>

                    </span>
                  </p>
                </div>
              </div>
              <hr className="border-gray-300" />
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-700 text-lg">Other Information</h3>
                <div className="flex gap-2 md:flex-row md:gap-10">
                  <p className='w-1/2'><strong>CAMPUS:</strong> {data.allSchoolInfos?.edges.filter((item: EdgeSchoolHigherInfo) => parseInt(decodeUrlID(item.node?.id)) === parseInt(formData.medicalHistory.campus.toString()))[0].node?.campus || 'N/A'} </p>
                </div>
                <div className="flex gap-2 md:flex-row md:gap-10">
                  <p className='w-1/2'><strong>Highest Certificate:</strong> {(formData.medicalHistory.highest_certificate === "Other" ? capitalizeFirstLetter(formData.medicalHistory.highest_certificate_other.toLowerCase()) : formData.medicalHistory.highest_certificate) || 'N/A'}</p>
                  <p className='w-1/2'><strong>Year Obtained:</strong> {formData.medicalHistory.year_obtained || 'N/A'}</p>
                </div>
                <div className="flex gap-10 md:flex-row">
                  <p><strong>Nationality:</strong> {formData.medicalHistory.nationality || 'N/A'}</p>
                  <p><strong>Region Of Origin:</strong> {(formData.medicalHistory.region_of_origin === "Other" ? capitalizeFirstLetter(formData.medicalHistory.region_of_origin_other.toLowerCase()) : formData.medicalHistory.region_of_origin) || 'N/A'}</p>
                </div>

                <div className='flex flex-row'>
                  <p className='flex flex-col justify-between md:flex-row md:items-center'>
                    <p><strong>Parent's Name:</strong> {formData.medicalHistory.emergency_name || 'N/A'}</p>
                    <span><strong>Parent's Address:</strong> {formData.medicalHistory.emergency_town || 'N/A'}</span>
                    <span><strong>Parent's Telephone:</strong> {formData.medicalHistory.emergency_telephone || 'N/A'}</span>
                  </p>
                  <span>
                      <button
                        onClick={() => setCurrentStep(currentStep - 2)}
                        className="bg-gray border hover:bg-gray-400 md:px-6 ml-4 my-0 p-2 py-2 rounded-lg shadow-md text-gray-800"
                      >
                        Edit Information
                      </button>

                    </span>
                </div>
              </div>

              <hr className="border-gray-300" />
              <div className="gap-10 space-y-2">

                <h3 className="font-semibold text-gray-700 text-lg">Class Assignment</h3>

                <p className='flex gap-2 items-center'>
                  <span className='w-1/2'> <strong>Specialty 1st:</strong> {data.allMainSpecialties.edges.filter((item: EdgeMainSpecialty) => decodeUrlID(item.node.id) === formData.classAssignment.specialty_one)[0].node.specialtyName || 'N/A'} </span>
                  <span className='w-1/2'> <strong>Specialty 2nd:</strong> {data.allMainSpecialties.edges.filter((item: EdgeMainSpecialty) => decodeUrlID(item.node.id) === formData.classAssignment.specialty_two)[0].node.specialtyName || 'N/A'} </span>
                </p>
                <p className='flex items-center justify-between'>
                  <p> <strong>Program:</strong> {data.allPrograms.edges.filter((item: EdgeMainSpecialty) => decodeUrlID(item.node.id) === formData.classAssignment.program)[0].node.name || 'N/A'} </p>
                  <p> <strong>Level:</strong> {formData.classAssignment.level || 'N/A'} </p>
                  <span> <strong>Session:</strong> {formData.classAssignment.session || 'N/A'} </span>
                  <span>
                    <button
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="bg-gray border hover:bg-gray-400 md:px-6 ml-4 my-0 p-2 py-2 rounded-lg shadow-md text-gray-800"
                    >
                      Edit Information
                    </button>

                  </span>
                </p>
              </div>
            </div>

          </motion.div>

        );
      default:
        return null;
    }
  };


  return (
    <div className="bg-white md:p-6 p-2 mx-auto rounded shadow  w-full">
      {/* Stepper */}
      <div className="flex items-center justify-between md:mb-6">
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
      <div className="flex justify-between mb-4 mt-10 p-2">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="bg-red disabled:opacity-50 font-medium hover:bg-slate-500 px-4 py-2 rounded text-white"
        >
          Previous
        </button>
        {currentStep === steps.length - 1 ? (
          <>{count === 10 ? <button
            disabled
            onClick={handleSubmit}
            className="bg-green-700 hover:bg-blue-700 px-4 py-2 rounded text-white"
          >
            Submitting ...
          </button>
            :
            <button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
            >
              Confirm and Submit
            </button>}
          </>
        ) : (
          <button
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default PreForm



const CREATE_PREINSCRIPTION = gql`
  mutation Create(
    $firstName: String!
    $lastName: String!
    $sex: String!
    $email: String!
    $telephone: String!
    $address: String!
    $pob: String!
    $dob: Date!

    $nationality: String!
    $highestCertificate: String!
    $yearObtained: String!
    $regionOfOrigin: String!
    $emergencyName: String!
    $emergencyTown: String!
    $emergencyTelephone: String!

    $academicYear: String!
    $session: String!
    $level: String!
    $program: String!
    $specialtyOne: String!
    $specialtyTwo: String!
    $action: String!
    $campus: String!
    $status: String!
    $admissionStatus: Boolean!
    $delete: Boolean!
  ) {
    createUpdateDeletePreinscription(
      firstName: $firstName
      lastName: $lastName
      sex: $sex
      address: $address
      email: $email
      telephone: $telephone
      pob: $pob
      dob: $dob

      nationality: $nationality
      highestCertificate: $highestCertificate
      yearObtained: $yearObtained
      regionOfOrigin: $regionOfOrigin
      emergencyName: $emergencyName
      emergencyTown: $emergencyTown
      emergencyTelephone: $emergencyTelephone

      academicYear: $academicYear
      session: $session
      level: $level
      program: $program
      specialtyOne: $specialtyOne
      specialtyTwo: $specialtyTwo
      action: $action
      campus: $campus
      status: $status
      admissionStatus: $admissionStatus
      delete: $delete
    ) {
      preinscription {
        id firstName
      }
    }
  }
`;
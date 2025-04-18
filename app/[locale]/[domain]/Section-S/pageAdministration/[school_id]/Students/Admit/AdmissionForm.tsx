'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '@/serverActions/interfaces';
import { decodeUrlID } from '@/functions';
import { EdgeClassRoom, EdgeProgramSec, EdgeSeries } from '@/Domain/schemas/interfaceGraphqlSecondary';
import { gql, useMutation } from '@apollo/client';
import MyInputField from '@/MyInputField';

const steps = ['Personal Info', 'Role / Department', 'Class Assignment', 'Confirmation'];

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
    parent: string;
    parentTelephone: string;
    password: string;
  };
  medicalHistory: {
    role: string;
    deptNames: string[];
    allergies: string;
    medicalHistory: string;
  };
  classAssignment: {
    classroomId: string;
    seriesIds: string[];
    programId: string;
    session: string;
  };
};


const AdmissionForm = ({ data, params }: { data: any, params: { school_id: string } }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [optionsClassroom, setOptionsClassroom] = useState<{ id: string, name: string }[]>();
  const [optionsSeries, setOptionsSeries] = useState<{ id: string, name: string }[]>();
  const [optionsPrograms, setOptionsPrograms] = useState<{ id: string, name: string }[]>();

  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      sex: '',
      address: '',
      dob: '',
      pob: '',
      telephone: '',
      email: '',
      parent: '',
      parentTelephone: '',
      password: '',
    },
    medicalHistory: {
      role: 'student',
      deptNames: 'Student',
      allergies: '',
      medicalHistory: '',
    },
    classAssignment: {
      classroomId: '',
      seriesIds: [''],
      programId: '',
      session: 'MORNING',
    },
  });

  const [stepValidation, setStepValidation] = useState<boolean[]>(
    new Array(steps.length).fill(false)
  );

  const validateStep = (stepIndex: number): boolean => {
    console.log(stepIndex, 76)
    switch (stepIndex) {
      case 0:
        const { firstName, lastName, sex, address, dob, pob, telephone, email, parent, parentTelephone } = formData.personalInfo;
        return [firstName, lastName, sex, address, dob, pob, telephone, email, parent].every((field) => String(field).trim() !== '');
      case 1:
        const { role, deptNames } = formData.medicalHistory;
        return [role, deptNames].every((field) => String(field.trim()) !== '');
        return true
      case 2:
        const { classroomId, programId, session } = formData.classAssignment;
        return [classroomId, programId, session].every((field) => String(field).trim() !== '' && (Array.isArray(field) ? field.every(item => String(item).trim() !== '') : true));

      default:
        return true;
    }
  };


  useEffect(() => {
    if (data && data.allClassrooms?.edges) {
      const f = data.allClassrooms.edges.map((item: EdgeClassRoom) => {
        return { "id": decodeUrlID(item.node.id), "name": `${item.node.level.level}-${item.node.academicYear}-${item.node.stream} ${item.node.option}` }
      })
      if (f) { setOptionsClassroom(f) }
    }
    if (data && data.allSeries?.edges) {
      const f = data.allSeries.edges.map((item: EdgeSeries) => {
        return { "id": decodeUrlID(item.node.id), "name": `${item.node.name}` }
      })
      if (f) { setOptionsSeries(f) }
    }
    if (data && data.allProgramSec?.edges) {
      const f = data.allProgramSec.edges.map((item: EdgeProgramSec) => {
        return { "id": decodeUrlID(item.node.id), "name": `${item.node.name}` }
      })
      if (f) { setOptionsPrograms(f) }
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

  const handleChangeMultiple = <K extends keyof FormData>(
    section: K,
    field: keyof FormData[K],
    value: string | string[]
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: Array.isArray(value) ? value : [value],
      },
    }));
  };



  const [createCustomUser] = useMutation(CREATE_DATA)
  const [createUserProfileSec] = useMutation(CREATE_USERPROFILE_SEC)

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    const user: JwtPayload = jwtDecode(token ? token : "");

    const finalValidation = steps.slice(0, 3).map((_, index) => validateStep(index));
    if (finalValidation.every(Boolean)) {
      console.log('Final Form Data:', formData);
      alert('Form Submitted!');

      const newFormData = {
        ...formData.personalInfo,
        prefix: "TEST",
        role: formData.medicalHistory.role,
        email: `${formData.personalInfo.firstName.toLowerCase()}_${formData.personalInfo.telephone.slice(-3)}@e-conneq.com`,
        deptNames: [formData.medicalHistory.deptNames],
        schoolIds: [parseInt(params.school_id)],
      }

      try {
        const result = await createCustomUser({ variables: newFormData });
        if (result.data.createCustomUser.customUser.id) {
          const newFormDataProfile = {
            userId: parseInt(decodeUrlID(result.data.createCustomUser.customUser.id)),
            classroomId: parseInt(formData.classAssignment.classroomId),
            programId: parseInt(formData.classAssignment.programId),
            seriesIds: formData.classAssignment.seriesIds.map(Number),
            session: formData.classAssignment.session,
            createdById: user.user_id,
          }
          alert(`Success creating:, ${result.data.createCustomUser.customUser.fullName}`);
          try {
            const result = await createUserProfileSec({ variables: newFormDataProfile });
            if (result.data.createUserProfileSec.userProfileSec.id) {
              alert(`Success creating:, ${result.data.createUserProfileSec.userProfileSec.classroom.academicYear}-${result.data.createUserProfileSec.userProfileSec.classroom.level.level}`)
              window.location.reload()
            };
          } catch (err: any) {
            alert(`error creating:, ${err}`)
          }
        };
      } catch (err: any) {
        alert(`error creating:, ${err}`)
      }


    } else {
      alert('Please complete all steps before submitting.');
    }
    setStepValidation(finalValidation);
  };

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
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  type="text"
                  placeholder="First Name"
                  value={formData.personalInfo.firstName}
                  onChange={(e) => handleChange('personalInfo', 'firstName', e.target.value)}
                />
                <MyInputField
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  type="text"
                  placeholder="Last Name"
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

            </div>

            <h2 className="font-bold text-xl">Contact Information</h2>

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
                id="parent"
                name="parent"
                label="Parent Name"
                type="text"
                placeholder="Parent Name"
                value={formData.personalInfo.parent}
                onChange={(e) => handleChange('personalInfo', 'parent', e.target.value)}
              />
              <MyInputField
                id="parentTelephone"
                name="parentTelephone"
                label="Parent Telephone"
                type="number"
                placeholder="Parent Telephone"
                value={formData.personalInfo.parentTelephone}
                onChange={(e) => handleChange('personalInfo', 'parentTelephone', e.target.value)}
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
            <h2 className="font-bold text-xl">Role and Department</h2>
            <div className="space-y-2">
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

              <br />
              <h2 className="font-bold text-xl">Medical History</h2>
              <MyInputField
                id="allergies"
                name="allergies"
                label="Allergies"
                type="textArea"
                placeholder="Allergies"
                value={formData.medicalHistory.allergies}
                onChange={(e) => handleChange('medicalHistory', 'allergies', e.target.value)}
              />
              <MyInputField
                id="medicalHistory"
                name="medicalHistory"
                label="Medical History"
                type="textArea"
                placeholder="Medical History"
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
            <h2 className="font-bold mb-4 text-xl">Classroom Assigment</h2>
            <div className="space-y-4">
              <MyInputField
                id="classroomId"
                name="classroomId"
                label="Classroom"
                type="select"
                placeholder="Classroom"
                value={formData.classAssignment.classroomId}
                onChange={(e) => handleChange('classAssignment', 'classroomId', e.target.value)}
                options={optionsClassroom}
              />
              <MyInputField
                id="seriesIds"
                name="seriesIds"
                label="Series"
                type="select-multiple"
                placeholder="Series"
                value={formData.classAssignment.seriesIds}
                onChange={(e) => {
                  const target = e.target as HTMLSelectElement; // Type assertion here
                  handleChangeMultiple(
                    'classAssignment',
                    'seriesIds',
                    Array.from(target.selectedOptions, option => option.value) // Now `selectedOptions` is recognized
                  );
                }}
                options={optionsSeries}
              />
              <MyInputField
                id="programId"
                name="programId"
                label="Program"
                type="select"
                placeholder="Program"
                value={formData.classAssignment.programId}
                onChange={(e) => handleChange('classAssignment', 'programId', e.target.value)}
                options={optionsPrograms}
              />
              <MyInputField
                id="session"
                name="session"
                label="Session"
                type="select"
                placeholder="Session"
                value={formData.classAssignment.session}
                onChange={(e) => handleChange('classAssignment', 'session', e.target.value)}
                options={["MORNING", "EVENING"]}
              />
              <MyInputField
                id="password"
                name="password"
                label="Password (Optional)"
                type="password"
                placeholder="password"
                value={formData.personalInfo.password}
                onChange={(e) => handleChange('personalInfo', 'password', e.target.value)}
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
            <h2 className="font-bold mb-6 text-2xl text-blue-600 text-center">
              Confirm Your Information
            </h2>
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-700 text-lg">Personal Information</h3>
                <p><strong>First Name:</strong> {formData.personalInfo.firstName || 'N/A'}</p>
                <p><strong>Last Name:</strong> {formData.personalInfo.lastName || 'N/A'}</p>
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
                <p><strong>Email:</strong> {formData.personalInfo.email || 'N/A'}</p>
                <p><strong>Parent's Name:</strong> {formData.personalInfo.parent || 'N/A'}</p>
                <p className='flex items-center justify-between'>
                  <span><strong>Parent's Telephone:</strong> {formData.personalInfo.parentTelephone || 'N/A'}</span>
                  <span>
                    <button
                      onClick={() => setCurrentStep(currentStep - 3)}
                      className="bg-gray border hover:bg-gray-400 ml-4 my-0 px-6 py-2 rounded-lg shadow-md text-gray-800"
                    >
                      Edit Information
                    </button>

                  </span>
                </p>
              </div>
              <hr className="border-gray-300" />
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-700 text-lg">Medical History</h3>
                <p><strong>Allergies:</strong> {formData.medicalHistory.allergies || 'N/A'}</p>
                <p className='flex items-center justify-between'>
                  <span><strong>Medical History:</strong> {formData.medicalHistory.medicalHistory || 'N/A'}</span>
                  <span>
                    <button
                      onClick={() => setCurrentStep(currentStep - 2)}
                      className="bg-gray border hover:bg-gray-400 ml-4 my-0 px-6 py-2 rounded-lg shadow-md text-gray-800"
                    >
                      Edit Information
                    </button>

                  </span>
                </p>
              </div>
              <hr className="border-gray-300" />
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-700 text-lg">Class Assignment</h3>
                <p><strong>Classroom:</strong> {optionsClassroom?.find((item) => item.id === formData.classAssignment.classroomId)?.name || 'N/A'}</p>
                {/* <p><strong>Series:</strong> {optionsSeries?.find((item) => item.id === formData.classAssignment.seriesId)?.name || 'N/A'}</p> */}
                <p><strong>Program:</strong> {optionsPrograms?.find((item) => item.id === formData.classAssignment.programId)?.name || 'N/A'}</p>
                <p className='flex items-center justify-between'>
                  <span> <strong>Session:</strong> {formData.classAssignment.session || 'N/A'} </span>
                  <span>
                    <button
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="bg-gray border hover:bg-gray-400 ml-4 my-0 px-6 py-2 rounded-lg shadow-md text-gray-800"
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
    <div className="bg-white max-w-4xl mx-auto p-6 rounded shadow">
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
          className="bg-gray-200 disabled:opacity-50 hover:bg-gray-300 px-4 py-2 rounded text-gray-800"
        >
          Previous
        </button>
        {currentStep === steps.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
          >
            Confirm and Submit
          </button>
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

export default AdmissionForm;




const CREATE_DATA = gql`
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
      $parent: String!
      $parentTelephone: String!
      $deptNames: [String]!
      $schoolIds: [ID]!
    ) {
      createCustomUser(
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
        parent: $parent
        parentTelephone: $parentTelephone
        deptNames: $deptNames
        schoolIds: $schoolIds
      ) {
        customUser {
          id fullName, sex, dob
        }
      }
    }
  `;


const CREATE_USERPROFILE_SEC = gql`
  mutation CreateUserProfileSec(
    $userId: Int!
    $classroomId: Int!
    $seriesIds: [Int]!
    $programId: Int!
    $session: String!
    $createdById: ID!
  ) {
    createUserProfileSec(
      userId: $userId
      classroomId: $classroomId
      seriesIds: $seriesIds
      programId: $programId
      session: $session
      createdById: $createdById
    ) {
      userProfileSec {
        id user { fullName } classroom { academicYear stream level { level}   school { campus}} 
      }
    }
  }
`;
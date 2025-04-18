'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import MyInputField from '@/MyInputField';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '@/serverActions/interfaces';
import { capitalizeFirstLetter, decodeUrlID } from '@/functions';
import { gql, useMutation } from '@apollo/client';
import { EdgeDepartment } from '@/Domain/schemas/interfaceGraphql';

const steps = ['Personal Info', 'Role / Department', 'Confirmation'];

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
    parentTelephone: string;
    password: string;
  };
  medicalHistory: {
    role: string;
    deptNames: string[];
    allergies: string;
    medicalHistory: string;
  };
};


const AdmissionForm = ({ data, params, role }: { data: any, role: "admin" | "teacher", params: { school_id: string } }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [optionsDepartment, setOptionsDepartment] = useState<string[]>();
  const token = localStorage.getItem('token');
  const user: JwtPayload = jwtDecode(token ? token : "");

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
      role: role,
      deptNames: ['Lecturer'],
      allergies: '',
      medicalHistory: '',
    },
  });


  const [stepValidation, setStepValidation] = useState<boolean[]>(
    new Array(steps.length).fill(false)
  );

  const validateStep = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0:
        const { firstName, lastName, sex, address, telephone, email } = formData.personalInfo;
        return [firstName, lastName, sex, address, telephone, email].every((field) => String(field).trim() !== '');
      case 1:
        const { role } = formData.medicalHistory;
        return [role].every((field) => String(field.trim()) !== '');
      default:
        return true;
    }
  };

  useEffect(() => {
    if (data && data.allDepartments?.edges) {
      const f = data.allDepartments.edges.map((item: EdgeDepartment) => {
        return capitalizeFirstLetter(item.node.name)
      })
      if (f) { setOptionsDepartment(f) }
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
        [field]: value
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

  const handleSubmit = async () => {

    const finalValidation = steps.slice(0, 3).map((_, index) => validateStep(index));
    if (finalValidation.every(Boolean)) {
      alert('Form Submitted!');

      const newFormData = {
        ...formData.personalInfo,
        prefix: "TEST",
        role: formData.medicalHistory.role,
        deptNames: formData.medicalHistory.deptNames,
        schoolIds: [parseInt(params.school_id)],
      }

      try {
        const result = await createCustomUser({ variables: newFormData });
        if (result.data.createCustomUser.customUser.id) {
          alert(`Success creating:, ${result.data.createCustomUser.customUser.fullName}`);
          window.location.reload()
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
                id="parentTelephone"
                name="parentTelephone"
                label="Second Telephone"
                type="number"
                placeholder="Second Telephone"
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
                id="password"
                name="password"
                label="Password (Optional)"
                type="password"
                placeholder="password"
                value={formData.personalInfo.password}
                onChange={(e) => handleChange('personalInfo', 'password', e.target.value)}
              />
              <MyInputField
                id="role"
                name="role"
                label="Role"
                type="select"
                options={["admin", "superadmin", "teacher"]}
                placeholder="Role"
                value={formData.medicalHistory.role}
                onChange={(e) => handleChange('medicalHistory', 'role', e.target.value)}
                readOnly={!user.is_superuser}
              />
              <MyInputField
                id="deptNames"
                name="deptNames"
                label="Departments"
                type="select-multiple"
                options={optionsDepartment}
                placeholder="Departments"
                value={formData.medicalHistory.deptNames}
                onChange={(e) => {
                  const target = e.target as HTMLSelectElement;
                  handleChangeMultiple(
                    'medicalHistory',
                    'deptNames',
                    Array.from(target.selectedOptions, option => option.value)
                  )
                }
                }
                readOnly={!user.is_superuser}
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
            <h2 className="font-bold mb-2 text-2xl text-blue-600 text-center">
              Confirm Your Information
            </h2>

            <hr className="border-gray-300" />

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
                <h3 className="font-semibold text-gray-700 text-lg">Medical History</h3>
                <p><strong>Allergies:</strong> {formData.medicalHistory.allergies || 'N/A'}</p>
                <p className='flex items-center justify-between'>
                  <span><strong>Medical History:</strong> {formData.medicalHistory.medicalHistory || 'N/A'}</span>
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

              <hr className="border-gray-300" />

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

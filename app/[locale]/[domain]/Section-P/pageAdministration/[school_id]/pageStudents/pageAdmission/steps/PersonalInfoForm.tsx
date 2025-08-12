'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

const PersonalInfoForm = ({ formData, setFormData, onNext }: any) => {
  const { personalInfo } = formData;
  const { t } = useTranslation("common");

  const handleChange = (e: any) => {
    setFormData((prev: any) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [e.target.name]: e.target.value },
    }));
  };

  return (
    <div className="bg-white p-2 md:p-4 rounded-lg shadow-2xl space-y-4 md:space-y-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-950 bg-slate-300 py-1 rounded-lg text-center">{t("Personal Information")}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: 'First Name', name: 'firstName' },
          { label: 'Last Name', name: 'lastName' },
          { label: 'Sex', name: 'sex' },
          { label: 'Address', name: 'address' },
          { label: 'Date of Birth', name: 'dob' },
          { label: 'Place of Birth', name: 'pob' },
        ].map(({ label, name }) => (
          <div key={name} className="flex flex-col gap-1">
            <label htmlFor={name} className="text-slate-800 font-medium text-sm">{label}</label>
            <input
              id={name}
              name={name}
              placeholder={label}
              value={personalInfo[name] || ''}
              onChange={handleChange}
              className="w-full border border-slate-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-teal-700 font-bold"
            />
          </div>
        ))}
      </div>

      <hr />

      <h2 className="text-2xl font-bold mb-4 text-gray-900">{t("Other Information")}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: 'Allergies', name: 'allergies' },
          { label: 'Medical History', name: 'medicalHistory' },
          { label: 'Nationality', name: 'nationality' },
          { label: 'Region of Origin', name: 'regionOfOrigin' },
        ].map(({ label, name }) => (
          <div key={name} className="flex flex-col gap-1">
            <label htmlFor={name} className="text-slate-800 font-medium text-sm">{label}</label>
            <input
              id={name}
              name={name}
              placeholder={label}
              value={personalInfo[name] || ''}
              onChange={handleChange}
              className="w-full border border-slate-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-teal-700 font-bold"
            />
          </div>
        ))}
      </div>


      <div className='flex justify-end'>
        <button
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg transition"
        onClick={onNext}
      >
        Next
      </button>
      </div>
    </div>
  );
};

export default PersonalInfoForm;

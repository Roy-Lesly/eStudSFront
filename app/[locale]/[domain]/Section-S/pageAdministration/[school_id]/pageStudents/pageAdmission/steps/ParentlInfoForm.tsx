'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

const ParentlInfoForm = ({ formData, setFormData, onNext, onPrevious }: any) => {
  const { medicalHistory } = formData;
  const { t } = useTranslation("common");

  const handleChange = (e: any) => {
    setFormData((prev: any) => ({
      ...prev,
      medicalHistory: { ...prev.medicalHistory, [e.target.name]: e.target.value },
    }));
  };

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">{t("Medical Information")}</h2>
      {[ 
        { label: 'Role', name: 'role' },
        { label: 'Department Names (comma separated)', name: 'deptNames' },
        { label: 'Telephone', name: 'telephone' },
        { label: 'Email', name: 'email' },
        { label: 'Fathers Name', name: 'fatherName' },
        { label: 'Mothers Name', name: 'motherName' },
        { label: 'Fathers Telephone', name: 'fatherTelephone' },
        { label: 'Mothers Telephone', name: 'motherTelephone' },
        { label: 'Parents Address', name: 'parentAddress' },
        { label: 'Password', name: 'password' },
        { label: 'Prefix', name: 'prefix' },
        { label: 'Method', name: 'method' },
      ].map(({ label, name }) => (
        <div key={name} className="flex flex-col gap-1">
          <label htmlFor={name} className="text-gray-800 font-semibold text-sm">{label}</label>
          <input
            id={name}
            name={name}
            placeholder={label}
            value={medicalHistory[name] || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-black font-semibold"
          />
        </div>
      ))}

      <div className="flex gap-4 pt-4 justify-between w-full">
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded" onClick={onPrevious}>Back</button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" onClick={onNext}>Next</button>
      </div>
    </div>
  );
};

export default ParentlInfoForm;

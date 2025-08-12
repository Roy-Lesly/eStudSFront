'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

const ParentInfo = ({ formData, setFormData, onNext, onPrevious }: any) => {
  const { parentInfo } = formData;
  const { t } = useTranslation("common");
  console.log(formData);

  const handleChange = (e: any) => {
    setFormData((prev: any) => ({
      ...prev,
      parentInfo: { ...prev.parentInfo, [e.target.name]: e.target.value },
    }));
  };

  return (
    <div className="bg-white p-2 md:p-4 rounded-lg shadow-2xl space-y-4 md:space-y-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-900 bg-slate-300 rounded-lg py-1 text-center">{t("Medical Information")}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: 'Fathers Name', name: 'fatherName' },
          { label: 'Mothers Name', name: 'motherName' },
          { label: 'Fathers Telephone', name: 'fatherTelephone' },
          { label: 'Mothers Telephone', name: 'motherTelephone' },
          { label: 'Parents Email', name: 'parentEmail', placeHolder: "e.g name@email.com" },
          { label: 'Parents Address', name: 'parentAddress' },
          { label: 'Parents Password', name: 'password', type: "password" },
        ].map(({ label, name, type, placeHolder }) => (
          <div key={name} className="flex flex-col gap-1">
            <label htmlFor={name} className="text-slate-700 font-semibold text-sm">{label}</label>
            <input
              id={name}
              type={type}
              name={name}
              placeholder={placeHolder || label}
              value={parentInfo[name] || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400 font-semibold"
            />
          </div>
        ))}
      </div>

      <div className="flex gap-4 pt-4 justify-between w-full">
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded" onClick={onPrevious}>Back</button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" onClick={onNext}>Next</button>
      </div>
    </div>
  );
};

export default ParentInfo;

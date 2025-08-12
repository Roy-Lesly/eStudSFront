'use client';

import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const ParentlInfoForm = ({ formData, setFormData, onNext, onPrevious }: any) => {
  const { parentInfo } = formData;
  const { t } = useTranslation("common");

  useEffect(() => {
    setFormData((prev: any) => ({
      ...prev,
      parentInfo: { ...prev.parentInfo, parentPassword: "0000" },
    }));
  }, [formData.parentAddress])

  const handleChange = (e: any) => {
    setFormData((prev: any) => ({
      ...prev,
      parentInfo: { ...prev.parentInfo, [e.target.name]: e.target.value },
    }));
  };

  return (
    <div className="flex flex-col gap-4 rounded shadow-2xl bg-white p-2 md:p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">{t("Parent / Sponsor Information")}</h2>

      <div className="grid md:grid-cols-2 gap-2">
        {[
          // { label: 'Role', name: 'role' },
          // { label: 'Department Names (comma separated)', name: 'deptNames' },
          // { label: 'Telephone', name: 'telephone' },
          { label: 'Email', name: 'email' },
          { label: 'Fathers Name', name: 'fatherName' },
          { label: 'Mothers Name', name: 'motherName' },
          { label: 'Fathers Telephone', name: 'fatherTelephone' },
          { label: 'Mothers Telephone', name: 'motherTelephone' },
          { label: 'Parents Address', name: 'parentAddress' },
          { label: 'Password Parent', name: 'parentPassword' },
          // { label: 'Prefix', name: 'prefix' },
          // { label: 'Method', name: 'method' },
        ].map(({ label, name }) => (
          <div key={name} className="flex flex-col gap-1">
            <label htmlFor={name} className="text-slate-800 font-semibold">{label}</label>
            <input
              id={name}
              name={name}
              placeholder={label}
              value={parentInfo[name] || ''}
              onChange={handleChange}
              className="w-full border border-slate-300 p-2 text-lg text-teal-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-black font-semibold"
            />
          </div>
        ))}
      </div>

      <div className='flex justify-between  mt-6'>
        <button
          className="flex items-center justify-center w-32 gap-2 bg-red hover:bg-orange-700 text-white font-bold px-4 py-2 rounded-lg transition"
          onClick={onPrevious}
        >
          <FaArrowLeft /> {t("Previous")}
        </button>
        <button
          className="flex items-center justify-center w-30 gap-4 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg transition"
          onClick={onNext}
        >
          {t("Next")} <FaArrowRight />
        </button>
      </div>

    </div>
  );
};

export default ParentlInfoForm;

'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { EdgeClassRoomSec } from '@/utils/Domain/schemas/interfaceGraphqlSecondary';
import { decodeUrlID } from '@/utils/functions';

const Confirmation = (
  { formData, onNext, onPrevious, setCurrentStep, dataClassroomsSec }: any
) => {
  const { t } = useTranslation('common');

  const renderRow = (label: string, value: string) => (
    <div className="flex justify-between items-center border-b border-gray-100 py-1">
      <span className="text-sm font-medium text-gray-600">{label}:</span>
      <span className="text-sm font-semibold text-gray-900">{value || 'N/A'}</span>
    </div>
  );


  console.log(formData);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-black p-4 space-y-6"
    >
      <h2 className="font-bold text-2xl text-blue-600 text-center rounded-lg shadow py-3">
        {t('Confirm Your Information')}
      </h2>

      {/* Personal Information */}
      <section className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-700">{t('Personal Information')}</h3>
          <button onClick={() => setCurrentStep(0)} className="text-sm text-blue-600 hover:underline">
            {t('Edit')}
          </button>
        </div>
        {renderRow(t('First Name'), formData.personalInfo.firstName)}
        {renderRow(t('Last Name'), formData.personalInfo.lastName)}
        {renderRow(t('Sex'), formData.personalInfo.sex)}
        {renderRow(t('Address'), formData.personalInfo.address)}
        {renderRow(t('Date of Birth'), formData.personalInfo.dob)}
        {renderRow(t('Place of Birth'), formData.personalInfo.pob)}
        {renderRow(t('Telephone'), formData.personalInfo.telephone)}
        {renderRow(t('Email'), formData.personalInfo.email)}
        {renderRow(t('Fathers Name'), formData.personalInfo.fatherName)}
        {renderRow(t('Mothers Name'), formData.personalInfo.motherName)}
        {renderRow(t('Fathers Telephone'), formData.personalInfo?.fatherTelephone)}
        {renderRow(t('Mothers Telephone'), formData.personalInfo?.motherTelephone)}
        {renderRow(t('Parents Address'), formData.personalInfo?.parentAddress)}
      </section>

      {/* Medical Information */}
      <section className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-700">{t('Medical & Background Information')}</h3>
          <button onClick={() => setCurrentStep(1)} className="text-sm text-blue-600 hover:underline">
            {t('Edit')}
          </button>
        </div>
        {renderRow(t('Nationality'), formData.medicalHistory.nationality)}
        {renderRow(t('Highest Certificate'), formData.medicalHistory.highestCertificate)}
        {renderRow(t('Year Obtained'), formData.medicalHistory.yearObtained)}
        {renderRow(t('Region of Origin'), formData.medicalHistory.regionOfOrigin)}
        {renderRow(t('Allergies'), formData.medicalHistory.allergies)}
        {renderRow(t('Medical History'), formData.medicalHistory.medicalHistory)}
      </section>

      {/* Class Assignment */}
      <section className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-700">{t('Class Assignment')}</h3>
          <button onClick={() => setCurrentStep(2)} className="text-sm text-blue-600 hover:underline">
            {t('Edit')}
          </button>
        </div>
        {renderRow(t('Classroom'), dataClassroomsSec.find((item: EdgeClassRoomSec) => decodeUrlID(item.node.id) === formData.classAssignment.classroomsecId).node.level)}
        {renderRow(t('Series ID'), formData.classAssignment.seriesId)}
        {renderRow(t('Program'), formData.classAssignment.programsec)}
        {renderRow(t('Additional Subjects'), formData.classAssignment.additionalsubjectsIds || 'None')}
        {renderRow(t('Session'), formData.classAssignment.session)}
        {renderRow(t('Active'), formData.classAssignment.active ? 'Yes' : 'No')}
      </section>

      {/* Final Buttons */}
      <div className="flex justify-between pt-4">
        <button onClick={onPrevious} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">{t('Back')}</button>
        <button onClick={onNext} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">{t('Submit')}</button>
      </div>
    </motion.div>
  );
};

export default Confirmation;

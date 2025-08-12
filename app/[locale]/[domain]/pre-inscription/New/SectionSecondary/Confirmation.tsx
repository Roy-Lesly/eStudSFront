import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { capitalizeFirstLetter, decodeUrlID } from '@/utils/functions';
import { EdgeSchoolHigherInfo } from '@/utils/Domain/schemas/interfaceGraphql';
import { EdgeSeries } from '@/utils/Domain/schemas/interfaceGraphqlSecondary';

const Confirmation = ({
  formData,
  setCurrentStep,
  currentStep,
  data
}: {
  formData: any;
  setCurrentStep: any;
  currentStep: number;
  data: any;
}) => {
  const { t } = useTranslation('common');

  const renderRow = (label: string, value: string | null | undefined) => (
    <div className="flex justify-between items-center border-b border-gray-100 py-1">
      <span className="text-sm font-medium text-gray-600">{label}:</span>
      <span className="text-sm font-semibold text-gray-900">{value || 'N/A'}</span>
    </div>
  );

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
          <h3 className="text-lg font-semibold text-gray-700">
            {t('Personal Information')}
          </h3>
          <button
            onClick={() => setCurrentStep(currentStep - 3)}
            className="text-sm text-blue-600 hover:underline"
          >
            {t('Edit')}
          </button>
        </div>
        {renderRow(t('First Name'), formData.personalInfo.first_name)}
        {renderRow(t('Last Name'), formData.personalInfo.last_name)}
        {renderRow(t('Sex'), formData.personalInfo.sex)}
        {renderRow(t('Address'), formData.personalInfo.address)}
        {renderRow(t('Date of Birth'), formData.personalInfo.dob)}
        {renderRow(t('Place of Birth'), formData.personalInfo.pob)}
      </section>

      {/* Contact Information */}
      <section className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-700">
            {t('Contact Information')}
          </h3>
          <button
            onClick={() => setCurrentStep(currentStep - 3)}
            className="text-sm text-blue-600 hover:underline"
          >
            {t('Edit')}
          </button>
        </div>
        {renderRow(t('Telephone'), formData.personalInfo.telephone)}
        {renderRow(t('Email'), formData.personalInfo.email)}
      </section>

      {/* Other Information */}
      <section className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-700">{t('Other Information')}</h3>
          <button
            onClick={() => setCurrentStep(currentStep - 2)}
            className="text-sm text-blue-600 hover:underline"
          >
            {t('Edit')}
          </button>
        </div>
        {renderRow(
          'CAMPUS',
          data?.allSchoolInfos?.edges.find(
            (item: EdgeSchoolHigherInfo) =>
              parseInt(decodeUrlID(item.node.id)) ===
              parseInt(formData.medicalHistory.campusId.toString())
          )?.node.campus
        )}
        {renderRow(
          t('Highest Certificate'),
          formData.medicalHistory.highest_certificate === 'Other'
            ? capitalizeFirstLetter(formData.medicalHistory.highest_certificate_other.toLowerCase())
            : formData.medicalHistory.highest_certificate
        )}
        {renderRow(t('Year Obtained'), formData.medicalHistory.year_obtained)}
        {renderRow(t('Grade'), formData.medicalHistory.grade)}
        {renderRow(t('Nationality'), formData.medicalHistory.nationality)}
        {renderRow(
          t('Region Of Origin'),
          formData.medicalHistory.region_of_origin === 'Other'
            ? capitalizeFirstLetter(formData.medicalHistory.region_of_origin_other.toLowerCase())
            : formData.medicalHistory.region_of_origin
        )}
        {renderRow(t("Father's Name"), formData.medicalHistory.father_name)}
        {renderRow(t("Mother's Name"), formData.medicalHistory.mother_name)}
        {renderRow(t("Father's Telephone"), formData.medicalHistory.father_telephone)}
        {renderRow(t("Mother's Telephone"), formData.medicalHistory.mother_telephone)}
        {renderRow(t("Parent's Address"), formData.medicalHistory.parent_address)}
      </section>

      {/* Class Assignment */}
      <section className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-700">{t('Class Assignment')}</h3>
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="text-sm text-blue-600 hover:underline"
          >
            {t('Edit')}
          </button>
        </div>
        {renderRow(t('Section'), formData.classAssignment.stream)}
        {renderRow(t('Classroom'), formData.classAssignment.level)}
        {renderRow(
          t('Series (1st Choice)'),
          data.allSeries.edges.find(
            (item: EdgeSeries) =>
              decodeUrlID(item.node.id) === formData.classAssignment.series_one
          )?.node.name
        )}
        {renderRow(
          t('Series (2nd Choice)'),
          data.allSeries.edges.find(
            (item: EdgeSeries) =>
              decodeUrlID(item.node.id) === formData.classAssignment.series_two
          )?.node.name
        )}
        {renderRow(t('Program'), formData.classAssignment.program)}
        {renderRow(t('Session'), formData.classAssignment.session)}
      </section>
    </motion.div>
  );
};

export default Confirmation;

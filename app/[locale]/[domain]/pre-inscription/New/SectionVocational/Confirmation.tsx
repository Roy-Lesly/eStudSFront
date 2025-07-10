import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { capitalizeFirstLetter, decodeUrlID } from '@/utils/functions';
import { EdgeMainSpecialty, EdgeSchoolHigherInfo } from '@/utils/Domain/schemas/interfaceGraphql';


const Confirmation = (
    { formData, setCurrentStep, currentStep, data }:
    { formData: any, setCurrentStep: any, currentStep: number, data: any }
) => {

    const { t } = useTranslation("common");
  return (
    <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="font-bold mb-2 md:mb-6 text-2xl text-blue-600 text-center">
                  {t("Confirm Your Information")}
                </h2>
                <div className="bg-gray-100 md:p-6 md:pace-y-4 md:sp-2 p-2 rounded-lg shadow-lg space-y-2">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-700 text-lg">{t("Personal Information")}</h3>
                    <p><strong>{t("First Name")}:</strong> {formData.personalInfo.first_name || 'N/A'}</p>
                    <p><strong>{t("Last Name")}:</strong> {formData.personalInfo.last_name || 'N/A'}</p>
                    <p><strong>{t("Sex")}:</strong> {formData.personalInfo.sex || 'N/A'}</p>
                    <p><strong>{t("Address")}:</strong> {formData.personalInfo.address || 'N/A'}</p>
                    <p><strong>{t("Date of Birth")}:</strong> {formData.personalInfo.dob || 'N/A'}</p>
                    <p><strong>{t("Place of Birth")}:</strong> {formData.personalInfo.pob || 'N/A'}</p>
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
                            {t("Edit Information")}
                          </button>
    
                        </span>
                      </p>
                    </div>
                  </div>
                  <hr className="border-gray-300" />
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-700 text-lg">{t("Other Information")}</h3>
                    <div className="flex gap-2 md:flex-row md:gap-10">
                      <p className='w-1/2'><strong>CAMPUS:</strong> {data.allSchoolInfos?.edges.filter((item: EdgeSchoolHigherInfo) => parseInt(decodeUrlID(item.node?.id)) === parseInt(formData.medicalHistory.campus.toString()))[0].node?.campus || 'N/A'} </p>
                    </div>
                    <div className="flex gap-2 md:flex-row md:gap-10">
                      <p className='w-1/2'><strong>{t("Highest Certificate")}:</strong> {(formData.medicalHistory.highest_certificate === "Other" ? capitalizeFirstLetter(formData.medicalHistory.highest_certificate_other.toLowerCase()) : formData.medicalHistory.highest_certificate) || 'N/A'}</p>
                      <p className='w-1/2'><strong>{t("Grade")}:</strong> {formData.medicalHistory.grade || 'N/A'}</p>
                      <p className='w-1/2'><strong>{t("Year Obtained")}:</strong> {formData.medicalHistory.year_obtained || 'N/A'}</p>
                    </div>
                    <div className="flex gap-10 md:flex-row">
                      <p><strong>{t("Nationality")}:</strong> {formData.medicalHistory.nationality || 'N/A'}</p>
                      <p><strong>{t("Region Of Origin")}:</strong> {(formData.medicalHistory.region_of_origin === "Other" ? capitalizeFirstLetter(formData.medicalHistory.region_of_origin_other.toLowerCase()) : formData.medicalHistory.region_of_origin) || 'N/A'}</p>
                    </div>
    
                    <div className='flex flex-row'>
                      <p className='flex flex-col justify-between md:flex-row md:items-center'>
                        <p><strong>{t("Parent's Name")}:</strong> {formData.medicalHistory.emergency_name || 'N/A'}</p>
                        <span><strong>{t("Parent's Address")}:</strong> {formData.medicalHistory.emergency_town || 'N/A'}</span>
                        <span><strong>{t("Parent's Telephone")}:</strong> {formData.medicalHistory.emergency_telephone || 'N/A'}</span>
                      </p>
                      <span>
                          <button
                            onClick={() => setCurrentStep(currentStep - 2)}
                            className="bg-gray border hover:bg-gray-400 md:px-6 ml-4 my-0 p-2 py-2 rounded-lg shadow-md text-gray-800"
                          >
                            {t("Edit Information")}
                          </button>
    
                        </span>
                    </div>
                  </div>
    
                  <hr className="border-gray-300" />
                  <div className="gap-10 space-y-2">
    
                    <h3 className="font-semibold text-gray-700 text-lg">{t("Class Assignment")}</h3>
    
                    <p className='flex gap-2 items-center'>
                      <span className='w-1/2'> <strong>{t("Specialty 1st")}:</strong> {data.allMainSpecialties.edges.filter((item: EdgeMainSpecialty) => decodeUrlID(item.node.id) === formData.classAssignment.specialty_one)[0].node.specialtyName || 'N/A'} </span>
                      <span className='w-1/2'> <strong>{t("Specialty 2nd")}:</strong> {data.allMainSpecialties.edges.filter((item: EdgeMainSpecialty) => decodeUrlID(item.node.id) === formData.classAssignment.specialty_two)[0].node.specialtyName || 'N/A'} </span>
                    </p>
                    <p className='flex items-center justify-between'>
                      <p> <strong>{t("Program")}:</strong> {data.allPrograms.edges.filter((item: EdgeMainSpecialty) => decodeUrlID(item.node.id) === formData.classAssignment.program)[0].node.name || 'N/A'} </p>
                      <p> <strong>{t("Level")}:</strong> {formData.classAssignment.level || 'N/A'} </p>
                      <span> <strong>{t("Session")}:</strong> {formData.classAssignment.session || 'N/A'} </span>
                      <span>
                        <button
                          onClick={() => setCurrentStep(currentStep - 1)}
                          className="bg-gray border hover:bg-gray-400 md:px-6 ml-4 my-0 p-2 py-2 rounded-lg shadow-md text-gray-800"
                        >
                          {t("Edit Information")}
                        </button>
    
                      </span>
                    </p>
                  </div>
                </div>
    
              </motion.div>
  );
}

export default Confirmation;

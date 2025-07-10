import React from 'react';
import { motion } from 'framer-motion';
import { capitalizeFirstLetter } from '@/functions';


const FinalPage = (
    {
        setCurrentStep,
        currentStep,
        formData,
        t,
        optionsSpecialties,
        optionsPrograms
    }
        :
        {
            setCurrentStep: any,
            currentStep: number,
            formData: any,
            t: any,
            optionsSpecialties: any,
            optionsPrograms: any
        }
) => {


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="font-bold mb-6 text-2xl text-blue-600 text-center">
                {t("Confirm Your Information")}
            </h2>
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg space-y-4">
                <div className="space-y-2">
                    <h3 className="font-semibold text-gray-700 text-xl">{t("Personal Information")}</h3>
                    <p><strong>{t("First Name")}:</strong> {formData.personalInfo.firstName || 'N/A'}</p>
                    <p><strong>{t("Last Name")}:</strong> {formData.personalInfo.lastName || 'N/A'}</p>
                    <p><strong>{t("Sex")}:</strong> {formData.personalInfo.sex || 'N/A'}</p>
                    <p><strong>{t("Address")}:</strong> {formData.personalInfo.address || 'N/A'}</p>
                    <p><strong>{t("Date of Birth")}:</strong> {formData.personalInfo.dob || 'N/A'}</p>
                    <p><strong>{t("Place of Birth")}:</strong> {formData.personalInfo.pob || 'N/A'}</p>
                </div>
                {/* <hr className="border-gray" /> */}
                <br />

                <div className="space-y-2">
                    <h3 className="font-semibold text-gray-700 text-lg">{t("Contact Information")}</h3>
                    <p><strong>Telephone:</strong> {formData.personalInfo.telephone || 'N/A'}</p>
                    <p><strong>Email:</strong> {formData.personalInfo.email || 'N/A'}</p>
                    <p><strong>{t("Parent's Name")}:</strong> {formData.personalInfo.parent || 'N/A'}</p>
                    <p className='flex items-center justify-between'>
                        <span><strong>{t("Parent's Telephone")}:</strong> {formData.personalInfo.parentTelephone || 'N/A'}</span>
                        <span>
                            <button
                                onClick={() => setCurrentStep(currentStep - 3)}
                                className="bg-gray border hover:bg-gray-400 ml-4 my-0 px-6 py-2 rounded-lg shadow-md text-gray-800"
                            >
                                {t("Edit Information")}
                            </button>

                        </span>
                    </p>
                </div>
                <hr className="border-gray-300" />
                <div className="space-y-2">
                    <h3 className="font-semibold text-gray-700 text-lg">{t("Medical History")}</h3>
                    <div className='flex flex-col gap-4 md:flex-row md:gap-10'>
                        <p><strong>{t("Nationality")}:</strong> {formData.medicalHistory.nationality || 'N/A'}</p>
                        <p><strong>{t("Region Of Origin")}:</strong> {(formData.medicalHistory.regionOfOrigin === "Other" ? capitalizeFirstLetter(formData.medicalHistory.regionOfOriginOther.toLowerCase()) : formData.medicalHistory.regionOfOrigin) || 'N/A'}</p>
                    </div>
                    <div className='flex flex-col gap-4 md:flex-row md:gap-10'>
                        <p><strong>{t("Highest Certificate")}:</strong> {(formData.medicalHistory.highestCertificate === "Other" ? (formData.medicalHistory.highestCertificateOther.toLowerCase()) : formData.medicalHistory.highestCertificate) || 'N/A'}</p>
                        <p><strong>{t("Year Obtained")}:</strong> {formData.medicalHistory.yearObtained || 'N/A'}</p>
                        <p><strong>Allergies:</strong> {formData.medicalHistory.allergies || 'N/A'}</p>
                    </div>
                    <div className='flex items-center justify-between'>
                        <span><strong>{t("Medical History")}:</strong> {formData.medicalHistory.medicalHistory || 'N/A'}</span>
                        <span>
                            <button
                                onClick={() => setCurrentStep(currentStep - 2)}
                                className="bg-gray border hover:bg-gray-400 ml-4 my-0 px-6 py-2 rounded-lg shadow-md text-gray-800"
                            >
                                {t("Edit Information")}
                            </button>

                        </span>
                    </div>
                </div>
                <hr className="border-gray-300" />
                <div className="space-y-2">

                    <h3 className="font-semibold text-gray-700 text-lg">{t("Class Assignment")}</h3>

                    <span><strong>{t("Class")}:</strong> {optionsSpecialties?.find((item: any) => item.id === formData.classAssignment.specialtyId)?.name || 'N/A'}</span>
                    <span className='flex items-center justify-between'>
                        <span><strong>{t("Program")}:</strong> {optionsPrograms?.find((item: any) => item.id === formData.classAssignment.programId)?.name || 'N/A'}</span>
                        <span> <strong>Session:</strong> {formData.classAssignment.session || 'N/A'} </span>
                        <span>
                            <button
                                onClick={() => setCurrentStep(currentStep - 1)}
                                className="bg-gray border hover:bg-gray-400 ml-4 my-0 px-6 py-2 rounded-lg shadow-md text-gray-800"
                            >
                                {t("Edit Information")}
                            </button>

                        </span>
                    </span>
                </div>
            </div>

        </motion.div>
    );
}

export default FinalPage;

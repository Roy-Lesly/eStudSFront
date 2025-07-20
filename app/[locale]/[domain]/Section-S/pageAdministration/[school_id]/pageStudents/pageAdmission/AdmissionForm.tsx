'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ParentlInfoForm from './steps/ParentlInfoForm';
import ClassAssignmentForm from './steps/ClassAssignmentForm';
import PersonalInfoForm from './steps/PersonalInfoForm';
import ConfirmationPage from './steps/Confirmation';
import { decodeUrlID } from '@/utils/functions';
import { EdgeClassRoomSec, NodeClassRoomSec } from '@/utils/Domain/schemas/interfaceGraphqlSecondary';
import { errorLog } from '@/utils/graphql/GetAppolloClient';
import { mutationCreateUpdateCustomuser } from '@/utils/graphql/mutations/mutationCreateUpdateCustomuser';
import { mutationCreateUpdateUserProfileSec } from '@/utils/graphql/mutations/mutationCreateUpdateUserProfileSec';
import { JwtPayload } from '@/utils/serverActions/interfaces';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';


const AdmissionForm = (
  { data, myClassroom, params, dataClassroomsSec }:
    { data: any, myClassroom: NodeClassRoomSec, params: any, dataClassroomsSec: EdgeClassRoomSec[] }
) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const token = localStorage.getItem("token");
  const user: JwtPayload | null = token ? jwtDecode(token) : null

  const preinscription = data?.allPreinscriptionsSec?.edges?.[0]?.node;

  const steps = [t('Personal Info'), t('Medical Info'), t('Class Assignment'), t('Confirmation')];
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  console.log(preinscription);

  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: preinscription?.firstName || '',
      lastName: preinscription?.lastName || '',
      sex: preinscription?.sex || '',
      address: preinscription?.address || '',
      dob: preinscription?.dob || '',
      pob: preinscription?.pob || '',
      telephone: preinscription?.fatherTelephone || '',
      allergies: '',
      medicalHistory: '',
      nationality: preinscription?.nationality || '',
      highestCertificate: preinscription?.highestCertificate || '',
      highestCertificateOther: preinscription?.highestCertificate || '',
      yearObtained: preinscription?.yearObtained || '',
      regionOfOrigin: preinscription?.regionOfOrigin || '',
      regionOfOriginOther: preinscription?.regionOfOrigin || '',
    },
    parentInfo: {
      role: 'student',
      deptNames: ['Student'],
      email: preinscription?.email || '',
      fatherName: preinscription?.fatherName || '',
      motherName: preinscription?.motherName || '',
      fatherTelephone: preinscription?.fatherTelephone || '',
      motherTelephone: preinscription?.motherTelephone || '',
      parentAddress: preinscription?.parentAddress || '',
      password: '',
    },
    classAssignment: {
      customuserId: '',
      classroomsecId: decodeUrlID(myClassroom?.id) || '',
      seriesId: parseInt(decodeUrlID(preinscription?.seriesOne?.id)) || '',
      programsec: preinscription?.program.replace("_", " "),
      additionalSubjectsIds: null,
      session: preinscription?.session || 'Morning',
      active: true,
    },
  });

  const handleNext = () => setCurrentStep(prev => prev + 1);
  const handlePrevious = () => setCurrentStep(prev => prev - 1);

  const handleSubmit = async () => {
    setLoading(true);

    const formDataUser = {
      ...formData.personalInfo,
      ...formData.parentInfo,
      username: formData.personalInfo.firstName?.toString().toUpperCase(),
      role: "student",
      schoolIds: [parseInt(params.school_id)],
      delete: false,
    }


    try {
      const resUserId = await mutationCreateUpdateCustomuser({
        formData: formDataUser,
        p: params,
        router: null,
        routeToLink: "",
      })

      if (resUserId.length > 5) {
        const formDataProfile = {
          ...formData.classAssignment,
          customuserId: parseInt(decodeUrlID(resUserId)),
          createdById: user?.user_id,
          updatedById: user?.user_id,
          delete: false,
        }
        const resProfileId = await mutationCreateUpdateUserProfileSec({
          formData: formDataProfile,
          p: params,
          router: null,
          routeToLink: "",
        })
        if (resProfileId?.length > 5) {
          router.push(`/${params.locale}/${params.domain}/Section-S/pageAdministration/${params.school_id}/pageStudents/${resProfileId}`)
          alert(t("Operation Successful") + " " + `✅`)
        }
      }
    } catch (error) {
      errorLog(error);
    }

  };

  return (
    <div className="p-6 shadow-xl rounded-lg bg-slate-50">
      <div className="flex justify-between mb-6 rounded-lg bg-white p-2 shadow-lg">
        {steps.map((step, idx) => (
          <div
            key={idx}
            onClick={() => setCurrentStep(idx)}
            className={`text-center w-full ${currentStep === idx ? 'font-bold rounded-2xl bg-blue-50 text-blue-700 uppercase' : 'text-gray-400'} p-2 cursor-pointer`}>
            {step}
          </div>
        ))}
      </div>

      {currentStep === 0 &&
        <PersonalInfoForm
          data={data}
          formData={formData}
          setFormData={setFormData}
          onNext={handleNext}
        />
      }

      {currentStep === 1 &&
        <ParentlInfoForm
          formData={formData}
          setFormData={setFormData}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      }

      {currentStep === 2 &&
        <ClassAssignmentForm
          formData={formData}
          setFormData={setFormData}
          onNext={handleNext}
          onPrevious={handlePrevious}
          myClassroom={myClassroom}
          dataClassroomsSec={dataClassroomsSec}
          programsData={data?.getProgramsSec}
        />
      }

      {currentStep === 3 &&
        <ConfirmationPage
          // data={data}
          formData={formData}
          onNext={handleSubmit}
          onPrevious={handlePrevious}
          loading={loading}
          setCurrentStep={setCurrentStep}
          dataClassroomsSec={dataClassroomsSec}
          programsData={data?.allProgramsSec?.edges}
        />
      }

    </div>
  );
};

export default AdmissionForm;



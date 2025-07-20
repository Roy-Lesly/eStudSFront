'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ParentInfo from './steps/ParentInfoForm';
import ClassAssignmentForm from './steps/ClassAssignmentForm';
import PersonalInfoForm from './steps/PersonalInfoForm';
import ConfirmationPage from './steps/Confirmation';
import { decodeUrlID, getAcademicYear } from '@/utils/functions';
import { errorLog } from '@/utils/graphql/GetAppolloClient';
import { mutationCreateUpdateCustomuser } from '@/utils/graphql/mutations/mutationCreateUpdateCustomuser';
import { JwtPayload } from '@/utils/serverActions/interfaces';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import { mutationCreateUpdateUserProfilePrim } from '@/utils/graphql/mutations/mutationCreateUpdateUserProfilePrim';
import { EdgeClassRoomPrim, NodePreInscriptionPrim } from '@/utils/Domain/schemas/interfaceGraphqlPrimary';


const AdmissionForm = (
  { data, dataExtra, params }:
    { data: any, params: any, dataExtra: any }
) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const token = localStorage.getItem("token");
  const user: JwtPayload | null = token ? jwtDecode(token) : null

  const preinscription: NodePreInscriptionPrim = data?.allPreinscriptionsPrim?.edges?.[0]?.node;
  const classroomList: EdgeClassRoomPrim[] | null = dataExtra?.allClassroomsPrim?.edges
  const myClassroom = classroomList?.find((item: EdgeClassRoomPrim) => (item.node.academicYear === preinscription.academicYear && item.node.level === preinscription.level))

  const steps = [t('Personal Info'), t('Parent Info'), t('Class Assignment'), t('Confirmation')];
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: preinscription?.firstName || '',
      lastName: preinscription?.lastName || '',
      sex: preinscription?.sex || '',
      address: preinscription?.address || '',
      dob: preinscription?.dob || '',
      pob: preinscription?.pob || '',
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
      // telephone: preinscription?.fatherTelephone || '',
      telephone: new Date().toDateString().slice(3, 16),
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
      classroomprimId: decodeUrlID(myClassroom?.node?.id || ""),
      programsprim: preinscription?.program?.name,
      active: true,
      selectedAcademicYear: preinscription.academicYear || getAcademicYear()
    },
  });

  const handleNext = () => setCurrentStep(prev => prev + 1);
  const handlePrevious = () => setCurrentStep(prev => prev - 1);


  const handleSubmit = async () => {
    if (
      !formData.classAssignment.classroomprimId ||
      !formData.classAssignment.programsprim
    ) {
      alert(t("Complete Classroom Information"))
      return;
    }

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
        const resProfileId = await mutationCreateUpdateUserProfilePrim({
          formData: formDataProfile,
          p: params,
          router: null,
          routeToLink: "",
        })
        if (resProfileId?.length > 5) {
          router.push(`/${params.locale}/${params.domain}/Section-P/pageAdministration/${params.school_id}/pageStudents/${resProfileId}`)
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
        <ParentInfo
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
          classroomList={classroomList}
          programsData={dataExtra?.getProgramsPrim}
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
          classroomList={classroomList}
          programsData={data?.allProgramsPrim?.edges}
        />
      }

    </div>
  );
};

export default AdmissionForm;



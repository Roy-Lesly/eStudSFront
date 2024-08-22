'use client';
import { motion } from 'framer-motion';
import { capitalizeFirstLetter, decodeUrlID, getAcademicYear } from '@/functions';
import MyInputField from '@/MyInputField';
import React, { useEffect, useState } from 'react'
import { EdgeSchoolHigherInfo } from '@/Domain/schemas/interfaceGraphql';
import Select from "react-select";
import countryList from "react-select-country-list";
import { CertificateOptions, RegionList } from '@/constants';
import { useTranslation } from 'react-i18next';
import Confirmation from './Confirmation';
import { EdgeSeries } from '@/utils/Domain/schemas/interfaceGraphqlSecondary';
import { mutationCreateUpdatePreInscription } from '@/utils/graphql/mutations/mutationCreateUpdatePreInscription';
import { errorLog } from '@/utils/graphql/GetAppolloClient';


const steps = ['Personal Info', 'Role / Dept', 'Specialty', 'Confirmation'];
const CountryList = countryList().getData();

type FormData = {
  personalInfo: {
    first_name: string;
    last_name: string;
    sex: string;
    email: string;
    telephone: string;
    address: string;
    pob: string;
    dob: string;
  };
  medicalHistory: {
    nationality: string;
    highest_certificate: string;
    highest_certificate_other: string;
    year_obtained: string;
    grade: string;
    region_of_origin: string;
    region_of_origin_other: string;

    father_name: string;
    mother_name: string;
    parent_address: string;
    father_telephone: string;
    mother_telephone: string;
    campusId: string;
  };
  classAssignment: {
    academic_year: string;
    program: string;
    level: string;
    session: string;
    stream: string;
    series_one: string;
    // series_two: string;
    status: "PENDING";
    admission_status: false;
  };
};

const PreFormSecondary = ({ data, source, params }: { params: any, source: "admin" | "student", data: any }) => {

  const [currentStep, setCurrentStep] = useState(0);
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const [count, setCount] = useState<number>(0);
  const [schoolSystem, setschoolSystem] = useState<string>(params?.locale === "fr" ? "French Section" : "English Section");
  const [optionsSeriesFix, setOptionsSeriesFix] = useState<{ id: number, name: string }[]>();
  const [optionsSeries, setOptionsSeries] = useState<{ id: number, name: string }[]>();
  const [optionsCampuses, setOptionsCampuses] = useState<{ id: number, name: string }[]>();
  const [optionsProgramsSec, setOptionsProgramsSec] = useState<{ id: number, name: string }[]>();
  const [optionsLevels, setOptionsLevels] = useState<{ id: number, name: string }[]>();
  const [optionsYears, setOptionsYears] = useState<{ id: string, name: string }[]>();

  const [formData, setFormData] = useState({
    personalInfo: {
      first_name: '',
      last_name: '',
      sex: '',
      email: '',
      telephone: '',
      address: '',
      pob: '',
      dob: '',
    },
    medicalHistory: {
      nationality: "Cameroon",
      highest_certificate: '',
      highest_certificate_other: '',
      year_obtained: '',
      grade: '',
      region_of_origin: '',
      region_of_origin_other: '',
      father_name: '',
      mother_name: '',
      parent_address: '',
      father_telephone: '',
      mother_telephone: '',
      campusId: source === "admin" ? params.school_id : "",
    },
    classAssignment: {
      academic_year: '',
      program: '',
      level: '',
      session: '',
      class: '',
      stream: '',
      series_one: '',
      series_two: '',
      status: 'PENDING',
      admission_status: false,
    },
  });


  const [stepValidation, setStepValidation] = useState<boolean[]>(
    new Array(steps.length).fill(false)
  );

  const validateStep = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0:
        const { first_name, last_name, sex, address, dob, pob, telephone, } = formData.personalInfo;
        return [first_name, last_name, sex, address, dob, pob, telephone,].every((field) => String(field).trim() !== '');
      case 1:
        const { campusId, nationality, highest_certificate, grade, year_obtained, region_of_origin, mother_name, father_telephone } = formData.medicalHistory;
        return [nationality, highest_certificate, grade, year_obtained, region_of_origin, campusId.toString()].every((field) => String(field.trim()) !== '');
      case 2:
        const { academic_year, program, level, session, stream } = formData.classAssignment;
        return [academic_year, program, level, session, stream].every((field) => String(field).trim() !== '' && (Array.isArray(field) ? field.every(item => String(item).trim() !== '') : true));

      default:
        return true;
    }
  };

  useEffect(() => {
    if (count === 0) {
      if (data && data.allAcademicYears) {
        const f = data.allAcademicYears.slice(0, 2).map((item: string) => ({
          id: item,
          name: `${item}`
        }));
        if (f.length > 0) {
          setOptionsYears(f);
        }
      }
      if (data?.getProgramsSec?.length) {
        setOptionsProgramsSec(data?.getProgramsSec.map((item: string) => { return { id: item, name: item } }))
      }
      if (data?.getLevelsSec?.length) {
        setOptionsLevels(data?.getLevelsSec.map((item: string) => { return { id: item, name: item } }))
      }
      if (data && data?.allSchoolInfos?.edges.length) {
        const f = data.allSchoolInfos.edges.map((item: EdgeSchoolHigherInfo) => {
          return { "id": decodeUrlID(item.node.id), "name": `${item.node.campus.replace("_", "-")} - ${item.node?.town} - ${item.node?.address}` }
        })

        if (f) { setOptionsCampuses(f) }
      }
      setCount(1)
    }
  }, [data])


  useEffect(() => {
    if (count === 2) {
      if (data && data.allSeries?.edges?.length && formData.classAssignment.level) {
        const s = data.allSeries.edges.filter((s: EdgeSeries) => s.node.level === formData.classAssignment.level.replace("_", " ")).map((item: EdgeSeries) => {
          return { "id": decodeUrlID(item.node.id), "name": `${item.node.name}` }
        })?.sort((a: any, b: any) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0)
        if (s && s.length) { setOptionsSeries(s); setOptionsSeriesFix(s); }
        else {
          setOptionsSeries([]);
          setOptionsSeriesFix([]);
          handleChange('classAssignment', 'series_one', "")
          // handleChange('classAssignment', 'series_two', "")
        }
      }
      setCount(3)
    }
  }, [data, count, formData])

  useEffect(() => {
    if (count === 4) {
      if (data && optionsSeries && formData.classAssignment.series_one) {
        const filteredSeriesOneOut: any = optionsSeriesFix?.filter((item: any) => (item.id !== formData.classAssignment.series_one))
        if (filteredSeriesOneOut) { setOptionsSeries(filteredSeriesOneOut) }
      }
      setCount(5)
    }
  }, [data, count, formData])


  const handleNext = () => {
    const isValid = validateStep(currentStep);
    const updatedValidation = [...stepValidation];
    updatedValidation[currentStep] = isValid;
    setStepValidation(updatedValidation);

    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (!isValid) {
      alert(t("Please fill in all required fields"));
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleChange = <K extends keyof FormData>(
    section: K,
    field: keyof FormData[K],
    value: string | string[]
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value
      },
    }));
    if (field === "level") {
      setCount(2);
    }
    if (field === "series_one" || field === "series_two") {
      setCount(4);
    }
  };


  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const newData = {
      registrationNumber: formData.personalInfo.first_name?.toString().toUpperCase(),
      firstName: formData.personalInfo.first_name?.toString().toUpperCase(),
      lastName: formData.personalInfo.last_name?.toString().toUpperCase(),
      fullName: formData.personalInfo.first_name?.toString().toUpperCase() + " " + formData.personalInfo.last_name?.toString().toUpperCase(),
      sex: formData.personalInfo.sex.toUpperCase(),
      email: formData.personalInfo.email?.toString().toLowerCase(),
      telephone: formData.personalInfo.telephone,
      address: formData.personalInfo.address?.toString().toUpperCase(),
      pob: formData.personalInfo.pob,
      dob: formData.personalInfo.dob,

      fatherName: formData.medicalHistory.father_name ? formData.medicalHistory.father_name?.toString().toUpperCase() : "None",
      motherName: formData.medicalHistory.mother_name ? formData.medicalHistory.mother_name?.toString().toUpperCase() : "None",
      parentAddress: formData.medicalHistory.parent_address ? formData.medicalHistory.parent_address?.toString().toUpperCase() : "None",
      fatherTelephone: formData.medicalHistory.father_telephone,
      motherTelephone: formData.medicalHistory.mother_telephone,
      campusId: formData.medicalHistory.campusId,

      nationality: formData.medicalHistory?.nationality,
      regionOfOrigin: formData.medicalHistory.region_of_origin === "Other" ? capitalizeFirstLetter(formData.medicalHistory.region_of_origin_other.toLowerCase()) : formData.medicalHistory.region_of_origin,
      highestCertificate: formData.medicalHistory.highest_certificate === "Other" ? capitalizeFirstLetter(formData.medicalHistory.highest_certificate_other.toLowerCase()) : formData.medicalHistory.highest_certificate,
      yearObtained: formData.medicalHistory.year_obtained,
      grade: formData.medicalHistory.grade,

      academicYear: formData.classAssignment.academic_year,
      program: formData.classAssignment.program,
      level: formData.classAssignment.level,
      stream: formData.classAssignment.stream,
      session: formData.classAssignment.session,
      seriesOneId: formData.classAssignment.series_one,
      status: "PENDING",
      admissionStatus: false,
      action: "CREATING",
      delete: false,
    }
    setCount(10)

    if ([newData].length > 0) {
      for (let index = 0; index < [newData].length; index++) {
        const dataToSubmit = [newData][index];

        try {
          const resUserId = await mutationCreateUpdatePreInscription({
            section: "S",
            formData: dataToSubmit,
            p: params,
            router: null,
            routeToLink: "",
          })

          if (resUserId.length > 5) {
            alert(t("Operation Successful") + " " + `✅`)
            window.location.reload();
          }
        } catch (error) {
          errorLog(error);
        }
      };
    };
  };

  const last_20_years = Array.from({ length: 25 }, (_, i) => (currentYear - i).toString());

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='rounded p-2 shadow-lg bg-slate-50'
          >
            <h2 className="font-bold text-xl">{t("Personal Information")}</h2>

            <div className="mb-10 space-y-2">

              <div className='flex flex-col gap-2 md:flex-row md:gap-4'>
                <MyInputField
                  id="first_name"
                  name="first_name"
                  label={t("First Name")}
                  type="text"
                  placeholder={t("First Name")}
                  value={formData.personalInfo.first_name}
                  onChange={(e) => handleChange('personalInfo', 'first_name', e.target.value)}
                />
                <MyInputField
                  id="last_name"
                  name="last_name"
                  label={t("Last Name")}
                  type="text"
                  placeholder={t("Last Name")}
                  value={formData.personalInfo.last_name}
                  onChange={(e) => handleChange('personalInfo', 'last_name', e.target.value)}
                />
              </div>

              <div className='flex flex-col gap-2 md:flex-row md:gap-4'>
                <MyInputField
                  id="sex"
                  name="sex"
                  label={t("Gender")}
                  type="select"
                  placeholder={t("Gender")}
                  options={["Male", "Female"]}
                  value={formData.personalInfo.sex}
                  onChange={(e) => handleChange('personalInfo', 'sex', e.target.value)}
                />
                <MyInputField
                  id="address"
                  name="address"
                  label={t("Address")}
                  type="text"
                  placeholder={t("Address")}
                  value={formData.personalInfo.address}
                  onChange={(e) => handleChange('personalInfo', 'address', e.target.value)}
                />
              </div>

              <div className='flex flex-col gap-4 md:flex-row'>
                <MyInputField
                  id="dob"
                  name="dob"
                  label={t("Date of Birth")}
                  type="date"
                  placeholder={t("Date of Birth")}
                  value={formData.personalInfo.dob}
                  onChange={(e) => handleChange('personalInfo', 'dob', e.target.value)}
                />
                <MyInputField
                  id="pob"
                  name="pob"
                  label={t("Place of Birth")}
                  type="text"
                  placeholder={t("Place of Birth")}
                  value={formData.personalInfo.pob}
                  onChange={(e) => handleChange('personalInfo', 'pob', e.target.value)}
                />
              </div>

              <div className='flex flex-col gap-2 md:flex-row md:gap-4'>
                <MyInputField
                  id="telephone"
                  name="telephone"
                  label={t("Telephone")}
                  type="number"
                  placeholder={t("Telephone")}
                  value={formData.personalInfo.telephone}
                  onChange={(e) => handleChange('personalInfo', 'telephone', e.target.value)}
                />
                <MyInputField
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="Email"
                  value={formData.personalInfo.email}
                  onChange={(e) => handleChange('personalInfo', 'email', e.target.value)}
                />
              </div>

            </div>

          </motion.div>
        );
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='p-4'
          >
            <h2 className="font-bold mb-2 mx-2 text-center text-xl">{t("Other Information")}</h2>

            <div className='flex flex-col gap-2 md:flex-col md:gap-4'>
              <div className='flex flex-col gap-2 md:flex-row md:gap-4'>

                {source === "student" ? <MyInputField
                  id="campusId"
                  name="campusId"
                  label="Campus"
                  type="select"
                  placeholder={t("Select Campus")}
                  value={formData.medicalHistory.campusId.toString()}
                  onChange={(e) => handleChange('medicalHistory', 'campusId', e.target.value)}
                  options={optionsCampuses}
                /> : null}

                <Select
                  className='flex items-end justify-center w-full'
                  name="nationality"
                  options={CountryList}
                  onChange={(e) => handleChange('medicalHistory', 'nationality', e?.label || "")}
                  placeholder={t("Select a country")}
                  value={{value: formData.medicalHistory.nationality, label: formData.medicalHistory.nationality}}
                  isSearchable
                />

                <MyInputField
                  id="region_of_origin"
                  name="region_of_origin"
                  label={t("Region Of Origin")}
                  type="select"
                  placeholder={t("Region Of Origin")}
                  value={formData.medicalHistory.region_of_origin}
                  onChange={(e) => handleChange('medicalHistory', 'region_of_origin', e.target.value)}
                  options={RegionList}
                />

                {formData.medicalHistory.region_of_origin === "Other" ? <MyInputField
                  id="region_of_origin_other"
                  name="region_of_origin_other"
                  label={t("Other Region")}
                  type="text"
                  placeholder={t("Other Origin")}
                  value={formData.medicalHistory.region_of_origin_other}
                  onChange={(e) => handleChange('medicalHistory', 'region_of_origin_other', e.target.value)}
                /> : null}


              </div>

              <div className='flex flex-col gap-2 md:flex-row md:gap-4'>
                <MyInputField
                  id="highest_certificate"
                  name="highest_certificate"
                  label={t("Highest Certificate")}
                  type="select"
                  placeholder={t("Highest Certificate")}
                  value={formData.medicalHistory.highest_certificate}
                  onChange={(e) => handleChange('medicalHistory', 'highest_certificate', e.target.value)}
                  options={CertificateOptions}
                />

                {formData.medicalHistory.highest_certificate === "Other" ? <MyInputField
                  id="highest_certificate_other"
                  name="highest_certificate_other"
                  label={t("Other Certificate")}
                  type="text"
                  placeholder={t("Other Certificate / Diplome")}
                  value={formData.medicalHistory.highest_certificate_other}
                  onChange={(e) => handleChange('medicalHistory', 'highest_certificate_other', e.target.value)}
                /> : null}

                <MyInputField
                  id="year_obtained"
                  name="year_obtained"
                  label={t("Year Obtained")}
                  type="select"
                  placeholder={t("Select Year")}
                  value={formData.medicalHistory.year_obtained}
                  onChange={(e) => handleChange('medicalHistory', 'year_obtained', e.target.value)}
                  options={last_20_years}
                />
              </div>

              <div className='flex flex-col gap-2 md:flex-row md:gap-4 w-full'>
                <MyInputField
                  id="grade"
                  name="grade"
                  label={t("Subjects Grade")}
                  type="textArea"
                  placeholder={"e.g List a"}
                  value={formData.medicalHistory.grade}
                  onChange={(e) => handleChange('medicalHistory', 'grade', e.target.value)}
                />
              </div>

              <div className='flex flex-col gap-2 md:flex-row'>
                <MyInputField
                  id="father_name"
                  name="father_name"
                  label={t("Father's Name")}
                  type="text"
                  placeholder={t("Father's Name")}
                  value={formData.medicalHistory.father_name}
                  onChange={(e) => handleChange('medicalHistory', 'father_name', e.target.value)}
                />
                <MyInputField
                  id="mother_name"
                  name="mother_name"
                  label={t("Mother's Name")}
                  type="text"
                  placeholder={t("Mother's Name")}
                  value={formData.medicalHistory.mother_name}
                  onChange={(e) => handleChange('medicalHistory', 'mother_name', e.target.value)}
                />
              </div>

              <div className='flex flex-col gap-2 md:flex-row'>
                <MyInputField
                  id="father_telephone"
                  name="father_telephone"
                  label={t("Father Telephone")}
                  type="number"
                  placeholder={t("Father Telephone")}
                  value={formData.medicalHistory.father_telephone}
                  onChange={(e) => handleChange('medicalHistory', 'father_telephone', e.target.value)}
                />
                <MyInputField
                  id="mother_telephone"
                  name="mother_telephone"
                  label={t("Mother Telephone")}
                  type="number"
                  placeholder={t("Mother Telephone")}
                  value={formData.medicalHistory.mother_telephone}
                  onChange={(e) => handleChange('medicalHistory', 'mother_telephone', e.target.value)}
                />
              </div>
              <div className='flex flex-col gap-2 md:flex-row'>
                <MyInputField
                  id="parent_address"
                  name="parent_address"
                  label={t("Parent address")}
                  type="text"
                  placeholder={t("Parent address")}
                  value={formData.medicalHistory.parent_address}
                  onChange={(e) => handleChange('medicalHistory', 'parent_address', e.target.value)}
                />
              </div>

            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='p-4'
          >
            <h2 className="font-bold mb-4 text-xl">{t("Class Assignment")}</h2>
            <div className="space-y-4">

              <div className='flex md:flex-row flex-col justify-between gap-4'>
                <MyInputField
                  id="system"
                  name="system"
                  label={t("School System")}
                  type="select"
                  placeholder={t("Select a School System")}
                  value={schoolSystem}
                  onChange={(e) => setschoolSystem(e.target.value)}
                  options={[ params.locale === "fr" ? "French Section" : "English Section"]}
                />
                <MyInputField
                  id="stream"
                  name="stream"
                  label={t("School Section")}
                  type="select"
                  placeholder={t("Select a School stream")}
                  value={formData.classAssignment.stream}
                  onChange={(e) => handleChange('classAssignment', 'stream', e.target.value)}
                  options={["GENERAL", "TECHNICAL", "COMMERCIAL"]}
                />
              </div>

              <MyInputField
                id="level"
                name="level"
                label={t("Classroom")}
                type="select"
                placeholder={t("Select a Class")}
                value={formData.classAssignment.level}
                onChange={(e) => handleChange('classAssignment', 'level', e.target.value)}
                options={(schoolSystem === "English Section" || params.locale === "en") ? optionsLevels?.slice(0, 7) : optionsLevels?.slice(7, 14)}
              />

              <div className='flex md:flex-row flex-col justify-between gap-4'>
                <MyInputField
                  id="series_one"
                  name="series_one"
                  label={t("Series")}
                  type="select"
                  placeholder={t("Select Series")}
                  value={formData.classAssignment.series_one}
                  onChange={(e) => handleChange('classAssignment', 'series_one', e.target.value)}
                  options={optionsSeriesFix}
                />
              </div>

              <div className='flex md:flex-row flex-col justify-between gap-4'>
                <MyInputField
                  id="academic_year"
                  name="academic_year"
                  label={t("Academic Year")}
                  type="select"
                  placeholder={t("Academic Year")}
                  value={formData.classAssignment.academic_year}
                  onChange={(e) => handleChange('classAssignment', 'academic_year', e.target.value)}
                  options={optionsYears && optionsYears?.length > 0 ? optionsYears : [getAcademicYear()]}
                />
                <MyInputField
                  id="program"
                  name="program"
                  label={t("Program")}
                  type="select"
                  placeholder={t("Program")}
                  value={formData.classAssignment.program}
                  onChange={(e) => handleChange('classAssignment', 'program', e.target.value)}
                  options={optionsProgramsSec}
                />
              </div>


              <div className='flex md:flex-row flex-col justify-between gap-4'>
                <MyInputField
                  id="session"
                  name="session"
                  label={t("Session")}
                  type="select"
                  placeholder={t("Session")}
                  value={formData.classAssignment.session}
                  onChange={(e) => handleChange('classAssignment', 'session', e.target.value)}
                  options={["Morning", "Evening"]}
                />
              </div>

            </div>
          </motion.div>
        );
      case 3:
        return (
          <Confirmation
            formData={formData}
            data={data}
            setCurrentStep={setCurrentStep}
            currentStep={currentStep}
          />
        );
      default:
        return null;
    }
  };


  return (
    <div className="bg-slate-100 md:p-6 p-2 mx-auto rounded shadow  w-full">
      {/* Stepper */}
      <div className="flex items-center justify-between mb-4 rounded-lg bg-white shadow-lg py-2">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex-1 text-center ${index <= currentStep ? 'font-bold' : 'text-gray-400'
              } ${stepValidation[index]
                ? 'text-green-600'
                : index < currentStep && !stepValidation[index]
                  ? 'text-red-600'
                  : ''
              }`}
          >
            <div
              className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${stepValidation[index]
                ? 'bg-green-600 text-white'
                : index < currentStep && !stepValidation[index]
                  ? 'bg-red-600 text-white'
                  : index <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300'
                }`}
            >
              {index + 1}
            </div>
            <p>{step}</p>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className='rounded-lg bg-white shadow-lg text-black'>
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mb-4 mt-10 p-2">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="bg-red disabled:opacity-50 font-medium hover:bg-slate-500 px-4 py-2 rounded text-white"
        >
          {t("Previous")}
        </button>
        {currentStep === steps.length - 1 ? (
          <>{count === 10 ? <button
            disabled
            onClick={handleSubmit}
            className="bg-green-700 hover:bg-blue-700 px-4 py-2 rounded text-white"
          >
            {t("Submitting")} ...
          </button>
            :
            <button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
            >
              {t("Confirm and Submit")}
            </button>}
          </>
        ) : (
          <button
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default PreFormSecondary


'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gql } from '@apollo/client';
import { JwtPayload } from '@/serverActions/interfaces';
import { jwtDecode } from 'jwt-decode';
import { decodeUrlID } from '@/functions';
import { FaLeftLong, FaRightLong } from 'react-icons/fa6';
import { CertificateOptions } from '@/constants';
import { useTranslation } from 'react-i18next';
import QrCodeGenerator from '@/components/QrCodeGenerator';
import StudentIDCard1 from './Comps/StudentIDCard1';
import StudentIDCard2 from './Comps/StudentIDCard2';
import StudentIDCard3 from './Comps/StudentIDCard3';
import IDComp2 from '../../pageResult/pageIDCard/[specialty_id]/IDComp2';
import IDComp1 from '../../pageResult/pageIDCard/[specialty_id]/IDComp1';
import { QrCodeBase64 } from '@/components/QrCodeBase64';
import { protocol, RootApi } from '@/utils/config';
import { EdgeSchoolFeesSec } from '@/utils/Domain/schemas/interfaceGraphqlSecondary';
import { mutationCreateUpdateCustomuser } from '@/utils/graphql/mutations/mutationCreateUpdateCustomuser';
import ButtonUpdate from '@/components/Buttons/ButtonUpdate';


const Info = (
  { data, params, searchParams, hasMark }
    :
    { data: EdgeSchoolFeesSec, params: any, searchParams: any, hasMark: boolean }
) => {

  const { t } = useTranslation();
  const [showId, setShowId] = useState(false);
  const [user, setUser] = useState<JwtPayload | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");

  useEffect(() => {
    const url = `${protocol}${params.domain}${RootApi}/check/${decodeUrlID(data?.node?.userprofilesec?.id)}/S/idcard/?n=1`;
    QrCodeBase64(url).then(setQrCodeDataUrl);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token && !user) {
      setUser(jwtDecode(token))
    }
  }, [user])

  const [student, setStudent] = useState<{
    role: string;
    photo: string | File;  // Accept both a URL or a File object
    firstName: string;
    lastName: string;
    fullName: string;
    sex: string;
    dob: string;
    pob: string;
    address: string;
    telephone: string;
    email: string;
    parentAddress: string;
    fatherTelephone: string;
    motherTelephone: string;
    fatherName: string;
    motherName: string;
    nationality: string;
    regionOfOrigin: string;
    highestCertificate: string;
    yearObtained: string;
    schoolIds: string[];
    deptIds: number[];
    password: string;
    passwordSet: boolean;
    infoData: string;
    delete: boolean;
    prefix: string;
  }>({
    role: data?.node?.userprofilesec?.customuser.role || '',
    photo: data?.node?.userprofilesec?.customuser?.photo || '',
    firstName: data?.node?.userprofilesec?.customuser.firstName || '',
    lastName: data?.node?.userprofilesec?.customuser.lastName || '',
    fullName: data?.node?.userprofilesec?.customuser.fullName || '',
    sex: data?.node?.userprofilesec?.customuser.sex || '',
    dob: data?.node?.userprofilesec?.customuser.dob || '',
    pob: data?.node?.userprofilesec?.customuser.pob || '',
    address: data?.node?.userprofilesec?.customuser.address || '',
    telephone: data?.node?.userprofilesec?.customuser.telephone || '',
    email: data?.node?.userprofilesec?.customuser.email || '',
    parentAddress: data?.node?.userprofilesec?.customuser.parentAddress || '',
    fatherTelephone: data?.node?.userprofilesec?.customuser.fatherTelephone || '',
    motherTelephone: data?.node?.userprofilesec?.customuser.motherTelephone || '',
    fatherName: data?.node?.userprofilesec?.customuser.fatherName || '',
    motherName: data?.node?.userprofilesec?.customuser.motherName || '',
    nationality: data?.node?.userprofilesec?.customuser.nationality || '',
    regionOfOrigin: data?.node?.userprofilesec?.customuser.regionOfOrigin || '',
    highestCertificate: data?.node?.userprofilesec?.customuser.highestCertificate || '',
    yearObtained: data?.node?.userprofilesec?.customuser.yearObtained || '',
    password: data?.node?.userprofilesec?.customuser.password || '',
    passwordSet: data?.node?.userprofilesec?.customuser?.password ? true : false,
    schoolIds: [params.school_id],
    deptIds: [],
    infoData: data?.node?.userprofilesec?.customuser.infoData || JSON.stringify({}),
    delete: false,
    prefix: data?.node?.userprofilesec?.customuser.prefix ? data?.node?.userprofilesec?.customuser?.prefix : "x"
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setStudent({ ...student, [name]: value.toUpperCase() });
  };

  const handleSubmit = async (e: any) => {
    console.log(student)
    e.preventDefault();

    if ([student].length > 0 && user && user?.user_id) {
      for (let index = 0; index < [student].length; index++) {
        const newData = [student][index];

        const resUserId = await mutationCreateUpdateCustomuser({
          formData: { ...newData, id: parseInt(decodeUrlID(data?.node?.userprofilesec?.customuser?.id)), delete: false },
          p: params,
          router: null,
          routeToLink: "",
        })
        if (resUserId?.length > 5) {
          alert(t("Operation Successful") + " " + `✅`)
          window.location.reload();
        }

        // await ApiFactory({
        //   newData: { id: parseInt(decodeUrlID(data?.node?.userprofilesec?.customuser.id)), ...newData, delete: false },
        //   mutationName: "createUpdateDeleteCustomuser",
        //   modelName: "customuser",
        //   successField: "id",
        //   query,
        //   router: null,
        //   params: params,
        //   redirect: false,
        //   reload: true,
        //   returnResponseField: false,
        //   redirectPath: ``,
        //   actionLabel: "processing",
        // });

      }
    }
  };


  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.2 },
    },
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      if (file) {
        setStudent((prevState) => ({
          ...prevState,
          photo: imageUrl,
        }));
      }
    }
  };

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      {showId ?
        <div className='flex flex-col justify-center w-full gap-4'>
          <div className='flex items-center justify-center'>
            <button
              onClick={() => { setShowId(false); }}
              className='bg-blue-800 flex flex-row font-bold gap-2 m-2 px-6 py-2 rounded-lg text-white'
            >
              {t("Back")} <FaLeftLong color='red' size={27} />
            </button>
          </div>

          {/* <div className='flex flex-col md:flex-row justify-center items-center gap-4'>
            <StudentIDCard1
              params={params}
              data={data}
              imageSource='/images/logo/id-background.png'
            />
            <StudentIDCard2
              params={params}
              data={data}
              imageSource='/images/logo/id-background.png'
            />
            <StudentIDCard3
              params={params}
              data={data}
              imageSource='/images/idcards/id-background.png'
            />
          </div> */}
          {/* <IDComp1
            data={[data]}
            params={params}
            searchParams={searchParams}
            qrCodeDataUrl={qrCodeDataUrl}
          /> */}
          {/* <IDComp2
            data={[data]}
            params={params}
            searchParams={searchParams}
            qrCodeDataUrl={qrCodeDataUrl}
          /> */}
        </div>
        :

        <motion.form
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          onSubmit={handleSubmit}
          className="mx-auto rounded-lg shadow-lg w-full"
        >
          {/* Basic Information */}
          <motion.div variants={sectionVariants} className="bg-white mb-8 text-slate-800 rounded-lg shadow-xl p-2 md:p-4">
            <h2 className="border-b font-semibold mb-4 pb-2 text-slate-800 text-xl">
              {t("Basic Information")}
            </h2>

            <div className="gap-6 grid grid-cols-1 md:grid-cols-2">

              <div className="flex flex-row gap-4 items-center justify-between p-4 w-full">

                <div className="border flex h-full items-center justify-center md:w-1/3 rounded w-full">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <img
                    src={
                      selectedImage ||
                      (data?.node.userprofilesec?.customuser?.photo
                        ? `https://api${params.domain}.e-conneq.com/media/` + data?.node?.userprofilesec?.customuser.photo
                        : "x")
                    }
                    alt="Photo"
                    className={`bg-white border object-cover rounded-md cursor-pointer`}
                    onClick={() => fileInputRef.current?.click()}
                  />

                </div>

                <QrCodeGenerator
                  data={
                    {
                      id: parseInt(decodeUrlID(params.student_id)),
                      section: "S",
                      type: "idcard",
                      domain: params.domain,
                      size: 100
                    }
                  }
                />

                {/* <div className="flex h-full items-center justify-center md:w-1/3 rounded w-full">
                  <img
                    src={data?.node?.userprofilesec?.code ? `https://api${params.domain}.e-conneq.com/media/` + data?.node.userprofilesec?.code : "https://apitest.e-conneq.com/media/LogoEconneq.png"}
                    alt="Code"
                    className={`${data?.node.userprofilesec?.code ? data?.node.userprofilesec?.code : "opacity-90"} border-gray-100 object-cover rounded-md `}
                  />
                </div> */}

                {user && user.is_superuser && user.is_staff ? <div className="flex flex-col gap-4 items-center justify-between md:w-1/3 w-full">
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="font-semibold text-slate-800 text-lg"
                  >
                    Print ID
                  </motion.h1>

                  <div className='border flex items-center justify-center rounded-full'>
                    <button type='button' onClick={() => { setShowId(true) }}>
                      <FaRightLong color="green" size={23} className='m-2' />
                    </button>
                  </div>
                </div>
                  : null}
              </div>


              <div className='flex flex-col gap-6'>

                <div className='flex items-center justify-center italic gap-4'>
                  <span>Has Results ?:</span>
                  <span className={`${hasMark ? "text-green-600" : "text-red"} font-semibold text-lg tracking-widest`}>{hasMark ? "Yes" : "No"}</span>
                </div>

                <div className=''>
                  <label className="font-semibold text-lg text-slate-800 tracking-widest">Matricle</label>
                  <input
                    type="text"
                    name="x"
                    value={data?.node?.userprofilesec?.customuser.matricle}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                    required
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-600 text-sm">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={student.firstName}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="text-slate-600 text-sm">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={student.lastName}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="text-slate-600 text-sm">Sex</label>
                <select
                  name="sex"
                  value={student.sex}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                >
                  <option value="">Select</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>
              <div>
                <label className="text-slate-600 text-sm">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={student.dob}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="text-slate-600 text-sm">Place of Birth</label>
                <input
                  type="text"
                  name="pob"
                  value={student.pob}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div variants={sectionVariants} className="bg-white my-4 rounded-lg shadow-xl p-2 md:p-4">
            <h2 className="border-b font-semibold mb-4 pb-2 text-slate-800 text-xl">
              Contact and Extra Information
            </h2>
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
              <div>
                <label className="text-slate-600 text-sm">Address</label>
                <input
                  type="text"
                  name="address"
                  value={student.address}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="text-slate-600 text-sm">Telephone</label>
                <input
                  type="tel"
                  name="telephone"
                  value={student.telephone}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="text-slate-600 text-sm">Email</label>
                <input
                  type="email"
                  name="email"
                  value={student.email}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="text-slate-600 text-sm">Highest Level of Education</label>
                <select
                  name="highestCertificate"
                  value={student.highestCertificate}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                >
                  {CertificateOptions.map((item: string) => <option key={item} value={item.toUpperCase()}>{item}</option>)}
                </select>
              </div>
              <div>
                <label className="text-slate-600 text-sm">Year Obtained</label>
                <select
                  name="yearObtained"
                  value={student.yearObtained}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                >
                  {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i).map((item: number) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
              <div>
                <label className="text-slate-600 text-sm">Nationality</label>
                <input
                  type="nationality"
                  name="nationality"
                  value={student.nationality}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="text-slate-600 text-sm">Region of Origin</label>
                <input
                  type="regionOfOrigin"
                  name="regionOfOrigin"
                  value={student.regionOfOrigin}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
            </div>
          </motion.div>

          {/* Parent/Guardian Information */}
          <motion.div variants={sectionVariants} className="bg-white my-4 rounded-lg shadow-xl p-2 md:p-4">
            <h2 className="border-b font-semibold mb-4 pb-2 text-slate-800 text-xl">
              Parent/Guardian Information
            </h2>
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
              <div>
                <label className="text-slate-600 text-sm">{t("Father's Name")}</label>
                <input
                  type="text"
                  name="fatherName"
                  value={student.fatherName}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="text-slate-600 text-sm">{t("Mother's Name")}</label>
                <input
                  type="text"
                  name="motherName"
                  value={student.motherName}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </div>
            </div>
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
              <div>
                <label className="text-slate-600 text-sm">{t("Father's Telephone")}</label>
                <input
                  type="text"
                  name="fatherTelephone"
                  value={student.fatherTelephone}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="text-slate-600 text-sm">{t("Mother's Telephone")}</label>
                <input
                  type="text"
                  name="motherTelephone"
                  value={student.motherTelephone}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </div>
            </div>

            <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
              <div>
                <label className="text-slate-600 text-sm">{t("Parent's Address")}</label>
                <input
                  type="text"
                  name="parentAddress"
                  value={student.parentAddress}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={sectionVariants} className="flex justify-end">
            <ButtonUpdate handleUpdate={handleSubmit} dataToSubmit={[student]} />
          </motion.div>
        </motion.form>}

    </>
  );
};

export default Info;



const query = gql`
  mutation UpdateDelete(
    $id: ID!
    $prefix: String!
    $role: String!
    $photo: String
    $firstName: String!
    $lastName: String!
    $sex: String!
    $address: String!
    $telephone: String!
    $pob: String
    $dob: String
    $email: String!
    $parent: String
    $parentTelephone: String
    $highestCertificate: String!
    $yearObtained: String!
    $nationality: String!
    $regionOfOrigin: String!
    $deptIds: [ID!]
    $schoolIds: [ID]!
    $delete: Boolean!
    $infoData: JSONString!
  ) {
    createUpdateDeleteCustomUser(
      id: $id, 
      prefix: $prefix
      role: $role
      photo: $photo
      firstName: $firstName
      lastName: $lastName
      sex: $sex
      address: $address
      telephone: $telephone
      pob: $pob
      dob: $dob
      email: $email
      parent: $parent
      parentTelephone: $parentTelephone
      highestCertificate: $highestCertificate
      yearObtained: $yearObtained
      nationality: $nationality
      regionOfOrigin: $regionOfOrigin
      deptIds: $deptIds
      schoolIds: $schoolIds
      delete: $delete
      infoData: $infoData
    ) {
      customuser {
        id 
        fullName
      }
    }
  }
`;
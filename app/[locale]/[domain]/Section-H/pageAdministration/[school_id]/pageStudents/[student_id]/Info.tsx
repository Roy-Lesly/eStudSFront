'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { EdgeSchoolFees } from '@/Domain/schemas/interfaceGraphql';
import { gql, useMutation } from '@apollo/client';
import ButtonUpdate from '@/section-h/Buttons/ButtonUpdate';
import { JwtPayload } from '@/serverActions/interfaces';
import { jwtDecode } from 'jwt-decode';
import { capitalizeFirstLetter, decodeUrlID } from '@/functions';
import { FaLeftLong, FaRightLong } from 'react-icons/fa6';
import IDComp from '../../pageResult/pageIDCard/[specialty_id]/IDComp';
import { CertificateOptions } from '@/constants';
import { useTranslation } from 'react-i18next';
import PasswordResetModal from '@/PasswordModal';


const Info = ({ data, params, searchParams }: { data: EdgeSchoolFees, params: any, searchParams: any }) => {
  const { t } = useTranslation();
  const [showId, setShowId] = useState(false);
  const [user, setUser] = useState<JwtPayload | null>(null);

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
    parent: string;
    parentTelephone: string;
    nationality: string;
    regionOfOrigin: string;
    highestCertificate: string;
    yearObtained: string;
    schoolIds: string[];
    deptNames: string[];
    delete: boolean;
    prefix: string;
  }>({
    role: data.node.userprofile.user.role || '',
    photo: data.node.userprofile.user?.photo || '',
    firstName: data.node.userprofile.user.firstName || '',
    lastName: data.node.userprofile.user.lastName || '',
    fullName: data.node.userprofile.user.fullName || '',
    sex: data.node.userprofile.user.sex || '',
    dob: data.node.userprofile.user.dob || '',
    pob: data.node.userprofile.user.pob || '',
    address: data.node.userprofile.user.address || '',
    telephone: data.node.userprofile.user.telephone || '',
    email: data.node.userprofile.user.email || '',
    parent: data.node.userprofile.user.parent || '',
    parentTelephone: data.node.userprofile.user.parentTelephone || '',
    nationality: data.node.userprofile.user.nationality || '',
    regionOfOrigin: data.node.userprofile.user.regionOfOrigin || '',
    highestCertificate: data.node.userprofile.user.highestCertificate || '',
    yearObtained: data.node.userprofile.user.yearObtained || '',
    schoolIds: [params.school_id],
    deptNames: ["Student"],
    delete: false,
    prefix: data.node.userprofile.user.prefix ? data.node.userprofile.user?.prefix : "x"
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setStudent({ ...student, [name]: value.toUpperCase() });
  };


  const [createUpdateDeleteCustomUser] = useMutation(UPDATE_DELETE_CUSTOM_USER);

  const handleSubmit = async (e: any) => {
    console.log(student)
    e.preventDefault();

    if ([student].length > 0 && user && user?.user_id) {
      const successMessages: string[] = [];
      const errorMessages: string[] = [];
      for (let index = 0; index < [student].length; index++) {
        const res = [student][index];
        try {
          const result = await createUpdateDeleteCustomUser({
            variables: {
              ...res,
              id: parseInt(decodeUrlID(data.node.userprofile.user.id)),
              role: res.role.toLowerCase(),
              sex: capitalizeFirstLetter(res.sex),
              email: res.email.toLowerCase(),
              updatedById: user.user_id
            }
          });

          console.log(result.data, 70)

          if (result.data.createUpdateDeleteCustomUser.customuser.id) {
            successMessages.push(
              `${result.data.createUpdateDeleteCustomUser.customuser.fullName}`
            );
          }
        } catch (err: any) {
          errorMessages.push(`Error updating ${res.fullName}: ${err.message}`);
        }
      }

      let alertMessage = "";
      if (successMessages.length > 0) {
        alertMessage += `✅ Successfully Submitted`;
        window.location.reload();
      }
      if (errorMessages.length > 0) {
        alertMessage += `❌ Errors occurred:\n${errorMessages.join("\n")}`;
      }
      alert(alertMessage);
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
    console.log("object, 119")
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
  const [passwordState, setPasswordState] = useState<"reset" | "change" | null>(null);


  return (
    <>
      {showId ?
        <div className='flex flex-col justify-center w-full'>
          <div className='flex items-center justify-center'>
            <button
              onClick={() => { setShowId(false); }}
              className='bg-blue-800 flex flex-row font-bold gap-2 m-2 px-6 py-2 rounded-lg text-white'
            >
              Back <FaLeftLong color='red' size={27} />
            </button>
          </div>
          <IDComp
            data={[data]}
            params={params}
            searchParams={searchParams}
          />
        </div>
        :

        <motion.form
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          onSubmit={handleSubmit}
          className="bg-white mx-auto pb-6 pt-2 px-6 rounded-lg shadow-lg w-full"
        >
          {/* Basic Information */}
          <motion.div variants={sectionVariants} className="mb-8">
            <h2 className="border-b font-semibold mb-4 pb-2 text-gray-800 text-xl">
              Basic Information
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
                      (data?.node.userprofile.user.photo
                        ? "https://apitest.e-conneq.com/media/" + data.node.userprofile.user.photo
                        : "")
                    }
                    alt="Photo"
                    className={`bg-white border object-cover rounded-md cursor-pointer`}
                    onClick={() => fileInputRef.current?.click()}
                  />
                </div>
                <div className="flex h-full items-center justify-center md:w-1/3 rounded w-full">
                  <img
                    src={data?.node.userprofile.code ? "https://apitest.e-conneq.com/media/" + data?.node.userprofile.code : ""}
                    alt="Code"
                    className={`${data?.node.userprofile.code ? data?.node.userprofile.code : "opacity-90"} border-gray-100 object-cover rounded-md `}
                  />
                </div>

                {user && user.is_superuser && user.is_staff ? <div className="flex flex-col gap-4 items-center justify-between md:w-1/3 w-full">
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="font-semibold text-gray-800 text-lg"
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
                {/* <div className='flex gap-10'>
                  <label className="font-semibold text-xl text-slate-800 tracking-widest w-full">Reset or Change Password:</label>
                  <button onClick={() => setPasswordState("change")} type='button' className='w-32 text-lg font-semibold bg-teal-800 text-white tracking-wider rounded-lg border px-5 py-2'>Change</button>
                  <button onClick={() => setPasswordState("reset")} type='button' className='w-32 text-lg font-semibold bg-red text-white tracking-wider rounded-lg border px-5 py-2'>Reset</button>
                </div> */}
                <div className=''>
                  <label className="font-semibold text-lg text-slate-800 tracking-widest">Matricle</label>
                  <input
                    type="text"
                    name="x"
                    value={data.node.userprofile.user.matricle}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                    required
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-600 text-sm">First Name</label>
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
                <label className="text-gray-600 text-sm">Last Name</label>
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
                <label className="text-gray-600 text-sm">Sex</label>
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
                <label className="text-gray-600 text-sm">Date of Birth</label>
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
                <label className="text-gray-600 text-sm">Place of Birth</label>
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
          <motion.div variants={sectionVariants} className="mb-8">
            <h2 className="border-b font-semibold mb-4 pb-2 text-gray-800 text-xl">
              Contact and Extra Information
            </h2>
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
              <div>
                <label className="text-gray-600 text-sm">Address</label>
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
                <label className="text-gray-600 text-sm">Telephone</label>
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
                <label className="text-gray-600 text-sm">Email</label>
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
                <label className="text-gray-600 text-sm">Highest Level of Education</label>
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
                <label className="text-gray-600 text-sm">Year Obtained</label>
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
                <label className="text-gray-600 text-sm">Nationality</label>
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
                <label className="text-gray-600 text-sm">Region of Origin</label>
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
          <motion.div variants={sectionVariants} className="mb-8">
            <h2 className="border-b font-semibold mb-4 pb-2 text-gray-800 text-xl">
              Parent/Guardian Information
            </h2>
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
              <div>
                <label className="text-gray-600 text-sm">Parent Name</label>
                <input
                  type="text"
                  name="parent"
                  value={student.parent}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="text-gray-600 text-sm">Parent Telephone</label>
                <input
                  type="tel"
                  name="parentTelephone"
                  value={student.parentTelephone}
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

        <PasswordResetModal
          action={passwordState}
          onClose={() => setPasswordState(null)}
          id={parseInt(decodeUrlID(data?.node?.userprofile?.user?.id))}
        />

    </>
  );
};

export default Info;



const UPDATE_DELETE_CUSTOM_USER = gql`
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
    $deptNames: [String]!
    $schoolIds: [ID]!
    $delete: Boolean!
    $updatedById: ID!
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
      deptNames: $deptNames
      schoolIds: $schoolIds
      delete: $delete
      updatedById: $updatedById
    ) {
      customuser {
        id 
        fullName
      }
    }
  }
`;
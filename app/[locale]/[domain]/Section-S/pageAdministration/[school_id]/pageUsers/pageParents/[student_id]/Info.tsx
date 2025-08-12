'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ButtonUpdate from '@/section-h/Buttons/ButtonUpdate';
import { JwtPayload } from '@/serverActions/interfaces';
import { jwtDecode } from 'jwt-decode';
import { decodeUrlID } from '@/functions';
import { FaLeftLong } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import { mutationCreateUpdateCustomuser } from '@/utils/graphql/mutations/mutationCreateUpdateCustomuser';
import { EdgeSchoolFeesPrim } from '@/utils/Domain/schemas/interfaceGraphqlPrimary';
import { useRouter } from 'next/navigation';


const Info = (
  { data, params, searchParams, hasMark }
    :
    { data: EdgeSchoolFeesPrim, params: any, searchParams: any, hasMark: boolean }
) => {

  const router = useRouter();
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
    userprofile_id: string;
    email: string;
    parentAddress: string;
    fatherTelephone: string;
    motherTelephone: string;
    fatherName: string;
    motherName: string;
    schoolIds: string[];
    delete: boolean;
  }>({
    userprofile_id: data?.node?.userprofileprim?.id || '',
    email: data?.node?.userprofileprim?.customuser.email || '',
    parentAddress: data?.node?.userprofileprim?.customuser.parentAddress || '',
    fatherTelephone: data?.node?.userprofileprim?.customuser.fatherTelephone || '',
    motherTelephone: data?.node?.userprofileprim?.customuser.motherTelephone || '',
    fatherName: data?.node?.userprofileprim?.customuser.fatherName || '',
    motherName: data?.node?.userprofileprim?.customuser.motherName || '',
    schoolIds: [params.school_id],
    delete: false,
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
          formData: { ...newData, id: parseInt(decodeUrlID(data?.node?.userprofileprim?.customuser?.id)), delete: false },
          p: params,
          router: null,
          routeToLink: "",
        })
        if (resUserId?.length > 5) {
          alert(t("Operation Successful") + " " + `✅`)
          router.push(`/${params.locale}/${params.domain}/Section-P/pageAdministration/${params.school_id}/pageUsers/parents/${student.userprofile_id}/?user=VHlwZUN1c3RvbVVzZXI6Mw==&ft=${newData?.fatherTelephone}&mt=${newData.motherTelephone}`)
          // window.location.reload();
        }

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


  return (
    <>
      {showId ?
        <div className='flex flex-col justify-center w-full'>
          <div className='flex items-center justify-center'>
            <button
              onClick={() => { setShowId(false); }}
              className='bg-blue-800 flex flex-row font-bold gap-2 m-2 px-6 py-2 rounded-lg text-white'
            >
              {t("Back")} <FaLeftLong color='red' size={27} />
            </button>
          </div>

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
              {t("Basic Information")}
            </h2>

            <div className="gap-6 grid grid-cols-1 md:grid-cols-2">

              <div>
                <label className="text-gray-600 text-sm">{t("Father's Name")}</label>
                <input
                  type="text"
                  name="fatherName"
                  value={student.fatherName}
                  onChange={handleChange}
                  className="border p-2 rounded w-full text-teal-700 font-semibold"
                  required
                />
              </div>
              <div>
                <label className="text-gray-600 text-sm">{t("Mother's Name")}</label>
                <input
                  type="text"
                  name="motherName"
                  value={student.motherName}
                  onChange={handleChange}
                  className="border p-2 rounded w-full text-teal-700 font-semibold"
                  required
                />
              </div>
              
             
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div variants={sectionVariants} className="mb-8">
            <h2 className="border-b font-semibold mb-4 pb-2 text-gray-800 text-xl">
              {("Contact and Extra Information")}
            </h2>
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
              <div>
                <label className="text-gray-600 text-sm">{("Father's Telephone")}</label>
                <input
                  type="number"
                  name="fatherTelephone"
                  value={student.fatherTelephone}
                  onChange={handleChange}
                  className="border p-2 rounded w-full text-teal-700 font-semibold"
                  required
                />
              </div>
              <div>
                <label className="text-gray-600 text-sm">{("Mother's Telephone")}</label>
                <input
                  type="number"
                  name="motherTelephone"
                  value={student.motherTelephone}
                  onChange={handleChange}
                  className="border p-2 rounded w-full text-teal-700 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="text-gray-700 text-sm">{t("Parent Address")}</label>
                <input
                  type="parentAddress"
                  name="parentAddress"
                  value={student.parentAddress}
                  onChange={handleChange}
                  className="border p-2 rounded w-full text-teal-700 font-semibold"
                  required
                />
              </div>
              <div>
                <label className="text-gray-700 text-sm">{t("Parent Email")}</label>
                <input
                  type="email"
                  name="email"
                  value={student.email}
                  onChange={handleChange}
                  className="border p-2 rounded w-full text-teal-700 font-semibold"
                  required
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


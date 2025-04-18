'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { EdgeUserprofileSec } from '@/Domain/schemas/interfaceGraphqlSecondary';

const Info = ({ data }: { data: EdgeUserprofileSec}) => {

    console.log(data)

  const student = {
    firstName: data.node.user.firstName,
    lastName: data.node.user.lastName,
    fullName: data.node.user.fullName,
    sex: data.node.user.sex,
    dob: data.node.user.dob,
    pob: data.node.user.pob,
    address: data.node.user.address,
    telephone: data.node.user.telephone,
    email: data.node.user.email,
    parentName: data.node.user.parent,
    parentTelephone: data.node.user.parentTelephone,
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
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-white mx-auto p-6 rounded-lg shadow-lg w-full"
    >
  
      {/* Basic Information */}
      <motion.div variants={sectionVariants} className="mb-8">
        <h2 className="border-b font-semibold mb-4 pb-2 text-gray-800 text-xl">
          Basic Information
        </h2>
        <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
          <div>
            <label className="text-gray-600 text-sm">First Name</label>
            <p className="font-medium">{student.firstName}</p>
          </div>
          <div>
            <label className="text-gray-600 text-sm">Last Name</label>
            <p className="font-medium">{student.lastName}</p>
          </div>
          <div>
            <label className="text-gray-600 text-sm">Sex</label>
            <p className="font-medium">{student.sex}</p>
          </div>
          <div>
            <label className="text-gray-600 text-sm">Date of Birth</label>
            <p className="font-medium">{student.dob}</p>
          </div>
          <div>
            <label className="text-gray-600 text-sm">Place of Birth</label>
            <p className="font-medium">{student.pob}</p>
          </div>
        </div>
      </motion.div>

      {/* Contact Information */}
      <motion.div variants={sectionVariants} className="mb-8">
        <h2 className="border-b font-semibold mb-4 pb-2 text-gray-800 text-xl">
          Contact Information
        </h2>
        <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
          <div>
            <label className="text-gray-600 text-sm">Address</label>
            <p className="font-medium">{student.address}</p>
          </div>
          <div>
            <label className="text-gray-600 text-sm">Telephone</label>
            <p className="font-medium">{student.telephone}</p>
          </div>
          <div>
            <label className="text-gray-600 text-sm">Email</label>
            <p className="font-medium">{student.email}</p>
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
            <p className="font-medium">{student.parentName}</p>
          </div>
          <div>
            <label className="text-gray-600 text-sm">Parent Telephone</label>
            <p className="font-medium">{student.parentTelephone}</p>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div variants={sectionVariants} className="flex gap-4 justify-end">
        <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-gray-800">
          Edit
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white">
          Save
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Info;

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EdgeCourse } from '@/Domain/schemas/interfaceGraphql';

const Info = ({ data, params }: { data: EdgeCourse, params: any }) => {
  const [specialty, setSpecialty] = useState({
    mainCourseId: data.node.mainCourse.id || '',
  });

  console.log(data, 22)

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setSpecialty({ ...specialty, [name]: value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log('Updated specialty Info:',specialty);
    // TODO: Implement API call to submit updated data
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
          Basic Information - {data.node.mainCourse.courseName}
        </h2>



        <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
          
          {/* <div className=''>
            <label className="font-semibold text-lg text-slate-800 tracking-widest">Academic Year</label>
            <input
              type="text"
              name="x"
              value={data.node.academicYear}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
              readOnly
            />
          </div>
          <div>
            <label className="text-gray-600 text-sm">Level</label>
            <input
              type="text"
              name="firstName"
              value={specialty.academicYear}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div> */}
          {/* <div>
            <label className="text-gray-600 text-sm">1st Installment</label>
            <input
              type="text"
              name="paymentOne"
              value={specialty.paymentOne}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div>
            <label className="text-gray-600 text-sm">2nd Installment</label>
            <input
              type="text"
              name="paymentTwo"
              value={specialty.paymentTwo}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div>
            <label className="text-gray-600 text-sm">3rd Installment</label>
            <input
              type="text"
              name="paymentThree"
              value={specialty.paymentThree}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div> */}
          {/* <div>
            <label className="text-gray-600 text-sm">Sex</label>
            <select
              name="sex"
              value={specialty.sex}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            >
              <option value="">Select</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div> */}
          {/* <div>
            <label className="text-gray-600 text-sm">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={specialty.dob}
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
              value={specialty.pob}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div> */}
        </div>
      </motion.div>

      {/* Submit Button */}
      <motion.div variants={sectionVariants} className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
        >
          Save Changes
        </button>
      </motion.div>
    </motion.form>
  );
};

export default Info;

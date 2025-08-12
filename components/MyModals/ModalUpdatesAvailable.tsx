import { VersionType } from '@/utils/Domain/schemas/interfaceGraphql';
import { gql } from '@apollo/client';
import { motion } from 'framer-motion';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';

const ModalUpdatesAvailable = (
  { version, setUpdateExist, updateExist }:
    { version: VersionType | any, setUpdateExist: any, updateExist: boolean }
) => {

  const test = {
    "number": "2.1.1",
    "date": "2025-08-07",
    "updates": [
      { "title": "Login improved for mobile responsiveness" },
      { "title": "Admin dashboard bug fixes" },
      { "title": "New announcement banner" }
    ]
  }

  const { number, date, updates = [] } = version;

  const { t } = useTranslation("common");
  if (date) {
    const updateDate = new Date(date);
    const now = new Date();
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000); // 2 days in milliseconds

    if (updateDate < twoDaysAgo) {
      setUpdateExist(false);
    }
  }

  return <div>
    {updateExist ?
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white text-black max-w-lg w-full p-6 rounded-lg shadow-xl relative"
        >
          {/* Close Button */}
          <div className="absolute top-4 right-4">
            <button onClick={() => setUpdateExist(false)} className="text-xl">
              <FaTimes className="text-red-600" />
            </button>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-blue-700 mb-2">{t("New Update Available")}</h2>
            <div className="flex text-sm text-gray-500 w-full">
              <span className='w-1/2 md:w-1/4'>{t("Version")}</span>
              <strong className='w-1/2'>: {number}</strong>
              <strong className='w-0 md:w-1/4'></strong>
            </div>
            {date && <div className="flex text-sm text-gray-500 w-full">
              <span className='w-1/2 md:w-1/4'>{t("Released on")}</span>
              <strong className='w-1/2'>: {date}</strong>
              <strong className='w-0 md:w-1/4'></strong>
            </div>
            }
          </div>

          {/* Updates List */}
          <div className="space-y-2">
            {updates.length > 0 ? (
              updates.map((item: any, index: number) => (
                <div
                  key={index}
                  className="bg-blue-50 border border-blue-200 p-3 rounded-md text-sm text-gray-800 shadow-sm"
                >
                  ✅ {item.title}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 italic">{t("No detailed updates listed")}.</p>
            )}
          </div>
        </motion.div>
      </motion.div> : null}
  </div>
}

export default ModalUpdatesAvailable




const query = gql`
  mutation Update(
    $id: ID,
    $mainCourseId: ID!,
    $specialtyId: ID!,
    $courseCode: String!,
    $courseCredit: Int!,
    $courseType: String!,
    $semester: String!,
    $hours: Int!,
    $hoursLeft: String,
    $assigned: Boolean,
    $assignedToId: ID,
    $delete: Boolean!,
    $createdById: ID,
    $updatedById: ID

  ) {
    createUpdateDeleteCourse(
      id: $id
      mainCourseId: $mainCourseId
      specialtyId: $specialtyId
      courseCode: $courseCode
      courseCredit: $courseCredit
      courseType: $courseType
      semester: $semester
      hours: $hours
      hoursLeft: $hoursLeft
      assigned: $assigned
      assignedToId: $assignedToId
      delete: $delete
      createdById: $createdById
      updatedById: $updatedById
    ) {
      course {
        id 
      }
    }
  }
`;

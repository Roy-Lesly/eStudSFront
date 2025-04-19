import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EdgeResult, EdgeSchoolFees } from '@/Domain/schemas/interfaceGraphql';
import FeesCheck from './Comps/FeesCheck';
import ResultsEdit from './Comps/ResultsEdit';
import ResultSlip from '@/[locale]/[domain]/Section-H/pageStudent/[userprofile_id]/ResultSlip';

const Results = ({ data, fees, params }: { data: EdgeResult[], fees: EdgeSchoolFees, params: any }) => {
  const [selectedSemester, setSelectedSemester] = useState<string>('I');

  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSemester(e.target.value);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="overflow-x-auto p-4"
    >


      {/* Header Section */}
      <div className="bg-slate-100 flex flex-col gap-4 items-center justify-between mb-4 md:flex-row p-2 rounded w-full">
        <motion.h1
          className="font-bold text-gray-800 text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {data?.[0]?.node?.student?.user?.fullName || "Student Name"}
        </motion.h1>
        <motion.h2
          className="text-gray-700 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          Class: {fees?.node?.userprofile?.specialty?.mainSpecialty?.specialtyName}
        </motion.h2>
        <div className="text-gray-700 text-lg">
          Level: {fees?.node?.userprofile?.specialty?.level.level || "N/A"}
        </div>
        <div>
          Year: {fees?.node?.userprofile.specialty.academicYear || "N/A"}
        </div>
      </div>




      {/* Table Section */}
      <div className="mb-4 text-black">

        <div className='flex flex-col items-center justify-between md:flex-row'>
          <div
            className="flex font-semibold items-center justify-between mb-2 text-slate-800 text-xl">
            Semester {selectedSemester} - Results
          </div>

          <FeesCheck
            fees={fees}
            semester={selectedSemester}
            link={`${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/${params.student_id}`}
            emptyComp={true}
          >
            {data && data.length ? <ResultSlip
              data={data}
              schoolFees={fees.node}
              semester={selectedSemester}
            /> : null}
          </FeesCheck>



          <div className="mb-6">
            <select
              value={selectedSemester}
              onChange={handleSemesterChange}
              className="border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 px-4 py-2 rounded-md shadow-sm text-gray-700 transition"
            >
              <option value="I">1st Semester</option>
              <option value="II">2nd Semester</option>
            </select>
          </div>
        </div>


        <FeesCheck
          fees={fees}
          semester={selectedSemester}
          link={`${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/${params.student_id}`}
        >
          {/* Dynamic Table Rendering Based on Selected Semester */}
          {selectedSemester === 'I' ? <ResultsEdit data={data.filter((item) => item.node.course.semester === "I")} /> : null}
          {selectedSemester === 'II' ? <ResultsEdit data={data.filter((item) => item.node.course.semester === "II")} /> : null}

        </FeesCheck>

      </div>

    </motion.div >
  );
};

export default Results;

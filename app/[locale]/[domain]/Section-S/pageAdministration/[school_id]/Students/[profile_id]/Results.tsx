import { EdgeResultSecondary } from '@/Domain/schemas/interfaceGraphqlSecondary';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Results = ({ data }: { data: EdgeResultSecondary[] }) => {
  const [selectedTerm, setSelectedTerm] = useState<string>('1st Term');

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }),
  };

  const handleTermChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTerm(e.target.value);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="overflow-x-auto p-4"
    >
      {/* Header Section */}
      <div className="flex flex-col gap-4 items-center justify-between mb-4 md:flex-row w-full">
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
          Classroom: {data?.[0]?.node?.student?.classroom?.level.level || "N/A"}
        </motion.h2>
        <motion.h2
          className="text-gray-700 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          Stream: {data?.[0]?.node?.student?.classroom?.stream || "N/A"}
        </motion.h2>
        <motion.h3
          className="text-gray-700 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Year: {data?.[0]?.node?.student.classroom.academicYear || "N/A"}
        </motion.h3>
      </div>


      {/* Table Section */}
      <div className="mb-4 text-black">

        <div className='flex flex-col items-center justify-between md:flex-row'>
          <motion.div
            className="flex font-semibold items-center justify-between mb-2 text-slate-800 text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {selectedTerm} Results
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <select
              value={selectedTerm}
              onChange={handleTermChange}
              className="border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 px-4 py-2 rounded-md shadow-sm text-gray-700 transition"
            >
              <option value="1st Term">1st Term</option>
              <option value="2nd Term">2nd Term</option>
              <option value="3rd Term">3rd Term</option>
            </select>
          </motion.div>
        </div>



        {/* Dynamic Table Rendering Based on Selected Term */}
        {selectedTerm === '1st Term' && (
          <table className="border border-collapse border-gray-200 min-w-full shadow-md table-auto">
            <thead>
              <tr className="bg-slate-200 text-center">
                <th className="border border-gray-300 font-semibold px-4 py-2 text-gray-700">#</th>
                <th className="border border-gray-300 font-semibold px-4 py-2 text-gray-700">Subject</th>
                <th className="border border-gray-300 font-semibold px-4 py-2 text-gray-700">Sequence 1</th>
                <th className="border border-gray-300 font-semibold px-4 py-2 text-gray-700">Sequence 2</th>
                <th className="border border-gray-300 font-semibold px-4 py-2 text-gray-700">Average</th>
              </tr>
            </thead>
            <tbody>
              {data.map((edge, index: number) => {
                const { node } = edge;
                const { info } = node;

                const parsedInfo = typeof info === 'string' ? JSON.parse(info) : {};
                const { seq_1 = "-", seq_2 = "-", average_term_1 = "-" } = parsedInfo;

                return (
                  <motion.tr
                    key={node.id}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-200 text-center`}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                  >
                    <td className="border border-gray-300 px-4 py-2 text-sm">{index + 1}</td>
                    <td className="border border-gray-300 font-medium px-4 py-2 text-sm uppercase">{node.subject?.mainSubject?.subjectName || "N/A"}</td>
                    <td className="border border-gray-300 px-4 py-2">{seq_1}</td>
                    <td className="border border-gray-300 px-4 py-2">{seq_2}</td>
                    <td className="border border-gray-300 px-2 py-2">{average_term_1}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        )}

        {selectedTerm === '2nd Term' && (
          <table className="border border-collapse border-gray-200 min-w-full shadow-md table-auto">
            <thead>
              <tr className="bg-slate-200">
                <th className="border border-gray-300 font-semibold px-4 py-2 text-gray-700">#</th>
                <th className="border border-gray-300 font-semibold px-4 py-2 text-gray-700">Subject</th>
                <th className="border border-gray-300 font-semibold px-4 py-2 text-gray-700">Sequence 3</th>
                <th className="border border-gray-300 font-semibold px-4 py-2 text-gray-700">Sequence 4</th>
                <th className="border border-gray-300 font-semibold px-4 py-2 text-gray-700">Average</th>
              </tr>
            </thead>
            <tbody>
              {data.map((edge, index: number) => {
                const { node } = edge;
                const { info } = node;

                const parsedInfo = typeof info === 'string' ? JSON.parse(info) : {};
                const { seq_3 = "-", seq_4 = "-", average_term_2 = "-" } = parsedInfo;

                return (
                  <motion.tr
                    key={node.id}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-200 text-center`}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                  >
                    <td className="border border-gray-300 px-4 py-2 text-sm">{index + 1}</td>
                    <td className="border border-gray-300 font-medium px-4 py-2 text-sm uppercase">{node.subject?.mainSubject?.subjectName || "N/A"}</td>
                    <td className="border border-gray-300 px-4 py-2">{seq_3}</td>
                    <td className="border border-gray-300 px-4 py-2">{seq_4}</td>
                    <td className="border border-gray-300 px-2 py-2">{average_term_2}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        )}

        {selectedTerm === '3rd Term' && (
          <table className="border border-collapse border-gray-200 min-w-full shadow-md table-auto">
            <thead>
              <tr className="bg-slate-200">
                <th className="border border-gray-300 font-semibold px-4 py-2 text-gray-700">#</th>
                <th className="border border-gray-300 font-semibold px-4 py-2 text-gray-700">Subject</th>
                <th className="border border-gray-300 font-semibold px-4 py-2 text-gray-700">Sequence 5</th>
                <th className="border border-gray-300 font-semibold px-4 py-2 text-gray-700">Sequence 6</th>
                <th className="border border-gray-300 font-semibold px-4 py-2 text-gray-700">Average</th>
              </tr>
            </thead>
            <tbody>
              {data.map((edge, index: number) => {
                const { node } = edge;
                const { info } = node;

                const parsedInfo = typeof info === 'string' ? JSON.parse(info) : {};
                const { seq_5 = "-", seq_6 = "-", average_term_3 = "-" } = parsedInfo;

                return (
                  <motion.tr
                    key={node.id}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-200 text-center`}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                  >
                    <td className="border border-gray-300 px-4 py-2 text-sm">{index + 1}</td>
                    <td className="border border-gray-300 font-medium px-4 py-2 text-sm uppercase">{node.subject?.mainSubject?.subjectName || "N/A"}</td>
                    <td className="border border-gray-300 px-4 py-2">{seq_5}</td>
                    <td className="border border-gray-300 px-4 py-2">{seq_6}</td>
                    <td className="border border-gray-300 px-2 py-2">{average_term_3}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
};

export default Results;

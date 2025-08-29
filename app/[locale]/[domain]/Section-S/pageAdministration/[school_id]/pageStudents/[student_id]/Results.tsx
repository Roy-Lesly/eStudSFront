import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FeesCheck from './Comps/FeesCheck';
import ResultsEdit from './Comps/ResultsEdit';
import { EdgeResultSecondary, EdgeSchoolFeesSec } from '@/utils/Domain/schemas/interfaceGraphqlSecondary';
import { useTranslation } from 'react-i18next';

const Results = ({ data, fees, params }: { data: EdgeResultSecondary[], fees: EdgeSchoolFeesSec, params: any }) => {
  const { t } = useTranslation("common");
  const [selectedTerm, setSelectedTerm] = useState<{ value: string, label: string }>({ value: `${t("1")}`, label: `${("1st")} ${t("Term")}` });

  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const label = e.target.options[e.target.selectedIndex].text;
    setSelectedTerm({ value, label });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="overflow-x-auto "
    >


      {/* Header Section */}
      <div className="bg-slate-100 flex flex-col gap-4 items-center justify-between md:flex-row p-2 rounded w-full">
        <motion.h1
          className="font-bold text-gray-800 text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {data?.[0]?.node?.student?.customuser?.fullName || "Student Name"}
        </motion.h1>
        <motion.h2
          className="text-gray-700 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          {t("Class")}: {fees?.node?.userprofilesec?.classroomsec?.level}
        </motion.h2>
        <div>
          {t("Year")}: {fees?.node?.userprofilesec?.classroomsec?.academicYear || "N/A"}
        </div>
      </div>




      {/* Table Section */}
      <div className="mb-2 text-black">

        <div className='flex flex-col items-center justify-between md:flex-row'>
          <div
            className="w-full flex font-semibold items-center justify-between mb-2 text-slate-800 text-xl">
            {selectedTerm?.label} - {t("Results")}
          </div>



          <div className="w-32">
            <select
              value={selectedTerm.value}
              onChange={handleSemesterChange}
              className="border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 px-4 py-2 rounded-md shadow-sm text-gray-700 transition"
            >
              <option value="1">{("1st")} {t("Term")}</option>
              <option value="2">{("2nd")} {t("Term")}</option>
              <option value="3">{("3rd")} {t("Term")}</option>
            </select>
          </div>
        </div>


        <FeesCheck
          fees={fees?.node}
          term={parseInt(selectedTerm.value)}
          link={`${params.domain}/Section-S/pageAdministration/${params.school_id}/pageStudents/${params.student_id}`}
        >
          <ResultsEdit
            params={params}
            canEdit={true}
            data={data}
            selectedTerm={selectedTerm.value}
          />
        </FeesCheck>

      </div>

    </motion.div >
  );
};

export default Results;

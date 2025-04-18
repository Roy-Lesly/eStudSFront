'use client';
import React from 'react';
import { motion } from "framer-motion";
import { GrStatusGood } from 'react-icons/gr';
import FormModal from '@/componentsTwo/FormModal';
import { FaPlus } from 'react-icons/fa';
import { EdgeSchoolFees, EdgeTransactions } from '@/Domain/schemas/interfaceGraphql';



const DisplayFees = ({ params, apiSchoolFees, apiTransactions }: { apiSchoolFees: EdgeSchoolFees, apiTransactions: EdgeTransactions[], params?: any,  }) => {
  return (
    <motion.div
    className="bg-slate-50 mb-32 p-4 rounded text-black"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    {/* Student Info */}
    <div className="flex flex-col items-center justify-center text-center">
      <h2 className="font-semibold mb-1 text-lg">
        {apiSchoolFees.node.userprofile.user.firstName} - {apiSchoolFees.node.userprofile.user.matricle}
      </h2>
      <p className="text-gray-600">{apiSchoolFees.node.userprofile.specialty.mainSpecialty.specialtyName}</p>
      <p className="text-gray-600">Academic Year: {apiSchoolFees.node.userprofile.specialty.academicYear}</p>
    </div>

    {/* Tuition Info */}
    <div className="flex flex-col gap-2 mt-4">
      <div className="flex justify-between">
        <span className="font-medium">Level:</span>
        <span>{apiSchoolFees.node.userprofile.specialty.level.level}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium">Tuition:</span>
        <span className="font-semibold text-blue-600">
          {apiSchoolFees.node.userprofile.specialty.tuition.toLocaleString()} F
        </span>
      </div>
    </div>

    {/* Payments Breakdown */}
    <div className="mt-4 space-y-2">
      <div className="flex justify-between">
        <span>1st Payment:</span>
        <span className="font-semibold italic">{apiSchoolFees.node.userprofile.specialty.paymentOne.toLocaleString()} F</span>
      </div>
      <div className="flex justify-between">
        <span>2nd Payment:</span>
        <span className="font-semibold italic">{apiSchoolFees.node.userprofile.specialty.paymentTwo.toLocaleString()} F</span>
      </div>
      <div className="flex justify-between">
        <span>3rd Payment:</span>
        <span className="font-semibold italic">{apiSchoolFees.node.userprofile.specialty.paymentThree.toLocaleString()} F</span>
      </div>
    </div>

    {/* Transactions */}
    <div className="bg-slate-200 font-bold my-4 py-1 rounded text-center">
      All Transactions
    </div>

    <div className="mb-2 space-y-2">
          <motion.div
            className="bg-blue-800 flex font-semibold justify-between px-3 py-2 rounded text-lg text-white"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 15 * 0.1 }}
          >
            <span>No</span>
            <span className="truncate w-2/5">Reason</span>
            <span>Amount</span>
            {/* <span>{item.node.createdAt.slice(2, 10)}</span> */}
          </motion.div>

    </div>

    <div className="space-y-2">
      {apiTransactions && apiTransactions.length ? (
        apiTransactions.map((item: EdgeTransactions, index: number) => (
          <motion.div
            key={item.node.id}
            className="bg-slate-200 flex justify-between odd:bg-blue-100 px-3 py-1 rounded text-sm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <span>{index + 1}</span>
            <span className="truncate w-2/5">{item.node.reason}</span>
            <span>{item.node.amount.toLocaleString()} F</span>
          </motion.div>
        ))
      ) : (
        <div className="text-center text-gray-500">No Fee Transactions</div>
      )}
    </div>

    {/* Total Paid */}
    <div className="flex font-bold justify-between mt-6 text-lg">
      <span>Total Paid:</span>
      <span>{(apiSchoolFees.node.userprofile.specialty.tuition - apiSchoolFees.node.balance).toLocaleString()} F</span>
    </div>

    {/* Balance */}
    <div className="bg-slate-100 flex items-center justify-between mt-4 p-3 rounded">
      <span className="font-medium">Balance:</span>
      <span className="font-semibold text-red-500">
        {(apiSchoolFees.node.balance).toLocaleString()} F
      </span>
    </div>

    {/* Account Status & Action Button */}
    <div className="flex items-center justify-between mt-8">
      <span className="font-medium">Account Status:</span>
      {apiSchoolFees.node.platformPaid ? (
        <GrStatusGood color="green" size={40} />
      ) : (
        <FormModal
          table="platform_charge"
          type="custom"
          params={params}
          icon={<FaPlus />}
          data={apiSchoolFees}
          extra_data={{
            url: `${params.domain}/Section-H/pageStudent/${params.userprofile_id}/${params.specialty_id}/Fees`,
            type: "single",
          }}
          buttonTitle="Activate"
          customClassName="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        />
      )}
    </div>
  </motion.div>
  )
}

export default DisplayFees
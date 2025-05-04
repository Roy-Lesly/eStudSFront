'use client';
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { GrStatusGood } from 'react-icons/gr';
import FormModal from '@/componentsTwo/FormModal';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { EdgeSchoolFees, EdgeTransactions } from '@/Domain/schemas/interfaceGraphql';
import { useTranslation } from 'react-i18next';
import ModalApplication from './ModalApplication';
import { FaArrowRightLong } from 'react-icons/fa6';
import { FiClock } from 'react-icons/fi';


const DisplayFees = ({ params, apiSchoolFees, apiTransactions }: { apiSchoolFees: EdgeSchoolFees, apiTransactions: EdgeTransactions[], params?: any }) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState<boolean>(false)
  const info = JSON.parse(apiSchoolFees?.node?.userprofile?.info)
  const statusMoratoire = info?.moratoire?.status ?? null;

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
        <p className="text-gray-600">{t("Academic Year")}: {apiSchoolFees.node.userprofile.specialty.academicYear}</p>
      </div>

      {/* Tuition Info */}
      <div className="flex flex-col gap-2 mt-4">
        <div className="flex justify-between">
          <span className="font-medium">{t("Level")}:</span>
          <span>{apiSchoolFees.node.userprofile.specialty.level.level}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">{t("Tuition")}:</span>
          <span className="font-semibold text-blue-600">
            {apiSchoolFees.node.userprofile.specialty.tuition.toLocaleString()} F
          </span>
        </div>
      </div>

      {/* Payments Breakdown */}
      <div className="mt-4 space-y-2">
        <div className="flex justify-between">
          <span>{t("First Payment")}:</span>
          <span className="font-semibold italic">{apiSchoolFees.node.userprofile.specialty.paymentOne.toLocaleString()} F</span>
        </div>
        <div className="flex justify-between">
          <span>{t("Second Payment")}:</span>
          <span className="font-semibold italic">{apiSchoolFees.node.userprofile.specialty.paymentTwo.toLocaleString()} F</span>
        </div>
        <div className="flex justify-between">
          <span>{t("Third Payment")}:</span>
          <span className="font-semibold italic">{apiSchoolFees.node.userprofile.specialty.paymentThree.toLocaleString()} F</span>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-slate-200 font-bold my-4 py-1 rounded text-center">
        {t("All Transactions")}
      </div>

      <div className="mb-2 space-y-2">
        <motion.div
          className="bg-blue-800 flex font-semibold justify-between px-3 py-2 rounded text-lg text-white"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 15 * 0.1 }}
        >
          <span>{t("No")}</span>
          <span className="truncate w-2/5">{t("Reason")}</span>
          <span>{t("Amount")}</span>
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
          <div className="text-center text-gray-500">{t("No Fee Transactions")}</div>
        )}
      </div>

      {/* Total Paid */}
      <div className="flex font-bold justify-between mt-6 text-lg">
        <span>{t("Total Paid")}:</span>
        <span>{(apiSchoolFees.node.userprofile.specialty.tuition - apiSchoolFees.node.balance).toLocaleString()} F</span>
      </div>

      {/* Balance */}
      <div className="bg-slate-100 flex items-center justify-between mt-4 p-3 rounded">
        <span className="font-medium">{t("Balance")}:</span>
        <span className="font-semibold text-red-500">
          {(apiSchoolFees.node.balance).toLocaleString()} F
        </span>
      </div>

      {/* Account Status & Action Button */}
      <div className="flex items-center justify-between mt-8">
        <span className="font-medium">{t("Request Moratorium")}:</span>

        {apiSchoolFees?.node?.platformPaid ? (
          apiSchoolFees.node.balance < 1 ? <div className="flex items-center gap-2 text-green-600">
            <GrStatusGood size={40} />
          </div>
            :
            statusMoratoire === "Approved" ? (
              <div className="flex items-center gap-2 text-green-600">
                <GrStatusGood size={28} />
                <span className="text-sm font-semibold">{("Approved")}</span>
              </div>
            )
              :
              statusMoratoire === "Pending" ? (
                <div className="flex items-center gap-2 text-yellow-500">
                  <FiClock size={25} />
                  <span className="text-sm font-semibold">{("Pending")}</span>
                </div>
              ) : statusMoratoire === "Rejected" ? (
                <div className="flex items-center gap-2 text-red-500">
                  <FaTimes color='red' size={25} />
                  <span className="text-sm font-semibold">{("Rejected")}</span>
                </div>
              ) : (
                <button
                  onClick={() => setShowModal(true)}
                  className="p-2 border border-green-500 rounded-full hover:bg-green-50 transition"
                  title="Request Moratorium"
                >
                  <FaArrowRightLong size={22} color="green" />
                </button>
              )
        ) : (
          // Not an activated account
          <div className="flex items-center gap-2 text-red-500">
            <FaTimes size={25} />
            <span className="text-sm font-semibold">{t("Account Inactive")}</span>
          </div>
        )}
      </div>


      {/* Account Status & Action Button */}
      <div className="flex items-center justify-between mt-8">
        <span className="font-medium">{t("Account Status")}:</span>
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
            buttonTitle={t("Activate")}
            customClassName="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          />
        )}
      </div>


      {showModal ? <ModalApplication
        schoolFee={apiSchoolFees?.node}
        onClose={() => setShowModal(false)}
      /> : null}


    </motion.div>
  );
};

export default DisplayFees;

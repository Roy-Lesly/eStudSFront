'use client';
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { GrStatusGood } from 'react-icons/gr';
import { FaTimes } from 'react-icons/fa';
import { EdgeTransactions } from '@/Domain/schemas/interfaceGraphql';
import { useTranslation } from 'react-i18next';
import ModalApplication from '../ModalApplication';
import { FaArrowRightLong } from 'react-icons/fa6';
import { FiClock } from 'react-icons/fi';
import PaymentIDPLAT from '@/components/componentsTwo/formsAdmin/PaymentIDPLAT';
import { capitalizeFirstLetter } from '@/utils/functions';


const DisplayFees = (
  { p, apiFees, apiTransactions, apiMoratoires, section, role }:
  { apiFees: any, apiTransactions: any[], apiMoratoires: any, p?: any, section: "H" | "S" | "P", role: "Parent" | "Student" }
) => {

  const { t } = useTranslation();
  const [showModalType, setShowModalType] = useState<"id" | "platform" | "moratoire" | null>(null)

  const profile = section === "H" ? apiFees?.node?.userprofile 
  : section === "S" ? apiFees?.node?.userprofilesec
  : section === "P" ? apiFees?.node?.userprofileprim
  : null 
  const classInfo = section === "H" ? profile?.specialty
  : section === "S" ? profile?.classroomsec
  : section === "P" ? profile?.classroomprim
  : null 
  const school = section === "H" ? classInfo?.school
  : section === "S" ? classInfo?.school
  : section === "P" ? classInfo?.school
  : null 
  const info = JSON.parse(profile?.infoData)
  const statusMoratoire = info?.moratoire?.status || capitalizeFirstLetter(apiMoratoires?.node?.status);

  return (
    <motion.div
      className="bg-slate-50 mb-32 mt-20 p-4 rounded text-black"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Student Info */}
      <div className="flex flex-col items-center justify-center text-center">
        <h2 className="font-semibold mb-1 text-lg">
          {profile.customuser.firstName} - {profile.customuser.matricle}
        </h2>
        <p className="text-gray-600">{classInfo?.mainSpecialty.specialtyName || classInfo?.level || classInfo?.level}</p>
        <p className="text-gray-600">{t("Academic Year")}: {classInfo?.academicYear}</p>
      </div>

      {/* Tuition Info */}
      <div className="flex flex-col gap-2 mt-4">
        <div className="flex justify-between">
          <span className="font-medium">{t("Level")}:</span>
          <span>{classInfo?.level?.level}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">{t("Tuition")}:</span>
          <span className="font-semibold text-blue-600">
            {classInfo?.tuition.toLocaleString()} F
          </span>
        </div>
      </div>

      {/* Payments Breakdown */}
      <div className="mt-4 space-y-2">
        <div className="flex justify-between">
          <span>{t("First Payment")}:</span>
          <span className="font-semibold italic">{classInfo?.paymentOne.toLocaleString()} F</span>
        </div>
        <div className="flex justify-between">
          <span>{t("Second Payment")}:</span>
          <span className="font-semibold italic">{classInfo?.paymentTwo.toLocaleString()} F</span>
        </div>
        <div className="flex justify-between">
          <span>{t("Third Payment")}:</span>
          <span className="font-semibold italic">{classInfo?.paymentThree.toLocaleString()} F</span>
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
        {apiTransactions && apiTransactions?.length ? (
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
        <span>{(classInfo?.tuition - apiFees.node.balance).toLocaleString()} F</span>
      </div>

      {/* Balance */}
      <div className="bg-slate-100 flex items-center justify-between mt-4 p-3 rounded">
        <span className="font-medium">{t("Balance")}:</span>
        <span className="font-semibold text-red-500">
          {(apiFees.node.balance).toLocaleString()} F
        </span>
      </div>



      {/* Moratoire Status & Action Button */}
      <div className="flex items-center justify-between mt-8">
        <span className="font-medium">{t("Request Moratorium")}:</span>

        {apiFees?.node?.platformPaid ?
          apiFees.node.balance < 1 ? <div className="flex items-center gap-2 text-green-600">
            <GrStatusGood size={40} />
          </div>
            :
            statusMoratoire === "Approved" ? (
              <div className="flex items-center gap-2 text-green-600">
                <GrStatusGood size={28} />
                <span className="text-sm font-semibold">{t("Approved")}</span>
              </div>
            )
              :
              statusMoratoire === "Pending" ?
                <div className="flex items-center gap-2 text-yellow-500">
                  <FiClock size={25} />
                  <span className="text-sm font-semibold">{t("Pending")}</span>
                </div>
              : statusMoratoire === "Rejected" ?
                <div className="flex items-center gap-2 text-red-500">
                  <FaTimes color='red' size={25} />
                  <span className="text-sm font-semibold">{t("Rejected")}</span>
                </div>
              :
                <button
                  onClick={() => setShowModalType("moratoire")}
                  className="p-2 border border-green-500 rounded-full hover:bg-green-50 transition"
                  title="Request Moratorium"
                >
                  <FaArrowRightLong size={22} color="green" />
                </button>
        :
          <div className="flex items-center gap-2 text-red-500">
            <FaTimes size={25} />
            <span className="text-sm font-semibold">{t("Account Inactive")}</span>
          </div>
        }
      </div>


      {/* ID Card Status & Action Button */}
      <div className="flex items-center justify-between mt-8">
        <span className="font-medium">{t("ID Card")}:</span>

        {apiFees?.node?.idPaid ?
          <GrStatusGood size={40} />
          :
          <div className="flex items-center gap-2 text-red-500">
            <FaTimes size={25} />
            <span className="text-sm font-semibold">{t("ID Card Not Paid")}</span>
          </div>
        }
      </div>


      {/* Account Status & Action Button */}
      <div className="flex items-center justify-between mt-8">
        <span className="font-medium">{t("Account Status")}:</span>
        {apiFees.node.platformPaid ? (
          <GrStatusGood color="green" size={40} />
        ) : (
          <button
            onClick={() => setShowModalType("platform")}
            className="text-lg font-medium bg-orange-100 flex p-2 items-center justify-center border gap-2 border-red-500 rounded-full hover:bg-green-50 transition"
          >
            {t("Activate")} <FaArrowRightLong size={22} color="red" />
          </button>
        )}
      </div>


      {showModalType === "moratoire" ? <ModalApplication
        schoolFee={apiFees?.node}
        moratoire={apiMoratoires?.node}
        onClose={() => setShowModalType(null)}
      /> : null}

      {showModalType === "platform" || showModalType === "id" ? <PaymentIDPLAT
        source={"student"}
        setModalOpen={setShowModalType}
        data={[apiFees]}
        title={"single"}
        p={p}
        school={school}
      />
        :
        null}


    </motion.div>
  );
};

export default DisplayFees;

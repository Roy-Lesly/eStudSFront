import React, { useState } from 'react'
import { motion } from 'framer-motion';
import { FaCheckCircle, FaPlus, FaTimesCircle } from 'react-icons/fa';
import { SetTransactions } from '@/Domain/schemas/interfaceGraphql';
import ModalTransaction from './Comps/ModalTransaction';
import { EdgeSchoolFeesPrim, NodeSchoolFeesPrim } from '@/utils/Domain/schemas/interfaceGraphqlPrimary';
import { useTranslation } from 'react-i18next';


const Fees = ({ data, p, schoolFeesPrim }: { data: EdgeSchoolFeesPrim, p: any, schoolFeesPrim: NodeSchoolFeesPrim }) => {
  const [action, setAction] = useState<"create" | "update" | "delete">("create");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { t } = useTranslation("common");

  console.log(data);

  return (
    <motion.div
      className="bg-white mx-auto p-4 rounded-lg shadow-lg text-blue-950 w-full"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.h2
          className="flex font-bold gap-4 items-center justify-center text-2xl text-gray-700"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          {t("Financial Status")} {data?.node?.platformPaid ? <FaCheckCircle color='green' size={33} /> : <FaTimesCircle color='red' size={33} />}
        </motion.h2>
        <motion.div
          className={`px-4 py-2 rounded-lg text-sm font-semibold `}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          whileTap={{ scale: 2 }}
          transition={{ duration: 0.9 }}
        >
          <button onClick={() => { setModalOpen(true); setAction("create") }} className='bg-green-100 p-2 rounded-full'>
            <FaPlus color='green' size={31} />
          </button>
        </motion.div>
      </div>

      {/* Installments */}
      <motion.div
        className="bg-slate-100 flex flex-col gap-2 items-center justify-between md:flex-row md:gap-4 md:p-4 mt-2 p-2 rounded-lg shadow-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className='flex gap-4 justify-center w-full'>
          <span className="font-medium text-gray-700">{t("1st Installment")}</span>
          <span className="font-bold text-red-600">{data.node.userprofileprim.classroomprim.paymentOne.toLocaleString()} F</span>
        </div>
        <div className='flex gap-4 justify-center w-full'>
          <span className="font-medium text-gray-700">{t("2nd Installment")}</span>
          <span className="font-bold text-red-600">{data.node.userprofileprim.classroomprim.paymentTwo.toLocaleString()} F</span>
        </div>
        <div className='flex gap-4 justify-center w-full'>
          <span className="font-medium text-gray-700">{t("3rd Installment")}</span>
          <span className="font-bold text-red-600">{data.node.userprofileprim.classroomprim.paymentThree.toLocaleString()} F</span>
        </div>
      </motion.div>

      {/* Tuition Breakdown */}
      <motion.div
        className="grid grid-cols-1 md:gap-4 md:grid-cols-3 mt-2"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, x: -30 },
          visible: { opacity: 1, x: 0, transition: { delay: 0.2, duration: 0.5 } },
        }}
      >
        {data.node.userprofileprim ? (
          <div
            className="bg-slate-50 flex gap-4 items-center justify-center p-4 rounded-lg shadow-xl"
          >
            <span className="font-medium text-gray-600">{t("Tuition")}</span>
            <span className="font-bold text-lg text-slate-950">
              {data.node.userprofileprim.classroomprim.tuition.toLocaleString()} F
            </span>
          </div>
        ) : null}
        {data.node ? (
          <div
            className="bg-green-50 flex gap-4 items-center justify-center md:p-4 p-2 rounded-lg shadow-xl"
          >
            <span className="font-medium text-gray-600">{t("Paid")}</span>
            <span className="font-bold text-lg text-slate-950">
              {(data.node.userprofileprim.classroomprim.tuition - data.node.balance).toLocaleString()} F
            </span>
          </div>
        ) : null}
        {data.node ? (
          <div
            className="bg-yellow-50 flex gap-4 items-center justify-center md:p-4 p-2 rounded-lg shadow-xl"
          >
            <span className="font-medium text-gray-600">{t("Balance")}</span>
            <span className="font-bold text-lg text-red">
              {data.node.balance.toLocaleString()} F
            </span>
          </div>
        ) : null}
      </motion.div>

      {/* Transaction Table */}
      <motion.div
        className="mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h3 className="font-bold mb-4 text-lg text-slate-700">{t("Transaction History")}</h3>
        <div className="overflow-x-auto">
          <table className="bg-white border border-gray-200 min-w-full">
            <thead className="bg-slate-200">
              <tr>
                <th className="px-4 py-2 text-gray-600 text-left">{t("Reason")}</th>
                <th className="px-4 py-2 text-gray-600 text-left">{t("Amount")}</th>
                <th className="hidden md:flex px-4 py-2 text-gray-600 text-left">{t("Ref")}</th>
                <th className="px-4 py-2 text-gray-600 text-left">{t("Date")}</th>
              </tr>
            </thead>
            <tbody>
              {data.node.transactionsprim?.map((transaction: SetTransactions, index: number) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 * index, duration: 0.5 }}
                  className="border-b"
                >
                  <td className="px-4 py-2 text-gray-700">{transaction.reason}</td>
                  <td className="px-4 py-2 text-gray-800">{transaction.amount.toLocaleString()} F</td>
                  <td className="hidden md:flex px-4 py-2 text-grayflex">{transaction.ref}</td>
                  <td className="px-4 py-2 text-gray-600">{transaction.createdAt.slice(0, 10)}, {transaction.createdAt.slice(11, 16)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {modalOpen && data.node ?
        <ModalTransaction
          action={action}
          setModalOpen={setModalOpen}
          data={data.node}
          p={p}
          schoolFeesPrim={schoolFeesPrim}
        />
        :
        null}

    </motion.div>
  );
};

export default Fees;

'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaMoneyBillWave, FaReceipt, FaEdit } from 'react-icons/fa';
import { decodeUrlID } from '@/functions';
import { gql, useQuery } from '@apollo/client';
import { ApiFactory } from '@/utils/graphql/ApiFactory';
import { useTranslation } from 'react-i18next';
import { EdgeAccount } from '@/utils/Domain/schemas/interfaceGraphql';
import { NodeSchoolFeesPrim } from '@/utils/Domain/schemas/interfaceGraphqlPrimary';


const ModalTransaction = (
  { setModalOpen, data, p, schoolFeesPrim }:
    { setModalOpen: any; data: any, p: any, schoolFeesPrim: NodeSchoolFeesPrim }
) => {
  const [clicked, setClicked] = useState<boolean>(false)
  const [reasons, setReasons] = useState<EdgeAccount[]>([])
  const { t } = useTranslation("common");
  const [canSubmit, setCanSubmit] = useState(true);
  const platformCharges = schoolFeesPrim?.userprofileprim?.classroomprim?.school?.schoolIdentification?.platformCharges || 0
  const idCard = schoolFeesPrim?.userprofileprim?.classroomprim?.school?.schoolIdentification?.idCharges || 0

  const [formData, setFormData] = useState({
    amount: '',
    reason: '',
    paymentMethod: '',
    payerName: '',
    ref: '',
    telephone: null,
    origin: 'admin',
    account: '',
    operator: '',
    status: 'Completed',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { data: reasonsApi, loading, error } = useQuery(GET_ACCOUNTS,
    {
      variables: {
        year: schoolFeesPrim?.userprofileprim?.classroomprim?.academicYear,
        status: true
      }
    }
  );

  console.log(reasonsApi);

  useEffect(() => {
    if (formData.reason === "PLATFORM CHARGES" && parseInt(formData.amount) != platformCharges) {
      setFormData({ ...formData, amount: platformCharges.toString() });
      if (schoolFeesPrim.platformPaid && formData.reason === "PLATFORM CHARGES") {
        alert(t("Account Activated Already"));
        setCanSubmit(false);
      }
    }
    else if (formData.reason === "IDCARD" && parseInt(formData.amount) != idCard) {
      setFormData({ ...formData, amount: idCard.toString() });
      if (schoolFeesPrim.idPaid && formData.reason === "IDCARD") {
        alert(t("Already Paid For ID-CARD"));
        setCanSubmit(false);
      }
    }
    else if (formData.reason !== "IDCARD" && formData.reason !== "PLATFORM CHARGES") {
      setCanSubmit(true);
    }
    if (reasonsApi?.allAccountsPrim?.edges && reasons.length < 1) {
      setReasons(reasonsApi?.allAccountsPrim?.edges)
    }
  }, [formData, reasonsApi])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    if (data?.balance <= 0 && formData.reason === "TUITION") {
      alert("Fee Balance is 0, Can't Add a Payment for tuition");
      return;
    }

    setClicked(true)
    const newData = {
      ...formData,
      schoolfeesprimId: decodeUrlID(data.id),
      amount: parseInt(formData.amount),
      account: formData.reason,
      operationType: "income",
      status: (formData.reason === "PLATFORM CHARGES" || formData.reason === "IDCARD") ? "Pending" : "Completed",
      ref: formData.ref ? formData.ref : new Date().toISOString(),
      delete: false
    }

    await ApiFactory({
      newData: { id: parseInt(decodeUrlID(data?.node?.userprofile.customuser.id)), ...newData, delete: false },
      mutationName: "createUpdateDeleteTransactionPrim",
      modelName: "transactionprim",
      successField: "id",
      query,
      router: null,
      params: p,
      redirect: false,
      reload: true,
      returnResponseField: false,
      redirectPath: ``,
      actionLabel: "processing",
    });
  };

  const PAYMENT_METHODS = ["DIRECT", "BANK"]

  return (
    <motion.div
      className="bg-black bg-opacity-50 fixed flex inset-0 items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white max-w-lg p-6 relative rounded-lg shadow-lg w-full"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="flex font-bold gap-2 items-center text-blue-800 text-lg">

          </h3>
          <button
            onClick={() => setModalOpen(false)}
            className="duration-150 hover:text-red-600 text-gray-500 transition"
          >
            <FaTimes size={20} />
          </button>
        </div>
        <div className="flex items-center justify-center mb-4">
          <h3 className="flex font-bold gap-2 items-center text-2xl text-blue-800">
            <FaMoneyBillWave size={20} />
            {t("New Transaction")}
          </h3>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Reason */}
          <div className="flex gap-4 items-center">
            <FaEdit size={20} className="text-yellow-600" />
            <select
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
              className="border focus:ring-2 focus:ring-blue-500 outline-none px-4 py-2 rounded-lg w-full"
            >
              <option value="">{t("Select Reason")}</option>
              {reasons && reasons?.length ? reasons.map((r: EdgeAccount) => <option key={r.node.name} value={r.node.name}>{r.node.name} {r.node?.year}</option>) : null}
            </select>
          </div>

          {/* Amount */}
          <div className="flex gap-4 items-center">
            <FaMoneyBillWave size={20} className="text-green-600" />
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              placeholder="Enter amount"
              className="border focus:ring-2 focus:ring-blue-500 outline-none px-4 py-2 rounded-lg w-full"
            />
          </div>

          {/* Payment Method */}
          <div className="flex gap-4 items-center">
            <FaReceipt size={20} className="text-blue-600" />
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              required
              className="border focus:ring-2 focus:ring-blue-500 outline-none px-4 py-2 rounded-lg w-full"
            >
              <option value="">{t("Select payment method")}</option>
              {PAYMENT_METHODS.map((pm: string) => (
                <option key={pm} value={pm}>
                  {pm}
                </option>
              ))}            </select>
          </div>

          <div className="flex gap-4 items-center">
            <FaReceipt size={20} className="text-gray-600" />
            <input
              type="text"
              name="ref"
              required
              value={formData.ref}
              onChange={handleChange}
              placeholder="Enter reference (optional)"
              className="border focus:ring-2 focus:ring-blue-500 outline-none px-4 py-2 rounded-lg w-full"
            />
          </div>

          {/* Telephone */}
          {/* <div className="flex gap-4 items-center">
            <FaPhone size={20} className="text-orange-600" />
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              placeholder="Enter telephone (optional)"
              className="border focus:ring-2 focus:ring-blue-500 outline-none px-4 py-2 rounded-lg w-full"
            />
          </div> */}

          {/* Submit Button */}
          <div
            className="flex font-semibold items-center justify-center mt-4 text-center text-white"
          >
            {clicked ? <div
              className="bg-green-600 cursor-pointer duration-150 flex font-semibold hover:bg-green-700 items-center justify-center py-2 rounded-lg text-center text-white transition w-48"
            >
              {t("Submitt...")}
            </div>
              :
              <button
                type="submit"
                className="bg-green-600 duration-150 flex font-semibold hover:bg-green-700 items-center justify-center py-2 rounded-lg text-center text-white transition w-48"
              >
                {t("Submit")}
              </button>}
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ModalTransaction;


const query = gql`
    mutation CreateTransaction(
      $reason: String!
      $schoolfeesprimId: ID!
      $paymentMethod: String!
      $amount: Int!
      $ref: String!
      $telephone: Int
      $payerName: String
      $operator: String
      $origin: String!
      $account: String!
      $status: String!
      $delete: Boolean!
    ) {
      createUpdateDeleteTransactionPrim(
        reason: $reason
        schoolfeesprimId: $schoolfeesprimId
        paymentMethod: $paymentMethod
        amount: $amount
        ref: $ref
        telephone: $telephone
        payerName: $payerName
        operator: $operator
        origin: $origin
        account: $account
        status: $status
        delete: $delete
      ) {
        transactionprim {
          id
          amount
          reason
        }
      }
    }
  `;



const GET_ACCOUNTS = gql`
  query GetAllData (
    $year: String!
  ) {
    allAccountsPrim (
      status: true,
      year: $year
    ) {
      edges {
        node {
          id name year
        }
      }
    }
  }
`;
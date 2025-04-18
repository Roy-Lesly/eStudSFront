'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaMoneyBillWave, FaReceipt, FaEdit } from 'react-icons/fa';
import { decodeUrlID } from '@/functions';
import { gql, useMutation } from '@apollo/client';

const ModalTransaction = ({ setModalOpen, data }: { setModalOpen: any; data: any }) => {

  const [clicked, setClicked] = useState<boolean>(false)

  const [formData, setFormData] = useState({
    amount: '',
    reason: '',
    paymentMethod: '',
    payerName: '',
    ref: '',
    telephone: "0",
    origin: 'admin',
    account: '',
    operator: '',
    status: 'Completed',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const [createTransaction] = useMutation(CREATE_DATA)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClicked(true)
    const newFormData = {
      ...formData,
      schoolfeesId: decodeUrlID(data.id),
      amount: parseInt(formData.amount),
      account: formData.reason,
      operationType: "income",
      delete: false
    }

    try {
      const result = await createTransaction({ variables: newFormData });
      console.log(result, 47)
      const t = result?.data?.createUpdateDeleteTransaction?.transaction
      if (t?.id) {
        alert(`Success creating:, ${t?.reason}-${t?.amount}`)
        window.location.reload()
        setModalOpen(false);;
        setClicked(false)
      };
    } catch (err: any) {
      console.log(err)
      alert(`error creating:, ${err}`);
      setClicked(false)
    }
  };

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
            New Transaction
          </h3>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
              <option value="">Select Reason</option>
              <option value="REGISTRATION">REGISTRATION</option>
              <option value="TUITION">TUITION</option>
              <option value="SCHOLARSHIP">SCHOLARSHIP</option>
              {/* <option value="PLATFORM CHARGES">PLATFORM CHARGES</option> */}
              {/* <option value="ID CHARGES">ID CHARGES</option> */}
            </select>
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
              <option value="">Select payment method</option>
              <option value="DIRECT">DIRECT</option>
              <option value="BANK">BANK</option>
              <option value="MTN">Mobile Money</option>
              <option value="ORANGE">Orange Money</option>
            </select>
          </div>

          <div className="flex gap-4 items-center">
            <FaReceipt size={20} className="text-gray-600" />
            <input
              type="text"
              name="ref"
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
              Submitt...
            </div>
              :
              <button
                type="submit"
                className="bg-green-600 duration-150 flex font-semibold hover:bg-green-700 items-center justify-center py-2 rounded-lg text-center text-white transition w-48"
              >
                Submit
              </button>}
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ModalTransaction;


const CREATE_DATA = gql`
    mutation CreateTransaction(
      $reason: String!
      $schoolfeesId: ID!
      $paymentMethod: String!
      $amount: Int!
      $ref: String!
      $telephone: String
      $payerName: String
      $operator: String
      $origin: String!
      $account: String!
      $status: String!
      $delete: Boolean!
    ) {
      createUpdateDeleteTransaction(
        reason: $reason
        schoolfeesId: $schoolfeesId
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
        transaction {
          id
          amount
          reason
        }
      }
    }
  `;
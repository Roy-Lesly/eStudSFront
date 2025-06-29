'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaMoneyBillWave, FaEdit, FaPhone } from 'react-icons/fa';
import { capitalizeFirstLetter, decodeUrlID } from '@/functions';
import { gql } from '@apollo/client';
import { ApiFactory } from '@/utils/graphql/ApiFactory';
import { useTranslation } from 'react-i18next';
import { EdgeSchoolFees, NodeSchoolHigherInfo } from '@/utils/Domain/schemas/interfaceGraphql';
import MyLoadingModal from '@/components/section-h/common/MyButtons/MyLoadingModal';


const PaymentIDPLAT = (
  { source, setModalOpen, data, p, school, title }:
  { source: "admin" | "student" | "lecturer", setModalOpen: any; data: EdgeSchoolFees[], title: "single" | "multiple", p: any, school: NodeSchoolHigherInfo }
) => {
  
  const [clicked, setClicked] = useState<boolean>(false)
  const { t } = useTranslation("common");
  const platformCharges = school?.schoolIdentification?.platformCharges || 0
  const idCard = school?.schoolIdentification?.idCharges || 0


  const [formData, setFormData] = useState({
    amount: p.item_type === "ID" ? idCard : platformCharges,
    reason: p.item_type === "ID" ? "IDCARD" : "PLATFORM CHARGES",
    telephone: '',
    operator: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setClicked(true)
    const newData = {
      schoolfeesIds: data.map((sf: EdgeSchoolFees) => parseInt(decodeUrlID(sf.node.id.toString())) ),
      amount: data.length * parseInt(formData.amount.toString()),
      phoneNumber: formData.telephone,
      reason: formData.reason,
      origin: source,
      operator: formData.operator,
    }

    console.log(newData);

    // return

    const res = await ApiFactory({
      newData,
      mutationName: "makePaymentTransaction",
      modelName: "payment",
      successField: "success",
      query,
      router: null,
      params: p,
      redirect: false,
      reload: false,
      returnResponseField: true,
      redirectPath: ``,
      actionLabel: "processing",
    });

    if (res) {
      console.log(res);
      window.location.reload();
    }
    setClicked(false);
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
          <h3 className="flex font-bold gap-4 items-center text-2xl text-blue-800">
            <FaMoneyBillWave size={20} />
            {t(capitalizeFirstLetter(title))} {t("Payment")}
          </h3>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Reason */}
          <div className="flex gap-4 items-center">
            <FaEdit size={20} className="text-yellow-600" />
            <select
              name="operator"
              value={formData.operator}
              onChange={handleChange}
              required
              className="border focus:ring-2 focus:ring-blue-500 outline-none px-4 py-2 rounded-lg w-full"
            >
              <option value="">Select Operator</option>
              <option value="MTN">MTN</option>
              <option value="ORANGE">ORANGE</option>
            </select>
          </div>

          {/* Amount */}
          {title === "multiple" ? <span className='flex mt-2 items-center justify-center text-center font-semibold'>{data.length} x {formData.amount} FCFA</span> : null}
          <div className="flex gap-4 items-center">
            <FaMoneyBillWave size={20} className="text-green-600" />
            <input
              type="number"
              name="amount"
              value={data.length * formData.amount}
              onChange={handleChange}
              required
              readOnly
              placeholder="Enter amount"
              className="border focus:ring-2 focus:ring-blue-500 outline-none px-4 py-2 rounded-lg w-full"
            />
          </div>


          {/* Telephone */}
          <div className="flex gap-4 items-center">
            <FaPhone size={20} className="text-orange-600" />
            <input
              type="number"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              placeholder="Enter telephone"
              className="border focus:ring-2 focus:ring-blue-500 outline-none px-4 py-2 rounded-lg w-full"
            />
          </div>

          {/* Submit Button */}
          {formData?.telephone?.length > 8 ? <div
            className="flex font-semibold items-center justify-center mt-4 text-center text-white"
          >
            {clicked ? <div
              className="bg-green-600 cursor-pointer duration-150 flex font-semibold hover:bg-green-700 items-center justify-center py-2 rounded-lg text-center text-white transition w-48"
            >
              <MyLoadingModal />
            </div>
              :
              <button
                type="submit"
                className="bg-green-600 duration-150 flex font-semibold hover:bg-green-700 items-center justify-center py-2 rounded-lg text-center text-white transition w-48"
              >
                Submit
              </button>}
          </div> : null}
        </form>
      </motion.div>
    </motion.div>
  );
};

export default PaymentIDPLAT;


const query = gql`
    mutation CreateTransaction(
      $reason: String!
      $schoolfeesIds: [Int!]!
      $amount: Int!
      $phoneNumber: String!
      $origin: String!
      $operator: String!
    ) {
      makePaymentTransaction(
        reason: $reason
        schoolfeesIds: $schoolfeesIds
        amount: $amount
        phoneNumber: $phoneNumber
        origin: $origin
        operator: $operator
      ) {
        payment {
          id
          success
          message
        }
      }
    }
  `;
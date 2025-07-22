'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FormModal from './componentsTwo/FormModal';
import { FaPlus } from 'react-icons/fa';
import { useParams } from 'next/navigation';
// import ModalTransaction from '@/app/[locale]/[domain]/Section-P/pageAdministration/[school_id]/pageStudents/[student_id]/Comps/ModalTransaction';
import { NodeSchoolFeesPrim } from '@/utils/Domain/schemas/interfaceGraphqlPrimary';


const ActivationErrorPrim = (
  { type, item, link, fees }
    :
    { type: 'platform' | 'id' | "fees", fees: NodeSchoolFeesPrim, item?: string, link?: string }
) => {
  const params = useParams();

  const messages: Record<typeof type, { title: string; description: string; icon: string }> = {
    platform: {
      title: 'Account Inactive!',
      description: 'It seems you have not paid the platform charges.',
      icon: '📴',
    },
    id: {
      title: 'Network Error',
      description: 'There was an issue connecting to the network. Please try again later.',
      icon: '🌐',
    },
    fees: {
      title: 'School Fees',
      description: 'Minimum School fees (Tuition) Expected.',
      icon: '🌐',
    },
  };

  const [showDefault, setShowDefault] = useState<boolean>(true)
  const [showFees, setShowFees] = useState<boolean>(false)
  const [showPlatform, setShowPlatform] = useState<boolean>(false)
  const { title, description, icon } = messages[type];
  const showPage = () => {
    setShowDefault(false)
    if (type === "platform") { setShowPlatform(true); }
    if (type === "fees") { setShowFees(true); }
  }

  return (
    <div className="bg-gray-50 flex items-center justify-center md:py-40 py-28">
      {showDefault ? <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white border border-gray-200 max-w-md p-6 rounded-lg shadow-lg text-center w-full"
      >
        <motion.div
          initial={{ rotate: -10 }}
          animate={{ rotate: 10 }}
          transition={{
            yoyo: Infinity,
            duration: 1.5,
            ease: 'easeInOut',
          }}
          className="mb-4 text-6xl"
        >
          {icon}
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-bold text-2xl text-gray-800"
        >
          {item} {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-2 text-gray-600"
        >
          {description}
        </motion.p>

        {type !== "platform" ? <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex items-center justify-center w-full"
        >
          <button
            onClick={showPage}
            className="bg-blue-500 flex focus:ring focus:ring-blue-300 font-semibold hover:bg-blue-600 justify-center mt-6 px-4 py-2 rounded-lg shadow text-white"
          >
            Pay
          </button>
        </motion.button>
          :
          <div className='flex items-center justify-center'>
            <FormModal
              table='platform_and_id_card_sec'
              type='custom'
              params={params}
              icon={<FaPlus />}
              data={[fees]}
              extra_data={{
                url: `${link ? link : `${params.domain}/Section-H/pageStudent/${params.userprofile_id}/${params.specialty_id}/CA`}`,
                reason: 'platform_charges',
              }}
              buttonTitle={`${('Pay')}`}
              customClassName='flex gap-2 border bg-bluedash mt-6 justify-center text-center items-center w-32 px-4 py-2 rounded text-white font-medium capitalize cursor-pointer'
            /></div>}

      </motion.div>

        :

        showFees ?
        <></>
          // <ModalTransaction
          //   setModalOpen={setShowFees}
          //   p={null}
          //   schoolFeesPrim={fees}
          //   data={fees}
          // />
          :
          showPlatform ?
            <>Platform</>
            :
            null
      }
    </div>
  );
};

export default ActivationErrorPrim;

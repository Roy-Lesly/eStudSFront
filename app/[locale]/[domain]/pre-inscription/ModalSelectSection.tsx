'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { EdgeSchoolIdentification } from '@/utils/Domain/schemas/interfaceGraphql';

type ModalProps = {
  params: any;
  sp: any;
  data: EdgeSchoolIdentification;
  trueCount: number;
};

const ModalSelectSection = ({ params, sp, data, trueCount }: ModalProps) => {
  const { t } = useTranslation('common');
  const router = useRouter();

  const isVisible = trueCount >= 1 && sp?.hide !== 'true';

  const handleSelect = (section: string) => {
    router.push(`/${params.locale}/${params.domain}/pre-inscription/?section=${section}&hide=true`);
  };

  const sections = [
    { key: 'higher', label: t('Section - Higher / University'), condition: data?.node?.hasHigher },
    { key: 'secondary', label: t('Section - Secondary / College'), condition: data?.node?.hasSecondary },
    { key: 'primary', label: t('Section - Primary'), condition: data?.node?.hasPrimary },
    { key: 'vocational', label: t('Section - Vocational Education'), condition: data?.node?.hasVocational },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-900 max-w-lg w-full rounded-2xl shadow-xl m-4 p-6 space-y-6 text-center"
          >
            <h2 className="text-2xl font-bold text-black">
              {t('Select Section For Pre-Enrolment')}
            </h2>

            <div className="grid grid-cols-1 gap-6">
              {sections
                .filter((sec) => sec.condition)
                .map((sec) => (
                  <button
                    key={sec.key}
                    onClick={() => handleSelect(sec.key)}
                    className="px-4 py-4 text-xl font-semibold rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {sec.label}
                  </button>
                ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalSelectSection;

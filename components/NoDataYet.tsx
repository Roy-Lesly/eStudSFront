'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const NoDataYet = () => {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="bg-black bg-opacity-60 flex inset-0 items-center justify-center md:py-40 z-50"
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="bg-white dark:bg-gray-900 flex flex-col gap-4 items-center justify-center max-w-sm p-8 rounded-2xl shadow-2xl text-center w-full"
            >
                <h1 className="dark:text-white font-extrabold text-2xl text-slate-800">
                    {t("No Data Yet")}
                </h1>

            </motion.div>
        </motion.div>
    );
};

export default NoDataYet;

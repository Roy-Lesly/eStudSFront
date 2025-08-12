'use client';
import React from 'react'
import { motion } from 'framer-motion';
import { FaHourglassHalf } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';


const ComingSoon = () => {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="my-10 bg-white flex flex-col gap-2 items-center justify-center p-8 rounded-lg shadow-xl border border-slate-200 text-center"
        >
            <FaHourglassHalf className="animate-spin mb-4 text-6xl text-blue-600" />
            <h1 className="font-bold gray-800 mb-2 text-2xl">{t("Page Coming Soon")}!</h1>
            <p className="text-gray-600 text-lg">
                {t("We're working hard to bring you this page")}
            </p>
            <p className="text-gray-600 text-lg">
                {t("Please check back later for updates")}
            </p>
        </motion.div>
    )
}

export default ComingSoon
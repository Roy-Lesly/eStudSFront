'use client';
import React from 'react'
import { motion } from 'framer-motion';
import { FaHourglassHalf } from 'react-icons/fa';


const ComingSoon = () => {
    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="bg-white flex flex-col gap-2 items-center justify-center p-8 rounded-lg shadow-lg text-center"
        >
            <FaHourglassHalf className="animate-spin mb-4 text-6xl text-blue-600" />
            <h1 className="font-bold gray-800 mb-2 text-2xl">Page Coming Soon!</h1>
            <p className="text-gray-600 text-lg">
                We're working hard to bring you this page.
            </p>
            <p className="text-gray-600 text-lg">
                Please check back later for updates.
            </p>
        </motion.div>
    )
}

export default ComingSoon
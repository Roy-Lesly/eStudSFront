'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const ServerError = ({ type, item }: { type: 'offline' | 'network' | 'server' | 'notFound' | "authentication", item?: string }) => {
  // Messages for each error type
  const { t } = useTranslation()
  const messages: Record<typeof type, { title: string; description: string; icon: string }> = {
    offline: {
      title: 'You are Offline!',
      description: 'It seems your internet connection is lost. Please check your network settings.',
      icon: '📴',
    },
    network: {
      title: 'Network Error',
      description: 'There was an issue connecting to the network. Please try again later.',
      icon: '🌐',
    },
    server: {
      title: 'Server Error',
      description: 'The server encountered an issue. Please contact support if this persists.',
      icon: '⚠️',
    },
    notFound: {
      title: 'Data Not Found',
      description: 'The requested data could not be found. Please check back later.',
      icon: '🔍',
    },
    authentication: {
      title: 'Not Authenticated',
      description: 'Not Allowed to view this page.',
      icon: '🔍',
    },
  };

  const { title, description, icon } = messages[type];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-10 md:py-20 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 max-w-md p-6 rounded-lg shadow-lg text-center w-full transition-colors duration-300"
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
          className="font-bold text-2xl text-gray-800 dark:text-white"
        >
          {item} {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-2 text-gray-600 dark:text-gray-300"
        >
          {description}
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.location.reload()}
          className="bg-blue-500 focus:ring focus:ring-blue-300 font-semibold hover:bg-blue-600 mt-6 px-4 py-2 rounded-lg shadow text-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-400 transition-colors duration-300"
        >
          Retry
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ServerError;

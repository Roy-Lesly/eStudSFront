'use client';

import React from 'react';
import { motion } from 'framer-motion';



const MyTabs = ({ tabs, activeTab, setActiveTab }: { tabs: { label: string; content: React.ReactNode, icon?: any }[], activeTab: number, setActiveTab: any } ) => {

  return (
      <div className="w-full">
        {/* Tabs Navigation */}
        <div className="flex gap-1">
          {tabs.map((tab, index) => (
            <div
              key={index}
              onClick={() => setActiveTab(index)}
              className={`relative flex-1 px-4 py-2 rounded text-center font-medium cursor-pointer ${
                activeTab === index
                  ? 'bg-blue-600 text-white text-lg uppercase tracking-widest font-semibold'
                  : 'bg-blue-100 text-gray-700 hover:bg-blue-950 hover:text-white'
              } focus:outline-none transition duration-300 ease-in-out`}
            >
              
              <span className='flex gap-6 items-center justify-center md:gap-10'>{tab.label} {tab?.icon}</span>
  
              {/* Active Indicator */}
              {activeTab === index && (
                <motion.div
                  layoutId="active-tab-indicator"
                  className="absolute bg-teal-500 bottom-0 h-1 left-0 right-0 rounded-t-md"
                />
              )}
            </div>
          ))}
        </div>
  
        {/* Tabs Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-100 p-4 rounded-b-lg"
        >
          {tabs[activeTab].content}
        </motion.div>
      </div>
    );
};

export default MyTabs
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
// import Image from "next/image";
// import profilePlaceholder from "@/public/profile-placeholder.png";

const ProfilePage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");
//   const [profilePic, setProfilePic] = useState(profilePlaceholder);

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
    //   const imageUrl = URL.createObjectURL(file);
    //   setProfilePic(imageUrl);
    }
  };

  const settingsOptions = [
    { name: "First Name", value: "John" },
    { name: "Last Name", value: "Doe" },
    { name: "Email", value: "john.doe@example.com" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className={`min-h-screen bg-${darkMode ? "gray-900" : "white"} text-${
        darkMode ? "white" : "gray-900"
      } p-6`}
    >
      <div className="bg-gray-100 dark:bg-gray-800 max-w-3xl mx-auto p-6 rounded-lg shadow-lg">
        <h1 className="font-semibold mb-6 text-2xl">Profile Settings</h1>

        {/* Profile Picture */}
        <div className="flex gap-4 items-center mb-6">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="border-4 border-gray-200 dark:border-gray-700 h-24 overflow-hidden relative rounded-full shadow-lg w-24"
          >
            {/* <Image src={profilePic} alt="Profile Picture" layout="fill" objectFit="cover" /> */}
          </motion.div>
          <div>
            <label
              htmlFor="profile-pic"
              className="bg-blue-500 cursor-pointer hover:bg-blue-600 px-4 py-2 rounded-md shadow text-white"
            >
              Change Picture
            </label>
            <input
              type="file"
              id="profile-pic"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>

        {/* Settings Form */}
        <div className="space-y-4">
          {settingsOptions.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex flex-col gap-2"
            >
              <label className="font-medium text-sm">{option.name}</label>
              <input
                type="text"
                value={option.value}
                readOnly
                className="bg-gray-200 dark:bg-gray-700 focus:outline-none px-4 py-2 rounded-md"
              />
            </motion.div>
          ))}
        </div>

        {/* Dark Mode Toggle */}
        <div className="flex gap-4 items-center mt-6">
          <span>Dark Mode</span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setDarkMode(!darkMode)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
  darkMode ? "bg-blue-500 justify-end" : "bg-gray-300 justify-start"
            }`}
          >
            <div className="bg-white h-4 rounded-full shadow-md w-4"></div>
          </motion.button>
        </div>

        {/* Language Dropdown */}
        <div className="mt-6">
          <label className="font-medium text-sm">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-gray-200 dark:bg-gray-700 focus:outline-none mt-2 px-4 py-2 rounded-md w-full"
          >
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
          </select>
        </div>

        {/* More Settings */}
        <div className="mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md shadow text-white w-full"
          >
            More Settings
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;

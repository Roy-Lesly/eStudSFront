import React from "react";
import { motion } from "framer-motion";

const ConfirmLogout = ({showSignOut, setShowSignOut}: any) => {

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("You have been logged out.");
    window.location.reload();
  };

  return (
    <div>
      <button
        onClick={() => setShowSignOut(true)}
        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white"
      >
        Open Modal
      </button>

      {showSignOut && (
        <motion.div
          className="bg-black bg-opacity-80 fixed flex inset-0 items-center justify-center mt-20 mx-2 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-6 rounded-lg shadow-xl w-96"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <h2 className="font-bold mb-4 text-lg">Logout Confirmation</h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to log out?
            </p>

            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowSignOut(false)}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="bg-red hover:bg-red-600 px-4 py-2 rounded-lg text-white"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ConfirmLogout;

import React from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaTrashAlt, FaEye, FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // Import FaEye

const ButtonAction = ({
  type,
  action,
  data,
}: {
  type: 'edit' | 'delete' | 'view' | 'next' | 'previous';
  action: any;
  data: any;
}) => {
  return (
    <>
      {type === 'view' ? (
        <motion.button
          onClick={() => action(data)}
          whileHover={{ scale: 1.3 }}
          whileTap={{ scale: 0.7 }}
          className="bg-green-500 flex hover:bg-green-600 items-center justify-center p-2 rounded-full text-white"
        >
          <FaEye className="" /> {/* Use FaEye for the "view" icon */}
        </motion.button>
      ) : null}

      {type === 'edit' ? (
        <motion.button
          onClick={() => action(data)}
          whileHover={{ scale: 1.3 }}
          whileTap={{ scale: 0.7 }}
          className="bg-blue-500 flex hover:bg-blue-600 items-center justify-center p-2 rounded-full text-white"
        >
          <FaEdit className="" />
        </motion.button>
      ) : null}

      {type === 'delete' ? (
        <motion.button
          onClick={() => action(data)}
          whileHover={{ scale: 1.3 }}
          whileTap={{ scale: 0.7 }}
          className="bg-red flex hover:bg-yellow-700 items-center justify-center p-2 rounded-full text-white"
        >
          <FaTrashAlt className="" />
        </motion.button>
      ) : null}

      {type === 'previous' ? (
        <motion.button
          onClick={() => action(data)}
          whileHover={{ scale: 1.3 }}
          whileTap={{ scale: 0.7 }}
          className="bg-red flex hover:bg-yellow-700 items-center justify-center p-2 rounded-full text-white"
        >
          <FaTrashAlt className="" />
        </motion.button>
      ) : null}

{(type === 'previous' || type === 'next') && (
  <motion.button
    onClick={() => action(data)}
    whileHover={{ scale: 1.3 }}
    whileTap={{ scale: 0.7 }}
    className="bg-green-600 flex hover:bg-yellow-700 items-center justify-center p-2 rounded-full text-white"
  >
    {type === 'previous' ? <FaArrowLeft /> : <FaArrowRight />}
    </motion.button>
)}


    </>
  );
};

export default ButtonAction;

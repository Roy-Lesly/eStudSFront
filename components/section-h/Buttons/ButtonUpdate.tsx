import { useState } from "react";
import { FiRefreshCw } from "react-icons/fi"; // Install with `npm install react-icons`
import { motion } from "framer-motion"; // Install with `npm install framer-motion`



const ButtonUpdate = ({ handleUpdate, dataToSubmit }: { handleUpdate: any, dataToSubmit: any }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true); // Set loading state
    try {
      await handleUpdate(); // Call the update function
    } catch (error) {
      console.error("Error updating data:", error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex justify-center mt-4">
      {dataToSubmit.length > 0 ? (
        <motion.button
          onClick={handleClick}
          className={`flex items-center gap-2 px-4 py-2 text-white font-semibold rounded-lg ${
            isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          } shadow-md transition-colors duration-300`}
          disabled={isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.1 }}
          whileTap={{ scale: isLoading ? 1 : 0.9 }}
        >
          {isLoading ? (
            <>
              <motion.div
                className="animate-spin border-4 border-t-transparent border-white h-5 rounded-full w-5"
                transition={{ duration: 0.5 }}
              ></motion.div>
              Updating...
            </>
          ) : (
            <>
              <FiRefreshCw size={18} />
              Update
            </>
          )}
        </motion.button>
      ) : null}
    </div>
  );
};

export default ButtonUpdate;

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GrClose } from "react-icons/gr";

type ModalProps = {
  component: any;
  openState: boolean;
  onClose: () => void;
  title: string;
  classname: string;
  description?: string;

};

const MyModal: React.FC<ModalProps> = ({
  component,
  openState,
  onClose,
  title,
  classname,
  description
}) => {

  return (
    <AnimatePresence>
      {openState && (
        <motion.div
          className="bg-black bg-opacity-50 fixed flex inset-0 items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`bg-white p-6 relative rounded-lg shadow-lg w-full ${classname ? classname : "max-w-md "}`}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold text-gray-800 text-xl uppercase">{title}</h2>
              <span className="bg-red-300 p-2 rounded-full"><GrClose color="red" size={25} onClick={() => onClose()} /></span>
            </div>
            {description && <p className="mb-4 text-gray-600">{description}</p>}

            <div className="mb-4">
                {component}
            </div>
            
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MyModal;

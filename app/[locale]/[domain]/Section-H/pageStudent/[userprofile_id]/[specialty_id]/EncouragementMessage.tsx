'use client';
import { NodeSchoolFees } from '@/Domain/schemas/interfaceGraphql';
import { motion } from 'framer-motion';

const EncouragementMessage = ({ data }: { data: NodeSchoolFees }) => {
  return (
    <motion.div
      className="bg-gradient-to-r from-indigo-950 mb-6 mt-auto px-4 py-6 rounded-lg shadow-lg text-white to-purple-600"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <motion.span
        className="block font-semibold mb-2 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Dear {data?.userprofile.user.fullName},
      </motion.span>

      <motion.span
        className="block italic mb-2 text-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        We encourage you to keep on going, even when it gets tough.
      </motion.span>

      <motion.span
        className="block italic mb-0 text-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        Learning is a lifelong enriching journey.
      </motion.span>
    </motion.div>
  );
};

export default EncouragementMessage;

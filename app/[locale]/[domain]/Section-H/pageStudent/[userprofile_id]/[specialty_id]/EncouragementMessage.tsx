'use client';

import { NodeSchoolFees } from '@/Domain/schemas/interfaceGraphql';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';


const getInitialIndex = () => {
  const minute = new Date().getMinutes();
  if (minute === 0) return 1;
  const index = Math.ceil(minute / 3);
  return index >= toastMessages.length ? toastMessages.length - 1 : index;
};

const EncouragementMessage = ({ data }: { data: NodeSchoolFees }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
    const [index, setIndex] = useState(getInitialIndex());


    useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % toastMessages.length);
    }, 10000); // 10 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      className="bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-700 text-white rounded-xl shadow-md px-6 py-3 mt-2 w-full cursor-pointer overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      onClick={() => setIsCollapsed(!isCollapsed)}
    >
      <div className="flex items-center justify-between">
        <span className="font-bold text-sm sm:text-base">
          {isCollapsed ? `Hello, ${data?.userprofile?.customuser?.firstName}` : `Hello, ${data?.userprofile?.customuser?.fullName} 👋`}
        </span>
        {isCollapsed ? (
          <ChevronUp className="w-5 h-5 text-white" />
        ) : (
          <ChevronDown className="w-5 h-5 text-white" />
        )}
      </div>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-sm sm:text-base italic text-slate-100 mt-2">
              You're doing amazing! Keep pushing forward, even when it's hard.
            </p>
            <p className="text-sm sm:text-base italic text-slate-200">
              {toastMessages[index]}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EncouragementMessage;




const toastMessages = [
  "You're doing great, keep it up!",
  "Believe in yourself — you've got this!",
  "Every step forward is progress.",
  "Hard work always pays off.",
  "Stay focused. Stay determined.",
  "Your efforts today build your future.",
  "Small steps lead to big success.",
  "Don't give up — you're almost there.",
  "Your discipline is your superpower.",
  "Mistakes are proof that you're learning.",
  "Push through. Growth happens outside comfort zones.",
  "You’re stronger than your challenges.",
  "Be proud of how far you’ve come.",
  "Keep going — success is closer than you think.",
  "Consistency beats talent when talent doesn’t work hard.",
  "Each effort you make counts.",
  "Celebrate progress, no matter how small.",
  "Focus on the goal, not the obstacle.",
  "Learning never stops — embrace it.",
  "Your future self will thank you for today."
];

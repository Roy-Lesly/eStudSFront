'use client';
import { ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


const images = [
  '/images/background/school1.jpg',
  '/images/background/school3.jpg',
  '/images/background/school4.jpg',
];

export default function BackGround(
    {children, width, bgColor}:
    {children: ReactNode, width?: string, bgColor?: string}
) {
  const [index, setIndex] = useState(0);

  // Auto-slide images
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Slideshow */}
      <AnimatePresence>
        <motion.div
          key={images[index]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: `url(${images[index]})` }}
        />
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 -z-10" />

      {/* Children Modal */}

      <div className="flex justify-center items-center h-screen">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`${width ? width : "w-full md:max-w-xl"} ${bgColor ? bgColor : "bg-black/90"}  text-white rounded-xl p-4 md:p-10 m-2 shadow-xl`}
        >
         {children}
        </motion.div>
      </div>

      
    </div>
  );
}

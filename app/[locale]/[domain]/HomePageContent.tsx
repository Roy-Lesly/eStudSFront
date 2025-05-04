'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { protocol, RootApi } from '@/config';
import { EdgeSchoolIdentification } from '@/Domain/schemas/interfaceGraphql';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/LanguageSwitcher';


const HomePageContent = ({
  params,
  data,
}: {
  params: { domain: string, locale: string };
  data: EdgeSchoolIdentification;
}) => {
  const { t } = useTranslation("common");
  const [isDecember, setIsDecember] = useState(false);

  useEffect(() => {
    const currentMonth = new Date().getMonth();
    setIsDecember(currentMonth === 11);
  }, []);

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen ${
        isDecember ? 'bg-gradient-to-r from-red-500 to-pink-600' : 'bg-gradient-to-r from-blue-500 to-teal-500'
      } text-white relative overflow-hidden`}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        {isDecember && <ChristmasBackground />}
      </motion.div>

      <HeaderLinks 
        params={params} 
      />

      <motion.div
        className="md:w-48 mt-2 w-32 z-10"  // Reduced margin-top to mt-2
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <Image
          width={200}
          height={200}
          src={`${protocol + "api" + params.domain + RootApi}/media/${data?.node.logo}`}
          alt="Logo"
          className="rounded-full shadow-lg"
          priority
        />
      </motion.div>

      <motion.div
        className="flex flex-col gap-4 items-center justify-center mt-2 text-center z-10"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="drop-shadow-2xl font-bold md:text-4xl md:w-full my-10 text-2xl text-center text-slate-700 tracking-widest w-[60%]">
          {data?.node.messageOne}
        </h2>
      </motion.div>

      <motion.div
        className="absolute bottom-16 max-w-md w-4/5 z-10"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link
          href={`/${params.domain}/pageAuthentication/Login`}
          className="bg-white block font-semibold hover:bg-blue-100 px-6 py-3 rounded-lg shadow-lg text-blue-600 text-center text-xl tracking-widest uppercase w-full"
        >
          {t('Login')}
        </Link>
      </motion.div>

      <Footer />
    </div>
  );
};



const HeaderLinks = ({ params }: { params: any }) => {
  const { t } = useTranslation("common");

 return ( <motion.div
    className="absolute flex md:gap-10 gap-6 md:text-lg justify-end md:px-20 md:w-[60%] mt-2 px-10 text-black font-medium tracking-wide items-center top-4 w-[80%] z-10"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
  >
    <LanguageSwitcher currentLocale={params?.locale} />
    <Link href={`/${params.domain}/pre-inscription`} className="hover:underline">
    {t('Pre Enrollment')}
    </Link>
  </motion.div>)
};

const ChristmasBackground = () => (
  <AnimatePresence>
    <motion.div
      className="absolute bg-[url('/images/christmas-bg.jpg')] bg-center bg-cover inset-0 opacity-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.2 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2 }}
    />
  </AnimatePresence>
);

const Footer = () => (
  <motion.div
    className="absolute bottom-4 opacity-70 text-black text-xs z-10"
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 0.7 }}
    transition={{ duration: 1 }}
  >
    Main v3.0
  </motion.div>
);

export default HomePageContent;

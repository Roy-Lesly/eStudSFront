'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { protocol, RootApi } from '@/config';
import { EdgeSchoolIdentification, VersionType } from '@/Domain/schemas/interfaceGraphql';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/LanguageSwitcher';
import BackGround from '../pageAuthentication/BackGround';
import ModalUpdateSchoolIdentification from './ModalUpdateSchoolIdentification';
import ModalUpdatesAvailable from '@/components/MyModals/ModalUpdatesAvailable';
import { versionPresent } from '@/utils/constants';
import { FaGear } from 'react-icons/fa6';
import { Pen, PenBox } from 'lucide-react';


const HomePageContent = ({
  params,
  network,
  data,
}: {
  params: any;
  network: boolean;
  data: EdgeSchoolIdentification;
}) => {

  const { t } = useTranslation("common");
  const [isDecember, setIsDecember] = useState(false);

  if (!data?.node?.version) {
    return <div className='flex items-center justify-center h-screen font-bold w-full flex-col gap-4'>
      <div className='flex flex-col rounded-lg shadow-xl p-10 md:p-16 m-4 bg-white gap-6'>
        <span className='text-2xl'>{t("Possible Causes")}</span>
        <div className='flex flex-col gap-2'>
          <span className='text-red text-lg'>- {t("No Data")}</span>
          <span className='text-red text-lg'>- {t("Check Network")}</span>
          <span className='text-red text-lg'>- {t("Invalid Url")}</span>
        </div>
      </div>
    </div>
  }

  const version = data?.node?.version ? JSON.parse(data?.node?.version) : ""
  const [updateExist, setUpdateExist] = useState(version.number > versionPresent);

  if (!data?.node) {
    return <div className='flex flex-col gap-4 font-semibold shadow-lg rounded-lg text-xl items-center justify-center h-screen'>
      <div className='flex flex-col text-slate-600 gap-4 p-4 md:p-6 shadow-2xl bg-white rounded-xl items-center text-center tracking-wide'>
        <span>No School</span>
        <span>Subscribed with this Domain</span>
        <span>Check Network !</span>
        <span className='text-slate-300 text-sm italic'>v2.1.1</span>
      </div>
    </div>
  }
  const { hasHigher, hasSecondary, hasPrimary, hasVocational } = data?.node

  const hspv = [
    hasHigher ? 1 : 0,
    hasSecondary ? 1 : 0,
    hasPrimary ? 1 : 0,
    hasVocational ? 1 : 0
  ];

  useEffect(() => {
    const currentMonth = new Date().getMonth();
    setIsDecember(currentMonth === 11);
  }, []);

  return (
    <BackGround
      width='md:max-w-4xl w-full'
      bgColor='bg-black/70'
    >
      <div
        className={`flex flex-col items-center justify-center text-white gap-4`}
      >
        <HeaderLinks
          params={params}
          hspv={hspv}
        />

        {!updateExist ? <>
          <motion.div
            className="mt-2 md:max-w-4xl w-40 z-10"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            {!network ? <Image
              width={200}
              height={200}
              src={`${protocol + "api" + params.domain + RootApi}/media/${data?.node.logo}`}
              alt="Logo"
              className="rounded-full shadow-lg"
              priority
            /> : null}
          </motion.div>

          <motion.div
            className="flex flex-col gap-4 items-center justify-center mt-2 text-center md:z-10"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h2 className="drop-shadow-2xl font-bold lg:text-4xl w-full mt-4 md:mt-10 text-xl md:text-2xl text-center text-slate-100 tracking-widest">
              {data?.node.messageOne.toUpperCase()}
            </h2>
            <h2 className="drop-shadow-2xl font-bold w-full mb-10 md:text-2xl text-lg text-center text-slate-100 tracking-wider">
              {data?.node.messageTwo.toUpperCase()}
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
        </> : null}

        <Footer
          version={version}
          updateExist={updateExist}
          setUpdateExist={setUpdateExist}
        />

        <ModalUpdateSchoolIdentification
          params={params}
          network={network}
          data={data}
        />


      </div>
    </BackGround>
  );
};



const HeaderLinks = (
  { params, hspv }:
    { params: any, hspv: any }
) => {

  const hspvLabels = ["higher", "secondary", "primary", "vocational"];
  const firstLevel = hspvLabels[hspv.findIndex((v: any) => v === 1)];

  const { t } = useTranslation("common");

  return <motion.div
    className="absolute flex md:gap-10 gap-2 md:text-lg justify-end md:px-10 w-full mt-2 px-4 text-black font-medium tracking-wide items-center top-2 md:top-4 z-1"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
  >
    <div className='flex flex-col md:flex-row gap-6 md:gap-16 items-center rounded px-10 py-2 bg-black/70 text-slate-200 w-full'>
      {params.domain.includes("test") && firstLevel ? <div className='w-full flex justify-center'>
        <Link href={`/${params.locale}/${params.domain}/System-Test/?section=${firstLevel}`} className="flex items-center gap-2 font-semibold rounded bg-white py-1 md:py-2 px-4 text-teal-700">
          <FaGear color='teal' size={26} /> {t('System')}
        </Link>
      </div> : null}
      <div className='flex items-center justify-between gap-4 w-full'>
        <LanguageSwitcher currentLocale={params?.locale} />
        <Link href={`/${params.locale}/${params.domain}/pre-inscription`} className="flex font-semibold rounded bg-white gap-2 py-2 px-4 text-blue-700">
          {/* <Pen color='teal' size={26} /> {t('Pre Enrollment')} */}
          <PenBox color='blue' size={26} /> {t('Pre Enrollment')}
        </Link>
      </div>
    </div>
  </motion.div>
};


const Footer = (
  { version, setUpdateExist, updateExist }:
    { version: VersionType, setUpdateExist: any, updateExist: boolean }
) => {

  if (updateExist) {
    return <ModalUpdatesAvailable
      version={version}
      updateExist={updateExist}
      setUpdateExist={setUpdateExist}
    />
  }

  return <motion.div
    className="absolute bottom-4 opacity-70 text-slate-400 tracking-widest italic text-xs z-10"
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 0.7 }}
    transition={{ duration: 1 }}
  >
    v-{versionPresent}
  </motion.div>
};

export default HomePageContent;

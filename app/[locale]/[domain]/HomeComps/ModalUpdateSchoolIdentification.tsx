import React, { useState } from 'react'
import { motion } from 'framer-motion';
import { EdgeSchoolIdentification } from '@/utils/Domain/schemas/interfaceGraphql';
import { useTranslation } from 'react-i18next';


const ModalUpdateSchoolIdentification = ({
    params, data
}: {
    params: any, data: EdgeSchoolIdentification
}) => {

    const { t } = useTranslation("common");
    const exist = (data?.node?.id && data?.node?.logo && data?.node?.name && data?.node?.messageOne) ? true : false

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: true ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity ${!exist ? 'visible' : 'invisible'
                }`}
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: true ? 1 : 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-white max-w-2xl text-black p-4 rounded-lg shadow-lg w-full"
            >
                <div className="flex items-center gap-4 text-xl justify-between flex-col font-bold">

                    <span className='text-3xl'>{t("Complete School Identification Information")}</span>
                    {!data?.node?.name ? <span>{t("Bad or Poor Network - Retry")}</span> : null}
                    {!data?.node?.name ? <span>{t("School Name Missing")}</span> : null}
                    {!data?.node?.logo ? <span>{t("School Logo Missing")}</span> : null}
                    {!data?.node?.messageOne ? <span>{t("School Message Missing")}</span> : null}
                    {!data?.node?.supportNumberOne ? <span>{t("School Telephone Missing")}</span> : null}
                    {!data?.node?.supportNumberOne ? <span className='text-2xl my-2 text-green-600'>{t("Contact System Administrator")}</span> : null}
                </div>

            </motion.div>
        </motion.div>
    )
}

export default ModalUpdateSchoolIdentification

'use client';
import PaymentIDPLAT from '@/components/componentsTwo/formsAdmin/PaymentIDPLAT';
import { EdgeSchoolFees, NodeSchoolHigherInfo } from '@/utils/Domain/schemas/interfaceGraphql';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaArrowRightLong } from 'react-icons/fa6';
import { GrClose } from 'react-icons/gr';

const PaymentStatus = (
    { school, params, apiSchoolFees }:
    { school: NodeSchoolHigherInfo, params: any, apiSchoolFees: EdgeSchoolFees }
) => {
    const [showModalType, setShowModalType] = useState<"id" | "platform" | "moratoire" | null>(null)
    const { t } = useTranslation("common")

    return (
        <div className='flex flex-col gap-10 items-center justify-center pt-16 text-[18px] text-black'>
            <div className="flex gap-2 items-center">
                <span className='font-bold text-xl'>Status</span>
                <span className="bg-red p-2 rounded-full"><GrClose size={28} color="white" width={10} /></span>
            </div>
            <span className='font-bold px-10 text-center text-xl'>{t("Activate Account to Access Results")}</span>
            <button
                onClick={() => setShowModalType("platform")}
                className="text-lg font-medium bg-orange-100 flex p-2 items-center justify-center border gap-2 border-red-500 rounded-full hover:bg-green-50 transition"
            >
                {t("Activate")} <FaArrowRightLong size={22} color="red" />
            </button>

            {showModalType === "platform" || showModalType === "id" ? <PaymentIDPLAT
                source={"student"}
                setModalOpen={setShowModalType}
                data={[apiSchoolFees]}
                title={"single"}
                p={params}
                school={school}
            />
                :
                null}

        </div>
    );
}

export default PaymentStatus;

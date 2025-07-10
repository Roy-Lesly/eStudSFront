import { protocol, RootApi } from '@/utils/config';
import Image from 'next/image';
import React from 'react';
import { useTranslation } from 'react-i18next';

const HeaderForm = (
    { p, logoCampus, qrCodeDataUrl, page, title, titleName }:
        { p: any, logoCampus: any, qrCodeDataUrl: string, page: string, title: string, titleName: string }
) => {

    const { t } = useTranslation("common");


    return (
        <div className="w-full flex flex-row items-center justify-center text-center space-y-2">

            <div className="w-1/5 flex items-center justify-center">
                <Image
                    src={`${protocol}api${p.domain}${RootApi}/media/${logoCampus}`}
                    width={100}
                    height={100}
                    alt="Logo"
                    className="bg-gray-100 rounded"
                />
            </div>

            <div className="flex flex-col w-3/5">
                <h1 className="text-3xl font-bold text-slate-800">{t(page)} Form</h1>
                <p className="text-sm text-gray-600">
                    {t("Below is your Pre-Enrolment Summary. Save or print this page for your records")}.
                </p>
                <span className="text-xl font-semibold text-teal-600">
                    {t(titleName)}: {title}
                </span>
            </div>

            <div className="w-1/5 flex items-center justify-center">
                {qrCodeDataUrl.length ? <Image
                    src={qrCodeDataUrl}
                    width={100}
                    height={100}
                    alt="Logo"
                    className=""
                /> : null}
            </div>

        </div>
    );
}

export default HeaderForm;

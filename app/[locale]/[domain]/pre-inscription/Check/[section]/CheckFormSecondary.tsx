'use client';
import React, { useEffect, useState } from 'react';
import { removeEmptyFields } from '@/functions';
import { EdgePreInscription } from '@/utils/Domain/schemas/interfaceGraphql';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';


const CheckFormSecondary = ({ data, p, sp }: { data: EdgePreInscription[]; p: any; sp: any }) => {
    const { t } = useTranslation('common');
    const [clicked, setClicked] = useState(false);
    const [searching, setSearching] = useState(false);
    const [foundPreInscriptionLength, setFoundPreInscriptionLength] = useState(-1);
    const router = useRouter();

    const [formData, setFormData] = useState({
        telephone: sp?.telephone || ""
    })

    const updateVal = (val: string) => {
        if (val) {
            setFormData({ ...formData, telephone: val })
        }
    }

    const onSubmit = () => {
        setClicked(true);
        setSearching(true);
        const queryString = new URLSearchParams(removeEmptyFields(formData)).toString();
        router.push(`/${p.locale}/${p.domain}/pre-inscription/Check/secondary?${queryString}`);
    };

    useEffect(() => {
        if (clicked && data && data.length > 1) {
            console.log("39");
            setFoundPreInscriptionLength(data.length);
            setSearching(false);
            return;
        }

        if (clicked && data && data.length === 0) {
            console.log("46");
            setFoundPreInscriptionLength(0);
            setSearching(false);
        }
    }, [data, searching, clicked, formData.telephone, sp?.telephone]);


    useEffect(() => {
        if (clicked) {
            if (formData.telephone && data && data.length === 1) {
                console.log("57");
                const status = data[0].node.admissionStatus;
                const routeBase = `/${p.locale}/${p.domain}/pre-inscription/Check/secondary`;
                const activeTelephone = formData.telephone || sp?.telephone || "";

                if (status) {
                    router.push(`${routeBase}/Admitted/?telephone=${activeTelephone}`);
                } else {
                    router.push(`${routeBase}/Registered/?telephone=${activeTelephone}`);
                }

                setSearching(false);
                setClicked(false);
                return;
            } else {
                setClicked(false)
            }
        }
    }, [data])



    return (
        <div className="max-w-lg mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 mt-12">
            <h1 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-6">
                {t('Check Your Admission Status')}
            </h1>
            <p className="text-center text-gray-700 dark:text-gray-300 mb-8 px-6 text-lg leading-relaxed">
                {t('Enter your telephone number to verify your pre-enrollment or admission status')}.
            </p>

            <form className="flex flex-col gap-6 px-4">
                <label>{t('Telephone')}</label>
                <input
                    name="telephone"
                    defaultValue={sp?.telephone || ''}
                    type="text"
                    onChange={(e) => updateVal(e.target.value)}
                    className="border px-3 py-2 rounded border-gray-300 dark:border-gray-700 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-200"
                />

                <button
                    className={`p-2 rounded-md text-white flex items-center justify-center`}
                    type='button'
                    disabled={clicked}
                    onClick={() => onSubmit()}
                >
                    {clicked ?
                        <span className="animate-spin border-bluedash border-6 border-t-transparent flex h-[34px] rounded-full w-[34px]">.</span>
                        :
                        <span className="border-blue-400 bg-blue-700 px-6 py-2 font-medium rounded-lg border flex">Search</span>
                    }
                </button>

                {foundPreInscriptionLength > 1 && (
                    <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg p-5 text-center font-semibold mt-4">
                        <p>{t('Multiple results found')}.</p>
                        <p>{t('Please provide more details')}.</p>
                    </div>
                )}

                {foundPreInscriptionLength === 0 && (
                    <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg p-5 text-center font-semibold mt-4">
                        <p>{t('No results found')}.</p>
                        <p>{t('Please check your information and try again')}.</p>
                    </div>
                )}
            </form>
        </div>
    );
};

export default CheckFormSecondary;

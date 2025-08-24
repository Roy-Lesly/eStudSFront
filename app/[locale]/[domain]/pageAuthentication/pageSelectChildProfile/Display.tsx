'use client';

import { EdgeCustomUser, EdgeSchoolFees, NodeCustomUser } from '@/utils/Domain/schemas/interfaceGraphql';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    GraduationCap,
} from 'lucide-react';
import { EdgeSchoolFeesSec } from '@/utils/Domain/schemas/interfaceGraphqlSecondary';
import { EdgeSchoolFeesPrim } from '@/utils/Domain/schemas/interfaceGraphqlPrimary';
import DisplayChildProfile from './DisplayChildProfile';

const Display = (
    { dataUsers, dataH, dataS, dataP, p, dataYears }:
        { dataUsers: EdgeCustomUser[], dataH: EdgeSchoolFees[], dataS: EdgeSchoolFeesSec[], dataP: EdgeSchoolFeesPrim[]; p: any, dataYears: string[] | any }
) => {

    const { t } = useTranslation('common');
    const [selectedChild, setSelectedChild] = useState<NodeCustomUser | null>(null)

    if (!dataUsers?.length) {
        return (
            <div className="flex items-center justify-center min-h-[40vh] text-center px-4 sm:px-6 md:px-10 lg:px-20">
                <p className="text-red-600 font-semibold text-sm sm:text-base md:text-lg">
                    {t('No Children Found. Please contact administration')}.
                </p>
            </div>
        );
    }

    return (
        // <div className={`${selectedChild ? "h-full" : "h-screen"} flex justify-center p-4`}>
        <div className={`h-full flex justify-center p-4`}>
            <div className='flex flex-col w-full mt-2 max-w-xl rounded-lg shadow-xl gap-6 p-4 bg-white justify-center'>

                {!selectedChild?.id ? <>
                    <span className='bg-white shadow-xl border border-slate-50 rounded flex items-center justify-center py-3 text-2xl font-bold tracking-widest italic'>
                        {t("Select A Child")}
                    </span>

                    {dataUsers?.map(({ node }) => (
                        <div
                            key={node.id}
                            onClick={() => setSelectedChild(node)}
                            className="bg-gradient-to-tr from-indigo-100 to-sky-300 dark:from-slate-700 dark:to-slate-900 border border-slate-200 dark:border-slate-700 w-full rounded-xl shadow-lg"
                        >
                            <div className="hover:shadow-xl transition-all duration-300 cursor-pointer p-6 md:p-8 space-y-3">
                                <div className="flex items-center gap-4 text-indigo-800 dark:text-indigo-300 font-semibold text-base sm:text-lg">
                                    <GraduationCap className="w-5 h-5" />
                                    {node?.fullName || t('No Full Name')}
                                </div>
                            </div>
                        </div>
                    ))}</>
                    
                    :
                    
                    <DisplayChildProfile
                        selectedChild={selectedChild}
                        setSelectedChild={setSelectedChild}
                        dataH={dataH}
                        dataS={dataS}
                        dataP={dataP}
                        dataYears={dataYears}
                        p={p}
                    />
                }

            </div>
        </div>
    )
};

export default Display;

'use client';

import { EdgeSchoolFees } from '@/utils/Domain/schemas/interfaceGraphql';
import { decodeUrlID } from '@/utils/functions';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    GraduationCap,
    Calendar,
    Layers,
    BookText,
    CheckCircle2,
    XCircle,
} from 'lucide-react';
import { EdgeSchoolFeesSec } from '@/utils/Domain/schemas/interfaceGraphqlSecondary';
import { EdgeSchoolFeesPrim } from '@/utils/Domain/schemas/interfaceGraphqlPrimary';

const Display = (
    { dataH, dataS, dataP, p }:
    { dataH: EdgeSchoolFees[], dataS: EdgeSchoolFeesSec[], dataP: EdgeSchoolFeesPrim[]; p: any }
) => {

    console.log(dataH);
    console.log(dataS);
    console.log(dataP);

    const { t } = useTranslation('common');
    const router = useRouter();

    if (!dataH?.length && !dataS?.length && !dataP?.length) {
        return (
            <div className="flex items-center justify-center min-h-[40vh] text-center px-4 sm:px-6 md:px-10 lg:px-20">
                <p className="text-red-600 font-semibold text-sm sm:text-base md:text-lg">
                    {t('No profiles found. Please contact administration')}.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full mt-6 mb-12 px-4 sm:px-6 md:px-10 lg:px-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {dataH.map(({ node }) => (
                <div
                    key={node.id}
                    onClick={() =>
                        router.push(
                            `/${p.domain}/Section-H/pageStudent/${decodeUrlID(node?.userprofile?.id)}/${decodeUrlID(
                                node?.userprofile.specialty.id
                            )}`
                        )
                    }
                    className="p-3 bg-white shadow-lg rounded-2xl"
                >
                    <div className="bg-gradient-to-tr from-indigo-100 to-sky-300 dark:from-slate-700 dark:to-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer p-5 md:p-6 space-y-3">
                        <div className="flex items-center gap-3 text-indigo-800 dark:text-indigo-300 font-semibold text-base sm:text-lg">
                            <GraduationCap className="w-5 h-5" />
                            {node?.userprofile.specialty?.mainSpecialty.specialtyName || t('No Specialty')}
                        </div>

                        {/* Academic Year */}
                        <div className="flex items-center gap-2 text-slate-800 dark:text-gray-300">
                            <Calendar className="w-4 h-4" />
                            <span className="font-medium">{t('Academic Year')}:</span>{' '}
                            {node?.userprofile.specialty?.academicYear}
                        </div>

                        {/* Level */}
                        <div className="flex items-center gap-2 text-slate-700 dark:text-gray-300">
                            <Layers className="w-4 h-4" />
                            <span className="font-medium">{t('Level')}:</span>{' '}
                            {node?.userprofile.specialty?.level?.level || t('N/A')}
                        </div>

                        {/* Program */}
                        <div className="flex items-center justify-between gap-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                            <div className='flex gap-2'>
                                <BookText className="w-4 h-4" />
                                <span className="font-medium">{t('Program')}:</span>{' '}
                                {node?.userprofile.program?.name || t('N/A')}
                            </div>
                            <div className="flex items-center gap-2">
                                {node?.platformPaid ? (
                                    <span className="flex items-center gap-1 text-green-600 font-medium">
                                        <CheckCircle2 className="w-5 h-5" />
                                        <span>Active</span>
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-red-600 font-medium">
                                        <XCircle className="w-5 h-5" />
                                        <span>Unpaid</span>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            
            {dataS?.map(({ node }) => (
                <div
                    key={node.id}
                    onClick={() =>
                        router.push(
                            `/${p.domain}/Section-S/pageStudent/${decodeUrlID(node?.userprofilesec?.id)}/${decodeUrlID(
                                node?.userprofilesec?.classroomsec.id
                            )}`
                        )
                    }
                    className="p-3 bg-white shadow-lg rounded-2xl"
                >
                    <div className="bg-gradient-to-tr from-indigo-100 to-sky-300 dark:from-slate-700 dark:to-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer p-5 md:p-6 space-y-3">
                        <div className="flex items-center gap-3 text-indigo-800 dark:text-indigo-300 font-semibold text-base sm:text-lg">
                            <GraduationCap className="w-5 h-5" />
                            {node?.userprofilesec?.classroomsec?.cycle || t('No Classroom')}
                        </div>

                        {/* Academic Year */}
                        <div className="flex items-center gap-2 text-slate-800 dark:text-gray-300">
                            <Calendar className="w-4 h-4" />
                            <span className="font-medium">{t('Academic Year')}:</span>{' '}
                            {node?.userprofilesec?.classroomsec?.academicYear}
                        </div>

                        {/* Level */}
                        <div className="flex items-center gap-2 text-slate-700 dark:text-gray-300">
                            <Layers className="w-4 h-4" />
                            <span className="font-medium">{t('Level')}:</span>{' '}
                            {node?.userprofilesec?.classroomsec?.level || t('N/A')}
                        </div>

                        {/* Program */}
                        <div className="flex items-center justify-between gap-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                            <div className='flex gap-2'>
                                <BookText className="w-4 h-4" />
                                <span className="font-medium">{t('Program')}:</span>{' '}
                                {node?.userprofilesec?.program?.name || t('N/A')}
                            </div>
                            <div className="flex items-center gap-2">
                                {node?.platformPaid ? (
                                    <span className="flex items-center gap-1 text-green-600 font-medium">
                                        <CheckCircle2 className="w-5 h-5" />
                                        <span>Active</span>
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-red-600 font-medium">
                                        <XCircle className="w-5 h-5" />
                                        <span>Unpaid</span>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            
            {dataP?.map(({ node }) => (
                <div
                    key={node.id}
                    onClick={() =>
                        router.push(
                            `/${p.domain}/Section-P/pageStudent/${decodeUrlID(node?.userprofileprim?.id)}/${decodeUrlID(
                                node?.userprofileprim?.classroomprim.id
                            )}`
                        )
                    }
                    className="p-3 bg-white shadow-lg rounded-2xl"
                >
                    <div className="bg-gradient-to-tr from-indigo-100 to-sky-300 dark:from-slate-700 dark:to-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer p-5 md:p-6 space-y-3">
                        <div className="flex items-center gap-3 text-indigo-800 dark:text-indigo-300 font-semibold text-base sm:text-lg">
                            <GraduationCap className="w-5 h-5" />
                            {node?.userprofileprim?.classroomprim?.option || t('No Classroom')}
                        </div>

                        {/* Academic Year */}
                        <div className="flex items-center gap-2 text-slate-800 dark:text-gray-300">
                            <Calendar className="w-4 h-4" />
                            <span className="font-medium">{t('Academic Year')}:</span>{' '}
                            {node?.userprofileprim?.classroomprim?.academicYear}
                        </div>

                        {/* Level */}
                        <div className="flex items-center gap-2 text-slate-700 dark:text-gray-300">
                            <Layers className="w-4 h-4" />
                            <span className="font-medium">{t('Level')}:</span>{' '}
                            {node?.userprofileprim?.classroomprim?.level || t('N/A')}
                        </div>

                        {/* Program */}
                        <div className="flex items-center justify-between gap-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                            <div className='flex gap-2'>
                                <BookText className="w-4 h-4" />
                                <span className="font-medium">{t('Program')}:</span>{' '}
                                {node?.userprofileprim?.programprim || t('N/A')}
                            </div>
                            <div className="flex items-center gap-2">
                                {node?.platformPaid ? (
                                    <span className="flex items-center gap-1 text-green-600 font-medium">
                                        <CheckCircle2 className="w-5 h-5" />
                                        <span>Active</span>
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-red-600 font-medium">
                                        <XCircle className="w-5 h-5" />
                                        <span>Unpaid</span>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

        </div>
    );
};

export default Display;

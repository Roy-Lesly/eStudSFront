import { EdgeSchoolFees, NodeCustomUser } from '@/utils/Domain/schemas/interfaceGraphql';
import { EdgeSchoolFeesPrim } from '@/utils/Domain/schemas/interfaceGraphqlPrimary';
import { EdgeSchoolFeesSec } from '@/utils/Domain/schemas/interfaceGraphqlSecondary';
import { decodeUrlID, getAcademicYear } from '@/utils/functions';
import { Calendar, CheckCircle2, GraduationCap, Layers, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaArrowLeftLong } from 'react-icons/fa6';

const DisplayChildProfile = (
    { dataH, dataS, dataP, selectedChild, setSelectedChild, p, sp, dataYears }:
        { dataH: EdgeSchoolFees[], dataS: EdgeSchoolFeesSec[], dataP: EdgeSchoolFeesPrim[], selectedChild: NodeCustomUser, setSelectedChild: any, p: any, sp: any, dataYears: string[] }
) => {

    const { t } = useTranslation("common");
    const router = useRouter();
    const [selectedYear, setSelectedYear] = useState<string>(getAcademicYear())
    const [profileH, setProfileH] = useState<EdgeSchoolFees[]>()
    const [profileS, setProfileS] = useState<EdgeSchoolFeesSec[]>()
    const [profileP, setProfileP] = useState<EdgeSchoolFeesPrim[]>()

    useEffect(() => {
        if (selectedYear.length && selectedChild?.id) {
            setProfileH(
                dataH?.filter(
                    (item: EdgeSchoolFees) =>
                        item.node.userprofile.specialty.academicYear === selectedYear &&
                        item.node.userprofile.customuser.id == selectedChild.id
                )
            );
        }
        if (selectedYear?.length && selectedChild?.id) {
            setProfileS(
                dataS?.filter(
                    (item: EdgeSchoolFeesSec) =>
                        item.node.userprofilesec.classroomsec.academicYear === selectedYear &&
                        item.node.userprofilesec.customuser.id == selectedChild.id
                )
            );
        }
        if (selectedYear?.length && selectedChild?.id) {
            setProfileP(
                dataP?.filter(
                    (item: EdgeSchoolFeesPrim) =>
                        item.node.userprofileprim.classroomprim.academicYear === selectedYear &&
                        item.node.userprofileprim.customuser.id == selectedChild.id
                )
            );
        }

    }, [selectedYear])


    return (
        <div className='flex flex-col items-center justify-center gap-4'>
            <button
                className='flex gap-4 items-center rounded-lg bg-orange-100 shadow-lg text-xl font-bold px-6 py-3 text-black'
                onClick={() => setSelectedChild(null)}
            >
                <FaArrowLeftLong size={30} color='red' /> {t("Back")}
            </button>

            <span className='text-xl font-bold mt-4'>
                {selectedChild?.fullName}
            </span>

            <select
                value={selectedYear}
                className='px-10 text-lg font-semibold flex my-2 py-2 items-center justify-center'
                onChange={(e: any) => setSelectedYear(e.target.value)}
            >
                {dataYears?.map((year: string) => <option key={year} value={year}>{year}</option>)}
            </select>

            {!profileH?.length && !profileS?.length && !profileP?.length ?
                <div className="flex flex-col items-center justify-center min-h-[40vh] text-center px-4 sm:px-6 md:px-10 lg:px-20">
                    <p className="text-red-600 font-semibold text-sm sm:text-base md:text-lg">
                        {t('No profiles found')}.
                    </p>
                    <p className="text-red-600 font-semibold text-sm sm:text-base md:text-lg">
                        {t('Please contact administration')}.
                    </p>
                </div>
                :
                <div className='flex flex-col space-y-4'>
                    {profileH?.map(({ node }) => (
                        <div
                            key={node.id}
                            onClick={() =>
                                router.push(
                                    `/${p.domain}/Section-H/pageParent/${decodeUrlID(node?.userprofile?.id)}/${decodeUrlID(node?.userprofile.specialty.id)}`
                                )
                            }
                            className="w-full px-4 py-2 rounded-xl bg-gradient-to-tr from-indigo-100 to-sky-300 dark:border-slate-700 transition-all duration-300 cursor-pointer  dark:to-slate-900 border border-slate-200 dark:from-slate-700 shadow-2xl hover:shadow-xl "
                        >
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 justify-between text-xl">
                                    <div className="flex items-center justify-between gap-2 text-slate-700 dark:text-gray-300">
                                        <Layers className="w-4 h-4" />
                                        <span className="font-medium">{t('Level')}:</span>{' '}
                                        {node?.userprofile.specialty?.level?.level || t('N/A')}
                                    </div>
                                    <div className="flex items-center gap-2 text-lg">
                                        {node?.platformPaid ? (
                                            <span className="flex items-center gap-1 text-green-600 font-medium">
                                                <CheckCircle2 className="w-5 h-5" />
                                                <span>Active</span>
                                            </span>
                                        ) : (
                                            <span className="flex items-center text-red font-semibold gap-1 text-red-600">
                                                <XCircle className="w-5 h-5 " />
                                                <span>Unpaid</span>
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Academic Year */}
                                <div className="flex items-center gap-2 text-slate-800 dark:text-gray-300">
                                    <Calendar className="w-4 h-4" />
                                    <span className="font-medium">{t('Academic Year')}:</span>{' '}
                                    {node?.userprofile.specialty?.academicYear}
                                </div>

                                <div className="flex items-center gap-3 text-indigo-800 dark:text-indigo-300 font-semibold text-base sm:text-lg">
                                    <GraduationCap className="w-5 h-5" />
                                    {node?.userprofile.specialty?.mainSpecialty.specialtyName || t('No Specialty')}
                                </div>

                            </div>
                        </div>
                    ))}

                    {profileS?.map(({ node }) => (
                        <div
                            key={node.id}
                            onClick={() =>
                                router.push(
                                    `/${p.domain}/Section-S/pageParent/${decodeUrlID(node?.userprofilesec?.id)}/${decodeUrlID(
                                        node?.userprofilesec?.classroomsec.id
                                    )}`
                                )
                            }
                            className="px-4 py-2 bg-orange-200 border border-slate-200 hover:shadow-xl transition-all duration-300 cursor-pointer shadow-lg rounded-2xl"
                        >
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-indigo-800 font-semibold text-base sm:text-lg">
                                    <GraduationCap className="w-5 h-5" />
                                    <span className="font-medium">{t('Class')}:</span>{' '}
                                    {node?.userprofilesec?.classroomsec?.level || t('N/A')}
                                </div>


                                <div className="flex items-center gap-2 justify-between text-xl">
                                    <div className="flex items-center gap-2 text-slate-800">
                                        <Calendar className="w-4 h-4" />
                                        <span className="font-medium">{t('Year')}:</span>{' '}
                                        {node?.userprofilesec?.classroomsec?.academicYear}
                                    </div>
                                    <div className="flex items-center gap-2 text-lg">
                                        {node?.platformPaid ? (
                                            <span className="flex items-center gap-1 text-green-600 font-medium">
                                                <CheckCircle2 className="w-5 h-5" />
                                                <span>Active</span>
                                            </span>
                                        ) : (
                                            <span className="flex items-center text-red font-semibold gap-1 text-red-600">
                                                <XCircle className="w-5 h-5 " />
                                                <span>Unpaid</span>
                                            </span>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}

                    {profileP?.map(({ node }) => (
                        <div
                            key={node.id}
                            onClick={() =>
                                router.push(
                                    `/${p.domain}/Section-S/pageParent/${decodeUrlID(node?.userprofileprim?.id)}/${decodeUrlID(
                                        node?.userprofileprim?.classroomprim.id
                                    )}`
                                )
                            }
                            className="px-4 py-2 bg-orange-200 border border-slate-200 hover:shadow-xl transition-all duration-300 cursor-pointer shadow-lg rounded-2xl"
                        >
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-indigo-800 font-semibold text-base sm:text-lg">
                                    <GraduationCap className="w-5 h-5" />
                                    <span className="font-medium">{t('Class')}:</span>{' '}
                                    {node?.userprofileprim?.classroomprim?.level || t('N/A')}
                                </div>


                                <div className="flex items-center gap-2 justify-between text-xl">
                                    <div className="flex items-center gap-2 text-slate-800">
                                        <Calendar className="w-4 h-4" />
                                        <span className="font-medium">{t('Year')}:</span>{' '}
                                        {node?.userprofileprim?.classroomprim?.academicYear}
                                    </div>
                                    <div className="flex items-center gap-2 text-lg">
                                        {node?.platformPaid ? (
                                            <span className="flex items-center gap-1 text-green-600 font-medium">
                                                <CheckCircle2 className="w-5 h-5" />
                                                <span>Active</span>
                                            </span>
                                        ) : (
                                            <span className="flex items-center text-red font-semibold gap-1 text-red-600">
                                                <XCircle className="w-5 h-5 " />
                                                <span>Unpaid</span>
                                            </span>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}

                </div>
            }


        </div>
    );
}

export default DisplayChildProfile;

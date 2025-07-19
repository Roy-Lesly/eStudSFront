import MyInputField from '@/MyInputField';
import { JwtPayload } from '@/serverActions/interfaces';
import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';
import { SECONDARY_LEVEL_CHOICES_ENGLISH, SECONDARY_LEVEL_CHOICES_FRENCH, SECONDARY_LEVEL_OBJECT_ENGLISH, SECONDARY_LEVEL_OBJECT_FRENCH } from '@/utils/dataSource';
import { gql, useLazyQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';

interface FormData {
    level: string;
    academicYear: string;
    stream: string;
    system: string;
}

const ModalSelectProperties = (
    { setOpenModal, params, apiYears }:
        { setOpenModal: any, params: any, apiYears: any }
) => {
    const { t } = useTranslation();
    const router = useRouter();
    const [count, setCount] = useState<number>(0)

    const [formData, setFormData] = useState<FormData>({
        level: '',
        academicYear: '',
        stream: '',
        system: params?.locale === "fr" ? "FRENCH" : "ENGLISH",
    });

    const [getClassrooms, { data: classroomsData, loading: loadingClassrooms }] = useLazyQuery(GET_CLASSROOM_SEC_QUERY);

console.log(classroomsData?.allClassroomsSec?.edges);

    useEffect(() => {
        const { academicYear, level, stream, system } = formData;

        const allSelected = academicYear?.length && level?.length && stream?.length && system?.length > 0;

        console.log( academicYear,
                    level,
                    stream,);
        if (allSelected && count === 0) {
            getClassrooms({
                variables: {
                    academicYear,
                    level,
                    stream
                },
            });
            setCount(1);
        }
    }, [formData.academicYear, formData.level, formData.stream, formData.system, count]);

console.log(loadingClassrooms);
    useEffect(() => {
        if (count == 1 && !loadingClassrooms && !classroomsData?.allClassroomsSec?.edges?.length) {
            alert(t("No Class found For these Infos"));
        }
        setCount(count + 1)
    }, [ classroomsData, loadingClassrooms ])


    const handleChange = <K extends keyof FormData>(field: K, value: FormData[K]) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        setCount(0)
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setCount(0)
        if (!window.confirm(t('Are you sure you want to proceed?'))) return;
        router.push(`/${params.locale}/${params.domain}/Section-S/pageAdministration/${params.school_id}/pageAcademics/pageSubjects/assign/?classId=${classroomsData?.allClassroomsSec?.edges[0].node.id}`)
    };


    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: true ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity ${true ? 'visible' : 'invisible'}`}
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: true ? 1 : 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-white max-w-lg p-6 rounded-lg shadow-lg w-full"
            >
                <div className="flex items-center justify-between">
                    {/* <h2 className="font-semibold text-2xl">{t(actionType)?.toUpperCase()}</h2> */}
                    <button onClick={() => { setOpenModal(false) }} className="font-bold text-xl">
                        <FaTimes color='red' />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-2">

                    <div className='flex flex-row gap-2 justify-between'>
                        <MyInputField
                            id="system"
                            name="system"
                            label={t("Select System")}
                            type="select"
                            placeholder={t("Select System")}
                            value={formData.system}
                            options={["ENGLISH", "FRENCH"].map((item: string) => item)}
                            onChange={(e) => handleChange('system', e.target.value)}
                        />
                    </div>

                    <div className='flex flex-row gap-2 justify-between'>
                        <MyInputField
                            id="stream"
                            name="stream"
                            label={t("Select Section")}
                            type="select"
                            placeholder={t("Select Section")}
                            value={formData.stream}
                            options={["GENERAL", "TECHNICAL", "COMMERCIAL"].map((item: string) => item)}
                            onChange={(e) => handleChange('stream', e.target.value)}
                        />
                    </div>

                    <div className='flex flex-row gap-2 justify-between'>
                        <MyInputField
                            id="level"
                            name="level"
                            label={t("Select Level")}
                            type="select"
                            placeholder={t("Select Level")}
                            value={formData.level}
                            options={(formData.system === "ENGLISH" ? SECONDARY_LEVEL_CHOICES_ENGLISH : SECONDARY_LEVEL_CHOICES_FRENCH).map((item: string) => item)}
                            onChange={(e) => handleChange('level', e.target.value)}
                        />
                    </div>

                    <div className='flex flex-row gap-2 justify-between'>
                        <MyInputField
                            id="academicYear"
                            name="academicYear"
                            label={t("Select Academic Year")}
                            type="select"
                            placeholder={t("Select academicYear")}
                            value={formData.academicYear}
                            options={apiYears?.map((item: string) => item)}
                            onChange={(e) => handleChange('academicYear', e.target.value)}
                        />
                    </div>

                    {
                        (classroomsData?.allClassroomsSec?.edges.length) ?
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                className="bg-blue-600 font-bold hover:bg-blue-700 mt-6 px-6 py-2 rounded-md shadow-md text-lg text-white tracking-wide transition w-full"
                            >
                                {t("Proceed")}
                            </motion.button>
                            :
                            null}
                </form>
            </motion.div>
        </motion.div>
    )
}

export default ModalSelectProperties


export const GET_CLASSROOM_SEC_QUERY = gql`
    query 
        GetData(
            $academicYear: String!,
            $level: String!,
            $stream: String!
        ) {
            allClassroomsSec(
                academicYear: $academicYear,
                level: $level,
                stream: $stream
            ) {
                edges {
                    node {
                        id level academicYear stream cycle
                    }
                }
            }
        }

`


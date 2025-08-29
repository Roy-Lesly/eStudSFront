import MyInputField from '@/MyInputField';
import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';
import { gql, useLazyQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { EdgeClassRoomSec, EdgeSeries } from '@/utils/Domain/schemas/interfaceGraphqlSecondary';
import { decodeUrlID } from '@/utils/functions';
import MySelectField from '@/components/MySelectField';
import { MultiValue, SingleValue } from 'react-select';
import { LoaderIcon } from 'react-hot-toast';

type OptionType = { value: string | number; label: string };


interface FormData {
    level: string;
    academicYear: string;
    stream: string;
    seriesId: string;
    system: string;
}

const ModalSelectProperties = (
    { setOpenModal, params, apiYears, apiLevels, apiSeries }:
        { setOpenModal: any, params: any, apiYears: any, apiLevels: string[], apiSeries: EdgeSeries[] }
) => {

    const { t } = useTranslation();
    const router = useRouter();
    const [count, setCount] = useState<number>(0)
    const [filteredSeries, setFilteredSeries] = useState<EdgeSeries[]>()
    const [loading, setLoading] = useState<Boolean>(false)

    const [formData, setFormData] = useState<FormData>({
        level: '',
        academicYear: '',
        stream: '',
        seriesId: '0',
        system: params?.locale === "fr" ? "FRENCH" : "ENGLISH",
    });

    const [getClassrooms, { data: classroomsData, loading: loadingClassrooms }] = useLazyQuery(GET_CLASSROOM_SEC_QUERY);

    useEffect(() => {
        const { academicYear, level, stream, system } = formData;
        const allSelected = academicYear?.length && level?.length && stream?.length && system?.length > 0;
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
        if (formData?.level?.length > 1) {
            const fil = apiSeries?.filter((item: EdgeSeries) => item.node.level === formData.level);
            setFilteredSeries(fil || []); // <-- save it to state
        } else {
            setFilteredSeries([]);
        }
    }, [formData.academicYear, formData.level, formData.stream, formData.system, count]);

    useEffect(() => {
        if (count == 1 && !loadingClassrooms && !classroomsData?.allClassroomsSec?.edges?.length) {
            alert(t("No Class found For these Infoss"));
        }
        setCount(count + 1)
    }, [classroomsData, loadingClassrooms])

    useEffect(() => {
        if (filteredSeries && formData?.seriesId && filteredSeries?.length < 1) {
            setFormData({
                ...formData,
                seriesId: ""
            })
        }
        setCount(count + 1)
    }, [formData.level])


    const handleChange = <K extends keyof FormData>(field: K, value: FormData[K]) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        setCount(0)
    };

    const handleSeriesChange = (e: SingleValue<OptionType>) => {
        setFormData({
            ...formData,
            seriesId: e?.value?.toString() || ""
        })
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setCount(0);
        const fil = classroomsData.allClassroomsSec.edges.find(
            (cls: EdgeClassRoomSec) =>
                cls.node.academicYear === formData.academicYear &&
                cls.node.level === formData.level
        );
        if (fil?.node?.id && !window.confirm(t('Are you sure you want to proceed?'))) return;
        setLoading(true)
        router.push(`/${params.locale}/${params.domain}/Section-S/pageAdministration/${params.school_id}/pageAcademics/pageSubjects/assign/?classId=${decodeUrlID(fil.node.id)}&seriesId=${formData.seriesId}`)
    };

    const returnSeries = (seriesId: string) => {
        const s = filteredSeries?.find((item: EdgeSeries) => decodeUrlID(item.node.id) === seriesId)
        return s ? { value: formData?.seriesId, label: s?.node.name } : null
    }


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
                    <button onClick={() => { setOpenModal(false) }} className="font-bold text-xl">
                        <FaTimes color='red' />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-2">

                    {/* <div className='flex flex-row gap-2 justify-between'>
                        <MyInputField
                            id="system"
                            name="system"
                            label={t("System")}
                            type="select"
                            placeholder={t("Select System")}
                            value={formData.system}
                            options={[params.locale === "fr" ? "FRENCH" : "ENGLISH"].map((item: string) => item)}
                            onChange={(e) => handleChange('system', e.target.value)}
                        />
                    </div> */}

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
                            options={(formData.system === "ENGLISH" ? apiLevels.slice(0, 7) : apiLevels.slice(7, 14)).map((item: string) => item)}
                            onChange={(e) => handleChange('level', e.target.value)}
                        />
                        {formData?.level?.length > 2 && formData?.system && filteredSeries?.length ? <MySelectField
                            id="seriesId"
                            isMulti='select-single'
                            name="seriesId"
                            label={t("Select Series")}
                            placeholder={t("Select Series")}
                            value={returnSeries(formData.seriesId)}
                            options={(filteredSeries || []).map((item: EdgeSeries) => ({
                                value: decodeUrlID(item.node.id),
                                label: item.node.name
                            }))}
                            onChange={(e) => handleSeriesChange(e as SingleValue<OptionType>)}
                        /> : null}
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
                        loading ?
                            <LoaderIcon />
                            :
                            formData?.seriesId && classroomsData?.allClassroomsSec?.edges.length ?
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    className="bg-blue-600 font-bold hover:bg-blue-700 mt-6 px-6 py-2 rounded-md shadow-md text-lg text-white tracking-wide transition w-full"
                                >
                                    {t("Proceed")}
                                </motion.button>
                                :
                                null
                    }
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


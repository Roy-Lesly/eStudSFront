'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    XCircle,
    CheckCircle2,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { decodeUrlID } from '@/utils/functions';
import { useRouter } from 'next/navigation';
import { gql, useLazyQuery } from '@apollo/client';
import { EdgeMainSubjectSec, NodeSeries } from '@/utils/Domain/schemas/interfaceGraphqlSecondary';
import { ApiFactory } from '@/utils/graphql/ApiFactory';
import MyInputField from '@/components/MyInputField';
import MySelectField from '@/components/MySelectField';
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6';

interface Props {
    p: any;
    sp: any;
    isOpen: boolean;
    actionType: "create" | "update" | "delete";
    apiLevel: string[];
    onClose: () => void;
    selectedSeries?: NodeSeries | null;
}

export const ModalSeries = ({
    p,
    isOpen,
    onClose,
    selectedSeries,
    actionType,
    apiLevel,
}: Props) => {

    const { t } = useTranslation("common");
    const router = useRouter();
    const section = p?.locale === "fr" ? [7, 15] : [0, 7]

    const [formData, setFormData] = useState({
        name: selectedSeries ? selectedSeries.name : '',
        level: selectedSeries ? selectedSeries.level : '',
    });

    useEffect(() => {
        if (selectedSeries) {
            setFormData({
                name: selectedSeries.name?.toString() || '',
                level: selectedSeries.level || '',
            });
        } else {
            setFormData({ name: '', level: '', });
        }
    }, [selectedSeries]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const deleteData = () => {
        const confirmed = window.confirm("Are you sure you want to delete this item ?");
        if (confirmed) {
            handleSubmit(true);
        }
    }

    const [listSubjectsInSeries, setListSubjectsInSeries] = useState<EdgeMainSubjectSec[] | undefined>(selectedSeries?.mainsubjects?.edges)
    const [listSubjectsInDB, setListSubjectsInDB] = useState<EdgeMainSubjectSec[]>()
    const [filteredSubjects, setFilteredSubjects] = useState<EdgeMainSubjectSec[]>(); // 👈 new state
    const [getMainSubjects, { loading, data: mainSubjectsData }] = useLazyQuery(GET_MAIN_SUBJECTS);
    const [searchText, setSearchText] = useState<string>();

    useEffect(() => {
        if (selectedSeries?.mainsubjects?.edges) {
            setListSubjectsInSeries(selectedSeries?.mainsubjects?.edges);
        }
        if (mainSubjectsData) {
            setListSubjectsInDB(mainSubjectsData?.allMainSubjectSec?.edges);
        }
    }, [selectedSeries, mainSubjectsData])

    useEffect(() => {
        if (!listSubjectsInDB || !mainSubjectsData || !searchText) {
            getMainSubjects();
        }
        if (searchText && searchText?.length > 1) {
            getMainSubjects({
                variables: {
                    subjectName: searchText,
                }
            });
        }
    }, [searchText])

    useEffect(() => {
        if (listSubjectsInDB) {
            const filtered = listSubjectsInDB?.filter(
                (dbSubj) =>
                    !listSubjectsInSeries?.some((seriesSubj) => seriesSubj.node.id === dbSubj.node.id)
            );
            setFilteredSubjects(filtered);
        }
    }, [listSubjectsInSeries, listSubjectsInDB]);

    console.log(filteredSubjects?.length);


    const handleSubmit = async (deleteFlag = false) => {

        const mainsubjectsIds = listSubjectsInSeries?.map((s: EdgeMainSubjectSec) => parseInt(decodeUrlID(s.node.id)));

        if (!mainsubjectsIds || mainsubjectsIds?.length < 1) {
            alert(t("Please Select atleast 1 Subject"));
            return;
        }

        const newData = {
            name: formData.name?.toUpperCase(),
            level: formData.level?.toUpperCase(),
            mainsubjectsIds: mainsubjectsIds,
            delete: deleteFlag,
        };

        let res: any = newData
        if (selectedSeries?.id) {
            res = {
                ...res,
                id: parseInt(decodeUrlID(selectedSeries.id.toString())),
            }
        }

        await ApiFactory({
            newData: res,
            editData: res,
            mutationName: "createUpdateDeleteSeries",
            modelName: "series",
            successField: "id",
            query,
            router,
            params: p,
            redirect: false,
            reload: true,
            redirectPath: ``,
            actionLabel: selectedSeries?.id ? "updating" : "creating",
        });

        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white rounded-xl shadow-xl w-full md:max-w-3xl p-6 space-y-2 overflow-y-auto"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.9 }}
                    >
                        <div className="flex justify-between">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                {selectedSeries ? (
                                    <>
                                        <FileText size={20} /> {t("Edit Series")}
                                    </>
                                ) : (
                                    <>
                                        <FileText size={20} /> {t("New Series")}
                                    </>
                                )}
                            </h2>
                            <button
                                onClick={onClose}
                                className="flex items-center p-1 bg-red-200 rounded-full "
                            >
                                <XCircle size={22} />
                            </button>
                        </div>

                        <div className="space-y-2">

                            <div className='w-full gap-2 flex'>
                                <MyInputField
                                    id="name"
                                    label="Series Name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder={t("Enter Series Name")}
                                />
                                <MySelectField
                                    id="name"
                                    label="Select Class"
                                    name="name"
                                    value={{ value: formData.level, label: formData.level }}
                                    onChange={(e: any) => setFormData({ ...formData, level: e.value })}
                                    placeholder={t("Select Class")}
                                    options={apiLevel.slice(section[0], section[1]).map((lev: string) => { return { value: lev, label: lev } })}
                                />
                            </div>
                        </div>


                        <div className="mt-2 text-semibold text-black tracking-wider">
                            <label className="block font-medium text-sm mb-1">{t("Subjects")}</label>
                            <div className="flex gap-2">

                                {/* Left: Available subjects */}
                                <div className="w-1/2 border p-1 rounded">
                                    <div className="flex flex-col justify-between items-center mb-2">
                                        {/* <h3 className="font-semibold text-sm w-full px-2 pb-2">{t("Available Subjects")}</h3> */}
                                        <input
                                            type="text"
                                            value={searchText}
                                            onChange={e => setSearchText(e.target.value)}
                                            className="text-xs px-2 py-1 border border-teal-800 bg-teal-50 rounded w-full"
                                            placeholder="Search..."
                                        />
                                    </div>
                                    <div className="max-h-48 overflow-y-auto space-y-1">
                                        {/* {listSubjectsInDB && listSubjectsInDB */}
                                        {filteredSubjects && filteredSubjects
                                            .filter(subj => subj?.node.subjectName.toLowerCase().includes(searchText ? searchText.toLowerCase() : ""))
                                            // .slice(0, 10)
                                            .map(subj => (
                                                <li key={subj?.node.id} className="flex justify-between items-center border p-1 rounded">
                                                    <div className='flex justify-between'>
                                                        <span className='text-left mr-2'>{subj?.node?.subjectCode}</span>
                                                        <span className='text-left'>{subj?.node.subjectName}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            setSearchText("");
                                                            // setListSubjectsInDB(prev => (prev ?? []).filter(s => s.node.id !== subj.node.id));
                                                            setListSubjectsInSeries(prev => {
                                                                const exists = (prev ?? []).some(s => s.node.id === subj.node.id);
                                                                return exists ? prev : [...(prev ?? []), subj];
                                                            });
                                                        }}
                                                        className="text-green-500 hover:text-green-700"
                                                        title="Add"
                                                    >
                                                        <FaArrowRightLong size={25} color='green' />
                                                    </button>
                                                </li>
                                            ))}
                                    </div>
                                </div>



                                {/* Right: Series subjects */}
                                <div className="w-1/2 border p-2 rounded">
                                    <h3 className="font-semibold text-sm mb-2">{t("Series Subjects")} - {listSubjectsInSeries?.length}</h3>
                                    <ul className="space-y-1">
                                        {!loading && listSubjectsInSeries ? listSubjectsInSeries.map((subj: EdgeMainSubjectSec) => (
                                            <li key={subj.node.id} className="flex justify-between items-center border p-1 rounded">
                                                <div className='flex justify-between'>
                                                    <span className='text-left mr-2'>{subj?.node?.subjectCode}</span>
                                                    <span className='text-left'>{subj?.node.subjectName}</span>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setSearchText("");
                                                        setListSubjectsInSeries(prev => (prev ?? []).filter(s => s.node.id !== subj.node.id));
                                                        // setListSubjectsInDB(prev => {
                                                        //     const exists = (prev ?? []).some(s => s.node.id === subj.node.id);
                                                        //     return exists ? prev : [...(prev ?? []), subj];
                                                        // });
                                                    }}
                                                    className="text-red-500 hover:text-red-700"
                                                    title="Remove"
                                                >
                                                    <FaArrowLeftLong size={25} color='red' />
                                                </button>
                                            </li>
                                        )) : null}
                                    </ul>
                                </div>



                                {listSubjectsInSeries && listSubjectsInSeries?.length > 10 ? <div className='md:flex items-center hidden'>
                                    <button
                                        onClick={() => handleSubmit()}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                    >
                                        <CheckCircle2 size={18} /> {selectedSeries ? 'Update' : 'Submit'}
                                    </button>
                                </div> : null}



                            </div>
                        </div>


                        <div className="flex justify-between gap-3 pt-4">
                            {actionType === "delete" ? <button
                                onClick={deleteData}
                                className="flex items-center bg-red gap-2 px-4 py-2 bg-red-500 rounded hover:bg-gray-400 text-sm text-white"
                            >
                                <XCircle size={18} /> {t("Delete")}
                            </button>
                                :
                                (formData.name?.length && formData.level?.length) ? <button
                                    onClick={() => handleSubmit()}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                >
                                    <CheckCircle2 size={18} /> {selectedSeries ? 'Update' : 'Submit'}
                                </button> : null
                            }


                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};



const query = gql`
  mutation Create(
    $id: ID
    $name: String!
    $level: String!
    $mainsubjectsIds: [ID!]!
    $delete: Boolean!
  ) {
    createUpdateDeleteSeries (
        id: $id
        name: $name
        level: $level
        mainsubjectsIds: $mainsubjectsIds
        delete: $delete
    ) {
      series {
        id
      }
    }
  }
`;


const GET_MAIN_SUBJECTS = gql`
  query GetData(
      $subjectName: String
  ) {
      allMainSubjectSec (
        subjectName: $subjectName
      ) {
          edges {
              node {
                  id subjectName subjectCode
              }
          }
      }
  }`;
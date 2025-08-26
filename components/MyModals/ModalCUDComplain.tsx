import React, { useState } from 'react'
import { motion } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';
import { gql } from '@apollo/client';
import { JwtPayload } from '@/serverActions/interfaces';
import { capitalizeFirstLetter, decodeUrlID } from '@/functions';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';
import { ApiFactory } from '@/utils/graphql/ApiFactory';
import { EdgeComplainPrim, NodeUserProfilePrim } from '@/utils/Domain/schemas/interfaceGraphqlPrimary';
import { EdgeComplain, NodeCustomUser, NodeUserProfile } from '@/utils/Domain/schemas/interfaceGraphql';
import { EdgeComplainSec, NodeUserProfileSec } from '@/utils/Domain/schemas/interfaceGraphqlSecondary';


function isNodePrim(
    profile: NodeUserProfilePrim | NodeUserProfileSec | NodeUserProfile | undefined,
    complain: EdgeComplain | EdgeComplainSec | EdgeComplainPrim | null
): profile is NodeUserProfilePrim {
    if (complain) { return (complain as EdgeComplainPrim) !== undefined; }
    else { return (profile as NodeUserProfilePrim) !== undefined; }
}

function isNodeSec(
    profile: NodeUserProfilePrim | NodeUserProfileSec | NodeUserProfile | undefined,
    complain: EdgeComplain | EdgeComplainSec | EdgeComplainPrim | null
): profile is NodeUserProfileSec {
    if (complain) { return (complain as EdgeComplainSec) !== undefined; }
    else { return (profile as NodeUserProfileSec) !== undefined; }
}

function isNodeHigher(
    profile: NodeUserProfilePrim | NodeUserProfileSec | NodeUserProfile | undefined,
    complain: EdgeComplain | EdgeComplainSec | EdgeComplainPrim | null
): profile is NodeUserProfile {
    if (complain) { return (complain as EdgeComplain) !== undefined; }
    else { return (profile as NodeUserProfile) !== undefined; }
}


const ModalCUDComplain = ({
    source, actionType, selectedItem, setOpenModal, params, section, apiComplainNames, profile
}: {
    source: "teacher" | "student" | "admin", params: any, actionType: "update" | "create" | "delete", selectedItem: EdgeComplain | EdgeComplainSec | EdgeComplainPrim | null, setOpenModal: any, section: "Higher" | "Secondary" | "Primary",
    apiComplainNames: string[], profile?: NodeUserProfile | NodeUserProfileSec | NodeUserProfilePrim
}) => {

    const { t } = useTranslation();
    const token = localStorage.getItem('token');
    const user: JwtPayload = jwtDecode(token ? token : "");
    // const student: NodeCustomUser | null = selectedItem?.node?.userprofile ? selectedItem?.node?.userprofile?.customuser : null;
    const [resolve, setResolve] = useState(false);

    console.log(profile);

    const [formData, setFormData] = useState(() => {
        let userprofileId = parseInt(decodeUrlID(profile?.id || "")) || 0;
        let userprofilesecId = parseInt(decodeUrlID(profile?.id || "")) || 0;
        let userprofileprimId = parseInt(decodeUrlID(profile?.id || "")) || 0;
        let campusId;


        if (section === "Primary" && isNodePrim(profile, selectedItem)) {
            campusId = parseInt(decodeUrlID(profile?.classroomprim?.school?.id))
        } else if (section === "Secondary" && isNodeSec(profile, selectedItem)) {
            campusId = parseInt(decodeUrlID(profile?.classroomsec?.school?.id))
        } else if (section === "Higher" && isNodeHigher(profile, selectedItem)) {
            campusId = parseInt(decodeUrlID(profile?.specialty?.school?.id))
        }
        if (source === "admin") {
            return {
                customuserId: user?.user_id,
                message: selectedItem?.node.message || '',
                complainType: selectedItem?.node.complainType || '',
                endingAt: selectedItem?.node.endingAt || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                campusId: parseInt(params?.school_id || "0"),
                status: false,
                deleted: false,
                delete: actionType === 'delete',
            }
        }

        return {
            message: selectedItem?.node.message || '',
            complainType: selectedItem?.node.complainType || '',
            endingAt: selectedItem?.node.endingAt || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            userprofileprimId,
            userprofilesecId,
            userprofileId,
            campusId,
            status: false,
            deleted: false,
            delete: actionType === 'delete',
        };
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData?.message.length < 10) {
            alert(`${t("Expecting Minimum of 10 Characters")}`)
            return
        }
        if (!apiComplainNames || !apiComplainNames?.includes(formData?.complainType)) {
            alert(`${t("Select Category")}`)
            return
        }

        let dataToSubmit: any = {
            ...formData,
            endingAt: new Date(formData.endingAt).toISOString().slice(0, 10),
            delete: actionType === "delete"
        }
        if (actionType === "create") {
            dataToSubmit = {
                ...dataToSubmit,
                updatedById: user.user_id,
            }
        }
        if ((actionType === "update" || actionType === "delete") && selectedItem) {
            dataToSubmit = {
                ...dataToSubmit,
                id: parseInt(decodeUrlID(selectedItem.node.id)),
                updatedById: user.user_id,
            }
        }
        if ((formData.deleted) && selectedItem) {
            dataToSubmit = {
                ...dataToSubmit,
                deletedById: user.user_id,
            }
        }
        if (resolve && selectedItem) {
            dataToSubmit = {
                ...dataToSubmit,
                status: true,
                resolvedById: user.user_id,
            }
        }

        await ApiFactory({
            newData: dataToSubmit,
            editData: dataToSubmit,
            mutationName: section === "Secondary" ? "createUpdateDeleteComplainSec" : section === "Primary" ? "createUpdateDeleteComplainPrim" : "createUpdateDeleteComplain",
            modelName: section === "Secondary" ? "complainsec" : section === "Primary" ? "complainprim" : "complain",
            successField: "id",
            query: section === "Secondary" ? querySec : section === "Primary" ? queryPrim : queryHigher,
            router: null,
            params,
            redirect: false,
            reload: true,
            returnResponseField: false,
            redirectPath: ``,
            actionLabel: "processing",
        });
    };

    const canPerformAction = () => {
        console.log(selectedItem);
        if (!selectedItem) return true
        if (selectedItem) {
            if (!selectedItem.node.status) return true;
        }
        return false
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center text-black font-medium justify-center bg-black bg-opacity-50"
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-white m-2 max-w-2xl w-full p-4 rounded-xl shadow-xl space-y-2"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{t(actionType).toUpperCase()}</h2>
                    <button onClick={() => setOpenModal(false)}>
                        <FaTimes className="text-red-600" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    {source === "admin" && selectedItem ? (
                        <div className='w-full items-center rounded-lg bg-teal-600 shadow-2xl p-4 gap-2 text-white flex font-semibold text-lg justify-between'>
                            <span>{t("Student")}:</span>
                            {(() => {
                                const info = getUserInfo(selectedItem);
                                return info ? (
                                    <div className='flex flex-col justify-end'>
                                        <span>{info.name}</span>
                                        <span>{info.detail}</span>
                                    </div>
                                ) : (
                                    <span>N/A</span>
                                );
                            })()}
                        </div>
                    ) : null}

                    <div className='w-full'>
                        <label className="text-sm font-semibold">{t("Complain or Feedback Category")}</label>
                        <select
                            name="complainType"
                            className="w-full border rounded-md p-2"
                            value={formData.complainType} onChange={handleChange}
                        >
                            <option value="">------------</option>
                            {apiComplainNames?.map((item) => <option id={item} value={item}>{capitalizeFirstLetter(t(item))}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="text-gray-700 font-semibold text-sm">{t("Message")}</label>
                        <textarea
                            name="message"
                            rows={5}
                            className="w-full border border-gray-300 rounded-md p-2"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder={t("Enter Message")}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-gray-700 font-semibold text-sm">{t("Deadline")}</label>
                        <input
                            type='date'
                            name="endingAt"
                            className="w-full border border-gray-300 rounded-md p-2"
                            value={
                                formData?.endingAt
                                    ? typeof formData.endingAt === "string"
                                        ? formData.endingAt
                                        : new Date(formData.endingAt).toISOString().slice(0, 10)
                                    : ""
                            }
                            onChange={handleChange}
                            placeholder={t("Deadline")}
                            required
                        />
                    </div>

                    <div className='pt-4 flex gap-4 w-full justify-between'>

                        {canPerformAction() && source !== "student" ? <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            onClick={() => setFormData({
                                ...formData,
                                status: true,
                                deleted: true,
                            })}
                            className={`${"bg-red"} w-full py-2 px-6 rounded-md text-white font-bold shadow-md transition`}
                        >
                            {t("Delete")}
                        </motion.button> : null}

                        {canPerformAction() && source === "student" ? <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className={`${actionType === "delete" ? "bg-red" : "bg-blue-600 hover:bg-blue-700"} w-full py-2 px-6 rounded-md text-white font-bold shadow-md transition`}
                        >
                            {t("Confirm")} & {t(actionType)}
                        </motion.button> : null}

                        {canPerformAction() && source !== "student" ? <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            onClick={() => setResolve(true)}
                            className={`${"bg-green-600 hover:bg-green-700"} w-full py-2 px-6 rounded-md text-white font-bold shadow-md transition`}
                        >
                            {t("Resolved")}
                        </motion.button> : null}

                    </div>

                </form>
            </motion.div>
        </motion.div>
    );
};

export default ModalCUDComplain;



export const queryHigher = gql`
  mutation CreateUpdateDelete(
    $id: ID,
    $delete: Boolean!,
    $createdById: ID,
    $updatedById: ID!,
    $userprofileId: ID,
    $customuserId: ID,
    $deleted: Boolean,
    $deletedById: ID,
    $resolvedById: ID,
    $message: String!,
    $complainType: String!,
    $endingAt: String!,
    $campusId: ID!
    $status: Boolean!
  ) {
    createUpdateDeleteComplain(
      id: $id,
      delete: $delete,
      createdById: $createdById,
      updatedById: $updatedById,
      userprofileId: $userprofileId,
      customuserId: $customuserId,
      resolvedById: $resolvedById,
      deletedById: $deletedById,
      deleted: $deleted,
      message: $message,
      complainType: $complainType,
      endingAt: $endingAt,
      campusId: $campusId
      status: $status
    ) {
      complain {
        id
      }
    }
  }
`;


export const querySec = gql`
  mutation CreateUpdateDeleteComplainPrim(
    $id: ID,
    $delete: Boolean!,
    $createdById: ID,
    $updatedById: ID!,
    $userprofilesecId: ID!,
    $message: String!,
    $complainType: String!,
    $endingAt: String!,
    $campusId: ID!
  ) {
    createUpdateDeleteComplainSec(
      id: $id,
      delete: $delete,
      createdById: $createdById,
      updatedById: $updatedById,
      userprofilesecId: $userprofilesecId,
      message: $message,
      complainType: $complainType,
      endingAt: $endingAt,
      campusId: $campusId
    ) {
      complainsec {
        id
      }
    }
  }
`;



export const queryPrim = gql`
  mutation CreateUpdateDeleteComplainPrim(
    $id: ID,
    $delete: Boolean!,
    $createdById: ID,
    $userprofileprimId: ID!,
    $message: String!,
    $complainType: String!,
    $endingAt: String!,
    $campusId: ID!
  ) {
    createUpdateDeleteComplainPrim(
      id: $id,
      delete: $delete,
      createdById: $createdById,
      userprofileprimId: $userprofileprimId,
      message: $message,
      complainType: $complainType,
      endingAt: $endingAt,
      campusId: $campusId
    ) {
      complainprim {
        id
      }
    }
  }
`;



const getUserInfo = (selectedItem: any) => {
    if (!selectedItem) return null;

    const node = selectedItem.node as any;

    if ("userprofile" in node) {
        return {
            name: node.userprofile?.customuser?.fullName,
            detail: `${node.userprofile?.specialty?.mainSpecialty?.specialtyName} - ${node.userprofile?.specialty?.level?.level}`,
        };
    }
    if ("userprofilesec" in node) {
        return {
            name: node.userprofilesec?.customuser?.fullName,
            detail: node.userprofilesec?.classroomsec?.level,
        };
    }
    if ("userprofileprim" in node) {
        return {
            name: node.userprofileprim?.customuser?.fullName,
            detail: node.userprofileprim?.classroomprim?.level,
        };
    }
    return null;
};

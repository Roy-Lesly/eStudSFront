import React, { useState } from 'react'
import { motion } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';
import { gql } from '@apollo/client';
import { JwtPayload } from '@/serverActions/interfaces';
import MyInputField from '@/MyInputField';
import { decodeUrlID } from '@/functions';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';
import { ApiFactory } from '@/utils/graphql/ApiFactory';
import { EdgeComplainPrim } from '@/utils/Domain/schemas/interfaceGraphqlPrimary';
import DatePicker from 'react-datepicker';


const ModalCUDComplains = ({
    actionType, selectedItem, setOpenModal, params, section, apiYears
}: {
    params: any, actionType: "update" | "create" | "delete", selectedItem: EdgeComplainPrim | null, setOpenModal: any, section: "Secondary" | "Primary", apiYears: string[]
}) => {

    console.log(actionType);
    console.log(selectedItem);

    const { t } = useTranslation();
    const token = localStorage.getItem('token');
    const user: JwtPayload = jwtDecode(token ? token : "");

    const [formData, setFormData] = useState({
        message: selectedItem?.node.message || '',
        complainType: selectedItem?.node.complainType,
        status: selectedItem?.node.status || true,
        endingAt: selectedItem?.node.endingAt,
        delete: actionType === 'delete',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleDateChange = (date: Date | null) => {
        if (date) {
            setFormData(prev => ({ ...prev, scheduledFor: date }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let dataToSubmit: any = {
            ...formData,
            // subjectName: formData.subjectName.toUpperCase(),
            updatedById: user.user_id,
            delete: actionType === "delete"
        }
        if (actionType === "create") {
            dataToSubmit = {
                ...dataToSubmit,
                createdById: user.user_id,
            }
        }
        if ((actionType === "update" || actionType === "delete") && selectedItem) {
            dataToSubmit = {
                ...dataToSubmit,
                id: parseInt(decodeUrlID(selectedItem.node.id)),
            }
        }

        console.log(dataToSubmit);
        return

        const res = await ApiFactory({
            newData: dataToSubmit,
            editData: dataToSubmit,
            mutationName: section === "Secondary" ? "createUpdateDeleteComplainSec" : section === "Primary" ? "createUpdateDeleteComplainPrim" : "createUpdateDeleteComplain",
            modelName: section === "Secondary" ? "complainsec" : section === "Primary" ? "complainprim" : "complain",
            successField: "id",
            query: section === "Secondary" ? querySec : section === "Primary" ? queryPrim : queryPrim,
            router: null,
            params,
            redirect: false,
            reload: true,
            returnResponseField: false,
            redirectPath: ``,
            actionLabel: "processing",
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-white max-w-2xl w-full p-6 rounded-xl shadow-xl"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{t(actionType).toUpperCase()}</h2>
                    <button onClick={() => setOpenModal(false)}>
                        <FaTimes className="text-red-600" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
               
                    <div>
                        <label className="text-gray-700 font-semibold text-sm">{t("Message")}</label>
                        <textarea
                            name="message"
                            rows={4}
                            className="w-full border border-gray-300 rounded-md p-2"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder={t("Enter Message")}
                            required
                        />
                    </div>
                    {/* <div>
                        <label className="text-sm font-semibold">{t("Complain Type")}</label>
                        <select onSelect={handleChange} name="complainType" className="w-full border rounded-md p-2" value={formData.complainType} onChange={handleChange}>
                            <option value="">{t("-------------")}</option>
                            <option value="complain">{t("complain")}</option>
                            <option value="request">{t("request")}</option>
                        </select>
                    </div> */}

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="w-full mt-2 mb-4 py-2 px-6 rounded-md text-white font-bold shadow-md bg-blue-600 hover:bg-blue-700 transition"
                    >
                        {t("Confirm")} & {t(actionType)}
                    </motion.button>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default ModalCUDComplains;



export const querySec = gql`
  mutation CreateUpdateDeleteData(
    $id: ID,
    $delete: Boolean!,
    $createdById: ID,
    $updatedById: ID!,
    $subject: String!,
    $message: String!,
    $recipients: String!,
    $academicYear: String,
    $notificationType: String!,
    $scheduledFor: DateTime!,
    $classroomIds: [ID!]!
  ) {
    createUpdateDeleteComplainSec(
      id: $id,
      delete: $delete,
      createdById: $createdById,
      updatedById: $updatedById,
      subject: $subject,
      message: $message,
      recipients: $recipients,
      academicYear: $academicYear,
      notificationType: $notificationType,
      scheduledFor: $scheduledFor,
      classroomIds: $classroomIds
    ) {
      complainsec {
        id
      }
    }
  }
`;



export const queryPrim = gql`
  mutation CreateUpdateDelete(
    $id: ID,
    $delete: Boolean!,
    $createdById: ID,
    $subject: String!,
    $message: String!,
    $recipients: String!,
    $academicYear: String,
    $notificationType: String!,
    $scheduledFor: String!,
    $classroomsPrimIds: [ID!]
  ) {
    createUpdateDeleteComplainPrim(
      id: $id,
      delete: $delete,
      createdById: $createdById,
      subject: $subject,
      message: $message,
      recipients: $recipients,
      academicYear: $academicYear,
      notificationType: $notificationType,
      scheduledFor: $scheduledFor,
      classroomsPrimIds: $classroomsPrimIds
    ) {
      complainprim {
        id
      }
    }
  }
`;

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';
import { gql } from '@apollo/client';
import { JwtPayload } from '@/serverActions/interfaces';
import MyInputField from '@/MyInputField';
import { capitalizeFirstLetter, decodeUrlID } from '@/functions';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';
import { ApiFactory } from '@/utils/graphql/ApiFactory';
import { EdgeClassRoomPrim, EdgeNotificationPrim } from '@/utils/Domain/schemas/interfaceGraphqlPrimary';
import DatePicker from 'react-datepicker';
import { EdgeLevel, EdgeNotification, EdgeSpecialty } from '@/utils/Domain/schemas/interfaceGraphql';
import { EdgeClassRoomSec, EdgeNotificationSec } from '@/utils/Domain/schemas/interfaceGraphqlSecondary';
import MySelectField from '../MySelectField';


function isEdgeNotificationPrim(
    item: EdgeNotification | EdgeNotificationSec | EdgeNotificationPrim
): item is EdgeNotificationPrim {
    return (item as EdgeNotificationPrim).node.classroomsPrim !== undefined;
}

function isEdgeNotificationSec(
    item: EdgeNotification | EdgeNotificationSec | EdgeNotificationPrim
): item is EdgeNotificationSec {
    return (item as EdgeNotificationSec).node.classroomsSec !== undefined;
}

function isEdgeNotificationHigher(
    item: EdgeNotification | EdgeNotificationSec | EdgeNotificationPrim
): item is EdgeNotification {
    return (item as EdgeNotification).node.specialties !== undefined;
}


const ModalCUDNotification = ({
    actionType, selectedItem, setOpenModal, params, section, apiYears, apiTarget, apiLevels
}: {
    params: any, actionType: "update" | "create" | "delete", selectedItem: EdgeNotification | EdgeNotificationSec | EdgeNotificationPrim | null, setOpenModal: any, section: "Higher" | "Secondary" | "Primary",
    apiYears: string[], apiTarget: string[], apiLevels: EdgeLevel[] | string[]
}) => {

    console.log(selectedItem);

    const { t } = useTranslation();
    const token = localStorage.getItem('token');
    const user: JwtPayload = jwtDecode(token ? token : "");

    const [formData, setFormData] = useState(() => {
        let classroomsPrimIds: string[] = [];
        let classroomsSecIds: string[] = [];
        let specialtiesIds: string[] = [];
        let levelsIds: string[] = [];
        const campusId = parseInt(params.school_id);


        if (selectedItem) {
            if (section === "Primary" && isEdgeNotificationPrim(selectedItem)) {
                classroomsPrimIds = selectedItem.node.classroomsPrim?.edges.map((c: EdgeClassRoomPrim) => decodeUrlID(c.node.id));
            } else if (section === "Secondary" && isEdgeNotificationSec(selectedItem)) {
                classroomsSecIds = selectedItem.node.classroomsSec?.edges.map((c: EdgeClassRoomSec) => decodeUrlID(c.node.id));
            } else if (section === "Higher" && isEdgeNotificationHigher(selectedItem)) {
                specialtiesIds = selectedItem.node.specialties?.edges?.map((c: EdgeSpecialty) => decodeUrlID(c.node.id));
                levelsIds = selectedItem.node.levels?.edges.map((c: EdgeLevel) => decodeUrlID(c.node.id));
            }
        }

        return {
            target: selectedItem?.node.target || '',
            subject: selectedItem?.node.subject || '',
            message: selectedItem?.node.message || '',
            recipients: selectedItem?.node.recipients || 'students',
            academicYear: selectedItem?.node.academicYear || '',
            notificationType: selectedItem?.node.notificationType || 'general',
            scheduledFor: selectedItem?.node.scheduledFor ? new Date(selectedItem.node.scheduledFor) : new Date(),
            classroomsPrimIds,
            classroomsSecIds,
            specialtiesIds,
            levelsIds,
            campusId,
            delete: actionType === 'delete',
        };
    });

    const optionLevels = apiLevels?.map((l: any) => { return { value: decodeUrlID(l.node.id), label: l.node.level } });
    const optionSpecialties = apiLevels?.map((l: any) => { return { value: decodeUrlID(l.node.id), label: l.node.level } });
    const [selectedLevels, setSelectedLevels] = useState<any>([]);
    const [selectedSpecialtyOrClass, setSelectedSpecialtyOrClass] = useState<any>([]);

    console.log(formData);
    console.log(selectedLevels);

    useEffect(() => {
        if (selectedItem?.node && 'levels' in selectedItem.node) {
            setSelectedLevels(selectedItem.node.levels?.edges?.map((l: EdgeLevel) => { return { value: decodeUrlID(l.node.id), label: l.node.level }}));
            // do something with levels
        }
    }, [selectedItem]);


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

    const onSelectLevels = (e: any) => {
        setSelectedLevels(e)
    }

    const onSelectSpecialties = (e: any) => {
        setSelectedSpecialtyOrClass(e)
    }

    useEffect(() => {
        if (selectedLevels && selectedLevels.length) {
            setFormData(prev => ({ ...prev, levelsIds: selectedLevels.map((item: any) => parseInt(item.value)) }));
        }
    }, [selectedLevels])

    useEffect(() => {
        if (selectedSpecialtyOrClass && selectedSpecialtyOrClass.length) {
            setFormData(prev => ({ ...prev, levelsIds: selectedSpecialtyOrClass.map((item: any) => parseInt(item.value)) }));
        }
    }, [selectedSpecialtyOrClass])



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
            
        if (!formData.recipients){
            alert(`${t("Recipient Required")}`);
            return
        }
        let dataToSubmit: any = {
            ...formData,
            specialtiesIds: selectedSpecialtyOrClass?.map((s: any) => s.value),
            classroomssecIds: selectedSpecialtyOrClass?.map((s: any) => s.value),
            classroomsprimIds: selectedSpecialtyOrClass?.map((s: any) => s.value),
            levelsIds: selectedLevels?.map((s: any) => s.value), updatedById: user.user_id,
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
                updatedById: user.user_id,
            }
        }


        console.log(dataToSubmit);

        // return

        const res = await ApiFactory({
            newData: dataToSubmit,
            editData: dataToSubmit,
            mutationName: section === "Secondary" ? "createUpdateDeleteNotificationSec" : section === "Primary" ? "createUpdateDeleteNotificationPrim" : "createUpdateDeleteNotification",
            modelName: section === "Secondary" ? "notificationsec" : section === "Primary" ? "notificationprim" : "notification",
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

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-white max-w-2xl w-full p-6 rounded-xl shadow-xl space-y-2"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{t(actionType).toUpperCase()}</h2>
                    <button onClick={() => setOpenModal(false)}>
                        <FaTimes className="text-red-600" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-2">

                    <div className='flex flex-col md:flex-row gap-2 w-full'>
                        <div className='w-full'>
                            <label className="text-sm font-semibold">{t("Scope")}</label>
                            <select
                                name="target"
                                className="w-full border rounded-md p-2"
                                value={formData.target} onChange={handleChange}
                            >
                                <option value="">------------</option>
                                {apiTarget?.map((item, index) => <option id={index.toString()} value={item}>{t(capitalizeFirstLetter(item))}</option>)}
                            </select>
                        </div>
                        <div className='w-full'>
                            <label className="text-sm font-semibold">{t("Notification Type")}</label>
                            <select name="notificationType" className="w-full border rounded-md p-2" value={formData.notificationType} onChange={handleChange}>
                                <option value="general">{t("General")}</option>
                                <option value="urgent">{t("Urgent")}</option>
                            </select>
                        </div>
                    </div>

                    <div className='flex gap-2 flex-col md:flex-row'>
                        {section === "Higher" && formData.target !== "campus" && (formData.target === "level" || formData.target === "custom") ? <div className='w-full'>
                            <MySelectField
                                isMulti="select-multiple"
                                defaultValue={formData.levelsIds}
                                value={selectedLevels}
                                label={t("Select Levels")}
                                id='levelsIds'
                                name='levelsIds'
                                required={true}
                                placeholder='Select Levels'
                                onChange={onSelectLevels}
                                options={optionLevels}
                            />
                        </div> : null}
                        {section === "Higher" && formData.target !== "campus" && (formData.target === "specialty" || formData.target === "custom") ? <div className='w-full'>
                            <MySelectField
                                isMulti="select-multiple"
                                defaultValue={formData.specialtiesIds}
                                value={selectedLevels}
                                label={t("Select Specialties")}
                                id='specialtiesIds'
                                name='specialtiesIds'
                                required={true}
                                placeholder='Select Specialties'
                                onChange={onSelectSpecialties}
                                options={optionSpecialties}
                            />
                        </div> : null}
                    </div>

                    <MyInputField
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        label={t("Subject")}
                        placeholder={t("Enter Subject")}
                        required
                    />
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                            <label className="text-sm font-semibold">{t("Recipients")}</label>
                            <select name="recipients" className="w-full border rounded-md p-2" value={formData.recipients} onChange={handleChange}>
                                <option value={undefined}>{t("--------------")}</option>
                                <option value="student">{t("Students")}</option>
                                <option value="teacher">{t("Teachers")}</option>
                                <option value="admin">{t("Admin")}</option>
                                <option value="all">{t("All")}</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-semibold">{t("Academic Year")}</label>
                            <select
                                name="academicYear"
                                className="w-full border rounded-md p-2"
                                value={formData.academicYear} onChange={handleChange}
                            >
                                <option value="">------------</option>
                                {apiYears?.map((item) => <option id={item} value={item}>{item}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className='flex items-center justify-end gap-4 pt-4'>
                        <label className="text-sm font-semibold">{t("Scheduled For")}</label>
                        <DatePicker
                            selected={formData.scheduledFor}
                            onChange={handleDateChange}
                            showTimeSelect
                            dateFormat="Pp"
                            className="w-full border p-2 rounded-md"
                        />
                    </div>

                    <div className='pt-4 w-full'>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className={`${actionType === "delete" ? "bg-red" : "bg-blue-600 hover:bg-blue-700"} w-full py-2 px-6 rounded-md text-white font-bold shadow-md transition`}
                        >
                            {t("Confirm")} & {t(actionType)}
                        </motion.button>
                    </div>

                </form>
            </motion.div>
        </motion.div>
    );
};

export default ModalCUDNotification;



export const queryHigher = gql`
  mutation CreateUpdateDeleteNotification(
    $id: ID,
    $delete: Boolean!,
    $createdById: ID,
    $updatedById: ID!,
    $subject: String!,
    $target: String!,
    $message: String!,
    $recipients: String!,
    $academicYear: String,
    $notificationType: String!,
    $scheduledFor: String!,
    $specialtiesIds: [ID!]!
    $levelsIds: [ID!]!
    $campusId: ID!
  ) {
    createUpdateDeleteNotification(
      id: $id,
      delete: $delete,
      createdById: $createdById,
      updatedById: $updatedById,
      subject: $subject,
      target: $target,
      message: $message,
      recipients: $recipients,
      academicYear: $academicYear,
      notificationType: $notificationType,
      scheduledFor: $scheduledFor,
      specialtiesIds: $specialtiesIds
      levelsIds: $levelsIds
      campusId: $campusId
    ) {
      notification {
        id
      }
    }
  }
`;


export const querySec = gql`
  mutation CreateUpdateDeleteNotificationPrim(
    $id: ID,
    $delete: Boolean!,
    $createdById: ID,
    $updatedById: ID!,
    $subject: String!,
    $target: String!,
    $message: String!,
    $recipients: String!,
    $academicYear: String,
    $notificationType: String!,
    $scheduledFor: String!,
    $classroomIds: [ID!]!
    $campusId: ID!
  ) {
    createUpdateDeleteNotificationSec(
      id: $id,
      delete: $delete,
      createdById: $createdById,
      updatedById: $updatedById,
      subject: $subject,
      target: $target,
      message: $message,
      recipients: $recipients,
      academicYear: $academicYear,
      notificationType: $notificationType,
      scheduledFor: $scheduledFor,
      classroomIds: $classroomIds
      campusId: $campusId
    ) {
      notificationsec {
        id
      }
    }
  }
`;



export const queryPrim = gql`
  mutation CreateUpdateDeleteNotificationPrim(
    $id: ID,
    $delete: Boolean!,
    $createdById: ID,
    $subject: String!,
    $target: String!,
    $message: String!,
    $recipients: String!,
    $academicYear: String,
    $notificationType: String!,
    $scheduledFor: String!,
    $classroomsPrimIds: [ID!]
    $campusId: ID!
  ) {
    createUpdateDeleteNotificationPrim(
      id: $id,
      delete: $delete,
      createdById: $createdById,
      subject: $subject,
      target: $target,
      message: $message,
      recipients: $recipients,
      academicYear: $academicYear,
      notificationType: $notificationType,
      scheduledFor: $scheduledFor,
      classroomsPrimIds: $classroomsPrimIds
      campusId: $campusId
    ) {
      notificationprim {
        id
      }
    }
  }
`;

import React, { useState } from 'react'
import { motion } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';
import { gql, useMutation } from '@apollo/client';
import { JwtPayload } from '@/serverActions/interfaces';
import MyInputField from '@/MyInputField';
import { capitalizeFirstLetter, decodeUrlID } from '@/functions';
import { EdgeHall } from '@/Domain/schemas/interfaceGraphql';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';


const ModalCUDHall = ({
    actionType, selectedItem, setOpenModal, params
}: {
    params: any, actionType: "update" | "create" | "delete", selectedItem: EdgeHall | null, setOpenModal: any
}) => {

    const { t } = useTranslation();
    const token = localStorage.getItem('token');
    const user: JwtPayload = jwtDecode(token ? token : "");

    const [formData, setFormData] = useState({
        name: selectedItem && actionType !== "create" ? selectedItem.node.name : '',
        capacity: selectedItem && actionType !== "create" ? selectedItem.node.capacity.toString() : '',
        schoolId: parseInt(params.school_id),
        delete: selectedItem && actionType === "delete" ? true : false,
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value.toUpperCase(),
        }));
    };



    const [createUpdateDeleteHall] = useMutation(CREATE_OR_UPDATE_HALL)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let dataToSubmit: any = formData
        if (actionType === "create" && selectedItem) {
            dataToSubmit = {
                ...formData,
                createdById: user.user_id,
            }
        }
        if ((actionType === "update" || actionType === "delete") && selectedItem) {
            dataToSubmit = {
                ...formData,
                id: parseInt(decodeUrlID(selectedItem.node.id.toString())),
                updatedById: user.user_id,
            }
        }

        try {

            const result = await createUpdateDeleteHall({
                variables: { 
                    ...dataToSubmit,
                    name: dataToSubmit.name.toUpperCase(),
                    capacity: parseInt(dataToSubmit.capacity)
                }
            });
            if (
                (actionType !== "delete" && result.data.createUpdateDeleteHall.hall.id) ||
                (actionType === "delete" && result.data.createUpdateDeleteHall)
            ) {
                setOpenModal(false);
                window.location.reload()
            };
        } catch (error: any) {
            alert(`error domain:, ${error}`)
        }
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
                    <h2 className="font-semibold text-2xl">{t(actionType)?.toUpperCase()}</h2>
                    <button onClick={() => { setOpenModal(false) }} className="font-bold text-xl"><FaTimes color='red' /></button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-2">

                    <div className='flex flex-row gap-2 justify-between'>
                        <MyInputField
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            label={t("Hall Name")}
                            placeholder={t("Hall Name")}
                            required
                        />
                    </div>

                    <div className='flex flex-row gap-2 justify-between'>
                        <MyInputField
                            id="capacity"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                            label={t("Hall Capacity")}
                            placeholder={t("Hall Capacity")}
                            required
                            min={1}
                            max={1000}
                            type='number'
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className={`${actionType === "update" ? "bg-blue-600" : "bg-green-600"} font-bold hover:bg-blue-700 mt-6 px-6 py-2 rounded-md shadow-md text-lg text-white tracking-wide transition w-full`}
                    >
                        {t("Confirm")} & {t(capitalizeFirstLetter(actionType))}
                    </motion.button>

                </form>

            </motion.div>
        </motion.div>
    )
}

export default ModalCUDHall



export const CREATE_OR_UPDATE_HALL = gql`
    mutation CreateUpdateDelete(
        $id: ID,
        $name: String!,
        $capacity: Int!,
        $schoolId: ID!,
        $delete: Boolean!,
        $createdById: ID,
        $updatedById: ID
    ) {
        createUpdateDeleteHall(
            id: $id,
            name: $name,
            capacity: $capacity,
            schoolId: $schoolId,
            delete: $delete,
            createdById: $createdById,
            updatedById: $updatedById
        ) {
            hall {
              id
            }  
        } 
    }
`
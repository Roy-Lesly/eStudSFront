import React, { useState } from 'react'
import { motion } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';
import { gql } from '@apollo/client';
import { JwtPayload } from '@/serverActions/interfaces';
import MyInputField from '@/MyInputField';
import { capitalizeFirstLetter, decodeUrlID } from '@/functions';
import { EdgeLevel } from '@/Domain/schemas/interfaceGraphql';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';
import { ApiFactory } from '@/utils/graphql/ApiFactory';


const ModalCUDLevel = ({
    actionType, selectedItem, setOpenModal, params
}: {
    params: any, actionType: "update" | "create" | "delete", selectedItem: EdgeLevel | null, setOpenModal: any
}) => {

    const { t } = useTranslation();
    const token = localStorage.getItem('token');
    const user: JwtPayload = jwtDecode(token ? token : "");

    const [formData, setFormData] = useState({
        level: selectedItem && actionType !== "create" ? selectedItem.node.level : '',
        delete: selectedItem && actionType === "delete" ? true : false,
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: parseInt(value),
        }));
    };



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
                id: parseInt(decodeUrlID(selectedItem.node.id)),
                updatedById: user.user_id,
            }
        }

        const res = await ApiFactory({
            newData: { ...dataToSubmit, delete: actionType === "delete" },
            editData: { ...dataToSubmit, delete: actionType === "delete" },
            mutationName: "createUpdateDeleteLevel",
            modelName: "level",
            successField: "id",
            query,
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
            animate={{ opacity: true ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity ${true ? 'visible' : 'invisible'
                }`}
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
                            id="level"
                            name="level"
                            value={formData.level}
                            onChange={handleChange}
                            label={t("Level")}
                            placeholder={t("Level")}
                            type='number'
                            required
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

export default ModalCUDLevel



export const query = gql`
    mutation CreateUpdateDelete(
        $id: ID,
        $level: Int!,
        $delete: Boolean!,
        $createdById: ID,
        $updatedById: ID
    ) {
        createUpdateDeleteLevel (
            id: $id,
            level: $level,
            delete: $delete,
            createdById: $createdById,
            updatedById: $updatedById
        ) {
            level {
              id
            }  
        } 
    }
`
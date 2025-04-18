import React, { useState } from 'react'
import { motion } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';
import { gql, useMutation } from '@apollo/client';
import { JwtPayload } from '@/serverActions/interfaces';
import MyInputField from '@/MyInputField';
import { capitalizeFirstLetter, decodeUrlID } from '@/functions';
import { EdgeProgram } from '@/Domain/schemas/interfaceGraphql';


const ModalCUDProgram = ({
    actionType, selectedItem, setOpenModal
}: {
    params: any,  actionType: "update" | "create" | "delete", selectedItem: EdgeProgram | null, setOpenModal: any
}) => {

    const token = localStorage.getItem('token');
    const user: JwtPayload = jwtDecode(token ? token : "");

    const [formData, setFormData] = useState({
        name: selectedItem && actionType !== "create" ? selectedItem.node.name : '',
        description: selectedItem && actionType !== "create" ? selectedItem.node.description : '',
        delete: selectedItem && actionType === "delete" ? true : false,
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value.toUpperCase(),
        }));
    };



    const [createUpdateDeleteProgram] = useMutation(CREATE_OR_UPDATE)

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

        try {

            const result = await createUpdateDeleteProgram({
                variables: { ...dataToSubmit }
            });
            if (
                (actionType !== "delete" && result.data.createUpdateDeleteProgram.program.id) || 
                (actionType === "delete" && result.data.createUpdateDeleteProgram)
            ) {
                setOpenModal(false);
                window.location.reload()
            };
        } catch (err) {
            alert(`error domain:, ${err}`)
        }
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
                    <h2 className="font-semibold text-2xl">{actionType?.toUpperCase()}</h2>
                    <button onClick={() => { setOpenModal(false) }} className="font-bold text-xl">X</button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-2">

                    <div className='flex flex-row gap-2 justify-between'>
                        <MyInputField
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            label="name"
                            placeholder="name"
                            type='text'
                            required
                        />
                    </div>
                    <div className='flex flex-row gap-2 justify-between'>
                        <MyInputField
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            label="description"
                            placeholder="description"
                            type='textArea'
                            required
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className={`${actionType === "update" ?"bg-blue-600" : "bg-green-600"} font-bold hover:bg-blue-700 mt-6 px-6 py-2 rounded-md shadow-md text-lg text-white tracking-wide transition w-full`}
                    >
                        Confirm & {capitalizeFirstLetter(actionType)}
                    </motion.button>

                </form>

            </motion.div>
        </motion.div>
    )
}

export default ModalCUDProgram



export const CREATE_OR_UPDATE = gql`
    mutation CreateUpdateDelete(
        $id: ID,
        $name: String!,
        $description: String!,
        $delete: Boolean!,
        $createdById: ID,
        $updatedById: ID
    ) {
        createUpdateDeleteProgram(
            id: $id,
            name: $name,
            description: $description,
            delete: $delete,
            createdById: $createdById,
            updatedById: $updatedById
        ) {
            program {
              id
            }  
        } 
    }
`
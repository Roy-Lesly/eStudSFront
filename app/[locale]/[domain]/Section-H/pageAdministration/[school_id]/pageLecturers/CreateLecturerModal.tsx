import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';
import { gql } from '@apollo/client';
import { EdgeCustomUser, EdgeDepartment } from '@/Domain/schemas/interfaceGraphql';
import { JwtPayload } from '@/serverActions/interfaces';
import MyInputField from '@/MyInputField';
import { capitalizeFirstLetter, decodeUrlID } from '@/functions';
import { CertificateOptions, RegionList } from '@/constants';
import { FaTimes } from 'react-icons/fa';
import { ApiFactory } from '@/utils/graphql/ApiFactory';
import getApolloClient, { errorLog } from '@/utils/graphql/GetAppolloClient';


const CreateLecturer = ({
    params, role, actionType, selectedItem, openModal, setOpenModal, depts
}: {
    params: any, role: "teacher" | "admin", actionType: "update" | "create", selectedItem: EdgeCustomUser | null, openModal: boolean, setOpenModal: any, depts: EdgeDepartment[]
}) => {

    const last20Years = Array.from({ length: 25 }, (_, i) => (new Date().getFullYear() - (i + 1)).toString());
    const [count, setCount] = useState<number>(0)
    const token = localStorage.getItem('token');
    const user: JwtPayload = jwtDecode(token ? token : "");
    const dept: EdgeDepartment | null = depts ? depts?.filter((d: EdgeDepartment) => d.node.name.toLowerCase().includes(role === "admin" ? "admin" : "lecturer"))[0] : null;

    const [formData, setFormData] = useState({
        role: role,
        firstName: selectedItem && actionType === "update" ? selectedItem.node.firstName : '',
        lastName: selectedItem && actionType === "update" ? selectedItem.node.lastName : '',
        sex: selectedItem && actionType === "update" ? selectedItem.node.sex : '',
        dob: selectedItem && actionType === "update" ? selectedItem.node.dob : '',
        pob: selectedItem && actionType === "update" ? selectedItem.node.pob : '',
        address: selectedItem && actionType === "update" ? selectedItem.node.address : '',
        telephone: selectedItem && actionType === "update" ? selectedItem.node.telephone : '',
        title: selectedItem && actionType === "update" ? selectedItem.node.title : '',
        email: selectedItem && actionType === "update" ? selectedItem.node.email : '',
        highestCertificate: selectedItem && actionType === "update" ? selectedItem.node.highestCertificate : '',
        yearObtained: selectedItem && actionType === "update" ? selectedItem.node.yearObtained : '',
        regionOfOrigin: selectedItem && actionType === "update" ? selectedItem.node.regionOfOrigin : '',
        nationality: selectedItem && actionType === "update" ? selectedItem.node.nationality : '',
        infoData: selectedItem && actionType === "update" ? selectedItem.node.infoData || JSON.stringify({}) : JSON.stringify({}),
        prefix: '',
        deptIds: [parseInt(decodeUrlID(dept?.node.id || ""))],
        schoolIds: [params.school_id],
        delete: false,
    })

    const client = getApolloClient(params.domain)

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const result = await client.query<any>({
                    query: GET_DATA,
                    fetchPolicy: 'no-cache'
                });

                if (result?.data?.allDepartments) {
                }
            } catch (error: any) {
                errorLog(error);;
            }
        };
        if (count === 0) {
            if (actionType === "create") { }
            fetchDepartments();
            setCount(count + 1)
        }
        if (count === 1 && selectedItem && selectedItem.node) {
            let parsedData;


        }
    }, [setCount, count, selectedItem, actionType, client])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    if (!dept) {
        alert("No department Found !!!")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let dataToSubmit: any = formData
        if (actionType === "update" && selectedItem) {
            dataToSubmit = {
                ...formData,
                id: parseInt(decodeUrlID(selectedItem.node.id)),
                sex: formData.sex,
                delete: actionType === "update" ? false : true,
            }
        }

        await ApiFactory({
            newData: dataToSubmit,
            editData: dataToSubmit,
            mutationName: "createUpdateDeleteCustomUser",
            modelName: "customuser",
            successField: "id",
            query,
            router: null,
            params,
            redirect: false,
            reload: true,
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
                className="bg-white max-w-2xl p-4 rounded-lg shadow-lg w-full"
            >
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-2xl">{actionType?.toUpperCase()}</h2>
                    <button onClick={() => { setOpenModal(false) }} className="font-bold text-xl"><FaTimes color='red' /></button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-2">

                    <div className='flex flex-row gap-2 justify-between'>
                        <MyInputField
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            label="First Name"
                            placeholder="FirstName"
                            required
                        />

                        <MyInputField
                            id="lastName"
                            name="lastName"
                            value={formData.lastName?.toString()}
                            onChange={handleChange}
                            label="Last Name"
                            placeholder="LastName"
                            required
                        />
                    </div>

                    <div className='flex flex-row gap-2 justify-between'>

                        <MyInputField
                            id="sex"
                            name="sex"
                            value={formData.sex}
                            onChange={handleChange}
                            label="Gender"
                            placeholder="sex"
                            type='select'
                            options={["Male", "Female"]}
                            required
                        />
                        <MyInputField
                            id="dob"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            label="Date Of Birth"
                            placeholder="Date Of Birth"
                            type='date'
                        // required
                        />
                        <MyInputField
                            id="pob"
                            name="pob"
                            value={formData.pob}
                            onChange={handleChange}
                            label="Place of Birth"
                            placeholder="Place of Birth"
                            type='text'
                        // required
                        />
                    </div>

                    <div className='flex flex-row gap-2 justify-between'>
                        <MyInputField
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            label="Address"
                            placeholder="Address"
                            required
                        />

                        <MyInputField
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            label="Title"
                            placeholder="title"
                            type='select'
                            options={["MR", "MRS", "DR", "PROF", "HON", "SIR"]}
                        // required
                        />
                    </div>
                    <div className='flex flex-row gap-2 justify-between'>
                        <MyInputField
                            id="telephone"
                            name="telephone"
                            value={formData.telephone}
                            onChange={handleChange}
                            label="Telephone"
                            placeholder="telephone"
                            type='number'
                            required
                        />
                        <MyInputField
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            label="Email"
                            placeholder="email"
                            required
                        />
                    </div>
                    <div className='flex flex-row gap-2 justify-between'>
                        <MyInputField
                            id="highestCertificate"
                            name="highestCertificate"
                            value={formData?.highestCertificate}
                            onChange={handleChange}
                            label="Highest Level"
                            placeholder="highestCertificate"
                            type='select'
                            options={CertificateOptions}
                            required
                        />
                        <MyInputField
                            id="yearObtained"
                            name="yearObtained"
                            value={formData?.yearObtained?.toString()}
                            onChange={handleChange}
                            label="Year Obtained"
                            placeholder="yearObtained"
                            type='select'
                            options={last20Years}
                        />
                    </div>
                    <div className='flex flex-row gap-2 justify-between'>
                        <MyInputField
                            id="nationality"
                            name="nationality"
                            value={formData.nationality}
                            onChange={handleChange}
                            label="Nationality"
                            placeholder="nationality"
                            type='text'
                            required
                        />
                        <MyInputField
                            id="regionOfOrigin"
                            name="regionOfOrigin"
                            value={formData.regionOfOrigin}
                            onChange={handleChange}
                            label="Region Of Origin"
                            placeholder="regionOfOrigin"
                            type='select'
                            options={RegionList}
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className={`${actionType === "update" ? "bg-blue-600" : "bg-green-600"} font-bold hover:bg-blue-700 mt-6 px-6 py-2 rounded-md shadow-md text-lg text-white tracking-wide transition w-full`}
                    >
                        Confirm & {capitalizeFirstLetter(actionType)}
                    </motion.button>

                </form>

            </motion.div>
        </motion.div>
    )
}

export default CreateLecturer



export const query = gql`
    mutation CreateUpdateDeleteCustomUser(
        $id: ID,
        $schoolIds: [ID]!,
        $firstName: String!,
        $lastName: String,
        $role: String!,
        $sex: String!,
        $dob: String,
        $pob: String,
        $address: String!,
        $telephone: String!,
        $email: String!,
        $title: String,
        $deptIds: [ID!]!,
        $highestCertificate: String!,
        $yearObtained: String,
        $nationality: String!,
        $regionOfOrigin: String!,
        $prefix: String!,
        $infoData: JSONString!,
        $delete: Boolean!,
    ) {
        createUpdateDeleteCustomuser(
            id: $id,
            schoolIds: $schoolIds,
            firstName: $firstName,
            lastName: $lastName,
            role: $role,
            sex: $sex,
            dob: $dob,
            pob: $pob,
            address: $address,
            telephone: $telephone,
            email: $email,
            title: $title,
            deptIds: $deptIds,
            highestCertificate: $highestCertificate,
            yearObtained: $yearObtained,
            nationality: $nationality,
            regionOfOrigin: $regionOfOrigin,
            prefix: $prefix,
            infoData: $infoData,
            delete: $delete,
        ) {
            customuser {
              id
            }  
        } 
    }
`
const GET_DATA = gql`
query GetData {
  allDepartments{
    edges {
      node {
        id name
      }
    }
  }
}
`;
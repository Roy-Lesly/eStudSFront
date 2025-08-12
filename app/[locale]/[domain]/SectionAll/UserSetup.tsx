import React, { useState } from "react";
import { motion } from "framer-motion";
import { EdgeCustomUser, EdgeDepartment, EdgePage, EdgeSchoolHigherInfo } from "@/Domain/schemas/interfaceGraphql";
import MyInputField from "@/MyInputField";
import { decodeUrlID } from "@/functions";
import { useTranslation } from "react-i18next";
import { mutationCreateUpdateCustomuser } from "@/utils/graphql/mutations/mutationCreateUpdateCustomuser";
import { errorLog } from "@/utils/graphql/GetAppolloClient";


const UserSetup = (
    { user, setPage, p }:
    { user: EdgeCustomUser; setPage: any, p: any }
) => {

    console.log(user);
    const { t } = useTranslation("common");
    const [formData, setFormData] = useState({
        id: parseInt(decodeUrlID(user.node.id)),
        matricle: user.node.matricle,
        firstName: user.node.firstName,
        lastName: user.node.lastName,
        address: user.node.address,
        // sex: user.node.sex,
        // dob: user.node.dob,
        // pob: user.node.pob,
        telephone: user.node.telephone,
        email: user.node.email,
        role: user.node.role,
        pageIds: user.node.page?.edges?.map((p: EdgePage) => parseInt(decodeUrlID(p.node.id))),
        schoolIds: user.node?.school?.edges?.map((s: EdgeSchoolHigherInfo) => parseInt(decodeUrlID(s.node.id))),
        deptIds: user.node?.dept?.edges?.map((d: EdgeDepartment) => parseInt(decodeUrlID(d.node.id))),
        isActive: user.node.isActive,
        isStaff: user.node.isStaff,
        isSuperuser: user.node.isSuperuser,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleToggle = (field: "isStaff" | "isSuperuser" | "isActive") => {
        setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Updated user data:", formData);
        try {
            const resUserId = await mutationCreateUpdateCustomuser({
                formData,
                p,
                router: null,
                routeToLink: "",
            })
            if (resUserId.length > 5) {
                alert(t("Operation Successful") + " " + `✅`)
                window.location.reload();
            }
        } catch (error) {
            errorLog(error);
        }
    };

    console.log(formData);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center items-center bg-gray-100 md:px-4 p-1"
        >
            <div className="w-full bg-white shadow-xl rounded-2xl md:p-4 p-1">
                <form onSubmit={handleSubmit} className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 text-black text-lg">
                    {/* Username */}
                    <div className="flex flex-col">
                        <MyInputField
                            id={formData.matricle}
                            name="matricle"
                            label="Username / Matricle"
                            value={formData.matricle}
                            placeholder=""
                            onChange={handleChange}
                            readOnly
                        />
                        <MyInputField
                            id={formData.firstName}
                            name="firstName"
                            label="First Name"
                            value={formData.firstName}
                            placeholder=""
                            onChange={handleChange}
                        />
                        <MyInputField
                            id={formData.lastName}
                            name="lastName"
                            label="Last Name"
                            value={formData.lastName}
                            placeholder=""
                            onChange={handleChange}
                        />
                        <MyInputField
                            id={formData.telephone}
                            name="telephone"
                            label="Telephone"
                            value={formData.telephone}
                            placeholder=""
                            type="number"
                            onChange={handleChange}
                        />
                        <MyInputField
                            id={formData.address}
                            name="address"
                            label="Address"
                            value={formData.address}
                            placeholder=""
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex flex-col">
                        <MyInputField
                            id={formData.email}
                            name="email"
                            label="Email"
                            type="email"
                            value={formData.email}
                            placeholder=""
                            onChange={handleChange}
                        />
                        <MyInputField
                            id={formData.role}
                            name="role"
                            label="Role"
                            type="select"
                            value={formData.role}
                            placeholder=""
                            onChange={handleChange}
                            options={[
                                { id: "admin", name: "Admin" },
                                { id: "teacher", name: "Lecturer" },
                                { id: "student", name: "Student" }
                            ]}
                        />
                        <div className="flex gap-10 mt-4 items-center justify-between">
                            <label className="text-lg font-medium text-gray-600 mb-2">{t("Is Staff")}</label>
                            <button
                                type="button"
                                onClick={() => handleToggle("isStaff")}
                                className={`relative w-16 h-8 flex items-center rounded-full p-1 transition ${formData.isStaff ? "bg-blue-500" : "bg-red"
                                    }`}
                            >
                                <motion.div
                                    className="w-6 h-6 bg-white rounded-full shadow-md"
                                    layout
                                    transition={{ type: "spring", stiffness: 300 }}
                                    animate={{ x: formData.isStaff ? 32 : 0 }}
                                />
                            </button>
                        </div>

                        <div className="flex gap-10 my-2 items-center justify-between">
                            <label className="text-lg font-medium text-gray-600 mb-2">{t("Is Superuser")}</label>
                            <button
                                type="button"
                                onClick={() => handleToggle("isSuperuser")}
                                className={`relative w-16 h-8 flex items-center rounded-full p-1 transition ${formData.isSuperuser ? "bg-blue-500" : "bg-red"
                                    }`}
                            >
                                <motion.div
                                    className="w-6 h-6 bg-white rounded-full shadow-md"
                                    layout
                                    transition={{ type: "spring", stiffness: 300 }}
                                    animate={{ x: formData.isSuperuser ? 32 : 0 }}
                                />
                            </button>
                        </div>

                        <div className="flex gap-10 my-2 items-center justify-between">
                            <label className="text-lg font-medium text-gray-600 mb-2">{t("Is Superuser")}</label>
                            <button
                                type="button"
                                onClick={() => handleToggle("isActive")}
                                className={`relative w-16 h-8 flex items-center rounded-full p-1 transition ${formData.isActive ? "bg-blue-500" : "bg-red"
                                    }`}
                            >
                                <motion.div
                                    className="w-6 h-6 bg-white rounded-full shadow-md"
                                    layout
                                    transition={{ type: "spring", stiffness: 300 }}
                                    animate={{ x: formData.isActive ? 32 : 0 }}
                                />
                            </button>
                        </div>
                    </div>


                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            className="w-full p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default UserSetup;

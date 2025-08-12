"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { JwtPayload } from "@/serverActions/interfaces";
import { jwtDecode } from "jwt-decode";
import { mutationCreateUpdateCustomuser } from "@/utils/graphql/mutations/mutationCreateUpdateCustomuser";
import { errorLog } from "@/utils/graphql/GetAppolloClient";
import { useTranslation } from "react-i18next";

const ActivateUserModal = (
    { action, onClose, id, status, p }
        :
        { action: string | null, onClose: any, id: number, status: boolean, p: any }
) => {

    const { t } = useTranslation("common")
    const token = localStorage.getItem("token");
    const user: JwtPayload | null = token ? jwtDecode(token) : null;
    const [newStatus, setNewStatus] = useState<boolean | null>(status);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true)
        try {
            const resUserId = await mutationCreateUpdateCustomuser({
                formData: {
                    id: id,
                    updatedById: user?.user_id,
                    isActive: newStatus,
                    delete: false
                },
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
            setLoading(false)
        }
    };

    const handleToggle = () => {
        setNewStatus((prev) => !prev); // Toggle the status
    };

    return (
        <AnimatePresence>
            {action && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white rounded-2xl p-6 text-black shadow-xl w-full max-w-md"
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                    >
                        <h2 className="text-2xl font-bold mb-1">
                            User Activation
                        </h2>
                        <h2 className="text-lg font-bold mb-3">
                            User Status: {status ? <span>Active</span> : <span>Not Active</span>}
                        </h2>
                        <form onSubmit={handleSubmit} className="gap-6">
                            {/* Toggle Button */}
                            <div className="flex items-center justify-between">
                                <label htmlFor="status-toggle" className="text-lg font-medium">
                                    Status:
                                </label>
                                <div
                                    onClick={handleToggle}
                                    className={`relative cursor-pointer shadow-xl w-20 h-8 rounded-full transition-colors duration-300 ${newStatus ? 'bg-green-500' : 'bg-red'}`}
                                >
                                    <div
                                        className={`w-8 h-8 bg-slate-50 rounded-full shadow-md transition-transform duration-300 transform ${newStatus ? 'translate-x-12' : ''}`}
                                    ></div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-10">
                                <button
                                    type="button"
                                    className="border px-5 py-2 text-gray-500 hover:text-gray-700 bg-red text-white font-semibold rounded-lg tracking-wider"
                                    onClick={onClose}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="border px-5 py-2 bg-green-500 text-white font-semibold rounded-lg tracking-wider"
                                    disabled={loading}
                                >
                                    {loading ? "Submitting..." : "Submit"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ActivateUserModal;


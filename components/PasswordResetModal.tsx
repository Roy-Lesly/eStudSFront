import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { motion, AnimatePresence } from "framer-motion";
import { JwtPayload } from "@/serverActions/interfaces";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";


const PasswordResetModal = (
    { action, onClose, id }
        :
        { action: string | null, onClose: any, id: number }
) => {
    const { t } = useTranslation("common")
    const token = localStorage.getItem("token");
    const user: JwtPayload | null = token ? jwtDecode(token) : null;
    const [passwordOld, setPasswordOld] = useState("");
    const [passwordNew, setPasswordNew] = useState("");
    const [passwordNewConfirm, setPasswordNewConfirm] = useState("");

    const [resetChangePassword, { loading, error }] = useMutation(PASSWORD_RESET_CHANGE, {
        onCompleted: () => {
            setPasswordOld("");
            setPasswordNew("");
            setPasswordNewConfirm("");
            alert(t("Operation Successful") + " " + `✅`)
            onClose();
        },
    });

    const handleSubmit = (e: any) => {
        e.preventDefault();
        resetChangePassword({
            variables: {
                id: id,
                userId: user?.user_id,
                action: action,
                passwordOld: action === "change" ? passwordOld : undefined,
                passwordNew: passwordNew ? passwordNew : "0000",
                passwordNewConfirm: passwordNewConfirm ? passwordNewConfirm : "0000",
            },
        });
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
                            {action === "reset" ? `${t("Reset Password")}` : `${t("Change Password")}`}
                        </h2>
                        <h2 className="text-lg font-bold mb-3">
                            {action === "reset" ? "If blank default - 0000" : ""}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {action === "change" && (
                                <input
                                    type="password"
                                    placeholder={`${t("Old Password")}`}
                                    className="w-full p-2 border rounded"
                                    value={passwordOld}
                                    onChange={(e) => setPasswordOld(e.target.value)}
                                />
                            )}
                            <input
                                type="password"
                                placeholder={`${t("New Password")}`}
                                className="w-full p-2 border rounded"
                                value={passwordNew}
                                onChange={(e) => setPasswordNew(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder={`${t("Confirm New Password")}`}
                                className="w-full p-2 border rounded"
                                value={passwordNewConfirm}
                                onChange={(e) => setPasswordNewConfirm(e.target.value)}
                            />

                            {error && <p className="text-red font-medium italic tracking-wide">{error.message}</p>}

                            <div className="flex justify-between items-center">
                                <button
                                    type="button"
                                    className="border px-5 py-2 text-gray-500 hover:text-gray-700 bg-red text-white font-semibold rounded-lg tracking-wider"
                                    onClick={onClose}
                                >
                                    {t("Cancel")}
                                </button>
                                <button type="submit" className="border px-5 py-2 bg-green-500 text-white font-semibold rounded-lg tracking-wider" disabled={loading}>
                                    {loading ? `${t("Submitting")}...` : `${t("Submit")}`}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default PasswordResetModal



const PASSWORD_RESET_CHANGE = gql`
  mutation PasswordResetChange(
    $id: ID!,
    $userId: ID!,
    $action: String!,
    $passwordOld: String,
    $passwordNew: String,
    $passwordNewConfirm: String
  ) {
    passwordResetChange(
      id: $id,
      userId: $userId,
      action: $action,
      passwordOld: $passwordOld,
      passwordNew: $passwordNew,
      passwordNewConfirm: $passwordNewConfirm
    ) {
        customuser {
            id
        }
    }
  }
`;
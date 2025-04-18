import React from 'react'
import { motion } from "framer-motion";


const UserManagement = ({ period }: { period: any }) => {



    return (
        <div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="p-4 bg-white shadow-md rounded-lg"
            >
                <h2 className="text-xl font-semibold mb-4">Manage Users & Permissions</h2>
                <p>Manage user roles, permissions, and access levels.</p>
            </motion.div>
        </div>
    )
}

export default UserManagement

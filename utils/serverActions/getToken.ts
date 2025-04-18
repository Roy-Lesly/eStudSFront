import { cookies } from 'next/headers'; // Server-only module

export const getServerToken = () => {
    try {
        const cookieStore = cookies(); // Server-side access
        const token = cookieStore.get('token')?.value || "";
        console.log("Server-side token:", token);
        return token;
    } catch (error) {
        console.error("Error retrieving server-side token:", error);
        return null;
    }
};
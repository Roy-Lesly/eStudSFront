import { cookies } from 'next/headers'; // Server-only module

export const getServerToken = async () => {
    try {
        const cookieStore = await cookies(); // Await is required
        const token = cookieStore.get('token')?.value || "";
        console.log("Server-side token:", token);
        return token;
    } catch (error) {
        console.error("Error retrieving server-side token:", error);
        return null;
    }
};
